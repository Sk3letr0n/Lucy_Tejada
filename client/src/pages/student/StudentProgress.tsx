/**
 * StudentProgress - Pagina de progreso academico del alumno
 * Muestra graficos y analisis del desempenio por asignatura
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getStudentProgress } from '@/lib/mockData';

export default function StudentProgress() {
  const studentId = '1';
  const progress = getStudentProgress(studentId);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Mejorando';
      case 'down':
        return 'Bajando';
      default:
        return 'Estable';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progreso Academico</h1>
          <p className="text-gray-600 mt-2">Analisis detallado de tu desempenio</p>
        </div>

        {/* Estadisticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Promedio General</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {(progress.reduce((sum, p) => sum + p.currentGrade, 0) / progress.length).toFixed(1)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Asistencia Promedio</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {(progress.reduce((sum, p) => sum + p.attendance, 0) / progress.length).toFixed(0)}%
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{progress.length}</p>
          </Card>
        </div>

        {/* Progreso por asignatura */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Desempenio por Asignatura</h2>
          <div className="space-y-4">
            {progress.map((p) => (
              <div key={p.subjectId} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{p.subjectName}</h3>
                    <p className="text-sm text-gray-600 mt-1">Calificacion actual: {p.currentGrade.toFixed(1)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(p.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(p.trend)}`}>
                      {getTrendLabel(p.trend)}
                    </span>
                  </div>
                </div>

                {/* Barra de calificacion */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Calificacion</span>
                    <span>{p.currentGrade.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        p.currentGrade >= 80
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : p.currentGrade >= 60
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(p.currentGrade, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barra de asistencia */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Asistencia</span>
                    <span>{p.attendance.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        p.attendance >= 90
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : p.attendance >= 75
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${Math.min(p.attendance, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-6 border-0 shadow-md bg-blue-50 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recomendaciones</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Mantén tu asistencia por encima del 90% para un mejor desempenio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Enfocate en las asignaturas donde tu calificacion esta bajando</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">•</span>
              <span>Consulta con tus docentes si necesitas ayuda adicional</span>
            </li>
          </ul>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
