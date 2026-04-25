/**
 * TeacherAnalytics - Pagina de estadisticas y analisis para docentes
 * Muestra graficos y analisis del desempenio de la clase
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

export default function TeacherAnalytics() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadisticas y Analisis</h1>
          <p className="text-gray-600 mt-2">Dashboard de desempenio de tu clase</p>
        </div>

        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Promedio de Clase</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">8.2</p>
              </div>
              <Award className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asistencia Promedio</p>
                <p className="text-3xl font-bold text-green-600 mt-2">91%</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tasa de Aprobacion</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">94%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Estudiantes</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">45</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Graficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Distribucion de calificaciones */}
          <Card className="p-6 border-0 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribucion de Calificaciones</h3>
            <div className="space-y-3">
              {[
                { label: 'Excelente (90-100)', count: 12, color: 'bg-green-500', percentage: 27 },
                { label: 'Bueno (80-89)', count: 18, color: 'bg-blue-500', percentage: 40 },
                { label: 'Promedio (70-79)', count: 12, color: 'bg-orange-500', percentage: 27 },
                { label: 'Bajo (60-69)', count: 3, color: 'bg-red-500', percentage: 6 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count} estudiantes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tendencia de calificaciones */}
          <Card className="p-6 border-0 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tendencia de Calificaciones</h3>
            <div className="space-y-4">
              {[
                { mes: 'Enero', promedio: 7.8 },
                { mes: 'Febrero', promedio: 8.0 },
                { mes: 'Marzo', promedio: 8.1 },
                { mes: 'Abril', promedio: 8.2 },
              ].map((item) => (
                <div key={item.mes}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                    <span className="text-sm font-bold text-blue-600">{item.promedio}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.promedio / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Analisis por estudiante */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Estudiantes con Bajo Desempenio</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estudiante</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Promedio</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Asistencia</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Juan Perez', avg: 65, attendance: 75 },
                  { name: 'Maria Garcia', avg: 72, attendance: 82 },
                  { name: 'Carlos Lopez', avg: 68, attendance: 70 },
                ].map((student, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${student.avg >= 70 ? 'text-orange-600' : 'text-red-600'}`}>
                        {student.avg}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">{student.attendance}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                        Necesita Apoyo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
