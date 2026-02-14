
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Settings, 
  TrendingUp,
  FileText,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Intern, InternStatus } from './types';

export const INITIAL_INTERNS: Intern[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@university.edu',
    course: 'BS Computer Science',
    company: 'TechFlow Solutions',
    department: 'Frontend Development',
    startDate: '2024-01-15',
    endDate: '2024-05-15',
    requiredHours: 480,
    renderedHours: 245,
    status: InternStatus.IN_PROGRESS,
    logs: [
      { id: 'l1', date: '2024-03-01', taskDescription: 'Built reusable button components and integrated Tailwind.', hoursSpent: 8 },
      { id: 'l2', date: '2024-03-02', taskDescription: 'Fixed responsive issues on the landing page dashboard.', hoursSpent: 8 }
    ],
    trainingPlan: [
      { week: 1, topic: 'Environment Setup', objectives: ['Setup Node.js', 'Git workflow', 'Docker containers'] },
      { week: 2, topic: 'Component Design', objectives: ['Atomic design principles', 'Styling with Tailwind'] }
    ]
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'm.chen@statecollege.edu',
    course: 'BS Information Technology',
    company: 'SecureNet Systems',
    department: 'Cybersecurity',
    startDate: '2023-12-01',
    endDate: '2024-04-01',
    requiredHours: 600,
    renderedHours: 580,
    status: InternStatus.IN_PROGRESS,
    logs: []
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@techinst.edu',
    course: 'BS Web Development',
    company: 'Creative Pixel',
    department: 'UX/UI Design',
    startDate: '2024-02-01',
    endDate: '2024-06-01',
    requiredHours: 400,
    renderedHours: 400,
    status: InternStatus.COMPLETED,
    logs: []
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, role: 'ADMIN' },
  { id: 'interns', label: 'Interns', icon: <Users size={20} />, role: 'ADMIN' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, role: 'ADMIN' },
  { id: 'reports', label: 'Reports', icon: <ClipboardCheck size={20} />, role: 'ADMIN' },
  
  // Student Nav Items
  { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} />, role: 'STUDENT' },
  { id: 'activity', label: 'Activity Log', icon: <FileText size={20} />, role: 'STUDENT' },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} />, role: 'STUDENT' },
  { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} />, role: 'STUDENT' },
  { id: 'progress', label: 'Hours Progress', icon: <TrendingUp size={20} />, role: 'STUDENT' },
  
  // Shared
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const STATUS_COLORS = {
  [InternStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  [InternStatus.COMPLETED]: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  [InternStatus.ON_LEAVE]: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  [InternStatus.AT_RISK]: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
};
