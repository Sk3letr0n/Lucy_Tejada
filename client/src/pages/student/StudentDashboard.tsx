/**
 * StudentDashboard - Dashboard principal del alumno
 * Muestra resumen de notas, asistencia y proximas clases
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BookOpen, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockStudentProgress, mockAttendance, getStudentAttendance } from '@/lib/mockData';

export default function StudentDashboard() {
  const studentId = '1'; // Mock - en produccion vendria del contexto
  const progress = mockStudentProgress.filter(p => p.studentId === studentId);
  const attendance = getStudentAttendance(studentId);
  
  const attendanceRate = attendance.length > 0
    ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
    : 0;

  const avgGrade = progress.length > 0
    ? progress.reduce((sum, p) => sum + p.currentGrade, 0) / progress.length
    : 0;

  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido, Juan</h1>
          <p className="text-gray-600 mt-2">Aqui esta tu resumen academico</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Promedio */}
          <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Promedio General</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{avgGrade.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Asistencia */}
          <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asistencia</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{attendanceRate.toFixed(0)}%</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Asignaturas */}
          <Card className="p-6 border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{progress.length}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Alertas */}
          <Card className="p-6 border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Alertas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">0</p>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Progreso por asignatura */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tu Progreso por Asignatura</h2>
          <div className="space-y-4">
            {progress.map((p) => (
              <div key={p.subjectId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{p.subjectName}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${p.currentGrade}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-lg font-bold text-blue-600">{p.currentGrade.toFixed(1)}</p>
                  <p className={`text-xs font-medium ${
                    p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {p.trend === 'up' ? '↑ Mejorando' : p.trend === 'down' ? '↓ Bajando' : '→ Estable'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
