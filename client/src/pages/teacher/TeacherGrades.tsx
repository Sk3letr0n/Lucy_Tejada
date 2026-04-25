/**
 * TeacherGrades - Pagina de gestion de calificaciones para docentes
 * Permite ver y agregar calificaciones de estudiantes
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getTeacherGrades, mockStudents } from '@/lib/mockData';
import { toast } from 'sonner';

export default function TeacherGrades() {
  const teacherId = '1';
  const grades = getTeacherGrades(teacherId);
  const [isAddingGrade, setIsAddingGrade] = useState(false);

  const handleAddGrade = () => {
    setIsAddingGrade(true);
    toast.success('Formulario de calificacion abierto');
  };

  const handleDeleteGrade = (gradeId: string) => {
    toast.success('Calificacion eliminada');
  };

  const groupedGrades = grades.reduce((acc, grade) => {
    if (!acc[grade.studentId]) {
      acc[grade.studentId] = [];
    }
    acc[grade.studentId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Calificaciones</h1>
            <p className="text-gray-600 mt-2">Registra y administra las notas de tus estudiantes</p>
          </div>
          <Button onClick={handleAddGrade} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Agregar Calificacion
          </Button>
        </div>

        {/* Filtros */}
{/* Filtros */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Cátedra / Taller</label>
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
</div>
        {/* Tabla de calificaciones */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Calificaciones Registradas</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Asignatura</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Calificacion</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Peso</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">Estudiante {grade.studentId}</td>
                  <td className="py-3 px-4 text-gray-600">Asignatura {grade.subjectId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                      {grade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${
                      grade.value >= 80 ? 'text-green-600' :
                      grade.value >= 60 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {grade.value}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{(grade.weight * 100).toFixed(0)}%</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(grade.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(grade.id)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total de Calificaciones</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{grades.length}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Promedio de Clase</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {(grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(1)}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Estudiantes Calificados</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {new Set(grades.map(g => g.studentId)).size}
            </p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
