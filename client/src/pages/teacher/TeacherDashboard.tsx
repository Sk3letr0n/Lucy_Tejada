/**
 * TeacherDashboard - Dashboard principal del docente
 * Muestra resumen de clases, estudiantes y estadisticas
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, BookOpen, BarChart3, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function TeacherDashboard() {
  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Docente</h1>
          <p className="text-gray-600 mt-2">Bienvenido a tu panel de control</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Estudiantes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">45</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">3</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Promedio Clase</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">8.2</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Clases Hoy</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">2</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Proximas Clases</h2>
          <p className="text-gray-600">Las proximas clases aparecen aqui</p>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
