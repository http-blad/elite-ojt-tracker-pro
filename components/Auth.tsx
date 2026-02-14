
import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  ChevronLeft,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
  studentAccounts: User[];
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

const Auth: React.FC<AuthProps> = ({ onLogin, studentAccounts }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [role, setRole] = useState<'ADMIN' | 'STUDENT'>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'SIGNUP' && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (mode === 'LOGIN') {
      const { user, error: authError } = await AuthService.login(formData.email, formData.password);
      if (authError) {
        setError(authError);
        setLoading(false);
      } else if (user) {
        onLogin(user);
      }
    } else if (mode === 'SIGNUP') {
      const { user, error: authError } = await AuthService.register(
        formData.email, 
        formData.password, 
        formData.name, 
        role
      );
      if (authError) {
        setError(authError);
        setLoading(false);
      } else if (user) {
        onLogin(user);
      }
    } else if (mode === 'FORGOT_PASSWORD') {
      // simulated for Laravel implementation
      alert("Password reset requested via Laravel Mailer.");
      setMode('LOGIN');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
      
      <div className="w-full max-w-lg px-6 relative z-10 py-12">
        <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500">
          <div className="p-8 sm:p-14">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-4 rounded-[1.5rem] shadow-2xl shadow-indigo-500/20 mb-8 animate-float">
                <ShieldCheck className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter mb-3">
                {mode === 'LOGIN' ? 'EliteOJT' : mode === 'SIGNUP' ? 'Join the Elite' : 'Recovery'}
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                {mode === 'LOGIN' 
                  ? 'Access the unified high-performance OJT monitoring platform.' 
                  : mode === 'SIGNUP' 
                  ? 'Create your Laravel-backed profile to start tracking progress.'
                  : 'Enter your email to receive a Laravel recovery link.'}
              </p>
            </div>

            {/* Role Switcher */}
            {mode !== 'FORGOT_PASSWORD' && (
              <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800 mb-8">
                <button 
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${role === 'STUDENT' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <UserIcon size={14} /> Student
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <UserCheck size={14} /> Administrator
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center gap-3 text-xs font-bold border border-rose-500/20 animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleAuthAction} className="space-y-5">
              {mode === 'SIGNUP' && (
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl transition-all text-sm font-medium outline-none text-white placeholder:text-slate-600"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl transition-all text-sm font-medium outline-none text-white placeholder:text-slate-600"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {mode !== 'FORGOT_PASSWORD' && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl transition-all text-sm font-medium outline-none text-white placeholder:text-slate-600"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {mode === 'SIGNUP' && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-slate-800 focus:border-indigo-500 rounded-2xl transition-all text-sm font-medium outline-none text-white placeholder:text-slate-600"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              )}

              {mode === 'LOGIN' && (
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setMode('FORGOT_PASSWORD')}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                  <>
                    <span className="relative z-10">
                      {mode === 'LOGIN' ? 'Login via Laravel' : mode === 'SIGNUP' ? 'Initialize Profile' : 'Send Recovery'}
                    </span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              {mode === 'LOGIN' ? (
                <p className="text-xs text-slate-500 font-bold">
                  New student? <button type="button" onClick={() => setMode('SIGNUP')} className="text-indigo-400 hover:underline">Register account</button>
                </p>
              ) : (
                <button 
                  type="button"
                  onClick={() => setMode('LOGIN')} 
                  className="text-xs text-slate-500 font-bold flex items-center justify-center gap-2 mx-auto hover:text-indigo-400 transition-colors"
                >
                  <ChevronLeft size={16} /> Back to Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Laravel Footer */}
        <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
           <div className="flex items-center gap-2">
              <KeyRound size={14} className="text-slate-500" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Laravel Sanctum Auth Powered</p>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-[9px] text-slate-600 font-bold uppercase">v3.1.0-Laravel-Sanctum</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-[9px] text-slate-600 font-bold uppercase">Composer Verified</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
