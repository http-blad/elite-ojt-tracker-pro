
export enum InternStatus {
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  ON_LEAVE = 'On-Leave',
  AT_RISK = 'At-Risk'
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface TrainingLog {
  id: string;
  date: string;
  taskDescription: string;
  hoursSpent: number;
  proofImage?: string; // base64 proof
}

export interface TrainingPlanModule {
  week: number;
  topic: string;
  objectives: string[];
}

export interface Intern {
  id: string;
  name: string;
  email: string;
  course: string;
  company: string;
  department: string;
  startDate: string;
  endDate: string;
  requiredHours: number;
  renderedHours: number;
  status: InternStatus;
  logs: TrainingLog[];
  trainingPlan?: TrainingPlanModule[];
  hasAccount?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  institution: string;
  batch: string;
  term: string;
  password?: string;
  internId?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: Notification[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  type: 'task' | 'deadline' | 'meeting';
}
