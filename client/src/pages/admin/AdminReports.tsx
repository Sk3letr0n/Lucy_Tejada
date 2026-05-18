/**
 * AdminReports - Generación global de reportes para administradores
 * Permite exportar información agregada del instituto en PDF / Excel / CSV
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  FileText,
  BarChart3,
  Users,
  GraduationCap,
  Music2,
  ClipboardCheck,
} from 'lucide-react';
import {
  mockStudents,
  mockTeachers,
  mockSubjects,
  mockAuditLogs,
} from '@/lib/mockData';
import { toast } from 'sonner';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  formats: Array<'pdf' | 'excel' | 'csv'>;
  accent: string;
}

export default function AdminReports() {
  const [generating, setGenerating] = useState<string | null>(null);

  const reportOptions: ReportOption[] = [
    {
      id: 'students',
      title: 'Reporte de Estudiantes',
      description:
        'Listado general de estudiantes matriculados, GPA y tasa de asistencia.',
      icon: <Users className="w-6 h-6" />,
      formats: ['pdf', 'excel', 'csv'],
      accent: 'from-blue-50 to-blue-100 text-blue-700',
    },
    {
      id: 'teachers',
      title: 'Reporte de Docentes',
      description:
        'Personal académico activo, departamentos y asignaturas a cargo.',
      icon: <GraduationCap className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
      accent: 'from-green-50 to-green-100 text-green-700',
    },
    {
      id: 'subjects',
      title: 'Reporte de Asignaturas',
      description:
        'Cobertura curricular, cupos disponibles y promedios por asignatura.',
      icon: <BarChart3 className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
      accent: 'from-orange-50 to-orange-100 text-orange-700',
    },
    {
      id: 'music',
      title: 'Reporte del Módulo de Música',
      description:
        'Inventario de instrumentos, agrupaciones activas y próximos recitales.',
      icon: <Music2 className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
      accent: 'from-purple-50 to-purple-100 text-purple-700',
    },
    {
      id: 'audit',
      title: 'Reporte de Auditoría',
      description:
        'Eventos del sistema, accesos y modificaciones de los últimos 30 días.',
      icon: <ClipboardCheck className="w-6 h-6" />,
      formats: ['pdf', 'csv'],
      accent: 'from-red-50 to-red-100 text-red-700',
    },
    {
      id: 'global',
      title: 'Reporte Institucional',
      description:
        'Resumen ejecutivo con indicadores clave del instituto.',
      icon: <FileText className="w-6 h-6" />,
      formats: ['pdf'],
      accent: 'from-indigo-50 to-indigo-100 text-indigo-700',
    },
  ];

  const handleGenerate = (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    setGenerating(`${reportId}-${format}`);
    toast.info(`Generando ${reportId} en ${format.toUpperCase()}...`);
    setTimeout(() => {
      setGenerating(null);
      toast.success('Reporte descargado correctamente');
    }, 1200);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes Institucionales</h1>
          <p className="text-gray-600 mt-2">
            Genera reportes globales del Instituto Lucy Tejada en distintos formatos.
          </p>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-xs font-medium text-gray-600">Estudiantes</p>
            <p className="text-2xl font-bold text-blue-700">{mockStudents.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-xs font-medium text-gray-600">Docentes</p>
            <p className="text-2xl font-bold text-green-700">{mockTeachers.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-xs font-medium text-gray-600">Asignaturas</p>
            <p className="text-2xl font-bold text-orange-700">{mockSubjects.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <p className="text-xs font-medium text-gray-600">Eventos auditados</p>
            <p className="text-2xl font-bold text-red-700">{mockAuditLogs.length}</p>
          </Card>
        </div>

        {/* Catálogo de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportOptions.map((report) => (
            <Card
              key={report.id}
              className={`p-6 border-0 shadow-md bg-gradient-to-br ${report.accent}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-white/60 rounded-lg">{report.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{report.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.formats.map((format) => {
                  const key = `${report.id}-${format}`;
                  return (
                    <Button
                      key={format}
                      size="sm"
                      variant="secondary"
                      disabled={generating === key}
                      onClick={() => handleGenerate(report.id, format)}
                      className="bg-white/80 hover:bg-white text-gray-800"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {format.toUpperCase()}
                    </Button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
