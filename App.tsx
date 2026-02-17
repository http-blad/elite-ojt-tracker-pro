
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InternList from './components/InternList';
import InternDetails from './components/InternDetails';
import InternForm from './components/InternForm';
import Settings from './components/Settings';
import Auth from './components/Auth';
import Messaging from './components/Messaging';
import CalendarPage from './components/CalendarPage';
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import StudentActivityLog from './components/student/StudentActivityLog';
import StudentProgress from './components/student/StudentProgress';
import { Intern, User, CalendarEvent, ChatMessage } from './types';
import { INITIAL_INTERNS } from './constants';
import { AuthService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ojt_auth_user');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [initializing, setInitializing] = useState(true);
  const [interns, setInterns] = useState<Intern[]>(() => {
    const saved = localStorage.getItem('ojt_interns');
    return saved ? JSON.parse(saved) : INITIAL_INTERNS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const sessionUser = await AuthService.checkSession();
        if (sessionUser) handleLogin(sessionUser);
      } catch (e) {
        console.error("Session check failed");
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ojt_auth_user', JSON.stringify(u));
    setActiveTab('dashboard'); 
  };

  const handleLogout = async () => {
    try { await AuthService.logout(); } catch (e) {}
    setUser(null);
    localStorage.removeItem('ojt_auth_user');
  };

  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);

  const handleUpdateIntern = (updated: Intern) => {
    const newInterns = interns.map(i => i.id === updated.id ? updated : i);
    setInterns(newInterns);
    localStorage.setItem('ojt_interns', JSON.stringify(newInterns));
    if (selectedIntern?.id === updated.id) setSelectedIntern(updated);
  };

  const handleAddIntern = (newInternData: Partial<Intern>) => {
    const newIntern: Intern = {
      id: Math.random().toString(36).substr(2, 9),
      logs: [],
      renderedHours: 0,
      ...newInternData
    } as Intern;
    const newInterns = [...interns, newIntern];
    setInterns(newInterns);
    localStorage.setItem('ojt_interns', JSON.stringify(newInterns));
    setShowForm(false);
  };

  const handleSendMessage = (text: string, receiverId: string) => {
    if (!user) return;
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      senderName: user.name,
      receiverId,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  if (initializing) return <div className="h-screen w-full flex items-center justify-center bg-[#020617] text-white font-black animate-pulse">BOOTING ELITEOJT...</div>;
  if (!user) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    // 1. SUPERADMIN VIEW
    if (user.role === 'SUPERADMIN') {
      switch (activeTab) {
        case 'dashboard': return <SuperAdminDashboard view="overview" />;
        case 'coordinators': return <SuperAdminDashboard view="coordinators" />;
        case 'students': return <SuperAdminDashboard view="students" />;
        case 'logs': return <SuperAdminDashboard view="overview" />; 
        case 'settings': return <Settings user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
        default: return <SuperAdminDashboard view="overview" />;
      }
    }

    // 2. COORDINATOR VIEW
    if (user.role === 'COORDINATOR') {
      if (selectedIntern) {
        return <InternDetails 
          intern={selectedIntern} onBack={() => setSelectedIntern(null)} 
          onUpdate={handleUpdateIntern}
          onCreateAccount={() => {}} 
          isAccountCreated={selectedIntern.hasAccount || false}
          onEdit={() => { setEditingIntern(selectedIntern); setShowForm(true); }} 
          onAddLog={(l) => handleUpdateIntern({...selectedIntern, logs: [...selectedIntern.logs, l], renderedHours: selectedIntern.renderedHours + l.hoursSpent})}
        />;
      }
      switch (activeTab) {
        case 'dashboard': return <Dashboard interns={interns} />;
        case 'interns': return (
          <>
            <InternList interns={interns} onAdd={() => setShowForm(true)} onSelect={setSelectedIntern} />
            {showForm && (
              <InternForm 
                onClose={() => { setShowForm(false); setEditingIntern(null); }} 
                onSubmit={(data) => editingIntern ? handleUpdateIntern({...editingIntern, ...data} as Intern) : handleAddIntern(data)}
                initialData={editingIntern || undefined}
              />
            )}
          </>
        );
        case 'messages': return <Messaging currentUser={user} interns={interns} studentAccounts={[]} messages={messages} onSendMessage={handleSendMessage} />;
        case 'settings': return <Settings user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
        default: return <Dashboard interns={interns} />;
      }
    }

    // 3. STUDENT VIEW
    const studentIntern = interns.find(i => i.email === user.email);
    switch (activeTab) {
      case 'dashboard': return studentIntern ? <StudentDashboard intern={studentIntern} /> : null;
      case 'activity': return studentIntern ? <StudentActivityLog intern={studentIntern} onAddLog={(l) => studentIntern && handleUpdateIntern({...studentIntern, logs: [...studentIntern.logs, l], renderedHours: studentIntern.renderedHours + l.hoursSpent})} /> : null;
      case 'progress': return studentIntern ? <StudentProgress intern={studentIntern} /> : null;
      case 'messages': return <Messaging currentUser={user} interns={interns} studentAccounts={[]} messages={messages} onSendMessage={handleSendMessage} />;
      case 'calendar': return <CalendarPage events={events} onAddEvent={(e) => setEvents([...events, e])} onDeleteEvent={(id) => setEvents(events.filter(e => e.id !== id))} />;
      case 'settings': return <Settings user={user} onUpdateUser={setUser} onLogout={handleLogout} />;
      default: return studentIntern ? <StudentDashboard intern={studentIntern} /> : null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
