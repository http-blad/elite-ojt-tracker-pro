
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ojt_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  // Persistence
  useEffect(() => {
    localStorage.setItem('ojt_interns', JSON.stringify(interns));
  }, [interns]);

  useEffect(() => {
    localStorage.setItem('ojt_student_accounts', JSON.stringify(studentAccounts));
  }, [studentAccounts]);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const resolveTheme = () => {
      // If user not loaded yet, fall back to system (or light if you prefer)
      const t = user?.theme ?? "system"; // <-- change to "light" if you want
      if (t === "system") return mediaQuery.matches ? "dark" : "light";
      return t; // "dark" | "light"
    };

    const applyTheme = () => {
      const finalTheme = resolveTheme();
      root.classList.toggle("dark", finalTheme === "dark");
    };

    applyTheme();

    // React to system changes only when theme is system
    const onChange = () => {
      if ((user?.theme ?? "system") === "system") applyTheme();
    };

    // Cross-browser support
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onChange);
    } else {
      // @ts-ignore (older Safari)
      mediaQuery.addListener(onChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", onChange);
      } else {
        // @ts-ignore
        mediaQuery.removeListener(onChange);
      }
    };
  }, [user?.theme]);

  useEffect(() => {
    localStorage.setItem('ojt_messages', JSON.stringify(messages));
  }, [messages]);

  // Enhanced Theme Management with System Listener
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (!user) {
        root.classList.remove('dark');
        return;
      }

      const currentTheme = user.theme || 'light';
      
      if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else if (currentTheme === 'light') {
        root.classList.remove('dark');
      } else if (currentTheme === 'system') {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    updateTheme();

    // Listen for system theme changes if 'system' is selected
    const handleSystemChange = () => {
      if (user?.theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [user?.theme, user]);

  // Notifications logic
  const addNotification = useCallback((targetUserId: string, title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: targetUserId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };

    if (user?.id === targetUserId) {
      setUser(prev => prev ? { ...prev, notifications: [newNotif, ...(prev.notifications || [])] } : null);
    } else {
      setStudentAccounts(prev => prev.map(acc => acc.id === targetUserId ? { ...acc, notifications: [newNotif, ...(acc.notifications || [])] } : acc));
    }
  }, [user?.id]);

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

    // Notify receiver
    addNotification(receiverId, "New Message", `You received a message from ${user.name}.`, "info");
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ojt_auth_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ojt_auth_user');
    window.document.documentElement.classList.remove('dark');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('ojt_auth_user', JSON.stringify(updatedUser));

    // Also sync with the main student/admin accounts list so it persists correctly
    if (updatedUser.role === 'STUDENT') {
      setStudentAccounts(prev => prev.map(acc => acc.id === updatedUser.id ? updatedUser : acc));
    }
  };

  const handleAddIntern = (newInternData: Partial<Intern>, password?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const intern: Intern = { 
      ...newInternData, 
      id, 
      logs: [], 
      renderedHours: 0,
      hasAccount: !!password 
    } as Intern;
    
    setInterns([...interns, intern]);
    if (password) {
      handleCreateStudentAccount(id, intern.email, intern.name, password);
    }
    setShowForm(false);
  };

  const handleEditIntern = (updatedInternData: Partial<Intern>) => {
    setInterns(prev => prev.map(i => i.id === updatedInternData.id ? { ...i, ...updatedInternData } : i));
    
    // Notify user if account was updated
    const account = studentAccounts.find(acc => acc.internId === updatedInternData.id);
    if (account) {
      addNotification(account.id, "Account Update", "Admin has updated your internship profile information.", "info");
    }
    
    setEditingIntern(null);
    setSelectedIntern(null);
  };

  const handleCreateStudentAccount = (internId: string, email: string, name: string, password?: string) => {
    const newAccount: User = {
      id: `std-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: 'STUDENT',
      institution: user?.institution || 'Elite Institute',
      batch: user?.batch || '2026',
      term: user?.term || '2',
      password: password || 'password123',
      internId,
      notifications: [],
      theme: 'system' // Default to system theme for new accounts
    };
    setStudentAccounts(prev => [...prev, newAccount]);
    setInterns(prev => prev.map(i => i.id === internId ? { ...i, hasAccount: true } : i));
  };

  const handleAddLogEntry = (internId: string, log: any) => {
    setInterns(prev => prev.map(i => {
      if (i.id === internId) {
        const updatedLogs = [...i.logs, log];
        const updatedHours = updatedLogs.reduce((acc, l) => acc + l.hoursSpent, 0);
        
        // Notify Admin if it's the student logging
        if (user?.role === 'STUDENT') {
          const admins = ['admin-01']; // Mock admin list
          admins.forEach(adminId => {
            addNotification(adminId, "New Report", `${i.name} has submitted a new daily activity report.`, "success");
          });
        }

        return { ...i, logs: updatedLogs, renderedHours: updatedHours };
      }
      return i;
    }));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} studentAccounts={studentAccounts} />;
  }

  const currentUserIntern = user.role === 'STUDENT' ? interns.find(i => i.id === user.internId) : null;

  const renderContent = () => {
    if (user.role === 'ADMIN') {
      if (selectedIntern) {
        return (
          <InternDetails 
            intern={selectedIntern} 
            onBack={() => setSelectedIntern(null)} 
            onUpdate={(updated) => setInterns(interns.map(i => i.id === updated.id ? updated : i))}
            onCreateAccount={handleCreateStudentAccount}
            isAccountCreated={studentAccounts.some(acc => acc.internId === selectedIntern.id)}
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

    if (user.role === 'STUDENT' && currentUserIntern) {
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
      {showForm && (
        <InternForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddIntern} 
        />
      )}
      {editingIntern && (
        <InternForm 
          onClose={() => setEditingIntern(null)} 
          onSubmit={handleEditIntern} 
          initialData={editingIntern}
        />
      )}
    </Layout>
  );
};

export default App;
