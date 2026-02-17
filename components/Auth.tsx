
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Loader2,
  ChevronLeft,
  Eye, 
  EyeOff,
  Smartphone,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { User } from '../types';
import { AuthService } from '../services/authService';
import { getRoleFromEmail } from '../config';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'OTP_REQUEST' | 'OTP_VERIFY' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Auto-clear success message after 6 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        // Only clear if it's not the critical "Verified account" prompt that's needed for context
        if (!success.includes("Verified account!")) {
          setSuccess(null);
        }
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleResendOtp = async () => {
    if (!formData.email) return;
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.requestOtp(formData.email);
      if (!result.success) throw new Error(result.error || 'Failed to resend code');
      setSuccess("A fresh code has been sent to your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'LOGIN') {
        const result = await AuthService.login(formData.email, formData.password);
        if (result.error) throw new Error(result.error);
        
        if ((result as any).requires_verification) {
          setMode('OTP_VERIFY');
          setSuccess("Account verification required. A new code has been sent to your email.");
          return;
        }

        if (result.user) {
          setSuccess("Access granted! Entering system...");
          setTimeout(() => onLogin(result.user), 800);
        }
      } else if (mode === 'OTP_REQUEST') {
        const result = await AuthService.requestOtp(formData.email);
        if (!result.success) throw new Error(result.error || 'Failed to send code');
        setMode('OTP_VERIFY');
        setSuccess("Check your email for the 6-digit access code.");
      } else if (mode === 'OTP_VERIFY') {
        // Determine if we're verifying for LOGIN or for RESET
        const isResetFlow = success?.includes("reset code");
        
        if (isResetFlow) {
          // If verifying for reset, we don't call verifyOtpAndLogin yet
          // We just trust the code entry will happen in the RESET_PASSWORD step
          // or we can add a middle verification step if needed.
          // For the "Instant Transition" flow:
          setSuccess("Verified account! Enter a new password");
          setMode('RESET_PASSWORD');
        } else {
          const result = await AuthService.verifyOtpAndLogin(formData.email, formData.otp);
          if (result.error) throw new Error(result.error);
          if (result.user) {
            setSuccess("Verification successful! Welcome to EliteOJT.");
            setTimeout(() => onLogin(result.user), 1000);
          }
        }
      } else if (mode === 'FORGOT_PASSWORD') {
        const result = await AuthService.forgotPassword(formData.email);
        if (!result.success) throw new Error(result.error || 'Failed to request reset');
        setMode('OTP_VERIFY');
        setSuccess("A reset code has been sent to your email.");
      } else if (mode === 'RESET_PASSWORD') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match.");
        const result = await AuthService.resetPassword(formData.email, formData.otp, formData.password, formData.confirmPassword);
        if (result.error) throw new Error(result.error);
        if (result.user) {
          setSuccess("Password updated! Logging you in...");
          setTimeout(() => onLogin(result.user), 1000);
        }
      } else if (mode === 'SIGNUP') {
        const role = getRoleFromEmail(formData.email);
        if (role !== 'STUDENT') throw new Error("Only students can register publicly.");
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match.");
        
        const result = await AuthService.register(formData.email, formData.password, formData.name, 'STUDENT');
        if (result.error) throw new Error(result.error);

        if ((result as any).requires_verification) {
          setMode('OTP_VERIFY');
          setSuccess("Registration successful! Verify your email with the 6-digit code.");
        } else if (result.user) {
          setSuccess("Registration successful! Entering dashboard...");
          setTimeout(() => onLogin(result.user), 800);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden p-8 md:p-12 transition-all duration-500">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-4 rounded-2xl mb-6 shadow-xl shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {mode === 'LOGIN' && 'System Access'}
              {mode === 'SIGNUP' && 'Student Enrollment'}
              {mode === 'OTP_REQUEST' && 'Code Sign-In'}
              {mode === 'OTP_VERIFY' && 'Identity Verification'}
              {mode === 'FORGOT_PASSWORD' && 'Reset Password'}
              {mode === 'RESET_PASSWORD' && 'New Password'}
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              {mode === 'LOGIN' && 'Welcome back. Please sign in to continue.'}
              {mode === 'SIGNUP' && 'Join the Elite OJT network today.'}
              {mode === 'OTP_REQUEST' && 'Secure access via email verification.'}
              {mode === 'OTP_VERIFY' && `We've sent a 6-digit code to your email.`}
              {mode === 'FORGOT_PASSWORD' && 'Enter your email to receive a reset code.'}
              {mode === 'RESET_PASSWORD' && 'Create a strong new password for your account.'}
            </p>
          </div>

          {/* Success Toast */}
          {success && (
            <div className={`mb-6 p-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 ${
              success.includes("Verified account") 
                ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400' 
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                success.includes("Verified account") ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}>
                {success.includes("Verified account") ? <Zap size={14} className="text-white" /> : <CheckCircle2 size={14} className="text-slate-900" />}
              </div>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthAction} className="space-y-5">
            {mode === 'SIGNUP' && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            {(mode !== 'OTP_VERIFY' && mode !== 'RESET_PASSWORD') && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            {mode === 'OTP_VERIFY' && (
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white outline-none transition-all text-center tracking-[1em] text-xl font-black"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/[^0-9]/g, '') })}
                />
              </div>
            )}

            {(mode === 'LOGIN' || mode === 'SIGNUP' || mode === 'RESET_PASSWORD') && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === 'RESET_PASSWORD' ? "New Password" : "Password"}
                  className="w-full pl-12 pr-12 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {(mode === 'SIGNUP' || mode === 'RESET_PASSWORD') && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  required
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl text-white outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            )}

            {mode === 'LOGIN' && (
              <div className="flex justify-end px-1">
                <button 
                  type="button"
                  onClick={() => setMode('FORGOT_PASSWORD')}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <span>
                    {mode === 'LOGIN' && 'Sign In'}
                    {mode === 'SIGNUP' && 'Enroll Now'}
                    {mode === 'OTP_REQUEST' && 'Get Access Code'}
                    {mode === 'OTP_VERIFY' && 'Verify & Proceed'}
                    {mode === 'FORGOT_PASSWORD' && 'Send Reset Code'}
                    {mode === 'RESET_PASSWORD' && 'Set New Password'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {mode === 'OTP_VERIFY' && (
            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Resend Code
              </button>
            </div>
          )}

          {mode === 'LOGIN' && (
            <div className="mt-6 flex flex-col gap-4">
              <button 
                type="button"
                onClick={() => setMode('OTP_REQUEST')}
                className="w-full py-3 border border-slate-800 text-slate-400 rounded-2xl text-xs font-bold hover:bg-slate-800/40 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone size={16} /> Login with Access Code
              </button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-800/50 pt-6">
            {mode === 'LOGIN' ? (
              <p className="text-xs text-slate-500 font-bold">
                No account? <button onClick={() => setMode('SIGNUP')} className="text-indigo-400 hover:underline">Register as Student</button>
              </p>
            ) : (
              <button onClick={() => setMode('LOGIN')} className="text-xs text-slate-500 font-bold flex items-center justify-center gap-2 mx-auto hover:text-white transition-colors">
                <ChevronLeft size={16} /> Return to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
