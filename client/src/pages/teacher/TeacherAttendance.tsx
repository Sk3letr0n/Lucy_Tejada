/**
 * TeacherAttendance - Pagina de control de asistencia para docentes
 * Permite registrar asistencia de estudiantes
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Save } from 'lucide-react';
import { mockStudents, mockAttendance } from '@/lib/mockData';
import { toast } from 'sonner';

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

export default function TeacherAttendance() {
  const [selectedSubject, setSelectedSubject] = useState('1');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { studentId, status }
    }));
  };

  const handleSaveAttendance = () => {
    toast.success('Asistencia guardada correctamente');
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'late':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Ausente';
      case 'late':
        return 'Retrasado';
      default:
        return 'Sin marcar';
    }
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
            <p className="text-gray-600 mt-2">Registra la asistencia de tus estudiantes</p>
          </div>
          <Button onClick={handleSaveAttendance} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4" />
            Guardar Asistencia
          </Button>
        </div>

        {/* Selector de asignatura y fecha */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <option>Todas las cátedras</option>
      <option>Violín Técnico</option>
      <option>Piano Complementario</option>
      <option>Teoría y Solfeo</option>
      <option>Banda Sinfónica</option>
      <option>Coro Polifónico</option>
      <option>Danza Contemporánea</option>
      <option>Historia de la Música</option>
      <option>Artes Plásticas</option>
    </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
            <input
              type="time"
              defaultValue="08:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabla de asistencia */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estudiantes</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matricula</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Presente</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ausente</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Retrasado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {mockStudents.map((student) => {
                const record = attendanceRecords[student.id];
                return (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.studentId}</td>
                    <td className="py-3 px-4 text-gray-600">EST{student.id}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`p-2 rounded-lg transition-all ${
                          record?.status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <Check className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`p-2 rounded-lg transition-all ${
                          record?.status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <X className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`p-2 rounded-lg transition-all ${
                          record?.status === 'late'
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        <Clock className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record?.status)}`}>
                        {getStatusLabel(record?.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Presentes</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {Object.values(attendanceRecords).filter(r => r.status === 'present').length}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <p className="text-sm text-gray-600 font-medium">Ausentes</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {Object.values(attendanceRecords).filter(r => r.status === 'absent').length}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Retrasados</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {Object.values(attendanceRecords).filter(r => r.status === 'late').length}
            </p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
