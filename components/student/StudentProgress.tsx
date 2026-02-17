
import React from 'react';
import { Intern } from '../../types';
import { Clock, CheckCircle2, AlertCircle, Briefcase, Calendar } from 'lucide-react';

interface StudentProgressProps {
  intern: Intern;
}

const StudentProgress: React.FC<StudentProgressProps> = ({ intern }) => {
  const rendered = intern.renderedHours;
  const total = intern.requiredHours;
  const remaining = Math.max(0, total - rendered);
  const progressPercent = Math.round((rendered / total) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hours Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">In-depth breakdown of your rendered training time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatItem label="Rendered Hours" value={`${rendered}h`} icon={<Clock />} color="indigo" />
        <StatItem label="Required Total" value={`${total}h`} icon={<CheckCircle2 />} color="emerald" />
        <StatItem label="Remaining Time" value={`${remaining}h`} icon={<AlertCircle />} color="rose" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * progressPercent) / 100} className="text-indigo-600 transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{progressPercent}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Road to Completion</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Consistency is key to a successful internship.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y dark:border-slate-800">
            <div className="flex gap-4">
               <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 h-fit"><Briefcase size={24} /></div>
               <div>
                 <h4 className="font-bold text-slate-800 dark:text-white">Professional Role</h4>
                 <p className="text-sm text-slate-500 font-medium">{intern.department} at {intern.company}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 h-fit"><Calendar size={24} /></div>
               <div>
                 <h4 className="font-bold text-slate-800 dark:text-white">Duration</h4>
                 <p className="text-sm text-slate-500 font-medium">{intern.startDate} to {intern.endDate}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 flex items-center justify-center mb-6`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h4>
  </div>
);

export default StudentProgress;
