/**
 * Constantes de la aplicación
 * Instituto Educativo - Sistema de Gestión
 */

// Roles de usuario
export const USER_ROLES = {
  STUDENT: 'estudiante',
  TEACHER: 'docente',
  ADMIN: 'administrador',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Estados de asistencia
export const ATTENDANCE_STATUS = {
  PRESENT: 'presente',
  ABSENT: 'ausente',
  LATE: 'tarde',
} as const;

// Calificaciones (escala 0-100)
export const GRADE_SCALE = {
  MIN: 0,
  MAX: 100,
  PASS: 60,
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
} as const;

// Días de la semana
export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
] as const;

// Horas de clase
export const CLASS_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const;

// Asignaturas (ejemplo)
export const SUBJECTS = [
  { id: '1', name: 'Violín Técnico', code: 'MUS-VIO', credits: 4 },
  { id: '2', name: 'Piano Complementario', code: 'MUS-PIA', credits: 3 },
  { id: '3', name: 'Teoría y Solfeo', code: 'MUS-TEO', credits: 3 },
  { id: '4', name: 'Banda Sinfónica', code: 'MUS-BAN', credits: 5 },
  { id: '5', name: 'Coro Polifónico', code: 'MUS-COR', credits: 3 },
  { id: '6', name: 'Danza Contemporánea', code: 'DAN-CON', credits: 3 },
  { id: '7', name: 'Historia de la Música', code: 'MUS-HIS', credits: 2 },
  { id: '8', name: 'Artes Plásticas', code: 'ART-PLA', credits: 2 },
] as const;

// Mensajes de la aplicación
export const MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_ERROR: 'Credenciales inválidas',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  UNAUTHORIZED: 'No tienes permiso para acceder a este recurso',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet',
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Email inválido',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  SUCCESS: 'Operación completada exitosamente',
  ERROR: 'Ocurrió un error',
} as const;

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // Rutas de estudiante
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_GRADES: '/student/grades',
  STUDENT_PROGRESS: '/student/progress',
  STUDENT_SCHEDULE: '/student/schedule',
  
  // Rutas de docente
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_GRADES: '/teacher/grades',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_REPORTS: '/teacher/reports',
  TEACHER_ANALYTICS: '/teacher/analytics',
  TEACHER_SCHEDULE: '/teacher/schedule',
  
  // Rutas de administrativo
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_SCHEDULE: '/admin/schedule',
  ADMIN_SUBJECTS: '/admin/subjects',
  ADMIN_AUDIT: '/admin/audit',
  ADMIN_REPORTS: '/admin/reports',
  
  NOT_FOUND: '/404',
} as const;

// Colores educativos
export const COLORS = {
  PRIMARY: '#1e40af', // Azul académico
  PRIMARY_LIGHT: '#3b82f6',
  SECONDARY: '#10b981', // Verde educativo
  ACCENT: '#f97316', // Naranja motivador
  DESTRUCTIVE: '#ef4444', // Rojo alerta
  BACKGROUND: '#ffffff',
  CARD: '#f9fafb',
  TEXT: '#1f2937',
  TEXT_LIGHT: '#6b7280',
  BORDER: '#e5e7eb',
  SIDEBAR: '#0f172a',
  SIDEBAR_LIGHT: '#1e293b',
} as const;

// Duración de animaciones
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Límites de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Formatos de fecha
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

// Acciones de auditoría
export const AUDIT_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
} as const;

// Permisos por rol
export const ROLE_PERMISSIONS = {
  student: ['view_own_grades', 'view_own_schedule', 'view_own_progress'],
  teacher: [
    'view_grades',
    'add_grades',
    'edit_grades',
    'view_attendance',
    'add_attendance',
    'view_schedule',
    'generate_reports',
    'view_analytics',
  ],
  admin: [
    'manage_students',
    'manage_teachers',
    'manage_schedule',
    'manage_subjects',
    'view_audit_logs',
    'generate_reports',
    'view_analytics',
    'export_data',
  ],
} as const;
