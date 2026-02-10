
import React, { useState, useMemo } from 'react';
import { Users, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Intern } from '../types';

interface DashboardProps {
  interns: Intern[];
}

const Dashboard: React.FC<DashboardProps> = ({ interns }) => {
  const [timeRange, setTimeRange] = useState<'Day' | 'Week' | 'Month'>('Week');

  const activeInterns = interns.filter(i => i.status !== 'Completed').length;
  const completedInterns = interns.filter(i => i.status === 'Completed').length;
  const totalHours = interns.reduce((acc, curr) => acc + curr.renderedHours, 0);
  const totalRequired = interns.reduce((acc, curr) => acc + curr.requiredHours, 0);
  const completionPercentage = Math.round((totalHours / totalRequired) * 100) || 0;

  const chartData = useMemo(() => {
    if (timeRange === 'Day') {
      return [
        { name: '08:00', hours: 12 },
        { name: '10:00', hours: 25 },
        { name: '12:00', hours: 45 },
        { name: '14:00', hours: 38 },
        { name: '16:00', hours: 52 },
        { name: '18:00', hours: 15 },
      ];
    } else if (timeRange === 'Week') {
      return [
        { name: 'Mon', hours: 45 },
        { name: 'Tue', hours: 52 },
        { name: 'Wed', hours: 48 },
        { name: 'Thu', hours: 61 },
        { name: 'Fri', hours: 55 },
        { name: 'Sat', hours: 20 },
        { name: 'Sun', hours: 10 },
      ];
    } else {
      return [
        { name: 'Week 1', hours: 240 },
        { name: 'Week 2', hours: 310 },
        { name: 'Week 3', hours: 280 },
        { name: 'Week 4', hours: 350 },
      ];
    }
  }, [timeRange]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          icon={<Users className="text-indigo-600 dark:text-indigo-400" />} 
          label="Active Interns" 
          value={activeInterns.toString()} 
          change="+2 this week"
          trend="up"
        />
        <StatCard 
          icon={<Clock className="text-blue-600 dark:text-blue-400" />} 
          label="Total Hours Rendered" 
          value={totalHours.toLocaleString()} 
          change="89% of target"
          trend="neutral"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />} 
          label="Completions" 
          value={completedInterns.toString()} 
          change="4 pending"
          trend="up"
        />
        <StatCard 
          icon={<AlertCircle className="text-rose-600 dark:text-rose-400" />} 
          label="At Risk" 
          value="1" 
          change="Critical attention"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Hours Velocity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Aggregate hours rendered in {timeRange.toLowerCase()} view</p>
            </div>
            <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
              {(['Day', 'Week', 'Month'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeRange === r 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Overall Progress</h3>
            <p className="text-indigo-100 text-sm mb-8 opacity-90">Total hours across all active departments.</p>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-extrabold tracking-tighter">{completionPercentage}%</span>
              <TrendingUp size={24} className="mb-2 text-indigo-300" />
            </div>
            <div className="w-full bg-indigo-500/50 rounded-full h-3 mb-6">
              <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            
            <ul className="space-y-4">
              <li className="flex justify-between text-sm font-medium">
                <span className="text-indigo-100">IT Department</span>
                <span>82%</span>
              </li>
              <li className="flex justify-between text-sm font-medium">
                <span className="text-indigo-100">Engineering</span>
                <span>45%</span>
              </li>
              <li className="flex justify-between text-sm font-medium">
                <span className="text-indigo-100">Finance</span>
                <span>91%</span>
              </li>
            </ul>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500 dark:bg-indigo-600 rounded-full opacity-20"></div>
          <div className="absolute top-12 -left-12 w-24 h-24 bg-white rounded-full opacity-5"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, change, trend }: { icon: React.ReactNode, label: string, value: string, change: string, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
        {icon}
      </div>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline justify-between">
      <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</h4>
      <div className={`text-xs font-bold px-2 py-1 rounded-full ${
        trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 
        trend === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' : 
        'text-slate-500 bg-slate-50 dark:bg-slate-800'
      }`}>
        {change}
      </div>
    </div>
  </div>
);

export default Dashboard;
