/**
 * AdminStudents - Pagina de gestion de estudiantes para admin
 * Permite agregar, editar y eliminar estudiantes
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockStudents } from '@/lib/mockData';
import { toast } from 'sonner';

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  const filteredStudents = mockStudents.filter(student =>
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setIsAddingStudent(true);
    toast.success('Formulario de agregar estudiante abierto');
  };

  const handleDeleteStudent = (studentId: string) => {
    toast.success('Estudiante eliminado correctamente');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Estudiantes</h1>
            <p className="text-gray-600 mt-2">Administra todos los estudiantes del instituto</p>
          </div>
          <Button onClick={handleAddStudent} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Agregar Estudiante
          </Button>
        </div>

        {/* Buscador */}
        <Card className="p-4 border-0 shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por matricula o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
          />
        </Card>

        {/* Tabla de estudiantes */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estudiantes Registrados</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matricula</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asignaturas</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">GPA</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asistencia</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{student.studentId}</td>
                  <td className="py-3 px-4 text-gray-900">Estudiante {student.id}</td>
                  <td className="py-3 px-4 text-gray-600">est{student.id}@instituto.edu</td>
                  <td className="py-3 px-4 text-center text-gray-600">{student.enrolledSubjects.length}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-blue-600">{student.gpa.toFixed(1)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      student.attendanceRate >= 90 ? 'text-green-600' :
                      student.attendanceRate >= 75 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {student.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total de Estudiantes</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{mockStudents.length}</p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">GPA Promedio</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {(mockStudents.reduce((sum, s) => sum + s.gpa, 0) / mockStudents.length).toFixed(1)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Asistencia Promedio</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {(mockStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / mockStudents.length).toFixed(0)}%
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Activos Hoy</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{mockStudents.length}</p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
