
import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Building, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  studentAccounts: User[];
}

const Auth: React.FC<AuthProps> = ({ onLogin, studentAccounts }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    institution: 'State University'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      // Check for Admin (Hardcoded for demo)
      if (formData.email === 'admin@edu.ph' && formData.password === 'admin123') {
        onLogin({
          id: 'admin-01',
          name: 'Admin Coordinator',
          email: formData.email,
          role: 'ADMIN',
          institution: 'State University',
          batch: '2026',
          term: '2'
        });
        return;
      }

      // Check for Student Accounts
      const student = studentAccounts.find(s => s.email === formData.email && (s.password === formData.password || formData.password === 'password123'));
      if (student) {
        onLogin(student);
        return;
      }

      setError('Invalid credentials or account does not exist.');
    } else {
      // Sign up is ONLY for new Admin demo accounts in this context
      onLogin({
        id: `adm-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        email: formData.email,
        role: 'ADMIN',
        institution: formData.institution,
        batch: '2026',
        term: '2'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse delay-700"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
          <div className="p-10">
            <div className="flex flex-col items-center mb-10">
              <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mb-6 rotate-3">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-center">
                {isLogin ? 'OJT Elite Portal' : 'Admin Registration'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium text-center">
                {isLogin ? 'Students: Use the credentials provided by your Admin.' : 'Create an Admin coordinator account.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center gap-3 text-sm font-bold border border-rose-100 dark:border-rose-800 animate-in shake duration-300">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="Institution Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isLogin ? 'Sign In' : 'Register Admin'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
              >
                {isLogin ? "Need an Admin account? Register" : "Already have an account? Sign In"}
              </button>
            </div>
            {isLogin && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-2">Demo Credentials</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  Admin: <code className="text-indigo-600">admin@edu.ph</code> / <code className="text-indigo-600">admin123</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
