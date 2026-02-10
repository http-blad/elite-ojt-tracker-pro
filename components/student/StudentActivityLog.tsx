
import React, { useState, useRef } from 'react';
import { Camera, Send, FileText, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { Intern } from '../../types';

interface StudentActivityLogProps {
  intern: Intern;
  onAddLog: (log: any) => void;
}

const StudentActivityLog: React.FC<StudentActivityLogProps> = ({ intern, onAddLog }) => {
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], task: '', hours: 8 });
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Failed to access camera.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
        
        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newLog = {
        id: `log-${Math.random().toString(36).substr(2, 9)}`,
        date: formData.date,
        taskDescription: formData.task,
        hoursSpent: Number(formData.hours),
        proofImage: capturedImage || undefined
      };
      onAddLog(newLog);
      setFormData({ date: new Date().toISOString().split('T')[0], task: '', hours: 8 });
      setCapturedImage(null);
      setIsSubmitting(false);
      alert("Report submitted successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Activity Reporting</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Log your daily progress and provide evidence of your work.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Log Date</label>
                   <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none dark:text-white"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    required
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Hours Spent</label>
                   <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none dark:text-white"
                    value={formData.hours}
                    onChange={e => setFormData({...formData, hours: Number(e.target.value)})}
                    required
                   />
                 </div>
               </div>
               <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Activities & Accomplishments</label>
                 <textarea 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm font-medium outline-none dark:text-white h-32 resize-none"
                  placeholder="What did you work on today? List tasks clearly..."
                  value={formData.task}
                  onChange={e => setFormData({...formData, task: e.target.value})}
                  required
                 />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw size={20} className="animate-spin" /> : <Send size={18} />}
              {isSubmitting ? 'Submitting...' : 'Submit Daily Report'}
            </button>
          </form>
        </div>

        {/* Media/Proof Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8 h-full flex flex-col">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Camera size={20} className="text-indigo-600" /> Proof of Work
            </h4>
            
            <div className="flex-1 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden relative">
              {capturedImage ? (
                <div className="absolute inset-0 group">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured proof" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => setCapturedImage(null)} className="p-3 bg-white text-rose-600 rounded-full shadow-xl"><X size={20} /></button>
                    <button onClick={startCamera} className="p-3 bg-indigo-600 text-white rounded-full shadow-xl"><RefreshCw size={20} /></button>
                  </div>
                </div>
              ) : showCamera ? (
                <div className="absolute inset-0 flex flex-col">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button type="button" onClick={capturePhoto} className="w-14 h-14 bg-white rounded-full border-4 border-indigo-600 flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera size={28} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Live Proof Capture</p>
                  <p className="text-[10px] text-slate-400 font-medium mb-6">Capture a screenshot or photo of your current task workspace.</p>
                  <button type="button" onClick={startCamera} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">Enable Camera</button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <p className="text-[10px] text-slate-400 mt-4 text-center font-medium italic">Attachments ensure transparency and better evaluation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentActivityLog;
