export interface Notice {
  id: string;
  title: string;
  category: 'Academics' | 'Events' | 'Exams' | 'Sports' | 'Holidays';
  date: string;
  content: string;
  important?: boolean;
  audience?: 'All' | 'Parents' | 'Students' | 'Staff';
  attachment_url?: string;
  created_at?: string;
}

export interface Program {
  id: string;
  level: string;
  gradeRange: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  iconName: string;
  curriculum: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: string;
  qualification: string;
  experience: string;
  image: string;
  email?: string;
  bio: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at?: string;
}

export interface AdmissionApplication {
  id?: string;
  studentName: string;
  dob: string;
  gradeApplying: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  status?: 'Pending' | 'Under Review' | 'Accepted' | 'Waitlisted';
  created_at?: string;
}

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  grade: string;
  section: string;
  attendancePercentage: number;
  overallGpa: string;
  feeStatus: 'Paid' | 'Pending' | 'Partial';
  subjects: { name: string; score: number; grade: string; teacher: string }[];
  recentActivities: { title: string; date: string; score?: string }[];
}

export interface SupabaseConfigStatus {
  configured: boolean;
  urlSet: boolean;
  keySet: boolean;
  projectId?: string;
  tableCheck?: {
    notices: boolean;
    contact_messages: boolean;
    admissions: boolean;
  };
  missingTables?: string[];
  errors?: Record<string, string>;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
