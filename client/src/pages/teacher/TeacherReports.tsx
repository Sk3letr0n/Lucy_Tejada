/**
 * TeacherReports — Generador de reportes funcional.
 *
 * Cada tarjeta genera un archivo real (PDF/HTML o Excel) usando
 * los datos de DataContext en lugar de solo mostrar un toast.
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { descargarExcel, descargarPDF } from '@/lib/downloads';
import { toast } from 'sonner';

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    id: 'grades',
    title: 'Reporte de Calificaciones',
    description: 'Resumen de todas las calificaciones de tus estudiantes',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'attendance',
    title: 'Reporte de Asistencia',
    description: 'Registro detallado de asistencia por estudiante',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'progress',
    title: 'Reporte de Progreso',
    description: 'Análisis del progreso académico de la clase',
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    id: 'summary',
    title: 'Reporte Resumen',
    description: 'Resumen general de desempeño de la clase',
    icon: <FileText className="w-6 h-6" />,
  },
];

const TIPO: Record<string, string> = {
  quiz: 'Quiz', midterm: 'Parcial', final: 'Final', assignment: 'Trabajo',
};
const ESTADO: Record<string, string> = {
  present: 'Presente', absent: 'Ausente', late: 'Retrasado',
};

export default function TeacherReports() {
  const { grades, attendance, students, users, subjects } = useData();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const sName  = (id: string) => users.find((u) => u.id === students.find((s) => s.id === id)?.userId)?.name ?? id;
  const subName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  const obtenerDataset = (reportId: string) => {
    if (reportId === 'grades') {
      const rows = grades.map((g) => ({
        estudiante: sName(g.studentId),
        asignatura: subName(g.subjectId),
        tipo:  TIPO[g.type] ?? g.type,
        nota:  g.value.toFixed(1),
        peso:  `${g.weight}%`,
        fecha: new Date(g.date).toLocaleDateString('es-CO'),
      }));
      return {
        rows,
        cols: [
          { encabezado: 'Estudiante', obtener: (r: typeof rows[number]) => r.estudiante },
          { encabezado: 'Asignatura', obtener: (r: typeof rows[number]) => r.asignatura },
          { encabezado: 'Tipo',       obtener: (r: typeof rows[number]) => r.tipo },
          { encabezado: 'Nota',       obtener: (r: typeof rows[number]) => r.nota },
          { encabezado: 'Peso',       obtener: (r: typeof rows[number]) => r.peso },
          { encabezado: 'Fecha',      obtener: (r: typeof rows[number]) => r.fecha },
        ],
        titulo: 'Reporte de Calificaciones',
      };
    }
    if (reportId === 'attendance') {
      const rows = attendance.map((a) => ({
        estudiante: sName(a.studentId),
        asignatura: subName(a.subjectId),
        fecha:  new Date(a.date).toLocaleDateString('es-CO'),
        estado: ESTADO[a.status] ?? a.status,
        notas:  a.notes ?? '',
      }));
      return {
        rows,
        cols: [
          { encabezado: 'Estudiante', obtener: (r: typeof rows[number]) => r.estudiante },
          { encabezado: 'Asignatura', obtener: (r: typeof rows[number]) => r.asignatura },
          { encabezado: 'Fecha',      obtener: (r: typeof rows[number]) => r.fecha },
          { encabezado: 'Estado',     obtener: (r: typeof rows[number]) => r.estado },
          { encabezado: 'Notas',      obtener: (r: typeof rows[number]) => r.notas },
        ],
        titulo: 'Reporte de Asistencia',
      };
    }
    if (reportId === 'progress') {
      const byStudent: Record<string, { suma: number; count: number }> = {};
      grades.forEach((g) => {
        if (!byStudent[g.studentId]) byStudent[g.studentId] = { suma: 0, count: 0 };
        byStudent[g.studentId].suma  += g.value;
        byStudent[g.studentId].count += 1;
      });
      const rows = students.map((s) => {
        const stats = byStudent[s.id];
        const avg = stats ? stats.suma / stats.count : 0;
        return {
          estudiante:     sName(s.id),
          matricula:      s.studentId,
          promedio:       avg.toFixed(2),
          calificaciones: String(stats?.count ?? 0),
          asistencia:     `${s.attendanceRate ?? 0}%`,
        };
      });
      return {
        rows,
        cols: [
          { encabezado: 'Estudiante',    obtener: (r: typeof rows[number]) => r.estudiante },
          { encabezado: 'Matrícula',     obtener: (r: typeof rows[number]) => r.matricula },
          { encabezado: 'Promedio',      obtener: (r: typeof rows[number]) => r.promedio },
          { encabezado: 'Calificaciones',obtener: (r: typeof rows[number]) => r.calificaciones },
          { encabezado: 'Asistencia',    obtener: (r: typeof rows[number]) => r.asistencia },
        ],
        titulo: 'Reporte de Progreso Académico',
      };
    }
    // summary
    const rows = students.map((s) => ({
      estudiante: sName(s.id),
      matricula:  s.studentId,
      asistencia: `${s.attendanceRate ?? 0}%`,
      promedio:   s.gpa != null ? s.gpa.toFixed(2) : '—',
    }));
    return {
      rows,
      cols: [
        { encabezado: 'Estudiante', obtener: (r: typeof rows[number]) => r.estudiante },
        { encabezado: 'Matrícula',  obtener: (r: typeof rows[number]) => r.matricula },
        { encabezado: 'Asistencia', obtener: (r: typeof rows[number]) => r.asistencia },
        { encabezado: 'GPA',        obtener: (r: typeof rows[number]) => r.promedio },
      ],
      titulo: 'Resumen General de Clase',
    };
  };

  const handleGenerateReport = (reportId: string, format: 'pdf' | 'excel') => {
    const { rows, cols, titulo } = obtenerDataset(reportId);
    if (rows.length === 0) { toast.error('No hay datos para exportar'); return; }
    if (format === 'pdf') descargarPDF(rows, cols, `reporte_${reportId}`, titulo);
    else                  descargarExcel(rows, cols, `reporte_${reportId}`, titulo);
    toast.success(`Reporte descargado en ${format.toUpperCase()}`);
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generador de Reportes</h1>
          <p className="text-gray-600 mt-2">Crea reportes detallados de tu clase en PDF o Excel</p>
        </div>

        {/* Parámetros (fecha y asignatura — solo visual por ahora) */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Parámetros del Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Todas las asignaturas</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Filtrar</Button>
            </div>
          </div>
        </Card>

        {/* Tarjetas de reporte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_OPTIONS.map((report) => (
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
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {(['pdf', 'excel'] as const).map((fmt) => (
                  <Button
                    key={fmt}
                    onClick={(e) => { e.stopPropagation(); handleGenerateReport(report.id, fmt); }}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      fmt === 'pdf' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    {fmt.toUpperCase()}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Reportes recientes (sección informativa) */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reportes Recientes</h2>
          <div className="space-y-3">
            {REPORT_OPTIONS.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-600">Generado al momento de descarga</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport(r.id, 'pdf')}
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> PDF
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport(r.id, 'excel')}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Excel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
