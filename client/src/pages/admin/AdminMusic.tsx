/**
 * AdminMusic — Módulo de música funcional.
 *
 * Mantiene listas LOCALES (no en DataContext) de instrumentos, agrupaciones,
 * repertorio y recitales, inicializadas desde los mocks. Cada pestaña incluye
 * formulario de alta (Dialog), confirmación de borrado (AlertDialog) y notifica
 * al sistema con `useNotifications`.
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Music2, Users, CalendarDays, Disc3, Plus, Trash2, Search,
} from 'lucide-react';
import {
  mockInstruments, mockEnsembles, mockRepertoire, mockRecitals, mockUsers,
} from '@/lib/mockData';
import type {
  InstrumentStatus, MusicInstrument, Ensemble, EnsembleType,
  InstrumentFamily, RepertoirePiece, Recital, PieceDifficulty, RecitalStatus,
} from '@/lib/types';
import { DAY_LABELS, DayOfWeek } from '@/lib/constants';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from 'sonner';

type Tab = 'instruments' | 'ensembles' | 'repertoire' | 'recitals';

const STATUS_LABEL: Record<InstrumentStatus, string> = {
  available:   'Disponible',
  loaned:      'En préstamo',
  maintenance: 'Mantenimiento',
  retired:     'Retirado',
};
const STATUS_COLOR: Record<InstrumentStatus, string> = {
  available:   'bg-green-100 text-green-700',
  loaned:      'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
  retired:     'bg-gray-200 text-gray-700',
};

const FAMILIAS: InstrumentFamily[] = [
  'Cuerdas', 'Vientos Madera', 'Vientos Metal', 'Percusión', 'Teclas', 'Voz',
];
const TIPOS_ENSEMBLE: EnsembleType[] = [
  'Banda Sinfónica', 'Coro', 'Orquesta', 'Cámara', 'Ensamble Folclórico',
];
const DIFICULTADES: PieceDifficulty[] = ['Básico', 'Intermedio', 'Avanzado'];
const DIAS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

let nextId = 10000;
const genId = () => `m${nextId++}`;

export default function AdminMusic() {
  const { addNotification } = useNotifications();
  const [tab, setTab] = useState<Tab>('instruments');

  // ===== State local =====
  const [instruments, setInstruments] = useState<MusicInstrument[]>(mockInstruments);
  const [ensembles,   setEnsembles]   = useState<Ensemble[]>(mockEnsembles);
  const [repertoire,  setRepertoire]  = useState<RepertoirePiece[]>(mockRepertoire);
  const [recitals,    setRecitals]    = useState<Recital[]>(mockRecitals);

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<InstrumentStatus | 'all'>('all');
  const [openDialog,   setOpenDialog]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: Tab; id: string } | null>(null);

  // ===== Forms =====
  const [instForm, setInstForm] = useState({
    name: '', serial: '', family: 'Cuerdas' as InstrumentFamily, brand: '',
    status: 'available' as InstrumentStatus, notes: '',
  });
  const [ensForm, setEnsForm] = useState({
    name: '', type: 'Banda Sinfónica' as EnsembleType, directorId: '1',
    rehearsalDay: 'Monday' as DayOfWeek, rehearsalStart: '14:00', rehearsalEnd: '16:00',
    rehearsalRoom: 'Sala 1', description: '',
  });
  const [pieceForm, setPieceForm] = useState({
    title: '', composer: '', durationMin: '10', difficulty: 'Intermedio' as PieceDifficulty,
    ensembleId: '', notes: '',
  });
  const [recForm, setRecForm] = useState({
    title: '', date: new Date().toISOString().slice(0, 10), venue: '',
    ensembleId: '', status: 'scheduled' as RecitalStatus, description: '',
  });

  // ===== Stats derivadas =====
  const stats = useMemo(() => ({
    totalInstruments:     instruments.length,
    instrumentsAvailable: instruments.filter((i) => i.status === 'available').length,
    instrumentsLoaned:    instruments.filter((i) => i.status === 'loaned').length,
    totalEnsembles:       ensembles.length,
    upcomingRecitals:     recitals.filter((r) => r.status === 'scheduled' && new Date(r.date) >= new Date()).length,
    repertoireSize:       repertoire.length,
  }), [instruments, ensembles, repertoire, recitals]);

  const filteredInstruments = useMemo<MusicInstrument[]>(
    () => instruments.filter((i) => {
      const q = search.toLowerCase().trim();
      const matchSearch = !q
        || i.name.toLowerCase().includes(q)
        || i.serial.toLowerCase().includes(q)
        || (i.brand?.toLowerCase().includes(q) ?? false);
      const matchStatus = statusFilter === 'all' || i.status === statusFilter;
      return matchSearch && matchStatus;
    }),
    [instruments, search, statusFilter],
  );

  const getUserName = (id?: string) => id ? mockUsers.find((u) => u.id === id)?.name ?? '—' : '—';
  const ensembleName = (id?: string) => ensembles.find((e) => e.id === id)?.name ?? '—';

  // ===== Save handlers =====
  const handleSave = () => {
    if (tab === 'instruments') {
      if (!instForm.name || !instForm.serial) { toast.error('Nombre y serial son obligatorios'); return; }
      const nuevo: MusicInstrument = {
        id: genId(), name: instForm.name, serial: instForm.serial,
        family: instForm.family, brand: instForm.brand || undefined,
        status: instForm.status, acquiredAt: new Date(), notes: instForm.notes || undefined,
      };
      setInstruments((p) => [...p, nuevo]);
      addNotification({ title: 'Instrumento registrado', message: nuevo.name, type: 'success' });
      toast.success('Instrumento registrado');
      setInstForm({ name: '', serial: '', family: 'Cuerdas', brand: '', status: 'available', notes: '' });
    } else if (tab === 'ensembles') {
      if (!ensForm.name) { toast.error('El nombre es obligatorio'); return; }
      const nuevo: Ensemble = {
        id: genId(), name: ensForm.name, type: ensForm.type, directorId: ensForm.directorId,
        memberIds: [], rehearsalDay: ensForm.rehearsalDay as Ensemble['rehearsalDay'],
        rehearsalStart: ensForm.rehearsalStart, rehearsalEnd: ensForm.rehearsalEnd,
        rehearsalRoom: ensForm.rehearsalRoom, description: ensForm.description || undefined,
      };
      setEnsembles((p) => [...p, nuevo]);
      addNotification({ title: 'Agrupación creada', message: nuevo.name, type: 'success' });
      toast.success('Agrupación creada');
      setEnsForm({ name: '', type: 'Banda Sinfónica', directorId: '1', rehearsalDay: 'Monday',
                   rehearsalStart: '14:00', rehearsalEnd: '16:00', rehearsalRoom: 'Sala 1', description: '' });
    } else if (tab === 'repertoire') {
      if (!pieceForm.title || !pieceForm.composer) { toast.error('Título y compositor son obligatorios'); return; }
      const nuevo: RepertoirePiece = {
        id: genId(), title: pieceForm.title, composer: pieceForm.composer,
        durationMin: Number(pieceForm.durationMin) || 0, difficulty: pieceForm.difficulty,
        ensembleId: pieceForm.ensembleId || undefined, notes: pieceForm.notes || undefined,
      };
      setRepertoire((p) => [...p, nuevo]);
      addNotification({ title: 'Obra agregada', message: nuevo.title, type: 'success' });
      toast.success('Obra agregada al repertorio');
      setPieceForm({ title: '', composer: '', durationMin: '10', difficulty: 'Intermedio', ensembleId: '', notes: '' });
    } else if (tab === 'recitals') {
      if (!recForm.title || !recForm.ensembleId) { toast.error('Título y agrupación son obligatorios'); return; }
      const nuevo: Recital = {
        id: genId(), title: recForm.title, date: new Date(recForm.date),
        venue: recForm.venue, ensembleId: recForm.ensembleId, pieceIds: [],
        status: recForm.status, description: recForm.description || undefined,
      };
      setRecitals((p) => [...p, nuevo]);
      addNotification({ title: 'Recital programado', message: nuevo.title, type: 'info' });
      toast.success('Recital programado');
      setRecForm({ title: '', date: new Date().toISOString().slice(0, 10), venue: '',
                   ensembleId: '', status: 'scheduled', description: '' });
    }
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { kind, id } = deleteTarget;
    if (kind === 'instruments')  setInstruments((p) => p.filter((x) => x.id !== id));
    if (kind === 'ensembles')    setEnsembles((p)   => p.filter((x) => x.id !== id));
    if (kind === 'repertoire')   setRepertoire((p)  => p.filter((x) => x.id !== id));
    if (kind === 'recitals')     setRecitals((p)    => p.filter((x) => x.id !== id));
    toast.success('Elemento eliminado');
    setDeleteTarget(null);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Música</h1>
            <p className="text-gray-600 mt-2">
              Administra el inventario, las agrupaciones y la programación musical del instituto.
            </p>
          </div>
          <Button onClick={() => setOpenDialog(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" /> Nuevo
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Instrumentos</p>
                <p className="text-2xl font-bold text-purple-700">{stats.totalInstruments}</p>
              </div>
              <Music2 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.instrumentsAvailable} disponibles · {stats.instrumentsLoaned} en préstamo
            </p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Agrupaciones</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalEnsembles}</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Recitales próximos</p>
                <p className="text-2xl font-bold text-orange-700">{stats.upcomingRecitals}</p>
              </div>
              <CalendarDays className="w-6 h-6 text-orange-600" />
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Repertorio</p>
                <p className="text-2xl font-bold text-green-700">{stats.repertoireSize}</p>
              </div>
              <Disc3 className="w-6 h-6 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {([
            ['instruments', 'Instrumentos'],
            ['ensembles',   'Agrupaciones'],
            ['repertoire',  'Repertorio'],
            ['recitals',    'Recitales'],
          ] as Array<[Tab, string]>).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Instrumentos */}
        {tab === 'instruments' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar instrumento, serial o marca..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InstrumentStatus | 'all')}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="all">Todos los estados</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-600">
                    <th className="py-2 px-3">Instrumento</th>
                    <th className="py-2 px-3">Familia</th>
                    <th className="py-2 px-3">Serial</th>
                    <th className="py-2 px-3">Marca</th>
                    <th className="py-2 px-3">Estado</th>
                    <th className="py-2 px-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstruments.map((i) => (
                    <tr key={i.id} className="border-b border-gray-100 hover:bg-purple-50">
                      <td className="py-2 px-3 font-medium text-gray-900">{i.name}</td>
                      <td className="py-2 px-3 text-gray-700">{i.family}</td>
                      <td className="py-2 px-3 text-gray-700">{i.serial}</td>
                      <td className="py-2 px-3 text-gray-700">{i.brand ?? '—'}</td>
                      <td className="py-2 px-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLOR[i.status]}`}>
                          {STATUS_LABEL[i.status]}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => setDeleteTarget({ kind: 'instruments', id: i.id })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInstruments.length === 0 && (
                    <tr><td colSpan={6} className="py-6 px-3 text-center text-gray-500">
                      No se encontraron instrumentos con los filtros actuales.
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Agrupaciones */}
        {tab === 'ensembles' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ensembles.map((e) => (
                <div key={e.id} className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-purple-50">
                  <p className="text-xs font-semibold text-purple-700 uppercase">{e.type}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{e.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Director: {getUserName(e.directorId === '1' ? '3' : '4')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {DAY_LABELS[e.rehearsalDay as DayOfWeek]} · {e.rehearsalStart} - {e.rehearsalEnd}
                  </p>
                  <p className="text-sm text-gray-600">Sala: {e.rehearsalRoom}</p>
                  <p className="text-xs text-gray-500 mt-2">{e.memberIds.length} integrantes</p>
                  {e.description && <p className="text-xs text-gray-600 italic mt-2">{e.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="destructive"
                      onClick={() => setDeleteTarget({ kind: 'ensembles', id: e.id })}>
                      <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              ))}
              {ensembles.length === 0 && (
                <p className="text-center text-gray-500 col-span-2 py-6">Sin agrupaciones registradas.</p>
              )}
            </div>
          </Card>
        )}

        {/* Repertorio */}
        {tab === 'repertoire' && (
          <Card className="p-6 border-0 shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="py-2 px-3">Obra</th>
                  <th className="py-2 px-3">Compositor</th>
                  <th className="py-2 px-3">Duración</th>
                  <th className="py-2 px-3">Dificultad</th>
                  <th className="py-2 px-3">Agrupación</th>
                  <th className="py-2 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {repertoire.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-purple-50">
                    <td className="py-2 px-3 font-medium text-gray-900 flex items-center gap-2">
                      <Disc3 className="w-3 h-3 text-purple-500" />
                      {p.title}
                    </td>
                    <td className="py-2 px-3 text-gray-700">{p.composer}</td>
                    <td className="py-2 px-3 text-gray-700">{p.durationMin} min</td>
                    <td className="py-2 px-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        p.difficulty === 'Avanzado'   ? 'bg-red-100 text-red-700'
                      : p.difficulty === 'Intermedio' ? 'bg-orange-100 text-orange-700'
                                                      : 'bg-green-100 text-green-700'
                      }`}>{p.difficulty}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-700">{ensembleName(p.ensembleId)}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => setDeleteTarget({ kind: 'repertoire', id: p.id })}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {repertoire.length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-gray-500">Sin obras registradas.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {/* Recitales */}
        {tab === 'recitals' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="space-y-3">
              {[...recitals]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((r) => (
                  <div key={r.id} className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-orange-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-orange-600" />
                          {r.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {ensembleName(r.ensembleId)} · {r.venue}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{r.pieceIds.length} obras en programa</p>
                        {r.description && <p className="text-xs text-gray-600 italic mt-1">{r.description}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          r.status === 'scheduled' ? 'bg-orange-100 text-orange-700'
                        : r.status === 'completed' ? 'bg-green-100 text-green-700'
                                                   : 'bg-gray-100 text-gray-700'
                        }`}>
                          {r.status === 'scheduled' ? 'Programado'
                          : r.status === 'completed' ? 'Realizado' : 'Cancelado'}
                        </span>
                        <div className="mt-2">
                          <Button size="sm" variant="destructive"
                            onClick={() => setDeleteTarget({ kind: 'recitals', id: r.id })}>
                            <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {recitals.length === 0 && (
                <p className="text-center text-gray-500 py-6">Sin recitales programados.</p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Dialog dinámico según pestaña */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {tab === 'instruments' ? 'Nuevo instrumento'
              : tab === 'ensembles'   ? 'Nueva agrupación'
              : tab === 'repertoire'  ? 'Nueva obra'
                                      : 'Nuevo recital'}
            </DialogTitle>
            <DialogDescription>Completa los campos para registrar el elemento.</DialogDescription>
          </DialogHeader>

          {tab === 'instruments' && (
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input value={instForm.name}
                onChange={(e) => setInstForm({ ...instForm, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Serial</Label><Input value={instForm.serial}
                  onChange={(e) => setInstForm({ ...instForm, serial: e.target.value })} /></div>
                <div><Label>Marca</Label><Input value={instForm.brand}
                  onChange={(e) => setInstForm({ ...instForm, brand: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Familia</Label>
                  <select value={instForm.family}
                    onChange={(e) => setInstForm({ ...instForm, family: e.target.value as InstrumentFamily })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {FAMILIAS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <select value={instForm.status}
                    onChange={(e) => setInstForm({ ...instForm, status: e.target.value as InstrumentStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Notas</Label><Textarea value={instForm.notes} rows={2}
                onChange={(e) => setInstForm({ ...instForm, notes: e.target.value })} /></div>
            </div>
          )}

          {tab === 'ensembles' && (
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input value={ensForm.name}
                onChange={(e) => setEnsForm({ ...ensForm, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Tipo</Label>
                  <select value={ensForm.type}
                    onChange={(e) => setEnsForm({ ...ensForm, type: e.target.value as EnsembleType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {TIPOS_ENSEMBLE.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Día de ensayo</Label>
                  <select value={ensForm.rehearsalDay}
                    onChange={(e) => setEnsForm({ ...ensForm, rehearsalDay: e.target.value as DayOfWeek })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {DIAS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div><Label>Inicio</Label><Input type="time" value={ensForm.rehearsalStart}
                  onChange={(e) => setEnsForm({ ...ensForm, rehearsalStart: e.target.value })} /></div>
                <div><Label>Fin</Label><Input type="time" value={ensForm.rehearsalEnd}
                  onChange={(e) => setEnsForm({ ...ensForm, rehearsalEnd: e.target.value })} /></div>
                <div><Label>Sala</Label><Input value={ensForm.rehearsalRoom}
                  onChange={(e) => setEnsForm({ ...ensForm, rehearsalRoom: e.target.value })} /></div>
              </div>
              <div><Label>Descripción</Label><Textarea value={ensForm.description} rows={2}
                onChange={(e) => setEnsForm({ ...ensForm, description: e.target.value })} /></div>
            </div>
          )}

          {tab === 'repertoire' && (
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={pieceForm.title}
                onChange={(e) => setPieceForm({ ...pieceForm, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Compositor</Label><Input value={pieceForm.composer}
                  onChange={(e) => setPieceForm({ ...pieceForm, composer: e.target.value })} /></div>
                <div><Label>Duración (min)</Label><Input type="number" min={1} value={pieceForm.durationMin}
                  onChange={(e) => setPieceForm({ ...pieceForm, durationMin: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Dificultad</Label>
                  <select value={pieceForm.difficulty}
                    onChange={(e) => setPieceForm({ ...pieceForm, difficulty: e.target.value as PieceDifficulty })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {DIFICULTADES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Agrupación</Label>
                  <select value={pieceForm.ensembleId}
                    onChange={(e) => setPieceForm({ ...pieceForm, ensembleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sin asignar</option>
                    {ensembles.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Notas</Label><Textarea value={pieceForm.notes} rows={2}
                onChange={(e) => setPieceForm({ ...pieceForm, notes: e.target.value })} /></div>
            </div>
          )}

          {tab === 'recitals' && (
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={recForm.title}
                onChange={(e) => setRecForm({ ...recForm, title: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Fecha</Label><Input type="date" value={recForm.date}
                  onChange={(e) => setRecForm({ ...recForm, date: e.target.value })} /></div>
                <div><Label>Lugar</Label><Input value={recForm.venue}
                  onChange={(e) => setRecForm({ ...recForm, venue: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Agrupación</Label>
                  <select value={recForm.ensembleId}
                    onChange={(e) => setRecForm({ ...recForm, ensembleId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecciona...</option>
                    {ensembles.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <select value={recForm.status}
                    onChange={(e) => setRecForm({ ...recForm, status: e.target.value as RecitalStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="completed">Realizado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              <div><Label>Descripción</Label><Textarea value={recForm.description} rows={2}
                onChange={(e) => setRecForm({ ...recForm, description: e.target.value })} /></div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
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
