
import React from 'react';
import { Intern } from '../../types';
import { Clock, TrendingUp, Calendar, FileText } from 'lucide-react';

interface StudentDashboardProps {
  intern: Intern;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ intern }) => {
  const progressPercent = Math.round((intern.renderedHours / intern.requiredHours) * 100);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Welcome & Progress Card */}
        <div className="flex-1 bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-2">Welcome Back, {intern.name.split(' ')[0]}!</h2>
            <p className="text-indigo-100 font-medium mb-8 opacity-80">You have completed {progressPercent}% of your OJT requirements.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Rendered</p>
                <h3 className="text-2xl font-bold">{intern.renderedHours}h</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Remaining</p>
                <h3 className="text-2xl font-bold">{Math.max(0, intern.requiredHours - intern.renderedHours)}h</h3>
              </div>
            </div>

            <div className="mt-8">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-xs font-bold uppercase tracking-widest opacity-80">Completion Path</span>
                 <span className="text-lg font-bold">{progressPercent}%</span>
               </div>
               <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
               </div>
            </div>
          </div>
          {/* Orbs */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Status Mini Cards */}
        <div className="md:w-72 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><Clock size={18} /></div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Status</h4>
            </div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg"><TrendingUp size={18} /></div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Daily Avg</h4>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">7.5h</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
           <div className="px-8 py-6 border-b dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" /> Recent Logs
              </h3>
           </div>
           <div className="p-2">
              {intern.logs.slice(-4).reverse().map(log => (
                <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center font-bold text-slate-500">
                    <span className="text-[10px] leading-none">{log.date.split('-')[1]}</span>
                    <span className="text-lg leading-none">{log.date.split('-')[2]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{log.taskDescription}</p>
                    <p className="text-xs text-slate-400 font-medium">Rendered {log.hoursSpent} hours</p>
                  </div>
                </div>
              ))}
              {intern.logs.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm font-medium italic">No logs recorded yet.</div>
              )}
           </div>
        </div>

        {/* Reminders/Calendar Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Daily Log Reminder</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-[240px]">Don't forget to submit your report today to keep your progress accurate!</p>
            <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none">Submit Now</button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
