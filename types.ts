
export enum InternStatus {
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  ON_LEAVE = 'On-Leave',
  AT_RISK = 'At-Risk'
}

export type UserRole = 'SUPERADMIN' | 'COORDINATOR' | 'STUDENT';

export enum AppPermission {
  MANAGE_SYSTEM = 'manage_system',
  VIEW_SYSTEM_LOGS = 'view_system_logs',
  MANAGE_USERS = 'manage_users',
  MANAGE_INTERNS = 'manage_interns',
  VIEW_REPORTS = 'view_reports',
  GENERATE_TRAINING_PLANS = 'generate_training_plans',
  SUBMIT_LOGS = 'submit_logs',
  VIEW_OWN_PROGRESS = 'view_own_progress',
  CHAT_WITH_COORDINATOR = 'chat_with_coordinator',
  CHAT_WITH_STUDENTS = 'chat_with_students'
}

export interface SystemLog {
  id: number;
  user_id: string | null;
  user_name: string | null;
  event_type: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'UPDATE' | 'DELETE' | 'SECURITY';
  description: string;
  ip_address: string | null;
  created_at: string;
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
  role: UserRole;
  institution: string;
  batch: string;
  term: string;
  password?: string;
  internId?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: Notification[];
  email_verified_at: string | null;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  type: 'task' | 'deadline' | 'meeting';
}
