/**
 * Tipos TypeScript para la aplicación
 * Instituto Educativo - Sistema de Gestión
 */

import { UserRole } from './constants';

// ============ USUARIO ============
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// ============ ESTUDIANTE ============
export interface Student {
  id: string;
  userId: string;
  studentId: string;
  enrolledSubjects: string[];
  gpa: number;
  attendanceRate: number;
  enrollmentDate: Date;
}

export interface StudentProgress {
  studentId: string;
  subjectId: string;
  subjectName: string;
  currentGrade: number;
  attendance: number;
  trend: 'up' | 'down' | 'stable';
}

// ============ DOCENTE ============
export interface Teacher {
  id: string;
  userId: string;
  teacherId: string;
  subjects: string[];
  department: string;
  hireDate: Date;
  qualifications?: string[];
}

// ============ CALIFICACIÓN ============
export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  value: number;
  weight: number;
  date: Date;
  type: 'quiz' | 'midterm' | 'final' | 'assignment';
  comments?: string;
}

export interface GradeStatistics {
  average: number;
  highest: number;
  lowest: number;
  median: number;
  standardDeviation: number;
}

// ============ HORARIO ============
export interface Schedule {
  id: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  classroom: string;
  capacity?: number;
}

// ============ ASISTENCIA ============
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  subjectId: string;
  totalClasses: number;
  attended: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

// ============ ASIGNATURA ============
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  description?: string;
  department?: string;
  semester?: number;
  maxStudents?: number;
  enrolledStudents?: number;
}

export interface SubjectAnalytics {
  subjectId: string;
  subjectName: string;
  totalStudents: number;
  averageGrade: number;
  passRate: number;
  attendanceRate: number;
  gradeDistribution: {
    excellent: number;
    good: number;
    average: number;
    below_average: number;
    fail: number;
  };
}

// ============ AUDITORÍA ============
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// ============ REPORTES ============
export interface Report {
  id: string;
  title: string;
  type: 'grades' | 'attendance' | 'progress' | 'analytics';
  generatedBy: string;
  generatedAt: Date;
  data: any;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  studentId?: string;
  subjectId?: string;
  teacherId?: string;
  status?: string;
}

// ============ PAGINACIÓN ============
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ RESPUESTA API ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// ============ NOTIFICACIÓN ============
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

// ============ ESTADÍSTICAS ============
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  averageGPA: number;
  averageAttendance: number;
}

export interface TeacherStats {
  totalStudents: number;
  averageGrade: number;
  averageAttendance: number;
  classesThisWeek: number;
  pendingGrades: number;
}

export interface StudentStats {
  currentGPA: number;
  attendanceRate: number;
  enrolledSubjects: number;
  averageGrade: number;
  classesThisWeek: number;
}

// ============ FORMULARIOS ============
export interface AddStudentForm {
  email: string;
  name: string;
  studentId: string;
  enrolledSubjects: string[];
}

export interface AddTeacherForm {
  email: string;
  name: string;
  teacherId: string;
  subjects: string[];
  department: string;
}

export interface AddGradeForm {
  studentId: string;
  subjectId: string;
  value: number;
  weight: number;
  type: 'quiz' | 'midterm' | 'final' | 'assignment';
  comments?: string;
}

export interface AddScheduleForm {
  subjectId: string;
  teacherId: string;
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

export interface AddAttendanceForm {
  studentId: string;
  subjectId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

// ============ ESTADO DE COMPONENTES ============
export interface ComponentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// ============ MÓDULO DE MÚSICA ============

export type InstrumentFamily =
  | 'Cuerdas'
  | 'Vientos Madera'
  | 'Vientos Metal'
  | 'Percusión'
  | 'Teclas'
  | 'Voz';

export type InstrumentStatus =
  | 'available'
  | 'loaned'
  | 'maintenance'
  | 'retired';

export interface MusicInstrument {
  id: string;
  name: string;
  serial: string;
  family: InstrumentFamily;
  brand?: string;
  status: InstrumentStatus;
  acquiredAt: Date;
  /** Estudiante (Student.id) al que está prestado, si aplica */
  loanedToStudentId?: string;
  notes?: string;
}

export type EnsembleType =
  | 'Banda Sinfónica'
  | 'Coro'
  | 'Orquesta'
  | 'Cámara'
  | 'Ensamble Folclórico';

export interface Ensemble {
  id: string;
  name: string;
  type: EnsembleType;
  /** Teacher.id del director/a */
  directorId: string;
  /** Student.id[] de los integrantes */
  memberIds: string[];
  rehearsalDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  rehearsalStart: string; // HH:mm
  rehearsalEnd: string;   // HH:mm
  rehearsalRoom: string;
  description?: string;
}

export type PieceDifficulty = 'Básico' | 'Intermedio' | 'Avanzado';

export interface RepertoirePiece {
  id: string;
  title: string;
  composer: string;
  durationMin: number;
  difficulty: PieceDifficulty;
  /** Ensemble.id que la trabaja actualmente, opcional */
  ensembleId?: string;
  /** Subject.id donde se estudia, opcional */
  subjectId?: string;
  /** Teacher.id que la asignó */
  assignedBy?: string;
  assignedAt?: Date;
  notes?: string;
}

export type RecitalStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Recital {
  id: string;
  title: string;
  date: Date;
  venue: string;
  /** Ensemble.id que se presenta */
  ensembleId: string;
  /** Repertoire piece IDs a interpretar */
  pieceIds: string[];
  status: RecitalStatus;
  description?: string;
}

export interface MusicModuleStats {
  totalInstruments: number;
  instrumentsAvailable: number;
  instrumentsLoaned: number;
  totalEnsembles: number;
  upcomingRecitals: number;
  repertoireSize: number;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// ============ FILTROS ============
export interface StudentFilter {
  search?: string;
  subject?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'gpa' | 'attendance';
  sortOrder?: 'asc' | 'desc';
}

export interface GradeFilter {
  subject?: string;
  type?: 'quiz' | 'midterm' | 'final' | 'assignment';
  minGrade?: number;
  maxGrade?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceFilter {
  subject?: string;
  status?: 'present' | 'absent' | 'late';
  startDate?: Date;
  endDate?: Date;
}
