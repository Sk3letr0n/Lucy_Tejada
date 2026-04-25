/**
 * AdminDashboard - Dashboard principal del administrador
 * Muestra estadisticas globales del sistema
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Users, BookOpen, BarChart3, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockStudents, mockTeachers, mockSubjects } from '@/lib/mockData';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-gray-600 mt-2">Estadisticas globales del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Estudiantes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{mockStudents.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-green-50 to-green-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Docentes</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{mockTeachers.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{mockSubjects.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-red-50 to-red-100 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Alertas</p>
                <p className="text-3xl font-bold text-red-600 mt-2">3</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Estudiantes Recientes</h2>
            <p className="text-gray-600">Lista de estudiantes recientemente agregados</p>
          </Card>

          <Card className="p-6 border-0 shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad del Sistema</h2>
            <p className="text-gray-600">Registro de cambios y acciones</p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
