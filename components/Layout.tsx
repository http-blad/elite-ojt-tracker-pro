
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, LogOut, Bell, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (id: string) => void;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const filteredNav = NAV_ITEMS.filter(item => !item.role || item.role === user.role);
  const unreadCount = user.notifications?.filter(n => !n.read).length || 0;

  // Primary mobile actions
  const mobileNavItems = filteredNav.filter(i => ['dashboard', 'messages', 'progress', 'activity'].includes(i.id)).slice(0, 4);

  // Safe name fallback
  const userName = user?.name || 'User';

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Header */}
      <div className="md:hidden h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-base tracking-tight dark:text-white">EliteOJT</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-slate-500 relative">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />}
          </button>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shrink-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
                  <div className="w-6 h-6 bg-white rounded-md rotate-45" />
                </div>
                <div>
                  <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white leading-none tracking-tight">EliteOJT</h1>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-1.5 uppercase tracking-[0.2em]">
                    {user.role === 'ADMIN' ? 'Admin' : 'Student'} Portal
                  </p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-1.5">
              {filteredNav.map((item) => (
                <button
                  key={`nav-${item.id}-${item.label}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none translate-x-1' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <span className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-lg shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-3 text-sm font-extrabold text-rose-500 hover:text-rose-700 transition-colors w-full px-2 group">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col h-full relative">
        {/* Desktop Top Header */}
        <header className="hidden md:flex items-center justify-between px-10 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white capitalize tracking-tight">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
            >
              <Bell size={22} />
              {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />}
            </button>

            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="text-right">
              <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">{user.institution || 'Institutional Access'}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1.5">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Batch {user.batch || '2026'}</span>
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Term {user.term || '1'}</span>
              </div>
            </div>
          </div>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute top-20 right-10 w-80 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                <button onClick={() => setShowNotifs(false)}><X size={16} /></button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {user.notifications?.length ? user.notifications.map(n => (
                  <div key={n.id} className="p-4 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{n.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                    <p className="text-[9px] text-slate-400 mt-2 font-medium">{new Date(n.timestamp).toLocaleTimeString()}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-slate-400 italic text-sm">No new alerts.</div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="max-w-7xl mx-auto p-4 md:p-10 pb-28 md:pb-16 min-h-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden h-16 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex items-center justify-around px-2 shrink-0 z-50">
          {mobileNavItems.map((item) => (
            <button
              key={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
                activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-slate-400'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              <span className="text-[9px] font-bold tracking-tight uppercase">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-slate-400">
            <Menu size={20} />
            <span className="text-[9px] font-bold tracking-tight uppercase">More</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[65] bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
