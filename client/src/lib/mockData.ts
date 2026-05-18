/**
 * Datos Mock para desarrollo
 * Instituto Educativo - Sistema de Gestión
 */

import {
  User,
  Student,
  Teacher,
  Grade,
  Schedule,
  Attendance,
  Subject,
  AuditLog,
  StudentProgress,
  MusicInstrument,
  Ensemble,
  RepertoirePiece,
  Recital,
  MusicModuleStats,
} from './types';

// ============ USUARIOS MOCK ============
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'juan@example.com',
    name: 'Juan Pérez',
    role: 'student',
    avatar: '👨‍🎓',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'maria@example.com',
    name: 'María García',
    role: 'student',
    avatar: '👩‍🎓',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
  },
  {
    id: '3',
    email: 'carlos@example.com',
    name: 'Ricardo Arbeláez',
    role: 'teacher',
    avatar: '👨‍🏫',
    createdAt: new Date('2023-09-01'),
    lastLogin: new Date(),
  },
  {
    id: '4',
    email: 'laura@example.com',
    name: 'Elena Valencia',
    role: 'teacher',
    avatar: '👩‍🏫',
    createdAt: new Date('2023-09-01'),
    lastLogin: new Date(),
  },
  {
    id: '5',
    email: 'admin@example.com',
    name: 'Administrador',
    role: 'admin',
    avatar: '👨‍💼',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
  },
];

// ============ ESTUDIANTES MOCK ============
export const mockStudents: Student[] = [
  {
    id: '1',
    userId: '1',
    studentId: 'EST001',
    enrolledSubjects: ['1', '2', '3', '5'],
    gpa: 8.5,
    attendanceRate: 95,
    enrollmentDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '2',
    studentId: 'EST002',
    enrolledSubjects: ['1', '2', '4', '6'],
    gpa: 7.8,
    attendanceRate: 88,
    enrollmentDate: new Date('2024-01-15'),
  },
];

// ============ DOCENTES MOCK ============
export const mockTeachers: Teacher[] = [
  {
    id: '1',
    userId: '3',
    teacherId: 'DOC-M01',
    subjects: ['1', '4'], // Violín Técnico y Banda Sinfónica
    department: 'Cuerdas y Agrupaciones',
    hireDate: new Date('2022-02-15'),
    qualifications: [
      'Maestro en Música - Universidad Tecnológica de Pereira',
      'Especialista en Dirección Orquestal'
    ],
  },
  {
    id: '2',
    userId: '4',
    teacherId: 'DOC-M02',
    subjects: ['3', '5', '7'], // Teoría y Solfeo, Coro Polifónico, Historia de la Música
    department: 'Teoría y Voz',
    hireDate: new Date('2021-08-10'),
    qualifications: [
      'Licenciatura en Música',
      'Magíster en Interpretación Vocal y Coral'
    ],
  },
];

// ============ ASIGNATURAS MOCK ============
export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Violín Técnico',
    code: 'MUS-VIO',
    credits: 4,
    description: 'Estudio de técnica individual, postura y escalas para cuerdas frotadas.',
    department: 'Cuerdas',
    semester: 1,
    maxStudents: 10,
    enrolledStudents: 8,
  },
  {
    id: '2',
    name: 'Piano Complementario',
    code: 'MUS-PIA',
    credits: 3,
    description: 'Desarrollo de habilidades armónicas y lectura en teclado para no pianistas.',
    department: 'Teclas',
    semester: 1,
    maxStudents: 15,
    enrolledStudents: 12,
  },
  {
    id: '3',
    name: 'Teoría y Solfeo',
    code: 'MUS-TEO',
    credits: 3,
    description: 'Fundamentos de gramática musical, dictado y entrenamiento auditivo.',
    department: 'Teoría',
    semester: 1,
    maxStudents: 30,
    enrolledStudents: 26,
  },
  {
    id: '4',
    name: 'Banda Sinfónica',
    code: 'MUS-BAN',
    credits: 5,
    description: 'Práctica de ensamble para vientos y percusión. Montaje de repertorio.',
    department: 'Agrupaciones',
    semester: 1,
    maxStudents: 60,
    enrolledStudents: 52,
  },
  {
    id: '5',
    name: 'Coro Polifónico',
    code: 'MUS-COR',
    credits: 3,
    description: 'Técnica vocal colectiva y montaje de obras a varias voces.',
    department: 'Voz',
    semester: 1,
    maxStudents: 45,
    enrolledStudents: 38,
  },
  {
    id: '6',
    name: 'Danza Contemporánea',
    code: 'DAN-CON',
    credits: 3,
    description: 'Exploración del movimiento, expresión corporal y técnicas modernas.',
    department: 'Danza',
    semester: 1,
    maxStudents: 25,
    enrolledStudents: 21,
  },
  {
    id: '7',
    name: 'Historia de la Música',
    code: 'MUS-HIS',
    credits: 2,
    description: 'Recorrido por los periodos musicales desde el Barroco hasta la actualidad.',
    department: 'Humanidades',
    semester: 1,
    maxStudents: 35,
    enrolledStudents: 30,
  },
  {
    id: '8',
    name: 'Artes Plásticas',
    code: 'ART-PLA',
    credits: 2,
    description: 'Taller de dibujo, pintura y fundamentación en artes visuales.',
    department: 'Artes Visuales',
    semester: 1,
    maxStudents: 20,
    enrolledStudents: 18,
  },
];
// ============ CALIFICACIONES MOCK ============
export const mockGrades: Grade[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    value: 92,
    weight: 0.3,
    date: new Date('2024-02-15'),
    type: 'quiz',
    comments: 'Excelente desempeño',
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '1',
    value: 88,
    weight: 0.2,
    date: new Date('2024-03-10'),
    type: 'assignment',
    comments: 'Buen trabajo',
  },
  {
    id: '3',
    studentId: '1',
    subjectId: '1',
    value: 95,
    weight: 0.5,
    date: new Date('2024-04-20'),
    type: 'midterm',
    comments: 'Sobresaliente',
  },
  {
    id: '4',
    studentId: '1',
    subjectId: '2',
    value: 85,
    weight: 0.3,
    date: new Date('2024-02-20'),
    type: 'quiz',
  },
  {
    id: '5',
    studentId: '1',
    subjectId: '2',
    value: 90,
    weight: 0.5,
    date: new Date('2024-04-15'),
    type: 'midterm',
  },
  {
    id: '6',
    studentId: '2',
    subjectId: '1',
    value: 78,
    weight: 0.3,
    date: new Date('2024-02-15'),
    type: 'quiz',
  },
  {
    id: '7',
    studentId: '2',
    subjectId: '1',
    value: 82,
    weight: 0.2,
    date: new Date('2024-03-10'),
    type: 'assignment',
  },
  {
    id: '8',
    studentId: '2',
    subjectId: '1',
    value: 75,
    weight: 0.5,
    date: new Date('2024-04-20'),
    type: 'midterm',
  },
];

// ============ HORARIOS MOCK ============
export const mockSchedules: Schedule[] = [
  {
    id: '1',
    subjectId: '1',
    subjectName: 'Violín Técnico',
    teacherId: '1',
    teacherName: 'Ricardo Arbeláez',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:30',
    classroom: 'Cubículo 04', // Clases individuales o grupos pequeños
    capacity: 5,
  },
  {
    id: '2',
    subjectId: '4',
    subjectName: 'Banda Sinfónica',
    teacherId: '1',
    teacherName: 'Ricardo Arbeláez',
    day: 'Monday',
    startTime: '16:00',
    endTime: '18:30',
    classroom: 'Salón de Ensayos Principal',
    capacity: 60,
  },
  {
    id: '3',
    subjectId: '3',
    subjectName: 'Teoría y Solfeo',
    teacherId: '2',
    teacherName: 'Elena Valencia',
    day: 'Tuesday',
    startTime: '15:00',
    endTime: '16:30',
    classroom: 'Salón Teórico A',
    capacity: 30,
  },
  {
    id: '4',
    subjectId: '5',
    subjectName: 'Coro Polifónico',
    teacherId: '2',
    teacherName: 'Elena Valencia',
    day: 'Tuesday',
    startTime: '17:00',
    endTime: '19:00',
    classroom: 'Auditorio Pedro Nel Gómez',
    capacity: 45,
  },
  {
    id: '5',
    subjectId: '4',
    subjectName: 'Banda Sinfónica',
    teacherId: '1',
    teacherName: 'Ricardo Arbeláez',
    day: 'Wednesday',
    startTime: '16:00',
    endTime: '18:30',
    classroom: 'Salón de Ensayos Principal',
    capacity: 60,
  },
  {
    id: '6',
    subjectId: '2',
    subjectName: 'Piano Complementario',
    teacherId: '2',
    teacherName: 'Elena Valencia',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '15:30',
    classroom: 'Salón de Pianos',
    capacity: 15,
  },
  {
    id: '7',
    subjectId: '6',
    subjectName: 'Danza Contemporánea',
    teacherId: '2', // Asumiendo que Elena también coordina esta área o puedes usar un ID genérico
    teacherName: 'Elena Valencia',
    day: 'Thursday',
    startTime: '16:00',
    endTime: '17:30',
    classroom: 'Salón de Espejos',
    capacity: 25,
  },
  {
    id: '8',
    subjectId: '7',
    subjectName: 'Historia de la Música',
    teacherId: '2',
    teacherName: 'Elena Valencia',
    day: 'Friday',
    startTime: '15:00',
    endTime: '16:30',
    classroom: 'Salón Teórico B',
    capacity: 35,
  },
];
// ============ ASISTENCIA MOCK ============
export const mockAttendance: Attendance[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: '1',
    date: new Date('2024-04-15'),
    status: 'present',
  },
  {
    id: '2',
    studentId: '1',
    subjectId: '1',
    date: new Date('2024-04-17'),
    status: 'present',
  },
  {
    id: '3',
    studentId: '1',
    subjectId: '1',
    date: new Date('2024-04-19'),
    status: 'present',
  },
  {
    id: '4',
    studentId: '1',
    subjectId: '2',
    date: new Date('2024-04-16'),
    status: 'present',
  },
  {
    id: '5',
    studentId: '1',
    subjectId: '2',
    date: new Date('2024-04-18'),
    status: 'late',
    notes: 'Llegó 10 minutos tarde',
  },
  {
    id: '6',
    studentId: '2',
    subjectId: '1',
    date: new Date('2024-04-15'),
    status: 'present',
  },
  {
    id: '7',
    studentId: '2',
    subjectId: '1',
    date: new Date('2024-04-17'),
    status: 'absent',
    notes: 'Justificado',
  },
  {
    id: '8',
    studentId: '2',
    subjectId: '1',
    date: new Date('2024-04-19'),
    status: 'present',
  },
];

// ============ PROGRESO ACADÉMICO MOCK ============
// ============ PROGRESO ACADÉMICO MOCK (ACTUALIZADO A LUCY TEJADA) ============
export const mockStudentProgress: StudentProgress[] = [
  {
    studentId: '1', // Mateo Holguín
    subjectId: '1',
    subjectName: 'Violín Técnico',
    currentGrade: 4.8, // Escala de 0.0 a 5.0
    attendance: 98,
    trend: 'up',
  },
  {
    studentId: '1',
    subjectId: '2',
    subjectName: 'Piano Complementario',
    currentGrade: 3.9,
    attendance: 92,
    trend: 'stable',
  },
  {
    studentId: '1',
    subjectId: '3',
    subjectName: 'Teoría y Solfeo',
    currentGrade: 4.5,
    attendance: 95,
    trend: 'up',
  },
  {
    studentId: '1',
    subjectId: '4',
    subjectName: 'Banda Sinfónica',
    currentGrade: 5.0,
    attendance: 100,
    trend: 'up',
  },
  {
    studentId: '2', // Isabella Rojas
    subjectId: '3',
    subjectName: 'Teoría y Solfeo',
    currentGrade: 3.8,
    attendance: 85,
    trend: 'down',
  },
  {
    studentId: '2',
    subjectId: '5',
    subjectName: 'Coro Polifónico',
    currentGrade: 4.6,
    attendance: 92,
    trend: 'stable',
  },
  {
    studentId: '2',
    subjectId: '6',
    subjectName: 'Danza Contemporánea',
    currentGrade: 4.2,
    attendance: 90,
    trend: 'up',
  },
  {
    studentId: '2',
    subjectId: '7',
    subjectName: 'Historia de la Música',
    currentGrade: 3.5,
    attendance: 88,
    trend: 'stable',
  },
];

// ============ AUDITORÍA MOCK ============
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Juan Pérez',
    action: 'LOGIN',
    resource: 'Authentication',
    timestamp: new Date(Date.now() - 5 * 60000),
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Ricardo Arbeláez',
    action: 'CREATE',
    resource: 'Grade',
    resourceId: '1',
    changes: { value: 92, subjectId: '1', studentId: '1' },
    timestamp: new Date(Date.now() - 15 * 60000),
    ipAddress: '192.168.1.101',
  },
  {
    id: '3',
    userId: '3',
    userName: 'Ricardo Arbeláez',
    action: 'UPDATE',
    resource: 'Attendance',
    resourceId: '5',
    changes: { status: 'late' },
    timestamp: new Date(Date.now() - 30 * 60000),
    ipAddress: '192.168.1.101',
  },
  {
    id: '4',
    userId: '5',
    userName: 'Administrador',
    action: 'CREATE',
    resource: 'Student',
    resourceId: '2',
    changes: { email: 'maria@example.com', name: 'María García' },
    timestamp: new Date(Date.now() - 60 * 60000),
    ipAddress: '192.168.1.102',
  },
  {
    id: '5',
    userId: '5',
    userName: 'Administrador',
    action: 'UPDATE',
    resource: 'Schedule',
    resourceId: '1',
    changes: { classroom: 'A101', startTime: '08:00' },
    timestamp: new Date(Date.now() - 120 * 60000),
    ipAddress: '192.168.1.102',
  },
  {
    id: '6',
    userId: '2',
    userName: 'María García',
    action: 'LOGIN',
    resource: 'Authentication',
    timestamp: new Date(Date.now() - 180 * 60000),
    ipAddress: '192.168.1.103',
  },
];

// ============ FUNCIÓN AUXILIAR PARA OBTENER USUARIO MOCK ============
export const getMockUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email);
};

export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// ============ FUNCIÓN AUXILIAR PARA OBTENER DATOS POR ESTUDIANTE ============
export const getStudentGrades = (studentId: string): Grade[] => {
  return mockGrades.filter((grade) => grade.studentId === studentId);
};

export const getStudentAttendance = (studentId: string): Attendance[] => {
  return mockAttendance.filter((att) => att.studentId === studentId);
};

export const getStudentProgress = (studentId: string): StudentProgress[] => {
  return mockStudentProgress.filter((prog) => prog.studentId === studentId);
};

// ============ FUNCIÓN AUXILIAR PARA OBTENER DATOS POR DOCENTE ============
export const getTeacherSubjects = (teacherId: string): Subject[] => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  return mockSubjects.filter((subject) => teacher.subjects.includes(subject.id));
};

export const getTeacherSchedules = (teacherId: string): Schedule[] => {
  return mockSchedules.filter((schedule) => schedule.teacherId === teacherId);
};

export const getTeacherGrades = (teacherId: string): Grade[] => {
  const teacher = mockTeachers.find((t) => t.id === teacherId);
  if (!teacher) return [];
  const subjectIds = teacher.subjects;
  return mockGrades.filter((grade) => subjectIds.includes(grade.subjectId));
};

// ============ FUNCIÓN AUXILIAR PARA OBTENER HORARIOS ============
export const getSchedulesBySubject = (subjectId: string): Schedule[] => {
  return mockSchedules.filter((schedule) => schedule.subjectId === subjectId);
};

export const getSchedulesByDay = (day: string): Schedule[] => {
  return mockSchedules.filter((schedule) => schedule.day === day);
};

// ============ FUNCIÓN AUXILIAR PARA CALCULAR ESTADÍSTICAS ============
export const calculateGradeAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, grade) => sum + grade.value * grade.weight, 0);
  const weightSum = grades.reduce((sum, grade) => sum + grade.weight, 0);
  return weightSum > 0 ? total / weightSum : 0;
};

export const calculateAttendanceRate = (attendance: Attendance[]): number => {
  if (attendance.length === 0) return 0;
  const present = attendance.filter((att) => att.status === 'present').length;
  return (present / attendance.length) * 100;
};

// ============================================================
// MÓDULO DE MÚSICA - DATOS MOCK
// ============================================================

// ============ INVENTARIO DE INSTRUMENTOS ============
export const mockInstruments: MusicInstrument[] = [
  {
    id: 'INS-001',
    name: 'Violín 4/4',
    serial: 'VL-2023-001',
    family: 'Cuerdas',
    brand: 'Stentor',
    status: 'loaned',
    acquiredAt: new Date('2023-02-10'),
    loanedToStudentId: '1',
    notes: 'Entregado con estuche rígido y arco de fibra.',
  },
  {
    id: 'INS-002',
    name: 'Violín 3/4',
    serial: 'VL-2023-002',
    family: 'Cuerdas',
    brand: 'Cremona',
    status: 'available',
    acquiredAt: new Date('2023-02-10'),
  },
  {
    id: 'INS-003',
    name: 'Clarinete Sib',
    serial: 'CL-2022-014',
    family: 'Vientos Madera',
    brand: 'Yamaha',
    status: 'available',
    acquiredAt: new Date('2022-09-05'),
  },
  {
    id: 'INS-004',
    name: 'Trompeta Sib',
    serial: 'TR-2022-007',
    family: 'Vientos Metal',
    brand: 'Bach',
    status: 'maintenance',
    acquiredAt: new Date('2022-04-18'),
    notes: 'Cambio de pistones programado.',
  },
  {
    id: 'INS-005',
    name: 'Timbal Sinfónico 26"',
    serial: 'TI-2021-002',
    family: 'Percusión',
    brand: 'Adams',
    status: 'available',
    acquiredAt: new Date('2021-08-22'),
  },
  {
    id: 'INS-006',
    name: 'Piano Acústico Vertical',
    serial: 'PI-2020-001',
    family: 'Teclas',
    brand: 'Kawai',
    status: 'available',
    acquiredAt: new Date('2020-11-30'),
  },
  {
    id: 'INS-007',
    name: 'Violonchelo 4/4',
    serial: 'VC-2024-003',
    family: 'Cuerdas',
    brand: 'Eastman',
    status: 'loaned',
    acquiredAt: new Date('2024-01-15'),
    loanedToStudentId: '2',
  },
  {
    id: 'INS-008',
    name: 'Flauta Traversa',
    serial: 'FL-2023-009',
    family: 'Vientos Madera',
    brand: 'Pearl',
    status: 'available',
    acquiredAt: new Date('2023-06-01'),
  },
];

// ============ AGRUPACIONES (ENSEMBLES) ============
export const mockEnsembles: Ensemble[] = [
  {
    id: 'ENS-001',
    name: 'Banda Sinfónica Lucy Tejada',
    type: 'Banda Sinfónica',
    directorId: '1', // Ricardo Arbeláez
    memberIds: ['1', '2'],
    rehearsalDay: 'Wednesday',
    rehearsalStart: '16:00',
    rehearsalEnd: '18:30',
    rehearsalRoom: 'Salón de Ensayos Principal',
    description:
      'Agrupación insignia del instituto. Repertorio sinfónico y popular.',
  },
  {
    id: 'ENS-002',
    name: 'Coro Polifónico Juvenil',
    type: 'Coro',
    directorId: '2', // Elena Valencia
    memberIds: ['2'],
    rehearsalDay: 'Tuesday',
    rehearsalStart: '17:00',
    rehearsalEnd: '19:00',
    rehearsalRoom: 'Auditorio Pedro Nel Gómez',
    description: 'Coro a cuatro voces mixtas. Repertorio polifónico clásico.',
  },
  {
    id: 'ENS-003',
    name: 'Ensamble de Cuerdas',
    type: 'Cámara',
    directorId: '1',
    memberIds: ['1'],
    rehearsalDay: 'Friday',
    rehearsalStart: '14:00',
    rehearsalEnd: '15:30',
    rehearsalRoom: 'Cubículo 04',
    description: 'Cuarteto de cuerdas para conciertos didácticos.',
  },
];

// ============ REPERTORIO MUSICAL ============
export const mockRepertoire: RepertoirePiece[] = [
  {
    id: 'PIE-001',
    title: 'Concierto de Aranjuez - II. Adagio',
    composer: 'Joaquín Rodrigo',
    durationMin: 11,
    difficulty: 'Avanzado',
    ensembleId: 'ENS-001',
    subjectId: '4',
    assignedBy: '1',
    assignedAt: new Date('2024-03-01'),
    notes: 'Solista: trompeta principal.',
  },
  {
    id: 'PIE-002',
    title: 'Pequeña Serenata Nocturna - I',
    composer: 'W. A. Mozart',
    durationMin: 6,
    difficulty: 'Intermedio',
    ensembleId: 'ENS-003',
    subjectId: '1',
    assignedBy: '1',
    assignedAt: new Date('2024-02-12'),
  },
  {
    id: 'PIE-003',
    title: 'Ave Verum Corpus',
    composer: 'W. A. Mozart',
    durationMin: 4,
    difficulty: 'Intermedio',
    ensembleId: 'ENS-002',
    subjectId: '5',
    assignedBy: '2',
    assignedAt: new Date('2024-02-20'),
  },
  {
    id: 'PIE-004',
    title: 'Bambuco en Mi Menor',
    composer: 'Tradicional colombiano',
    durationMin: 5,
    difficulty: 'Básico',
    ensembleId: 'ENS-001',
    subjectId: '4',
    assignedBy: '1',
    assignedAt: new Date('2024-04-05'),
  },
  {
    id: 'PIE-005',
    title: 'Aleluya (El Mesías)',
    composer: 'G. F. Händel',
    durationMin: 4,
    difficulty: 'Avanzado',
    ensembleId: 'ENS-002',
    subjectId: '5',
    assignedBy: '2',
    assignedAt: new Date('2024-03-18'),
  },
];

// ============ RECITALES / EVENTOS ============
const inDays = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const mockRecitals: Recital[] = [
  {
    id: 'REC-001',
    title: 'Concierto de Apertura',
    date: inDays(14),
    venue: 'Auditorio Pedro Nel Gómez',
    ensembleId: 'ENS-001',
    pieceIds: ['PIE-001', 'PIE-004'],
    status: 'scheduled',
    description: 'Apertura del semestre con la Banda Sinfónica.',
  },
  {
    id: 'REC-002',
    title: 'Recital Coral',
    date: inDays(28),
    venue: 'Capilla del Instituto',
    ensembleId: 'ENS-002',
    pieceIds: ['PIE-003', 'PIE-005'],
    status: 'scheduled',
    description: 'Programa sacro de cámara.',
  },
  {
    id: 'REC-003',
    title: 'Concierto Didáctico de Cuerdas',
    date: inDays(-21),
    venue: 'Sala de Cámara',
    ensembleId: 'ENS-003',
    pieceIds: ['PIE-002'],
    status: 'completed',
    description: 'Presentación cerrada para familias.',
  },
];

// ============ HELPERS DEL MÓDULO DE MÚSICA ============
export const getInstrumentsByStatus = (
  status: MusicInstrument['status']
): MusicInstrument[] => mockInstruments.filter((i) => i.status === status);

export const getInstrumentLoanedToStudent = (
  studentId: string
): MusicInstrument[] =>
  mockInstruments.filter(
    (i) => i.status === 'loaned' && i.loanedToStudentId === studentId
  );

export const getEnsemblesByDirector = (teacherId: string): Ensemble[] =>
  mockEnsembles.filter((e) => e.directorId === teacherId);

export const getEnsemblesForStudent = (studentId: string): Ensemble[] =>
  mockEnsembles.filter((e) => e.memberIds.includes(studentId));

export const getRepertoireByEnsemble = (
  ensembleId: string
): RepertoirePiece[] =>
  mockRepertoire.filter((p) => p.ensembleId === ensembleId);

export const getRepertoireByTeacher = (teacherId: string): RepertoirePiece[] =>
  mockRepertoire.filter((p) => p.assignedBy === teacherId);

export const getUpcomingRecitals = (): Recital[] =>
  mockRecitals
    .filter((r) => r.status === 'scheduled' && r.date.getTime() >= Date.now())
    .sort((a, b) => a.date.getTime() - b.date.getTime());

export const getRecitalsForStudent = (studentId: string): Recital[] => {
  const ensembleIds = getEnsemblesForStudent(studentId).map((e) => e.id);
  return mockRecitals.filter((r) => ensembleIds.includes(r.ensembleId));
};

export const getMusicModuleStats = (): MusicModuleStats => ({
  totalInstruments: mockInstruments.length,
  instrumentsAvailable: getInstrumentsByStatus('available').length,
  instrumentsLoaned: getInstrumentsByStatus('loaned').length,
  totalEnsembles: mockEnsembles.length,
  upcomingRecitals: getUpcomingRecitals().length,
  repertoireSize: mockRepertoire.length,
});
