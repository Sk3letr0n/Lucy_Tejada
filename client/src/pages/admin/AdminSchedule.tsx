/**
 * AdminSchedule - Pagina de gestion de horarios para admin
 * Permite crear, editar y eliminar horarios de clases
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mockSchedules, mockSubjects, mockTeachers, mockUsers } from '@/lib/mockData';
import type { Schedule } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminSchedule() {
  const [schedules, setSchedules]   = useState<Schedule[]>(mockSchedules);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [openAdd, setOpenAdd]         = useState(false);
  const [deleteId, setDeleteId]       = useState<string | null>(null);

  const teacherOptions = mockTeachers.map((t) => ({
    id: t.id,
    name: mockUsers.find((u) => u.id === t.userId)?.name ?? `Docente ${t.id}`,
  }));

  const FORM_INICIAL = {
    subjectId: mockSubjects[0]?.id ?? '',
    teacherId: mockTeachers[0]?.id ?? '',
    day: 'Monday' as Schedule['day'],
    startTime: '08:00',
    endTime:   '10:00',
    classroom: '',
    capacity:  '30',
  };
  const [form, setForm] = useState(FORM_INICIAL);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayLabels: Record<string, string> = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miercoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
  };

  const handleAddSchedule = () => setOpenAdd(true);

  const handleSubmit = () => {
    if (!form.classroom) { toast.error('El aula es obligatoria'); return; }
    const subject = mockSubjects.find((s) => s.id === form.subjectId);
    const teacher = teacherOptions.find((t) => t.id === form.teacherId);
    const nuevo: Schedule = {
      id:          `sched-${Date.now()}`,
      subjectId:   form.subjectId,
      subjectName: subject?.name ?? form.subjectId,
      teacherId:   form.teacherId,
      teacherName: teacher?.name ?? form.teacherId,
      day:         form.day,
      startTime:   form.startTime,
      endTime:     form.endTime,
      classroom:   form.classroom,
      capacity:    Number(form.capacity) || undefined,
    };
    setSchedules((p) => [...p, nuevo]);
    toast.success('Horario agregado');
    setForm(FORM_INICIAL);
    setOpenAdd(false);
  };

  const handleDeleteSchedule = (scheduleId: string) => setDeleteId(scheduleId);

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    setSchedules((p) => p.filter((s) => s.id !== deleteId));
    toast.success('Horario eliminado');
    setDeleteId(null);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion de Horarios</h1>
            <p className="text-gray-600 mt-2">Administra los horarios de clases del instituto</p>
          </div>
          <Button onClick={handleAddSchedule} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Agregar Horario
          </Button>
        </div>

        {/* Selector de dias */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDay(null)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedDay === null
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos los dias
          </button>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dayLabels[day]}
            </button>
          ))}
        </div>

        {/* Tabla de horarios */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Horarios Registrados</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Asignatura</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Docente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Dia</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Hora</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aula</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Capacidad</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(selectedDay
                ? schedules.filter(s => s.day === selectedDay)
                : schedules
              ).map((schedule) => (
                <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{schedule.subjectName}</td>
                  <td className="py-3 px-4 text-gray-600">{schedule.teacherName}</td>
                  <td className="py-3 px-4 text-gray-600">{dayLabels[schedule.day]}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{schedule.classroom}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{schedule.capacity}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
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
            <p className="text-sm text-gray-600 font-medium">Total de Horarios</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{schedules.length}</p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Aulas en Uso</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {new Set(schedules.map(s => s.classroom)).size}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Horas Totales</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {schedules.reduce((sum, s) => {
                const start = parseInt(s.startTime.split(':')[0]);
                const end = parseInt(s.endTime.split(':')[0]);
                return sum + (end - start);
              }, 0)}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Docentes</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {new Set(schedules.map(s => s.teacherId)).size}
            </p>
          </Card>
        </div>
      </div>

      {/* Dialog: agregar horario */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Horario</DialogTitle>
            <DialogDescription>Completa los datos para crear un nuevo horario.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Asignatura</Label>
              <select
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {mockSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <Label>Docente</Label>
              <select
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {teacherOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Día</Label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value as Schedule['day'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(dayLabels).map(([val, lbl]) => (
                    <option key={val} value={val}>{lbl}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Aula</Label>
                <Input
                  value={form.classroom}
                  onChange={(e) => setForm({ ...form, classroom: e.target.value })}
                  placeholder="Ej: Sala 101"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Hora inicio</Label>
                <Input type="time" value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div>
                <Label>Hora fin</Label>
                <Input type="time" value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <div>
                <Label>Capacidad</Label>
                <Input type="number" min={1} value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: confirmar eliminar */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar horario?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
