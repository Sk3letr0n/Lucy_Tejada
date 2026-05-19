/**
 * DataContext — Estado global mutable para entidades del instituto.
 *
 * Centraliza las listas (estudiantes, docentes, asignaturas, calificaciones,
 * asistencia) para que las páginas de admin/docente puedan agregar y eliminar
 * registros y que los cambios se reflejen en todas las vistas durante la sesión.
 *
 * Persiste los cambios en localStorage para que sobrevivan a recargas del navegador.
 */

import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react';
import {
  mockStudents, mockTeachers, mockSubjects, mockGrades, mockAttendance,
  mockUsers,
} from '@/lib/mockData';
import {
  Student, Teacher, Subject, Grade, Attendance, User,
} from '@/lib/types';

const LS_KEY = 'lucytejada_data_v1';

interface PersistedShape {
  students:   Student[];
  teachers:   Teacher[];
  subjects:   Subject[];
  grades:     Grade[];
  attendance: Attendance[];
  users:      User[];
}

interface DataContextType extends PersistedShape {
  // Estudiantes
  addStudent:    (s: Omit<Student, 'id'> & { name: string; email: string }) => Student;
  deleteStudent: (id: string) => void;
  // Docentes
  addTeacher:    (t: Omit<Teacher, 'id'> & { name: string; email: string }) => Teacher;
  deleteTeacher: (id: string) => void;
  // Asignaturas
  addSubject:    (s: Omit<Subject, 'id'>) => Subject;
  deleteSubject: (id: string) => void;
  // Calificaciones
  addGrade:      (g: Omit<Grade, 'id'>) => Grade;
  deleteGrade:   (id: string) => void;
  // Asistencia
  upsertAttendance: (records: Omit<Attendance, 'id'>[]) => void;
  // Util
  resetAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function loadInitial(): PersistedShape {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedShape;
      // Revive las fechas
      parsed.students   = parsed.students.map((s)   => ({ ...s, enrollmentDate: new Date(s.enrollmentDate) }));
      parsed.teachers   = parsed.teachers.map((t)   => ({ ...t, hireDate: new Date(t.hireDate) }));
      parsed.grades     = parsed.grades.map((g)     => ({ ...g, date: new Date(g.date) }));
      parsed.attendance = parsed.attendance.map((a) => ({ ...a, date: new Date(a.date) }));
      parsed.users      = parsed.users.map((u)      => ({ ...u, createdAt: new Date(u.createdAt) }));
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return {
    students:   [...mockStudents],
    teachers:   [...mockTeachers],
    subjects:   [...mockSubjects],
    grades:     [...mockGrades],
    attendance: [...mockAttendance],
    users:      [...mockUsers],
  };
}

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedShape>(loadInitial);

  // Persiste cualquier cambio
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* quota */ }
  }, [state]);

  // ── Estudiantes ──────────────────────────────────────────────────────────
  const addStudent: DataContextType['addStudent'] = useCallback((s) => {
    const id      = genId();
    const userId  = `u_${id}`;
    const student: Student = {
      id, userId,
      studentId:        s.studentId,
      enrolledSubjects: s.enrolledSubjects ?? [],
      gpa:              s.gpa ?? 0,
      attendanceRate:   s.attendanceRate ?? 100,
      enrollmentDate:   s.enrollmentDate ?? new Date(),
    };
    const user: User = {
      id: userId, email: s.email, name: s.name, role: 'student',
      createdAt: new Date(),
    };
    setState((prev) => ({
      ...prev,
      students: [...prev.students, student],
      users:    [...prev.users,    user],
    }));
    return student;
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setState((prev) => {
      const stu = prev.students.find((x) => x.id === id);
      return {
        ...prev,
        students: prev.students.filter((x) => x.id !== id),
        users:    stu ? prev.users.filter((u) => u.id !== stu.userId) : prev.users,
      };
    });
  }, []);

  // ── Docentes ─────────────────────────────────────────────────────────────
  const addTeacher: DataContextType['addTeacher'] = useCallback((t) => {
    const id      = genId();
    const userId  = `u_${id}`;
    const teacher: Teacher = {
      id, userId,
      teacherId:    t.teacherId,
      subjects:     t.subjects ?? [],
      department:   t.department,
      hireDate:     t.hireDate ?? new Date(),
      qualifications: t.qualifications,
    };
    const user: User = {
      id: userId, email: t.email, name: t.name, role: 'teacher',
      createdAt: new Date(),
    };
    setState((prev) => ({
      ...prev,
      teachers: [...prev.teachers, teacher],
      users:    [...prev.users,    user],
    }));
    return teacher;
  }, []);

  const deleteTeacher = useCallback((id: string) => {
    setState((prev) => {
      const t = prev.teachers.find((x) => x.id === id);
      return {
        ...prev,
        teachers: prev.teachers.filter((x) => x.id !== id),
        users:    t ? prev.users.filter((u) => u.id !== t.userId) : prev.users,
      };
    });
  }, []);

  // ── Asignaturas ──────────────────────────────────────────────────────────
  const addSubject: DataContextType['addSubject'] = useCallback((s) => {
    const subject: Subject = { ...s, id: genId() } as Subject;
    setState((prev) => ({ ...prev, subjects: [...prev.subjects, subject] }));
    return subject;
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setState((prev) => ({ ...prev, subjects: prev.subjects.filter((x) => x.id !== id) }));
  }, []);

  // ── Calificaciones ───────────────────────────────────────────────────────
  const addGrade: DataContextType['addGrade'] = useCallback((g) => {
    const grade: Grade = { ...g, id: genId() };
    setState((prev) => ({ ...prev, grades: [...prev.grades, grade] }));
    return grade;
  }, []);

  const deleteGrade = useCallback((id: string) => {
    setState((prev) => ({ ...prev, grades: prev.grades.filter((x) => x.id !== id) }));
  }, []);

  // ── Asistencia ───────────────────────────────────────────────────────────
  const upsertAttendance: DataContextType['upsertAttendance'] = useCallback((records) => {
    setState((prev) => {
      let next = [...prev.attendance];
      for (const r of records) {
        const dateStr = new Date(r.date).toDateString();
        const idx = next.findIndex(
          (a) =>
            a.studentId === r.studentId &&
            a.subjectId === r.subjectId &&
            new Date(a.date).toDateString() === dateStr,
        );
        if (idx >= 0) {
          next[idx] = { ...next[idx], status: r.status, notes: r.notes };
        } else {
          next.push({ ...r, id: genId() });
        }
      }
      return { ...prev, attendance: next };
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    setState({
      students:   [...mockStudents],
      teachers:   [...mockTeachers],
      subjects:   [...mockSubjects],
      grades:     [...mockGrades],
      attendance: [...mockAttendance],
      users:      [...mockUsers],
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        ...state,
        addStudent, deleteStudent,
        addTeacher, deleteTeacher,
        addSubject, deleteSubject,
        addGrade,   deleteGrade,
        upsertAttendance,
        resetAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
};
