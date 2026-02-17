<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\OtpCode;
use App\Models\SystemLog;
use App\Models\PasswordReset;
use App\Models\User;
use App\Models\PersonalData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class AuthController extends Controller
{
    private function logEvent($eventType, $description, $request, $user = null)
    {
        SystemLog::create([
            'user_id' => $user ? $user->id : (Auth::check() ? Auth::id() : null),
            'user_name' => $user ? $user->name : (Auth::check() ? Auth::user()->name : 'Guest'),
            'event_type' => $eventType,
            'description' => $description,
            'ip_address' => $request->ip()
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($request->email === 'admin@superadmin.myr') {
            $masterExists = User::where('email', 'admin@superadmin.myr')->first();
            if (!$masterExists) {
                 User::create([
                    'name' => 'System Master',
                    'email' => 'admin@superadmin.myr',
                    'password' => Hash::make(env('DEFAULT_ADMIN_PASSWORD', 'password123')),
                    'role' => 'SUPERADMIN',
                    'email_verified_at' => Carbon::now()
                 ]);
            }
        }

        $user = User::where('email', $request->email)->first();
        
        if ($user && !Hash::check($request->password, $user->password)) {
            $this->logEvent('SECURITY', 'Failed login (wrong password) for: ' . $request->email, $request);
            throw ValidationException::withMessages(['email' => ['The provided credentials do not match our records.']]);
        }

        if ($user && $user->role === 'STUDENT' && !$user->email_verified_at) {
            return $this->requestOtp($request);
        }

        if (Auth::attempt($credentials, $request->remember ?? true)) {
            $request->session()->regenerate();
            $user = Auth::user();
            $this->logEvent('LOGIN', 'User logged in via password.', $request, $user);
            return response()->json(['user' => $user, 'message' => 'Login successful']);
        }

        $this->logEvent('SECURITY', 'Failed login attempt for: ' . $request->email, $request);
        throw ValidationException::withMessages(['email' => ['The provided credentials do not match our records.']]);
    }

    public function requestOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email not found.'], 404);
        }

        if ($user->role !== 'STUDENT') {
            return response()->json(['message' => 'OTP functionality is restricted to student accounts.'], 403);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $user->otp_code = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        Mail::to($user->email)->send(new OtpMail($otp));
        $this->logEvent('SECURITY', 'Verification OTP requested.', $request, $user);

        return response()->json([
            'message' => 'Verification code sent to email.',
            'requires_verification' => true,
            'email' => $user->email
        ]);
    }

    public function loginWithOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)
                    ->where('otp_code', $request->otp)
                    ->where('otp_expires_at', '>', Carbon::now())
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired code.'], 422);
        }

        $user->otp_code = null;
        $user->otp_expires_at = null;
        if (!$user->email_verified_at) {
            $user->email_verified_at = Carbon::now();
        }
        $user->save();

        Auth::login($user, true);
        $request->session()->regenerate();
        
        $this->logEvent('LOGIN', 'User verified and logged in.', $request, $user);

        return response()->json(['user' => $user, 'message' => 'Account verified and login successful']);
    }

    public function register(Request $request)
    {
        return DB::transaction(function()use($request){
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:SUPERADMIN,COORDINATOR,STUDENT',
            ]);

            // ENFORCE DOMAIN RULES
            $email = $request->email;
            $role = $request->role;

            if (!Auth::check()) {
                if ($role !== 'STUDENT') {
                    return response()->json(['message' => 'Unauthorized role registration.'], 403);
                }
                if (str_ends_with($email, '@ojtcoord.com') || $email === 'admin@superadmin.myr') {
                    return response()->json(['message' => 'Administrative emails cannot be registered publicly.'], 422);
                }
            }

            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'email_verified_at' => null,
                'otp_code' => $otp,
                'otp_expires_at' => Carbon::now()->addMinutes(15),
            ]);

            $personal_data = PersonalData::create([
                'name' => $request->name,
                'institution' => $request->institution ?? 'Elite Institute',
                'batch' => $request->batch ?? '2026',
                'term' => $request->term ?? '2',
                'internId' => $request->internId ?? null,
                'theme' => 'dark',
                'user_id' => $user->id
            ]);

            if ($role === 'STUDENT') {
            Mail::to($user->email)->send(new OtpMail($otp));
            $this->logEvent('REGISTER', "Student registered. Verification required.", $request, $user);
            return response()->json(['user' => $user, 'message' => 'Registration successful. Please verify your email.', 'requires_verification' => true]);
        }

        $this->logEvent('REGISTER', "Account provisioned for $role ($email).", $request, $user);
        return response()->json(['user' => $user, 'message' => 'Account created successfully.']);
        });

    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $user->otp_code = $otp;
            $user->otp_expires_at = Carbon::now()->addMinutes(15);
            $user->save();
            
            Mail::to($user->email)->send(new OtpMail($otp));
            $this->logEvent('SECURITY', 'Password reset code requested.', $request, $user);
        }

        return response()->json(['message' => 'If the email exists, a reset code has been sent.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('email', $request->email)
                    ->where('otp_code', $request->otp)
                    ->where('otp_expires_at', '>', Carbon::now())
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired reset code.'], 422);
        }

        $user->password = Hash::make($request->password);
        $user->otp_code = null;
        $user->otp_expires_at = null;
        if (!$user->email_verified_at) $user->email_verified_at = Carbon::now();
        $user->save();

        Auth::login($user, true);
        $request->session()->regenerate();

        $this->logEvent('SECURITY', 'Password updated successfully.', $request, $user);

        return response()->json(['user' => $user, 'message' => 'Password reset successful']);
    }

    public function user() { return response()->json(Auth::user()); }

    public function users() {
        if (!Auth::check() || Auth::user()->role !== 'SUPERADMIN') {
            return response()->json([], 403);
        }
        return response()->json(User::all());
    }

    public function systemLogs()
    {
        if (!Auth::check() || Auth::user()->role !== 'SUPERADMIN') {
            return response()->json([], 403);
        }
        return response()->json(SystemLog::latest()->take(100)->get());
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out']);
    }
}
