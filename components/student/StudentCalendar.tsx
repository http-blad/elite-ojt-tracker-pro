    
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, FileText, Plus } from 'lucide-react';
import { Intern } from '../../types';

interface StudentCalendarProps {
  intern: Intern;
  onAddLog: (log: any) => void;
}

const StudentCalendar: React.FC<StudentCalendarProps> = ({ intern }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30"></div>);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const log = intern.logs.find(l => l.date === dateStr);
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

    days.push(
      <div key={d} className={`h-24 md:h-32 border-b border-r dark:border-slate-800 p-2 transition-all relative group
        ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-900'}
      `}>
        <span className={`text-xs font-bold flex items-center justify-center w-6 h-6 rounded-lg ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}>
          {d}
        </span>
        {log && (
          <div className="mt-2 p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800 overflow-hidden">
            <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 truncate">{log.taskDescription}</p>
            <p className="text-[8px] font-extrabold text-emerald-500 uppercase">{log.hoursSpent}h rendered</p>
          </div>
        )}
        {!log && !isToday && new Date(year, month, d) < new Date() && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <button className="p-2 bg-indigo-600 text-white rounded-full shadow-lg"><Plus size={16} /></button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 md:p-10 border-b dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <CalendarIcon className="text-indigo-600" size={24} />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Review and manage your daily training reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">Today</button>
          <button onClick={handleNext} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><ChevronRight size={20} /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-4 text-center text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
};

export default StudentCalendar;
