/**
 * AdminSubjects - Pagina de gestion de asignaturas para admin
 * Permite agregar, editar y eliminar asignaturas
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockSubjects } from '@/lib/mockData';
import { toast } from 'sonner';

export default function AdminSubjects() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = mockSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    toast.success('Formulario de agregar asignatura abierto');
  };

  const handleDeleteSubject = (subjectId: string) => {
    toast.success('Asignatura eliminada correctamente');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Asignaturas</h1>
            <p className="text-gray-600 mt-2">Administra todas las asignaturas del instituto</p>
          </div>
          <Button onClick={handleAddSubject} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Agregar Asignatura
          </Button>
        </div>

        {/* Buscador */}
        <Card className="p-4 border-0 shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por nombre o codigo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
          />
        </Card>

        {/* Tabla de asignaturas */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Asignaturas Registradas</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Codigo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripcion</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Creditos</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Estudiantes</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Docentes</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{subject.code}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{subject.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate">{subject.description}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{subject.credits}</td>
                  <td className="py-3 px-4 text-center text-gray-600">-</td>
                  <td className="py-3 px-4 text-center text-gray-600">-</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
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
            <p className="text-sm text-gray-600 font-medium">Total de Asignaturas</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{mockSubjects.length}</p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Estudiantes Totales</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {mockSubjects.reduce((sum, s) => sum + (s.enrolledStudents || 0), 0)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Creditos Totales</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {mockSubjects.reduce((sum, s) => sum + s.credits, 0)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Docentes Asignados</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">6</p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
