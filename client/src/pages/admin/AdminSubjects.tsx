/**
 * AdminSubjects - Gestion de asignaturas (CRUD funcional + export).
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function AdminSubjects() {
  const { subjects, addSubject, deleteSubject } = useData();
  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [openAdd,    setOpenAdd]    = useState(false);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', code: '', credits: '3', description: '', department: '',
  });

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      toast.error('Completa nombre y código');
      return;
    }
    addSubject({
      name:        form.name.trim(),
      code:        form.code.trim().toUpperCase(),
      credits:     Number(form.credits) || 3,
      description: form.description.trim(),
      department:  form.department.trim(),
    });
    addNotification({
      title:   'Nueva asignatura',
      message: `${form.name} (${form.code}) fue creada.`,
      type:    'success',
    });
    toast.success(`Asignatura "${form.name}" creada`);
    setForm({ name: '', code: '', credits: '3', description: '', department: '' });
    setOpenAdd(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const s = subjects.find((x) => x.id === deleteId);
    deleteSubject(deleteId);
    toast.success(`Asignatura "${s?.name}" eliminada`);
    addNotification({
      title:   'Asignatura eliminada',
      message: `${s?.name ?? 'Una asignatura'} fue eliminada.`,
      type:    'warning',
    });
    setDeleteId(null);
  };

  const handleExport = (formato: 'csv' | 'pdf') => {
    const cols = [
      { encabezado: 'Código',       obtener: (s: typeof subjects[number]) => s.code },
      { encabezado: 'Nombre',       obtener: (s: typeof subjects[number]) => s.name },
      { encabezado: 'Créditos',     obtener: (s: typeof subjects[number]) => s.credits },
      { encabezado: 'Departamento', obtener: (s: typeof subjects[number]) => s.department ?? '-' },
      { encabezado: 'Descripción',  obtener: (s: typeof subjects[number]) => s.description ?? '' },
    ];
    if (formato === 'csv') descargarCSV(subjects, cols, 'asignaturas');
    else descargarPDF(subjects, cols, 'asignaturas', 'Catálogo de Asignaturas');
    toast.success(`Exportado como ${formato.toUpperCase()}`);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Asignaturas</h1>
            <p className="text-gray-600 mt-2">Administra el catálogo académico</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('csv')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')} className="flex items-center gap-1">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button onClick={() => setOpenAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Agregar Asignatura
            </Button>
          </div>
        </div>

        <Card className="p-4 border-0 shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none bg-transparent"
          />
        </Card>

        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Asignaturas Registradas ({filtered.length})
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Créditos</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Departamento</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Sin resultados</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{s.code}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{s.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate">{s.description}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{s.credits}</td>
                  <td className="py-3 px-4 text-gray-600">{s.department ?? '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toast.info('Edición disponible próximamente')}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
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
            <p className="text-sm text-gray-600 font-medium">Total de Asignaturas</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{subjects.length}</p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Total de Créditos</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {subjects.reduce((sum, s) => sum + s.credits, 0)}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Departamentos</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {new Set(subjects.map((s) => s.department).filter(Boolean)).size}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Promedio Créditos</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {subjects.length ? (subjects.reduce((s, x) => s + x.credits, 0) / subjects.length).toFixed(1) : '0'}
            </p>
          </Card>
        </div>
      </div>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar nueva asignatura</DialogTitle>
            <DialogDescription>Define los datos del nuevo curso.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="s-name">Nombre *</Label>
              <Input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="s-code">Código *</Label>
                <Input id="s-code" placeholder="MUS101" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="s-credits">Créditos</Label>
                <Input id="s-credits" type="number" min="1" max="10" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="s-dept">Departamento</Label>
              <Input id="s-dept" placeholder="Música" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-desc">Descripción</Label>
              <Textarea id="s-desc" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar asignatura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los estudiantes inscritos perderán la referencia.
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
