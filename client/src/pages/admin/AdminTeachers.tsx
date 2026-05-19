/**
 * AdminTeachers - Pagina de gestion de docentes para admin
 * CRUD persistido via DataContext + exportación CSV/PDF.
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
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

export default function AdminTeachers() {
  const { teachers, users, addTeacher, deleteTeacher } = useData();
  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd,    setOpenAdd]    = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);

  const [form, setForm] = useState({
    nombre: '', email: '', teacherId: '', department: '',
  });

  const teachersWithUser = useMemo(() =>
    teachers.map((t) => {
      const u = users.find((u) => u.id === t.userId);
      return {
        ...t,
        name:  u?.name  ?? `Docente ${t.id}`,
        email: u?.email ?? `doc${t.id}@instituto.edu`,
      };
    }),
  [teachers, users]);

  const filtered = teachersWithUser.filter((t) =>
    t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim() || !form.teacherId.trim() || !form.department.trim()) {
      toast.error('Completa todos los campos');
      return;
    }
    addTeacher({
      name:       form.nombre.trim(),
      email:      form.email.trim(),
      teacherId:  form.teacherId.trim(),
      department: form.department.trim(),
      subjects:   [],
      hireDate:   new Date(),
      userId:     '',
    });
    addNotification({
      title:   'Nuevo docente',
      message: `Se contrató a ${form.nombre} en ${form.department}.`,
      type:    'success',
    });
    toast.success(`Docente ${form.nombre} agregado`);
    setForm({ nombre: '', email: '', teacherId: '', department: '' });
    setOpenAdd(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const t = teachersWithUser.find((x) => x.id === deleteId);
    deleteTeacher(deleteId);
    toast.success(`${t?.name ?? 'Docente'} eliminado`);
    addNotification({
      title:   'Docente eliminado',
      message: `${t?.name ?? 'Un docente'} fue eliminado del sistema.`,
      type:    'warning',
    });
    setDeleteId(null);
  };

  const handleExport = (formato: 'csv' | 'pdf') => {
    const cols = [
      { encabezado: 'Matrícula',          obtener: (t: typeof teachersWithUser[number]) => t.teacherId },
      { encabezado: 'Nombre',             obtener: (t: typeof teachersWithUser[number]) => t.name },
      { encabezado: 'Email',              obtener: (t: typeof teachersWithUser[number]) => t.email },
      { encabezado: 'Departamento',       obtener: (t: typeof teachersWithUser[number]) => t.department },
      { encabezado: 'Asignaturas',        obtener: (t: typeof teachersWithUser[number]) => t.subjects.length },
      { encabezado: 'Fecha Contratación', obtener: (t: typeof teachersWithUser[number]) => new Date(t.hireDate).toLocaleDateString('es-CO') },
    ];
    if (formato === 'csv') descargarCSV(teachersWithUser, cols, 'docentes');
    else descargarPDF(teachersWithUser, cols, 'docentes', 'Listado de Docentes', 'Reporte de personal docente');
    toast.success(`Exportado como ${formato.toUpperCase()}`);
  };

  const totalDepts = new Set(teachers.map((t) => t.department)).size;
  const totalAsig  = teachers.reduce((sum, t) => sum + t.subjects.length, 0);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Docentes</h1>
            <p className="text-gray-600 mt-2">Administra todos los docentes del instituto</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button onClick={() => setOpenAdd(true)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4" /> Agregar Docente
            </Button>
          </div>
        </div>

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

        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Docentes Registrados ({filtered.length})
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Matrícula</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Departamento</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Asignaturas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contratación</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Sin resultados</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{t.teacherId}</td>
                  <td className="py-3 px-4 text-gray-900">{t.name}</td>
                  <td className="py-3 px-4 text-gray-600">{t.email}</td>
                  <td className="py-3 px-4 text-gray-600">{t.department}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{t.subjects.length}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(t.hireDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toast.info('Edición disponible próximamente')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(t.id)}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total de Docentes</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{teachers.length}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Departamentos</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalDepts}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Total Asignaturas</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{totalAsig}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Activos</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{teachers.length}</p>
          </Card>
        </div>
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nuevo docente</DialogTitle>
            <DialogDescription>Registra un docente al instituto.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="t-nombre">Nombre completo *</Label>
              <Input id="t-nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="t-email">Email *</Label>
              <Input id="t-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="t-id">Matrícula *</Label>
              <Input id="t-id" placeholder="DOC-M07" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="t-dept">Departamento *</Label>
              <Input id="t-dept" placeholder="Música" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar docente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
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
