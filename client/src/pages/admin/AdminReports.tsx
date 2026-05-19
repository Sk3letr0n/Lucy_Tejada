/**
 * AdminReports - Reportes institucionales con descarga real (PDF/Excel/CSV).
 * La descarga usa el helper de @/lib/downloads (sin dependencias externas).
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download, FileText, BarChart3, Users, GraduationCap, Music2, ClipboardCheck,
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import {
  mockAuditLogs, mockEnsembles, mockRepertoire, mockRecitals,
} from '@/lib/mockData';
import { descargarCSV, descargarExcel, descargarPDF, ColumnaTabla } from '@/lib/downloads';
import { toast } from 'sonner';

type Formato = 'pdf' | 'excel' | 'csv';

interface ReportOption {
  id:          string;
  title:       string;
  description: string;
  icon:        React.ReactNode;
  formats:     Formato[];
  accent:      string;
}

export default function AdminReports() {
  const { students, teachers, subjects, users } = useData();
  const { addNotification } = useNotifications();
  const [generating, setGenerating] = useState<string | null>(null);

  // ── Datasets para cada reporte ──────────────────────────────────────────
  const studentsRows = useMemo(() => students.map((s) => {
    const u = users.find((u) => u.id === s.userId);
    return {
      matricula:    s.studentId,
      nombre:       u?.name  ?? `Estudiante ${s.id}`,
      email:        u?.email ?? '',
      asignaturas:  s.enrolledSubjects.length,
      gpa:          s.gpa.toFixed(1),
      asistencia:   `${s.attendanceRate}%`,
    };
  }), [students, users]);

  const teachersRows = useMemo(() => teachers.map((t) => {
    const u = users.find((u) => u.id === t.userId);
    return {
      matricula:    t.teacherId,
      nombre:       u?.name  ?? `Docente ${t.id}`,
      email:        u?.email ?? '',
      departamento: t.department,
      asignaturas:  t.subjects.length,
      contratacion: new Date(t.hireDate).toLocaleDateString('es-CO'),
    };
  }), [teachers, users]);

  const subjectsRows = useMemo(() => subjects.map((s) => ({
    codigo:       s.code,
    nombre:       s.name,
    creditos:     s.credits,
    departamento: s.department ?? '-',
    descripcion:  s.description ?? '',
  })), [subjects]);

  const musicRows = useMemo(() => [
    ...mockEnsembles.map((e) => ({
      tipo:       'Agrupación',
      nombre:     e.name,
      detalle:    e.type,
      info:       `${e.memberIds?.length ?? 0} integrantes`,
    })),
    ...mockRepertoire.map((r) => ({
      tipo:       'Obra',
      nombre:     r.title,
      detalle:    r.composer,
      info:       r.difficulty ?? '',
    })),
    ...mockRecitals.map((r) => ({
      tipo:       'Recital',
      nombre:     r.title,
      detalle:    new Date(r.date).toLocaleDateString('es-CO'),
      info:       r.venue,
    })),
  ], []);

  const auditRows = useMemo(() => mockAuditLogs.map((a) => ({
    fecha:    new Date(a.timestamp).toLocaleString('es-CO'),
    usuario:  a.userName,
    accion:   a.action,
    recurso:  a.resource,
    detalle:  a.resourceId ?? '',
  })), []);

  const globalRows = useMemo(() => [
    { indicador: 'Total estudiantes',           valor: String(students.length) },
    { indicador: 'Total docentes',              valor: String(teachers.length) },
    { indicador: 'Total asignaturas',           valor: String(subjects.length) },
    { indicador: 'Agrupaciones activas',        valor: String(mockEnsembles.length) },
    { indicador: 'Obras del repertorio',        valor: String(mockRepertoire.length) },
    { indicador: 'Recitales programados',       valor: String(mockRecitals.length) },
    { indicador: 'Eventos auditados',           valor: String(mockAuditLogs.length) },
    {
      indicador: 'GPA promedio',
      valor: students.length
        ? (students.reduce((s, x) => s + x.gpa, 0) / students.length).toFixed(2)
        : '0',
    },
    {
      indicador: 'Asistencia promedio',
      valor: students.length
        ? `${(students.reduce((s, x) => s + x.attendanceRate, 0) / students.length).toFixed(0)}%`
        : '0%',
    },
  ], [students, teachers, subjects]);

  // ── Catálogo de reportes ────────────────────────────────────────────────
  const reportOptions: ReportOption[] = [
    {
      id: 'students',
      title: 'Reporte de Estudiantes',
      description: 'Listado general de estudiantes matriculados, GPA y tasa de asistencia.',
      icon: <Users className="w-6 h-6" />, formats: ['pdf', 'excel', 'csv'],
      accent: 'from-blue-50 to-blue-100 text-blue-700',
    },
    {
      id: 'teachers',
      title: 'Reporte de Docentes',
      description: 'Personal académico activo, departamentos y asignaturas a cargo.',
      icon: <GraduationCap className="w-6 h-6" />, formats: ['pdf', 'excel', 'csv'],
      accent: 'from-green-50 to-green-100 text-green-700',
    },
    {
      id: 'subjects',
      title: 'Reporte de Asignaturas',
      description: 'Cobertura curricular, créditos y descripciones del catálogo.',
      icon: <BarChart3 className="w-6 h-6" />, formats: ['pdf', 'excel', 'csv'],
      accent: 'from-orange-50 to-orange-100 text-orange-700',
    },
    {
      id: 'music',
      title: 'Reporte del Módulo de Música',
      description: 'Agrupaciones activas, repertorio y próximos recitales.',
      icon: <Music2 className="w-6 h-6" />, formats: ['pdf', 'excel', 'csv'],
      accent: 'from-purple-50 to-purple-100 text-purple-700',
    },
    {
      id: 'audit',
      title: 'Reporte de Auditoría',
      description: 'Eventos del sistema, accesos y modificaciones recientes.',
      icon: <ClipboardCheck className="w-6 h-6" />, formats: ['pdf', 'csv'],
      accent: 'from-red-50 to-red-100 text-red-700',
    },
    {
      id: 'global',
      title: 'Reporte Institucional',
      description: 'Resumen ejecutivo con indicadores clave del instituto.',
      icon: <FileText className="w-6 h-6" />, formats: ['pdf', 'excel'],
      accent: 'from-indigo-50 to-indigo-100 text-indigo-700',
    },
  ];

  // ── Mapeos de columnas ──────────────────────────────────────────────────
  function obtenerDataset(reportId: string): { rows: any[]; cols: ColumnaTabla<any>[]; titulo: string } {
    switch (reportId) {
      case 'students':
        return {
          rows: studentsRows,
          cols: [
            { encabezado: 'Matrícula',   obtener: (r) => r.matricula },
            { encabezado: 'Nombre',      obtener: (r) => r.nombre },
            { encabezado: 'Email',       obtener: (r) => r.email },
            { encabezado: 'Asignaturas', obtener: (r) => r.asignaturas },
            { encabezado: 'GPA',         obtener: (r) => r.gpa },
            { encabezado: 'Asistencia',  obtener: (r) => r.asistencia },
          ],
          titulo: 'Reporte de Estudiantes',
        };
      case 'teachers':
        return {
          rows: teachersRows,
          cols: [
            { encabezado: 'Matrícula',          obtener: (r) => r.matricula },
            { encabezado: 'Nombre',             obtener: (r) => r.nombre },
            { encabezado: 'Email',              obtener: (r) => r.email },
            { encabezado: 'Departamento',       obtener: (r) => r.departamento },
            { encabezado: 'Asignaturas',        obtener: (r) => r.asignaturas },
            { encabezado: 'Fecha Contratación', obtener: (r) => r.contratacion },
          ],
          titulo: 'Reporte de Docentes',
        };
      case 'subjects':
        return {
          rows: subjectsRows,
          cols: [
            { encabezado: 'Código',       obtener: (r) => r.codigo },
            { encabezado: 'Nombre',       obtener: (r) => r.nombre },
            { encabezado: 'Créditos',     obtener: (r) => r.creditos },
            { encabezado: 'Departamento', obtener: (r) => r.departamento },
            { encabezado: 'Descripción',  obtener: (r) => r.descripcion },
          ],
          titulo: 'Reporte de Asignaturas',
        };
      case 'music':
        return {
          rows: musicRows,
          cols: [
            { encabezado: 'Tipo',    obtener: (r) => r.tipo },
            { encabezado: 'Nombre',  obtener: (r) => r.nombre },
            { encabezado: 'Detalle', obtener: (r) => r.detalle },
            { encabezado: 'Info',    obtener: (r) => r.info },
          ],
          titulo: 'Módulo de Música',
        };
      case 'audit':
        return {
          rows: auditRows,
          cols: [
            { encabezado: 'Fecha',   obtener: (r) => r.fecha },
            { encabezado: 'Usuario', obtener: (r) => r.usuario },
            { encabezado: 'Acción',  obtener: (r) => r.accion },
            { encabezado: 'Recurso', obtener: (r) => r.recurso },
            { encabezado: 'Detalle', obtener: (r) => r.detalle },
          ],
          titulo: 'Reporte de Auditoría',
        };
      case 'global':
      default:
        return {
          rows: globalRows,
          cols: [
            { encabezado: 'Indicador', obtener: (r) => r.indicador },
            { encabezado: 'Valor',     obtener: (r) => r.valor },
          ],
          titulo: 'Reporte Institucional',
        };
    }
  }

  const handleGenerate = (reportId: string, format: Formato) => {
    const key = `${reportId}-${format}`;
    setGenerating(key);
    try {
      const { rows, cols, titulo } = obtenerDataset(reportId);
      if (rows.length === 0) {
        toast.warning('No hay datos para generar este reporte');
        setGenerating(null);
        return;
      }
      const nombreArchivo = `reporte_${reportId}_${new Date().toISOString().slice(0, 10)}`;
      if (format === 'csv') {
        descargarCSV(rows, cols, nombreArchivo);
      } else if (format === 'excel') {
        descargarExcel(rows, cols, nombreArchivo, titulo);
      } else {
        descargarPDF(rows, cols, nombreArchivo, titulo, 'Generado desde el panel de administración');
      }
      addNotification({
        title:   'Reporte generado',
        message: `${titulo} (${format.toUpperCase()}) listo para descargar.`,
        type:    'success',
      });
      toast.success(`Reporte generado en ${format.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      toast.error('No se pudo generar el reporte');
    } finally {
      setGenerating(null);
    }
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

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-xs font-medium text-gray-600">Estudiantes</p>
            <p className="text-2xl font-bold text-blue-700">{students.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-xs font-medium text-gray-600">Docentes</p>
            <p className="text-2xl font-bold text-green-700">{teachers.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-xs font-medium text-gray-600">Asignaturas</p>
            <p className="text-2xl font-bold text-orange-700">{subjects.length}</p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <p className="text-xs font-medium text-gray-600">Eventos auditados</p>
            <p className="text-2xl font-bold text-red-700">{mockAuditLogs.length}</p>
          </Card>
        </div>

        {/* Catálogo */}
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
                      {generating === key ? 'Generando...' : format.toUpperCase()}
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
