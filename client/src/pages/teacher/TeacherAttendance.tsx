/**
 * TeacherAttendance — Control de asistencia funcional.
 *
 * - El docente selecciona asignatura y fecha.
 * - Marca presente/ausente/retrasado por estudiante.
 * - "Guardar" persiste en DataContext (localStorage) y envía notificación.
 * - "Exportar" descarga PDF/CSV con el listado del día.
 */

import React, { useState, useMemo, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Save, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { descargarCSV, descargarPDF } from '@/lib/downloads';
import { toast } from 'sonner';

type Estado = 'present' | 'absent' | 'late';

export default function TeacherAttendance() {
  const { students, users, subjects, attendance, upsertAttendance } = useData();
  const { addNotification } = useNotifications();

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.id ?? '');
  const [fecha,           setFecha]           = useState<string>(new Date().toISOString().slice(0, 10));
  const [hora,            setHora]            = useState<string>('08:00');
  const [records,         setRecords]         = useState<Record<string, Estado>>({});

  // Si se cambia la fecha o asignatura, precarga el estado desde lo ya guardado
  useEffect(() => {
    if (!selectedSubject) return;
    const fechaStr = new Date(fecha).toDateString();
    const initial: Record<string, Estado> = {};
    attendance.forEach((a) => {
      if (a.subjectId === selectedSubject && new Date(a.date).toDateString() === fechaStr) {
        initial[a.studentId] = a.status;
      }
    });
    setRecords(initial);
  }, [selectedSubject, fecha, attendance]);

  const studentsWithName = useMemo(() => students.map((s) => {
    const u = users.find((u) => u.id === s.userId);
    return { ...s, name: u?.name ?? `Estudiante ${s.id}` };
  }), [students, users]);

  const handleStatusChange = (studentId: string, status: Estado) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!selectedSubject) {
      toast.error('Selecciona una asignatura');
      return;
    }
    const marcados = Object.entries(records);
    if (marcados.length === 0) {
      toast.error('No has marcado a ningún estudiante');
      return;
    }
    const fechaObj = new Date(`${fecha}T${hora || '08:00'}:00`);
    upsertAttendance(marcados.map(([studentId, status]) => ({
      studentId, subjectId: selectedSubject, date: fechaObj, status,
    })));
    const nombreAsig = subjects.find((s) => s.id === selectedSubject)?.name ?? 'asignatura';
    toast.success(`Asistencia guardada para ${marcados.length} estudiante(s)`);
    addNotification({
      title:   'Asistencia registrada',
      message: `Se registró la asistencia de ${nombreAsig} (${fecha}).`,
      type:    'success',
    });
  };

  const handleExport = (formato: 'csv' | 'pdf') => {
    const rows = studentsWithName.map((s) => ({
      matricula: s.studentId,
      nombre:    s.name,
      estado:    records[s.id]
        ? records[s.id] === 'present' ? 'Presente'
        : records[s.id] === 'absent'  ? 'Ausente'
                                      : 'Retrasado'
        : 'Sin marcar',
    }));
    const cols = [
      { encabezado: 'Matrícula', obtener: (r: typeof rows[number]) => r.matricula },
      { encabezado: 'Estudiante', obtener: (r: typeof rows[number]) => r.nombre },
      { encabezado: 'Estado',    obtener: (r: typeof rows[number]) => r.estado },
    ];
    const nombreAsig = subjects.find((s) => s.id === selectedSubject)?.name ?? 'asignatura';
    if (formato === 'csv') descargarCSV(rows, cols, `asistencia_${fecha}`);
    else descargarPDF(rows, cols, `asistencia_${fecha}`, `Asistencia · ${nombreAsig}`, `Fecha: ${fecha}`);
    toast.success(`Listado exportado en ${formato.toUpperCase()}`);
  };

  const stats = useMemo(() => ({
    presente: Object.values(records).filter((s) => s === 'present').length,
    ausente:  Object.values(records).filter((s) => s === 'absent').length,
    retrasado:Object.values(records).filter((s) => s === 'late').length,
  }), [records]);

  const colorEstado = (status: Estado | undefined) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':  return 'bg-red-100 text-red-800 border-red-300';
      case 'late':    return 'bg-orange-100 text-orange-800 border-orange-300';
      default:        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const labelEstado = (status: Estado | undefined) => {
    switch (status) {
      case 'present': return 'Presente';
      case 'absent':  return 'Ausente';
      case 'late':    return 'Retrasado';
      default:        return 'Sin marcar';
    }
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
            <p className="text-gray-600 mt-2">Registra la asistencia de tus estudiantes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4" />
              Guardar Asistencia
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabla */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estudiantes ({studentsWithName.length})</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matrícula</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Presente</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ausente</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Retrasado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {studentsWithName.map((s) => {
                const estado = records[s.id];
                return (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{s.name}</td>
                    <td className="py-3 px-4 text-gray-600">{s.studentId}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(s.id, 'present')}
                        className={`p-2 rounded-lg transition-all ${
                          estado === 'present' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        aria-label="Presente"
                      >
                        <Check className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(s.id, 'absent')}
                        className={`p-2 rounded-lg transition-all ${
                          estado === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        aria-label="Ausente"
                      >
                        <X className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleStatusChange(s.id, 'late')}
                        className={`p-2 rounded-lg transition-all ${
                          estado === 'late' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                        aria-label="Retrasado"
                      >
                        <Clock className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorEstado(estado)}`}>
                        {labelEstado(estado)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Presentes</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.presente}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
            <p className="text-sm text-gray-600 font-medium">Ausentes</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.ausente}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Retrasados</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.retrasado}</p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
