
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle, 
  PlusCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  UserPlus,
  ShieldCheck,
  Download,
  Edit3,
  Plus
} from 'lucide-react';
import { Intern, TrainingPlanModule, TrainingLog } from '../types';
import { generateTrainingPlan, analyzeProgress } from '../services/geminiService';
import { STATUS_COLORS } from '../constants';

interface InternDetailsProps {
  intern: Intern;
  onBack: () => void;
  onUpdate: (updatedIntern: Intern) => void;
  onCreateAccount: (id: string, email: string, name: string) => void;
  isAccountCreated: boolean;
  onEdit: () => void;
  onAddLog: (log: TrainingLog) => void;
}

const InternDetails: React.FC<InternDetailsProps> = ({ intern, onBack, onUpdate, onCreateAccount, isAccountCreated, onEdit, onAddLog }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);
  const [showAddLog, setShowAddLog] = useState(false);
  const [logForm, setLogForm] = useState({ date: new Date().toISOString().split('T')[0], task: '', hours: 8 });

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    const plan = await generateTrainingPlan(intern);
    if (plan) {
      onUpdate({ ...intern, trainingPlan: plan });
    }
    setIsGenerating(false);
  };

  const handleAnalyzeProgress = async () => {
    if (intern.logs.length === 0) {
      setAnalysisResult("No logs available to analyze. Please add logs first.");
      return;
    }
    setIsAnalyzing(true);
    const result = await analyzeProgress(intern.logs, intern.name);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleExportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Activities,Duration\n"
      + intern.logs.map(l => `"${l.date}","${l.taskDescription.replace(/"/g, '""')}",${l.hoursSpent}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${intern.name.replace(/\s+/g, '_')}_OJT_Logs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TrainingLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: logForm.date,
      taskDescription: logForm.task,
      hoursSpent: Number(logForm.hours)
    };
    onAddLog(newLog);
    setLogForm({ date: new Date().toISOString().split('T')[0], task: '', hours: 8 });
    setShowAddLog(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-sm transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to list
        </button>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportLogs}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Download size={18} /> Export CSV
          </button>
          {!isAccountCreated ? (
            <button 
              onClick={() => onCreateAccount(intern.id, intern.email, intern.name)}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none flex items-center gap-2"
            >
              <UserPlus size={18} /> Generate Account
            </button>
          ) : (
            <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-xl font-bold text-sm flex items-center gap-2">
              <ShieldCheck size={18} /> Account Active
            </div>
          )}
          <button 
            onClick={onEdit}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
                {intern.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">{intern.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{intern.email}</p>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold border uppercase tracking-widest ${STATUS_COLORS[intern.status]}`}>
                {intern.status}
              </div>
              
              <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 my-8" />
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Internship Period</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{intern.startDate} — {intern.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Hours Target</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{intern.requiredHours} Hours Required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-none text-white relative overflow-hidden">
            <Sparkles className="text-indigo-400 absolute top-4 right-4" size={24} />
            <h3 className="text-xl font-bold mb-2">AI Insights</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Analyze work logs and generate internship roadmaps powered by Gemini.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : (
                  <>
                    <BrainCircuit size={18} className="text-indigo-600" />
                    {intern.trainingPlan ? 'Refresh Roadmap' : 'Generate Roadmap'}
                  </>
                )}
              </button>
              <button 
                onClick={handleAnalyzeProgress}
                disabled={isAnalyzing}
                className="w-full py-3 bg-indigo-600 text-white border border-indigo-500/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : (
                  <>
                    <Sparkles size={18} />
                    Analyze Work Performance
                  </>
                )}
              </button>
            </div>
          </div>

          {analysisResult && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-6 rounded-3xl text-emerald-900 dark:text-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-emerald-600" />
                <h4 className="font-bold text-sm uppercase tracking-wider">AI Insights Dashboard</h4>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysisResult}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                Internship Roadmap
              </h3>
            </div>
            <div className="p-4 md:p-8">
              {intern.trainingPlan ? (
                <div className="space-y-4">
                  {intern.trainingPlan.map((module) => (
                    <div key={module.week} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
                      <button 
                        onClick={() => toggleWeek(module.week)}
                        className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm border border-indigo-100 dark:border-indigo-800">
                            W{module.week}
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{module.topic}</span>
                        </div>
                        {expandedWeeks.includes(module.week) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      {expandedWeeks.includes(module.week) && (
                        <div className="px-5 pb-5 pt-2 bg-slate-50/30 dark:bg-slate-800/20">
                          <ul className="space-y-2">
                            {module.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <BrainCircuit size={32} className="text-slate-300 dark:text-slate-700" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Roadmap Unavailable</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mt-2">Generate a professional internship roadmap using Gemini AI.</p>
                  <button onClick={handleGeneratePlan} className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm">Generate Now</button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" />
                Training Logs
              </h3>
              <button 
                onClick={() => setShowAddLog(!showAddLog)}
                className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {showAddLog && (
              <form onSubmit={handleAddLogSubmit} className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date" 
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 text-sm outline-none dark:text-white"
                    value={logForm.date}
                    onChange={e => setLogForm({...logForm, date: e.target.value})}
                    required
                  />
                  <input 
                    type="number" 
                    placeholder="Hours"
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 text-sm outline-none dark:text-white"
                    value={logForm.hours}
                    onChange={e => setLogForm({...logForm, hours: Number(e.target.value)})}
                    required
                  />
                </div>
                <textarea 
                  placeholder="What was accomplished?"
                  className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-700 text-sm outline-none dark:text-white h-24 resize-none"
                  value={logForm.task}
                  onChange={e => setLogForm({...logForm, task: e.target.value})}
                  required
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddLog(false)} className="text-sm font-bold text-slate-500">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-100">Add Log</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-extrabold tracking-widest border-b dark:border-slate-700">
                  <tr>
                    <th className="px-8 py-4 text-left">Date</th>
                    <th className="px-8 py-4 text-left">Activities</th>
                    <th className="px-8 py-4 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {intern.logs.length > 0 ? intern.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-8 py-5 text-sm font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">{log.date}</td>
                      <td className="px-8 py-5">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">{log.taskDescription}</p>
                      </td>
                      <td className="px-8 py-5 text-right font-bold text-slate-900 dark:text-white">{log.hoursSpent} hrs</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic text-sm">No training logs recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDetails;
