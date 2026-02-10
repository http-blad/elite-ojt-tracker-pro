
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Trash2 } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarPageProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', type: 'task' as const });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(year, currentDate.getMonth());
  const firstDay = firstDayOfMonth(year, currentDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 md:h-32 border-b border-r border-slate-100 bg-slate-50/30"></div>);
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateEvents = events.filter(e => e.date === dateStr);
    const isToday = new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();
    const isSelected = selectedDate.toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();

    days.push(
      <div 
        key={day}
        onClick={() => setSelectedDate(new Date(year, currentDate.getMonth(), day))}
        className={`h-24 md:h-32 border-b border-r border-slate-100 p-2 cursor-pointer transition-all hover:bg-indigo-50/30 relative
          ${isSelected ? 'bg-indigo-50/50' : 'bg-white'}
        `}
      >
        <span className={`text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full
          ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}
        `}>
          {day}
        </span>
        <div className="mt-1 space-y-1 overflow-y-auto max-h-[70%]">
          {dateEvents.map(event => (
            <div 
              key={event.id}
              className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-bold uppercase tracking-tighter
                ${event.type === 'deadline' ? 'bg-rose-100 text-rose-700' : 
                  event.type === 'meeting' ? 'bg-amber-100 text-amber-700' : 
                  'bg-blue-100 text-blue-700'}
              `}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedEvents = events.filter(e => e.date === selectedDateStr);

  const handleAdd = () => {
    onAddEvent({
      id: Math.random().toString(36).substr(2, 9),
      date: selectedDateStr,
      ...newEvent
    });
    setNewEvent({ title: '', description: '', type: 'task' });
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Calendar Section */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <CalendarIcon className="text-indigo-600" size={24} />
              {monthName} <span className="text-slate-400 font-medium">{year}</span>
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all">
                Today
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Agenda</p>
                <h4 className="text-lg font-bold text-slate-900">
                  {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h4>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {selectedEvents.length > 0 ? (
                selectedEvents.map(event => (
                  <div key={event.id} className="group p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden transition-all hover:bg-white hover:shadow-md">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      event.type === 'deadline' ? 'bg-rose-500' : 
                      event.type === 'meeting' ? 'bg-amber-500' : 
                      'bg-indigo-500'
                    }`} />
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm mb-1">{event.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
                      </div>
                      <button 
                        onClick={() => onDeleteEvent(event.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Clock size={28} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm">No tasks scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add New Task</h3>
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Weekly Report Submission"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                <textarea 
                  placeholder="Describe the task details..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-sm h-24 resize-none"
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['task', 'deadline', 'meeting'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNewEvent({...newEvent, type: type as any})}
                      className={`py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border transition-all ${
                        newEvent.type === type 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
