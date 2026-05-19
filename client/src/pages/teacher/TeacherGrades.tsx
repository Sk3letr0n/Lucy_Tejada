/**
 * TeacherGrades — Gestión funcional de calificaciones.
 *
 * - Lista calificaciones (filtrables por asignatura) agrupadas por estudiante.
 * - Permite agregar nueva calificación (Dialog con formulario).
 * - Permite eliminar con confirmación (AlertDialog).
 * - Cambios persisten en DataContext (localStorage).
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { descargarCSV, descargarPDF } from '@/lib/downloads';
import { toast } from 'sonner';
import type { Grade } from '@/lib/types';

const TIPO_LABEL: Record<Grade['type'], string> = {
  quiz:       'Quiz',
  midterm:    'Parcial',
  final:      'Final',
  assignment: 'Trabajo',
};

const FORM_INICIAL = {
  studentId: '',
  subjectId: '',
  value:     '',
  weight:    '20',
  type:      'quiz' as Grade['type'],
  comments:  '',
};

export default function TeacherGrades() {
  const { students, users, subjects, grades, addGrade, deleteGrade } = useData();
  const { addNotification } = useNotifications();

  const [filtroAsig, setFiltroAsig] = useState<string>('all');
  const [openAdd,    setOpenAdd]    = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [form,       setForm]       = useState(FORM_INICIAL);

  const studentName = (id: string) => {
    const s = students.find((x) => x.id === id);
    const u = users.find((u) => u.id === s?.userId);
    return u?.name ?? `Estudiante ${id}`;
  };
  const subjectName = (id: string) =>
    subjects.find((x) => x.id === id)?.name ?? '—';

  const filtered = useMemo(
    () => filtroAsig === 'all' ? grades : grades.filter((g) => g.subjectId === filtroAsig),
    [grades, filtroAsig],
  );

  const grouped = useMemo(() => filtered.reduce((acc, g) => {
    (acc[g.studentId] ??= []).push(g);
    return acc;
  }, {} as Record<string, Grade[]>), [filtered]);

  const handleSubmit = () => {
    if (!form.studentId || !form.subjectId) {
      toast.error('Selecciona estudiante y asignatura'); return;
    }
    const valor = Number(form.value);
    if (Number.isNaN(valor) || valor < 0 || valor > 5) {
      toast.error('La nota debe estar entre 0.0 y 5.0'); return;
    }
    const peso = Number(form.weight);
    if (Number.isNaN(peso) || peso <= 0 || peso > 100) {
      toast.error('El peso debe ser un porcentaje entre 1 y 100'); return;
    }
    addGrade({
      studentId: form.studentId,
      subjectId: form.subjectId,
      value:     valor,
      weight:    peso,
      type:      form.type,
      date:      new Date(),
      comments:  form.comments || undefined,
    });
    toast.success('Calificación registrada');
    addNotification({
      title:   'Nueva calificación',
      message: `Se registró ${TIPO_LABEL[form.type]} de ${valor} para ${studentName(form.studentId)}.`,
      type:    'success',
    });
    setForm(FORM_INICIAL);
    setOpenAdd(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteGrade(deleteId);
    toast.success('Calificación eliminada');
    setDeleteId(null);
  };

  const handleExport = (formato: 'csv' | 'pdf') => {
    const rows = filtered.map((g) => ({
      estudiante: studentName(g.studentId),
      asignatura: subjectName(g.subjectId),
      tipo:       TIPO_LABEL[g.type],
      nota:       g.value.toFixed(1),
      peso:       `${g.weight}%`,
      fecha:      new Date(g.date).toLocaleDateString('es-CO'),
    }));
    const cols = [
      { encabezado: 'Estudiante', obtener: (r: typeof rows[number]) => r.estudiante },
      { encabezado: 'Asignatura', obtener: (r: typeof rows[number]) => r.asignatura },
      { encabezado: 'Tipo',       obtener: (r: typeof rows[number]) => r.tipo },
      { encabezado: 'Nota',       obtener: (r: typeof rows[number]) => r.nota },
      { encabezado: 'Peso',       obtener: (r: typeof rows[number]) => r.peso },
      { encabezado: 'Fecha',      obtener: (r: typeof rows[number]) => r.fecha },
    ];
    if (formato === 'csv') descargarCSV(rows, cols, 'calificaciones');
    else descargarPDF(rows, cols, 'calificaciones', 'Reporte de Calificaciones');
    toast.success(`Reporte exportado en ${formato.toUpperCase()}`);
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Calificaciones</h1>
            <p className="text-gray-600 mt-2">Registra y administra las notas de tus estudiantes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button onClick={() => setOpenAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Agregar Calificación
            </Button>
          </div>
        </div>

        {/* Filtro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Cátedra / Taller</Label>
            <select
              value={filtroAsig}
              onChange={(e) => setFiltroAsig(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las cátedras</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Listado agrupado */}
        {Object.entries(grouped).length === 0 ? (
          <Card className="p-10 text-center text-gray-600">
            No hay calificaciones registradas para los filtros seleccionados.
          </Card>
        ) : (
          Object.entries(grouped).map(([studentId, gs]) => {
            const promedio = gs.reduce((sum, g) => sum + g.value, 0) / gs.length;
            return (
              <Card key={studentId} className="p-6 border-0 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{studentName(studentId)}</h3>
                    <p className="text-sm text-gray-500">{gs.length} calificación(es)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Promedio</p>
                    <p className="text-2xl font-bold text-blue-600">{promedio.toFixed(2)}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 text-sm text-gray-700">
                        <th className="text-left py-2 px-3">Asignatura</th>
                        <th className="text-left py-2 px-3">Tipo</th>
                        <th className="text-right py-2 px-3">Nota</th>
                        <th className="text-right py-2 px-3">Peso</th>
                        <th className="text-left py-2 px-3">Fecha</th>
                        <th className="text-right py-2 px-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gs.map((g) => (
                        <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3">{subjectName(g.subjectId)}</td>
                          <td className="py-2 px-3">{TIPO_LABEL[g.type]}</td>
                          <td className="py-2 px-3 text-right font-semibold">{g.value.toFixed(1)}</td>
                          <td className="py-2 px-3 text-right">{g.weight}%</td>
                          <td className="py-2 px-3">{new Date(g.date).toLocaleDateString('es-CO')}</td>
                          <td className="py-2 px-3 text-right">
                            <Button
                              variant="ghost" size="sm"
                              onClick={() => setDeleteId(g.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialog: agregar */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Calificación</DialogTitle>
            <DialogDescription>Registra una nueva nota para un estudiante.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Estudiante</Label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecciona...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{studentName(s.id)} — {s.studentId}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Asignatura</Label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecciona...</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Tipo</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as Grade['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="quiz">Quiz</option>
                  <option value="midterm">Parcial</option>
                  <option value="final">Final</option>
                  <option value="assignment">Trabajo</option>
                </select>
              </div>
              <div>
                <Label>Nota (0-5)</Label>
                <Input
                  type="number" step="0.1" min={0} max={5}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <Label>Peso (%)</Label>
                <Input
                  type="number" min={1} max={100}
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Comentarios (opcional)</Label>
              <Textarea
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación de eliminar */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar calificación?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
