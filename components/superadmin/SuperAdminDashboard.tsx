
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Plus, 
  Clock, 
  HardDrive, 
  UserCog, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { SystemLog } from '../../types';

const SuperAdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [coordForm, setCoordForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await AuthService.fetchSystemLogs();
      setLogs(data);
    };
    fetchLogs();
  }, []);

  const handleCreateCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordForm.email.endsWith('@ojtcoord.com')) {
      alert("Error: Email must end with @ojtcoord.com");
      return;
    }
    setLoading(true);
    try {
      await AuthService.register(coordForm.email, coordForm.password, coordForm.name, 'COORDINATOR');
      alert("Coordinator account provisioned successfully.");
      setCoordForm({ name: '', email: '', password: '' });
      // Refresh logs
      const data = await AuthService.fetchSystemLogs();
      setLogs(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">System Control Center</h2>
          <p className="text-slate-500 font-medium">Global oversight of the OJT network and administrative provisioning.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-xs font-bold">
            <Activity size={14} className="animate-pulse" /> SYSTEM ONLINE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provisioning */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
            <ShieldAlert className="absolute -right-8 -bottom-8 opacity-10" size={180} />
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <UserCog size={24} /> Provision Coordinator
            </h3>
            <form onSubmit={handleCreateCoordinator} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Dr. Emily Smith"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-white/40 text-sm font-medium"
                  value={coordForm.name}
                  onChange={e => setCoordForm({...coordForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest px-1">Email (@ojtcoord.com)</label>
                <input 
                  required
                  type="email" 
                  placeholder="emily@ojtcoord.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-white/40 text-sm font-medium"
                  value={coordForm.email}
                  onChange={e => setCoordForm({...coordForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-widest px-1">Temp Password</label>
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20 transition-all placeholder:text-white/40 text-sm font-medium"
                  value={coordForm.password}
                  onChange={e => setCoordForm({...coordForm, password: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Plus size={18} /> Provision Access
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Security Stats</h4>
            <div className="space-y-6">
               <StatRow label="Failed Logins" value="0" icon={<AlertCircle className="text-emerald-500" />} />
               <StatRow label="Active Sessions" value="12" icon={<CheckCircle2 className="text-indigo-500" />} />
               <StatRow label="DB Integrity" value="OK" icon={<HardDrive className="text-blue-500" />} />
            </div>
          </div>
        </div>

        {/* Right Column: System Logs */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-900 dark:bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Clock className="text-indigo-400" size={24} />
                    Audit Logs
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Real-time system events and security tracking.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input type="text" placeholder="Search events..." className="bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none w-48" />
                </div>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                   <thead className="bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                     <tr>
                       <th className="px-8 py-4">Event Type</th>
                       <th className="px-8 py-4">Description</th>
                       <th className="px-8 py-4">User</th>
                       <th className="px-8 py-4 text-right">Timestamp</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                     {logs.length > 0 ? logs.map(log => (
                       <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                         <td className="px-8 py-4">
                           <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                             log.event_type === 'SECURITY' ? 'bg-rose-500/20 text-rose-500' :
                             log.event_type === 'LOGIN' ? 'bg-emerald-500/20 text-emerald-500' :
                             'bg-indigo-500/20 text-indigo-400'
                           }`}>
                             {log.event_type}
                           </span>
                         </td>
                         <td className="px-8 py-4 text-sm text-slate-300 font-medium">{log.description}</td>
                         <td className="px-8 py-4 text-xs text-slate-500 font-bold">{log.user_name || 'Guest'}</td>
                         <td className="px-8 py-4 text-right text-[10px] text-slate-600 font-bold">
                           {new Date(log.created_at).toLocaleTimeString()}
                         </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic text-sm">No recent events detected.</td>
                       </tr>
                     )}
                   </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-center">
                <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 flex items-center gap-1">
                  View Full Audit Trail <ArrowUpRight size={12} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</span>
    </div>
    <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
  </div>
);

export default SuperAdminDashboard;
