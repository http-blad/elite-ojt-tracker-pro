
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InternList from './components/InternList';
import InternDetails from './components/InternDetails';
import InternForm from './components/InternForm';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Messaging from './components/Messaging';
import StudentDashboard from './components/student/StudentDashboard';
import StudentCalendar from './components/student/StudentCalendar';
import StudentActivityLog from './components/student/StudentActivityLog';
import StudentProgress from './components/student/StudentProgress';
import { Intern, User, Notification, ChatMessage } from './types';
import { INITIAL_INTERNS } from './constants';
import { AuthService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ojt_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initializing, setInitializing] = useState(true);
  
  const [interns, setInterns] = useState<Intern[]>(() => {
    const saved = localStorage.getItem('ojt_interns');
    return saved ? JSON.parse(saved) : INITIAL_INTERNS;
  });

  const [studentAccounts, setStudentAccounts] = useState<User[]>(() => {
    const saved = localStorage.getItem('ojt_student_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ojt_messages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);

  // Sync with Laravel Session on Mount
  useEffect(() => {
    const initAuth = async () => {
      const serverUser = await AuthService.checkSession();
      if (serverUser) {
        handleLogin(serverUser);
      } else if (user) {
        // Local state says logged in but server says no: logout
        handleLogout();
      }
      setInitializing(false);
    };
    initAuth();
  }, []);

  // Theme Sync
  useEffect(() => {
    const root = window.document.documentElement;
    const theme = user?.theme || 'dark';
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [user?.theme, user]);

  // Persistence side-effects
  useEffect(() => localStorage.setItem('ojt_interns', JSON.stringify(interns)), [interns]);
  useEffect(() => localStorage.setItem('ojt_student_accounts', JSON.stringify(studentAccounts)), [studentAccounts]);
  useEffect(() => localStorage.setItem('ojt_messages', JSON.stringify(messages)), [messages]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ojt_auth_user', JSON.stringify(u));
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    localStorage.removeItem('ojt_auth_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('ojt_auth_user', JSON.stringify(updatedUser));
    if (updatedUser.role === 'STUDENT') {
      setStudentAccounts(prev => prev.map(acc => acc.id === updatedUser.id ? updatedUser : acc));
    }
  };

  const handleAddIntern = (newInternData: Partial<Intern>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const intern: Intern = { 
      ...newInternData, 
      id, 
      logs: [], 
      renderedHours: 0,
      hasAccount: false 
    } as Intern;
    setInterns([...interns, intern]);
    setShowForm(false);
  };

  const handleEditIntern = (updatedInternData: Partial<Intern>) => {
    setInterns(prev => prev.map(i => i.id === updatedInternData.id ? { ...i, ...updatedInternData } : i));
    setEditingIntern(null);
    setSelectedIntern(null);
  };

  const handleAddLogEntry = (internId: string, log: any) => {
    setInterns(prev => prev.map(i => {
      if (i.id === internId) {
        const updatedLogs = [...i.logs, log];
        const updatedHours = updatedLogs.reduce((acc, l) => acc + l.hoursSpent, 0);
        return { ...i, logs: updatedLogs, renderedHours: updatedHours };
      }
      return i;
    }));
  };

  const handleSendMessage = (text: string, receiverId: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      receiverId: receiverId,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (initializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Laravel Sync Active</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} studentAccounts={studentAccounts} />;
  }

  const currentUserIntern = user.role === 'STUDENT' ? interns.find(i => i.id === user.internId || i.email === user.email) : null;

  const renderContent = () => {
    if (user.role === 'ADMIN') {
      if (selectedIntern) {
        return (
          <InternDetails 
            intern={selectedIntern} 
            onBack={() => setSelectedIntern(null)} 
            onUpdate={(updated) => setInterns(interns.map(i => i.id === updated.id ? updated : i))}
            onCreateAccount={() => {}} 
            isAccountCreated={selectedIntern.hasAccount || false}
            onEdit={() => setEditingIntern(selectedIntern)}
            onAddLog={(log) => handleAddLogEntry(selectedIntern.id, log)}
          />
        );
      }
      switch (activeTab) {
        case 'dashboard': return <Dashboard interns={interns} />;
        case 'interns': return <InternList interns={interns} onAdd={() => setShowForm(true)} onSelect={setSelectedIntern} />;
        case 'messages': return <Messaging currentUser={user} interns={interns} studentAccounts={studentAccounts} messages={messages} onSendMessage={handleSendMessage} />;
        case 'settings': return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
        default: return <Dashboard interns={interns} />;
      }
    }

    if (user.role === 'STUDENT') {
      if (!currentUserIntern) return <div className="p-10 text-center text-slate-400">Warning: No intern record linked to this account.</div>;
      switch (activeTab) {
        case 'dashboard': return <StudentDashboard intern={currentUserIntern} />;
        case 'calendar': return <StudentCalendar intern={currentUserIntern} onAddLog={(log) => handleAddLogEntry(currentUserIntern.id, log)} />;
        case 'activity': return <StudentActivityLog intern={currentUserIntern} onAddLog={(log) => handleAddLogEntry(currentUserIntern.id, log)} />;
        case 'messages': return <Messaging currentUser={user} interns={interns} studentAccounts={studentAccounts} messages={messages} onSendMessage={handleSendMessage} />;
        case 'progress': return <StudentProgress intern={currentUserIntern} />;
        case 'settings': return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
        default: return <StudentDashboard intern={currentUserIntern} />;
      }
    }
    return null;
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {renderContent()}
      {showForm && <InternForm onClose={() => setShowForm(false)} onSubmit={handleAddIntern} />}
      {editingIntern && <InternForm onClose={() => setEditingIntern(null)} onSubmit={handleEditIntern} initialData={editingIntern} />}
    </Layout>
  );
};

export default App;
