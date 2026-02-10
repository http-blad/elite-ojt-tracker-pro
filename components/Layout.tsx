
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-lg tracking-tight dark:text-white">OJT Tracker</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-400">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none">
                <div className="w-6 h-6 bg-white rounded-md rotate-45" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white leading-none">EliteOJT</h1>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-1 uppercase tracking-[0.2em]">
                  {user.role === 'ADMIN' ? 'Management Pro' : 'Student Portal'}
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {filteredNav.map((item) => (
                <button
                  key={`${item.id}-${item.label}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-bold transition-all duration-300
                    ${activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none scale-[1.02]' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
                  `}
                >
                  <span className={activeTab === item.id ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-100 dark:shadow-none">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 text-sm font-extrabold text-rose-500 hover:text-rose-700 transition-colors w-full px-2 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto relative bg-slate-50/30 dark:bg-slate-950/30">
        <header className="hidden md:flex items-center justify-between px-10 py-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white capitalize tracking-tight">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all relative"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifs && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {user.notifications?.length ? user.notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-2 font-medium">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      </div>
                    )) : (
                      <div className="p-8 text-center">
                        <p className="text-xs text-slate-400 italic">No notifications yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800" />
            
            {/* Active Session Display */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user.institution}</p>
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">BATCH {user.batch}</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">TERM {user.term}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                 <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
