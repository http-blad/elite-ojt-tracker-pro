
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Save, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
}

type SettingsTab = 'profile' | 'notifications' | 'security' | 'display';

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState({ ...user });
  const [passwordData, setPasswordData] = useState({ current: '', next: '', confirm: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    showToast("Profile updated successfully!", "success");
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.next !== passwordData.confirm) {
      showToast("Passwords do not match", "info");
      return;
    }
    showToast("Password updated successfully!", "success");
    setPasswordData({ current: '', next: '', confirm: '' });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    const updatedUser = { ...formData, theme: newTheme };
    setFormData(updatedUser);
    onUpdateUser(updatedUser);
    showToast(`Display theme set to ${newTheme}`, "info");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 border ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-100' 
            : 'bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-indigo-900/90 dark:border-indigo-800 dark:text-indigo-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-indigo-500" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal profile and system preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <SettingsNavLink 
            icon={<User size={18} />} 
            label="Profile Details" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsNavLink 
            icon={<Bell size={18} />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
          <SettingsNavLink 
            icon={<Shield size={18} />} 
            label="Security & Privacy" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />
          <SettingsNavLink 
            icon={<Palette size={18} />} 
            label="Display Theme" 
            active={activeTab === 'display'} 
            onClick={() => setActiveTab('display')}
          />
          <div className="pt-8">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </div>

        {/* Settings Form Content */}
        <div className="md:col-span-2 space-y-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-800 pb-4">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Institution</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={formData.institution}
                      onChange={e => setFormData({...formData, institution: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Batch Year</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={formData.batch}
                      onChange={e => setFormData({...formData, batch: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Academic Term</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={formData.term}
                      onChange={e => setFormData({...formData, term: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t dark:border-slate-800 flex justify-end">
                <button 
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Save size={18} /> Save Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-800 pb-4">Notification Preferences</h4>
                <div className="space-y-4">
                  <ToggleSetting 
                    label="Email Notifications" 
                    description="Receive weekly summaries of intern progress" 
                    onToggle={(val) => showToast(`Email Notifications ${val ? 'enabled' : 'disabled'}`)}
                  />
                  <ToggleSetting 
                    label="Push Notifications" 
                    description="Real-time alerts for overdue logs" 
                    checked 
                    onToggle={(val) => showToast(`Push Notifications ${val ? 'enabled' : 'disabled'}`)}
                  />
                  <ToggleSetting 
                    label="Auto-Generate Analysis" 
                    description="AI analysis of every new log added" 
                    checked 
                    onToggle={(val) => showToast(`AI Auto-Analysis ${val ? 'enabled' : 'disabled'}`)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-800 pb-4">Security Settings</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                      value={passwordData.current}
                      onChange={e => setPasswordData({...passwordData, current: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                        value={passwordData.next}
                        onChange={e => setPasswordData({...passwordData, next: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Confirm Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium outline-none dark:text-white"
                        value={passwordData.confirm}
                        onChange={e => setPasswordData({...passwordData, confirm: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t dark:border-slate-800 flex justify-end">
                <button 
                  type="submit"
                  className="px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all"
                >
                  Update Security
                </button>
              </div>
            </form>
          )}

          {activeTab === 'display' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-800 pb-4">Display Theme</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ThemeOption 
                    active={formData.theme === 'light'} 
                    label="Light" 
                    onClick={() => handleThemeChange('light')}
                    previewClass="bg-white border-slate-100"
                  />
                  <ThemeOption 
                    active={formData.theme === 'dark'} 
                    label="Dark" 
                    onClick={() => handleThemeChange('dark')}
                    previewClass="bg-slate-950 border-slate-800"
                  />
                  <ThemeOption 
                    active={formData.theme === 'system'} 
                    label="System" 
                    onClick={() => handleThemeChange('system')}
                    previewClass="bg-gradient-to-r from-white to-slate-950 border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsNavLink = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {icon} {label}
  </button>
);

const ThemeOption = ({ label, active, onClick, previewClass }: { label: string, active: boolean, onClick: () => void, previewClass: string }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
      active 
        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20 shadow-md' 
        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
    }`}
  >
    <div className={`w-full h-12 rounded-lg border ${previewClass}`} />
    <span className={`text-xs font-bold ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
  </button>
);

const ToggleSetting = ({ label, description, checked = false, onToggle }: { label: string, description: string, checked?: boolean, onToggle: (val: boolean) => void }) => {
  const [val, setVal] = useState(checked);
  
  const handleToggle = () => {
    const newVal = !val;
    setVal(newVal);
    onToggle(newVal);
  };

  return (
    <div className="flex items-center justify-between group">
      <div>
        <h5 className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</h5>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{description}</p>
      </div>
      <button 
        onClick={handleToggle}
        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${val ? 'bg-indigo-600 shadow-md shadow-indigo-100 dark:shadow-none' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${val ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
};

export default Settings;
