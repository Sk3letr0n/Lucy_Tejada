/**
 * AdminStudents - Pagina de gestion de estudiantes para admin
 * Permite agregar, editar y eliminar estudiantes (persistido en localStorage via DataContext).
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { descargarCSV, descargarPDF } from '@/lib/downloads';
import { toast } from 'sonner';

export default function AdminStudents() {
  const { students, users, deleteStudent, addStudent } = useData();
  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd,    setOpenAdd]    = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    nombre: '', email: '', studentId: '', gpa: '', attendanceRate: '',
  });

  // Enriquece cada estudiante con su nombre y email del usuario asociado
  const studentsWithUser = useMemo(() =>
    students.map((s) => {
      const u = users.find((u) => u.id === s.userId);
      return {
        ...s,
        name:  u?.name  ?? `Estudiante ${s.id}`,
        email: u?.email ?? `est${s.id}@instituto.edu`,
      };
    }),
  [students, users]);

  const filtered = studentsWithUser.filter((s) =>
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.studentId.trim()) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    addStudent({
      name:             form.nombre.trim(),
      email:            form.email.trim(),
      studentId:        form.studentId.trim(),
      gpa:              Number(form.gpa) || 0,
      attendanceRate:   Number(form.attendanceRate) || 100,
      enrolledSubjects: [],
      enrollmentDate:   new Date(),
      userId:           '', // lo sobrescribe DataContext
    });
    addNotification({
      title:   'Nuevo estudiante',
      message: `Se registró ${form.nombre} (${form.studentId}).`,
      type:    'success',
    });
    toast.success(`Estudiante ${form.nombre} agregado correctamente`);
    setForm({ nombre: '', email: '', studentId: '', gpa: '', attendanceRate: '' });
    setOpenAdd(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const stu = studentsWithUser.find((s) => s.id === deleteId);
    deleteStudent(deleteId);
    toast.success(`${stu?.name ?? 'Estudiante'} eliminado`);
    addNotification({
      title:   'Estudiante eliminado',
      message: `${stu?.name ?? 'Un estudiante'} fue eliminado del sistema.`,
      type:    'warning',
    });
    setDeleteId(null);
  };

  const handleExport = (formato: 'csv' | 'pdf') => {
    const cols = [
      { encabezado: 'Matrícula',   obtener: (s: typeof studentsWithUser[number]) => s.studentId },
      { encabezado: 'Nombre',      obtener: (s: typeof studentsWithUser[number]) => s.name },
      { encabezado: 'Email',       obtener: (s: typeof studentsWithUser[number]) => s.email },
      { encabezado: 'Asignaturas', obtener: (s: typeof studentsWithUser[number]) => s.enrolledSubjects.length },
      { encabezado: 'GPA',         obtener: (s: typeof studentsWithUser[number]) => s.gpa.toFixed(1) },
      { encabezado: 'Asistencia',  obtener: (s: typeof studentsWithUser[number]) => `${s.attendanceRate}%` },
    ];
    if (formato === 'csv') {
      descargarCSV(studentsWithUser, cols, 'estudiantes');
    } else {
      descargarPDF(studentsWithUser, cols, 'estudiantes', 'Listado de Estudiantes', 'Reporte completo de matrícula');
    }
    toast.success(`Listado exportado en formato ${formato.toUpperCase()}`);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
            <p className="text-gray-600 mt-2">Administra todos los estudiantes del instituto</p>
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
              Agregar Estudiante
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <Card className="p-4 border-0 shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por matrícula, nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none bg-transparent"
          />
        </Card>

        {/* Tabla */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Estudiantes Registrados ({filtered.length})
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matrícula</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asignaturas</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">GPA</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asistencia</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Sin resultados</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{s.studentId}</td>
                  <td className="py-3 px-4 text-gray-900">{s.name}</td>
                  <td className="py-3 px-4 text-gray-600">{s.email}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{s.enrolledSubjects.length}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-blue-600">{s.gpa.toFixed(1)}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      s.attendanceRate >= 90 ? 'text-green-600' :
                      s.attendanceRate >= 75 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toast.info('Edición disponible próximamente')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Eliminar"
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total de Estudiantes</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">GPA Promedio</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {students.length
                ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(1)
                : '0.0'}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Asistencia Promedio</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {students.length
                ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length).toFixed(0)
                : '0'}%
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Activos Hoy</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{students.length}</p>
          </Card>
        </div>
      </div>

      {/* Dialog: Agregar estudiante */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nuevo estudiante</DialogTitle>
            <DialogDescription>
              Completa los datos para registrar al estudiante en el instituto.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="studentId">Matrícula *</Label>
              <Input id="studentId" placeholder="EST123" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gpa">GPA inicial</Label>
                <Input id="gpa" type="number" step="0.1" min="0" max="10" value={form.gpa} onChange={(e) => setForm({ ...form, gpa: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="att">Asistencia %</Label>
                <Input id="att" type="number" min="0" max="100" value={form.attendanceRate} onChange={(e) => setForm({ ...form, attendanceRate: e.target.value })} />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog: confirmar borrado */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El estudiante será eliminado del registro.
            </AlertDialogDescription>
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
