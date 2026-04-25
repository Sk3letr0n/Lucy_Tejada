/**
 * StudentGrades - Pagina de notas del alumno
 * Muestra todas las calificaciones por asignatura
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, TrendingUp } from 'lucide-react';
import { getStudentGrades, mockSubjects } from '@/lib/mockData';
import { toast } from 'sonner';

export default function StudentGrades() {
  const studentId = '1';
  const grades = getStudentGrades(studentId);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const groupedGrades = grades.reduce((acc, grade) => {
    if (!acc[grade.subjectId]) {
      acc[grade.subjectId] = [];
    }
    acc[grade.subjectId].push(grade);
    return acc;
  }, {} as Record<string, typeof grades>);

  const calculateSubjectAverage = (subjectId: string): number => {
    const subjectGrades = groupedGrades[subjectId] || [];
    if (subjectGrades.length === 0) return 0;
    const total = subjectGrades.reduce((sum, g) => sum + g.value * g.weight, 0);
    const weightSum = subjectGrades.reduce((sum, g) => sum + g.weight, 0);
    return weightSum > 0 ? total / weightSum : 0;
  };

  const handleExportPDF = () => {
    toast.success('Descargando PDF de calificaciones...');
  };

  const handleExportExcel = () => {
    toast.success('Descargando Excel de calificaciones...');
  };

  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Calificaciones</h1>
            <p className="text-gray-600 mt-2">Resumen detallado de todas tus notas</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="p-4 border-0 shadow-md flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Todas las asignaturas</option>
            {mockSubjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </Card>

        {/* Asignaturas con calificaciones */}
        <div className="space-y-4">
          {Object.entries(groupedGrades).map(([subjectId, subjectGrades]) => {
            const subject = mockSubjects.find(s => s.id === subjectId);
            const average = calculateSubjectAverage(subjectId);

            return (
              <Card key={subjectId} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{subject?.name}</h3>
                    <p className="text-sm text-gray-600">{subject?.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{average.toFixed(1)}</p>
                    <p className="text-xs text-gray-600 mt-1">Promedio</p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(average, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tabla de calificaciones */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Calificacion</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Peso</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Fecha</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Comentarios</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectGrades.map((grade) => (
                        <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                              {grade.type}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`font-bold ${
                              grade.value >= 80 ? 'text-green-600' :
                              grade.value >= 60 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {grade.value}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-600">{(grade.weight * 100).toFixed(0)}%</td>
                          <td className="py-3 px-3 text-gray-600">
                            {new Date(grade.date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3 px-3 text-gray-600 text-xs">{grade.comments || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Resumen General */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen General</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Promedio General</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {Object.values(groupedGrades).length > 0
                  ? (Object.entries(groupedGrades)
                      .reduce((sum, [subId]) => sum + calculateSubjectAverage(subId), 0) /
                      Object.keys(groupedGrades).length)
                      .toFixed(1)
                  : '0.0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{Object.keys(groupedGrades).length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Calificaciones Registradas</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{grades.length}</p>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
