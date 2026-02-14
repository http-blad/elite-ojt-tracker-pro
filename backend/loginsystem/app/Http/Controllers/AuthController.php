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
    /**
     * Helper to create system logs.
     */
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

    /**
     * Connection health check - useful for debugging network issues.
     */
    public function ping()
    {
        return response()->json([
            'status' => 'online',
            'server' => 'Laravel 11',
            'auth_status' => Auth::check() ? 'authenticated' : 'guest',
            'timestamp' => now()
        ]);
    }

    /**
     * Generate and store OTP directly on the user record, then send email.
     */
    public function requestOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();
        $otpValue = (string) rand(100000, 999999);

        $user->otp_code = $otpValue;
        $user->otp_expires_at = Carbon::now()->addMinutes(15);
        $user->save();

        $this->logEvent('SECURITY', 'OTP requested for ' . $user->email, $request, $user);

        try {
            Mail::to($user->email)->send(new OtpMail($otpValue));
            return response()->json(['message' => 'Security code sent to your email.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'OTP saved to database, but email delivery failed.',
                'error' => config('app.debug') ? $e->getMessage() : 'Mail Error'
            ], 500);
        }
    }

    /**
     * Verify OTP and Login
     */
    public function loginWithOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric'
        ]);

        $user = User::where('email', $request->email)
            ->where('otp_code', $request->otp)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'otp' => ['Invalid or expired access code.'],
            ]);
        }

        // Clear the OTP fields after successful use for security
        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'email_verified_at' => now() // Fixed: This marks the user as verified
        ]);
        //$user->otp_expires_at = null;
        //$user->save();

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
            'message' => 'Secure access granted.'
        ]);
    }

    /**
     * Traditional password-based login.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->remember ?? true)) {
            $request->session()->regenerate();
            $user = Auth::user();

            $this->logEvent('LOGIN', 'User logged in via password.', $request, $user);

            return response()->json([
                'user' => $user,
                'message' => 'Login successful'
            ]);
        }

        $this->logEvent('SECURITY', 'Failed login attempt for email: ' . $request->email, $request);
        throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
    }

    /**
     * Send a password reset link to the user.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Laravel's Password facade handles the token generation and email sending.
        // It uses the route named 'password.reset' defined in routes/api.php.
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : throw ValidationException::withMessages(['email' => [__($status)]]);
    }

    /**
     * Handle the actual password reset using the token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );
        
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : throw ValidationException::withMessages(['email' => [__($status)]]);
    }

    /**
     * Registration logic. Now triggers OTP for verification.
     */
    public function register(Request $request)
    {
        return DB::transaction(function()use($request){
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:SUPERADMIN,COORDINATOR,STUDENT',
            ]);

            $otpValue = rand(100000, 999999);

            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'email_verified_at' => null,
                'otp_code' => $otpValue,
                'otp_expires_at' => Carbon::now()->addMinutes(15)
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

            $this->logEvent('REGISTER', 'New user registered as ' . $user->role, $request, $user);

            try {
                Mail::to($user->email)->send(new OtpMail($otpValue));
            } catch (\Exception $e) {
            }

            return response()->json([
                'user' => $user,
                'message' => 'Account created. Please verify your email.'
            ]);
        });

    }

    /**
     * Fetches system logs (Superadmin only).
     */
    public function systemLogs(Request $request)
    {
        if (Auth::user()->role !== 'SUPERADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $logs = SystemLog::orderBy('created_at', 'desc')->take(100)->get();
        return response()->json($logs);
    }

    public function logout(Request $request)
    {
        $this->logEvent('LOGOUT', 'User logged out.', $request);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out.']);
    }

    public function user(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        return response()->json($user);
    }
}
