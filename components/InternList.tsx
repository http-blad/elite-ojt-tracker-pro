
import React, { useState } from 'react';
import { Search, Plus, Mail, Building2, MapPin } from 'lucide-react';
import { Intern, InternStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface InternListProps {
  interns: Intern[];
  onAdd: () => void;
  onSelect: (intern: Intern) => void;
}

const InternList: React.FC<InternListProps> = ({ interns, onAdd, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InternStatus | 'All'>('All');

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          intern.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || intern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm dark:text-white text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
            {['All', ...Object.values(InternStatus)].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-tight transition-all ${
                  filterStatus === status 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all ml-auto"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Intern</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredInterns.map((intern) => (
          <div 
            key={intern.id}
            onClick={() => onSelect(intern)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  {intern.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${STATUS_COLORS[intern.status]}`}>
                  {intern.status}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{intern.name}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                  <Mail size={14} />
                  {intern.email}
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                  <Building2 size={16} className="text-slate-400 dark:text-slate-500" />
                  <span className="font-medium">{intern.company}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                  <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                  <span className="font-medium">{intern.department}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  <span>Progress</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{Math.round((intern.renderedHours / intern.requiredHours) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${(intern.renderedHours / intern.requiredHours) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  <span>{intern.renderedHours}h rendered</span>
                  <span>{intern.requiredHours}h total</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">{intern.course}</span>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInterns.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="text-slate-300 dark:text-slate-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No interns found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs text-center mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default InternList;
