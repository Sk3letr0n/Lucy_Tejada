/**
 * AdminTeachers - Pagina de gestion de docentes para admin
 * Permite agregar, editar y eliminar docentes
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockTeachers } from '@/lib/mockData';
import { toast } from 'sonner';

export default function AdminTeachers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeachers = mockTeachers.filter(teacher =>
    teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    toast.success('Formulario de agregar docente abierto');
  };

  const handleDeleteTeacher = (teacherId: string) => {
    toast.success('Docente eliminado correctamente');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Docentes</h1>
            <p className="text-gray-600 mt-2">Administra todos los docentes del instituto</p>
          </div>
          <Button onClick={handleAddTeacher} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4" />
            Agregar Docente
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

        {/* Tabla de docentes */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Docentes Registrados</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matricula</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Departamento</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asignaturas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Contratacion</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{teacher.teacherId}</td>
                  <td className="py-3 px-4 text-gray-900">Docente {teacher.id}</td>
                  <td className="py-3 px-4 text-gray-600">doc{teacher.id}@instituto.edu</td>
                  <td className="py-3 px-4 text-gray-600">{teacher.department}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{teacher.subjects.length}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(teacher.hireDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
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
            <p className="text-sm text-gray-600 font-medium">Total de Docentes</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{mockTeachers.length}</p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Departamentos</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {new Set(mockTeachers.map(t => t.department)).size}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Asignaturas Impartidas</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {mockTeachers.reduce((sum, t) => sum + t.subjects.length, 0)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Activos Hoy</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{mockTeachers.length}</p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
