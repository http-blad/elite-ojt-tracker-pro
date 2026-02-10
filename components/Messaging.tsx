
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Search, MessageSquare, Clock } from 'lucide-react';
import { User as UserType, Intern, ChatMessage } from '../types';

interface MessagingProps {
  currentUser: UserType;
  interns: Intern[];
  studentAccounts: UserType[];
  messages: ChatMessage[];
  onSendMessage: (text: string, receiverId: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ currentUser, interns, studentAccounts, messages, onSendMessage }) => {
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(
    currentUser.role === 'STUDENT' ? 'admin-01' : null
  );
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatUserId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatUserId) return;
    onSendMessage(inputText, selectedChatUserId);
    setInputText('');
  };

  // Filter accounts for Admin view
  const activeStudentAccounts = studentAccounts.filter(acc => 
    acc.role === 'STUDENT' && 
    (acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedChatUser = selectedChatUserId === 'admin-01' 
    ? { name: 'OJT Coordinator (Admin)', role: 'ADMIN' }
    : studentAccounts.find(acc => acc.id === selectedChatUserId);

  const filteredMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === selectedChatUserId) ||
    (m.senderId === selectedChatUserId && m.receiverId === currentUser.id)
  );

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar for Admin */}
      {currentUser.role === 'ADMIN' && (
        <div className="w-full md:w-80 border-r dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-6 border-b dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-600" />
              Conversations
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeStudentAccounts.length > 0 ? activeStudentAccounts.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedChatUserId(student.id)}
                className={`w-full p-4 flex items-center gap-3 border-b dark:border-slate-800 transition-all ${
                  selectedChatUserId === student.id ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{student.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase font-bold tracking-tight">{student.batch} Batch</p>
                </div>
              </button>
            )) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No active student accounts found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {selectedChatUserId ? (
          <>
            {/* Header */}
            <div className="px-8 py-5 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {selectedChatUser?.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{selectedChatUser?.name}</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online Now</p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all ${
                    msg.senderId === currentUser.id 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-2 px-1">
                    <Clock size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
                    <MessageSquare size={32} className="text-slate-300 dark:text-slate-700" />
                  </div>
                  <h5 className="font-bold text-slate-800 dark:text-white">Start a Conversation</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-2">Send a message to begin discussing internship progress or tasks.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t dark:border-slate-800">
              <form onSubmit={handleSend} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Type your message here..."
                  className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white transition-all"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
              <User size={48} className="text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">Select a Conversation</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Choose a student from the list to view your chat history and send messages.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
