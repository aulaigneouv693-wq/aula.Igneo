export interface Lesson {
  id: string;
  title: string;
  durationSeconds: number; // Duración requerida SENCE
  videoUrl: string;
  completed: boolean;
  activeSecondsWatched: number;
  description: string;
  isLocked: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  codeSence: string; // Código SENCE oficial
  title: string;
  subtitle: string;
  hours: number;
  modules: Module[];
  passingScorePercent: number; // Mínimo 75% o 80%
}

export interface StudentProgress {
  studentRut: string;
  studentName: string;
  companyName: string;
  totalTimeActiveSeconds: number;
  requiredTimeSeconds: number;
  percentageCompleted: number;
  lastAccess: string;
  status: 'en_progreso' | 'completado' | 'pendiente_evaluacion' | 'reprobado';
  quizScore?: number;
  certificateHash?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  nfpaReference: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  citations?: string[];
}

export interface CertificateData {
  hash: string;
  studentName: string;
  studentRut: string;
  courseTitle: string;
  hours: number;
  issueDate: string;
  companyName: string;
  instructorName: string;
  senceCode: string;
  qrUrl: string;
}
