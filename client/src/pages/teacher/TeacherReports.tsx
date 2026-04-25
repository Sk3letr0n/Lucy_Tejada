/**
 * TeacherReports - Pagina de generacion de reportes para docentes
 * Permite generar reportes en PDF y Excel
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  formats: ('pdf' | 'excel')[];
}

export default function TeacherReports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportOptions: ReportOption[] = [
    {
      id: 'grades',
      title: 'Reporte de Calificaciones',
      description: 'Resumen de todas las calificaciones de tus estudiantes',
      icon: <BarChart3 className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
    },
    {
      id: 'attendance',
      title: 'Reporte de Asistencia',
      description: 'Registro detallado de asistencia por estudiante',
      icon: <FileText className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
    },
    {
      id: 'progress',
      title: 'Reporte de Progreso',
      description: 'Analisis del progreso academico de la clase',
      icon: <BarChart3 className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
    },
    {
      id: 'summary',
      title: 'Reporte Resumen',
      description: 'Resumen general de desempenio de la clase',
      icon: <FileText className="w-6 h-6" />,
      formats: ['pdf', 'excel'],
    },
  ];

  const handleGenerateReport = (reportId: string, format: 'pdf' | 'excel') => {
    toast.success(`Generando reporte en ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Reporte descargado exitosamente`);
    }, 1500);
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generador de Reportes</h1>
          <p className="text-gray-600 mt-2">Crea reportes detallados de tu clase en PDF o Excel</p>
        </div>

        {/* Filtros */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Parametros del Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Todas las asignaturas</option>
     
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Filtrar</Button>
            </div>
          </div>
        </Card>

        {/* Opciones de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportOptions.map((report) => (
            <Card
              key={report.id}
              className={`p-6 border-0 shadow-md cursor-pointer transition-all hover:shadow-lg ${
                selectedReport === report.id ? 'ring-2 ring-blue-600' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {report.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
              </div>

              {/* Botones de descarga */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {report.formats.map((format) => (
                  <Button
                    key={format}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateReport(report.id, format);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      format === 'pdf'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Reportes recientes */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reportes Recientes</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Reporte de Calificaciones - Abril 2024</p>
                    <p className="text-xs text-gray-600">Generado hace 2 dias</p>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Descargar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
