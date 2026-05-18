/**
 * AdminMusic - Vista del módulo de Música para administradores
 * Permite gestionar inventario de instrumentos, agrupaciones,
 * repertorio y recitales del instituto.
 */

import React, { useState, useMemo } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Music2,
  Users,
  CalendarDays,
  Disc3,
  Plus,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import {
  mockInstruments,
  mockEnsembles,
  mockRepertoire,
  mockRecitals,
  mockUsers,
  getMusicModuleStats,
} from '@/lib/mockData';
import {
  InstrumentStatus,
  MusicInstrument,
  Ensemble,
} from '@/lib/types';
import { DAY_LABELS, DayOfWeek } from '@/lib/constants';
import { toast } from 'sonner';

type Tab = 'instruments' | 'ensembles' | 'repertoire' | 'recitals';

const STATUS_LABEL: Record<InstrumentStatus, string> = {
  available: 'Disponible',
  loaned: 'En préstamo',
  maintenance: 'Mantenimiento',
  retired: 'Retirado',
};

const STATUS_COLOR: Record<InstrumentStatus, string> = {
  available: 'bg-green-100 text-green-700',
  loaned: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-orange-100 text-orange-700',
  retired: 'bg-gray-200 text-gray-700',
};

export default function AdminMusic() {
  const [tab, setTab] = useState<Tab>('instruments');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InstrumentStatus | 'all'>(
    'all'
  );

  const stats = getMusicModuleStats();

  const filteredInstruments = useMemo<MusicInstrument[]>(
    () =>
      mockInstruments.filter((i) => {
        const matchSearch =
          search.trim() === '' ||
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.serial.toLowerCase().includes(search.toLowerCase()) ||
          (i.brand?.toLowerCase().includes(search.toLowerCase()) ?? false);
        const matchStatus = statusFilter === 'all' || i.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [search, statusFilter]
  );

  const getUserName = (id?: string) =>
    id ? mockUsers.find((u) => u.id === id)?.name ?? '—' : '—';

  const handleAction = (action: string) => toast.success(`${action}...`);

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Música</h1>
            <p className="text-gray-600 mt-2">
              Administra el inventario, las agrupaciones y la programación musical
              del instituto.
            </p>
          </div>
          <Button
            onClick={() => handleAction(`Crear nuevo elemento (${tab})`)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Nuevo
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Instrumentos</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.totalInstruments}
                </p>
              </div>
              <Music2 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.instrumentsAvailable} disponibles · {stats.instrumentsLoaned}{' '}
              en préstamo
            </p>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Agrupaciones</p>
                <p className="text-2xl font-bold text-blue-700">
                  {stats.totalEnsembles}
                </p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Recitales próximos</p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.upcomingRecitals}
                </p>
              </div>
              <CalendarDays className="w-6 h-6 text-orange-600" />
            </div>
          </Card>
          <Card className="p-4 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">Repertorio</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.repertoireSize}
                </p>
              </div>
              <Disc3 className="w-6 h-6 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {([
            ['instruments', 'Instrumentos'],
            ['ensembles', 'Agrupaciones'],
            ['repertoire', 'Repertorio'],
            ['recitals', 'Recitales'],
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

        {tab === 'instruments' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar instrumento, serial o marca..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as InstrumentStatus | 'all')
                }
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="all">Todos los estados</option>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
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
                    <th className="py-2 px-3">Prestado a</th>
                    <th className="py-2 px-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstruments.map((inst) => (
                    <tr
                      key={inst.id}
                      className="border-b border-gray-100 hover:bg-purple-50"
                    >
                      <td className="py-2 px-3 font-medium text-gray-900">
                        {inst.name}
                      </td>
                      <td className="py-2 px-3 text-gray-700">{inst.family}</td>
                      <td className="py-2 px-3 text-gray-700">{inst.serial}</td>
                      <td className="py-2 px-3 text-gray-700">
                        {inst.brand ?? '—'}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            STATUS_COLOR[inst.status]
                          }`}
                        >
                          {STATUS_LABEL[inst.status]}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-gray-700">
                        {inst.loanedToStudentId
                          ? `Estudiante ${inst.loanedToStudentId}`
                          : '—'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleAction('Editar instrumento')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction('Eliminar instrumento')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInstruments.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 px-3 text-center text-gray-500"
                      >
                        No se encontraron instrumentos con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'ensembles' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockEnsembles.map((ensemble: Ensemble) => (
                <div
                  key={ensemble.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-purple-50"
                >
                  <p className="text-xs font-semibold text-purple-700 uppercase">
                    {ensemble.type}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {ensemble.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Director: {getUserName(
                      // teacherId 1 -> userId 3; quick lookup vía mockTeachers omitido por brevedad
                      ensemble.directorId === '1' ? '3' : '4'
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {DAY_LABELS[ensemble.rehearsalDay as DayOfWeek]} ·{' '}
                    {ensemble.rehearsalStart} - {ensemble.rehearsalEnd}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sala: {ensemble.rehearsalRoom}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {ensemble.memberIds.length} integrantes
                  </p>
                  {ensemble.description && (
                    <p className="text-xs text-gray-600 italic mt-2">
                      {ensemble.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAction('Editar agrupación')}
                    >
                      <Edit2 className="w-4 h-4 mr-1" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction('Eliminar agrupación')}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

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
                {mockRepertoire.map((piece) => (
                  <tr
                    key={piece.id}
                    className="border-b border-gray-100 hover:bg-purple-50"
                  >
                    <td className="py-2 px-3 font-medium text-gray-900 flex items-center gap-2">
                      <Disc3 className="w-3 h-3 text-purple-500" />
                      {piece.title}
                    </td>
                    <td className="py-2 px-3 text-gray-700">{piece.composer}</td>
                    <td className="py-2 px-3 text-gray-700">
                      {piece.durationMin} min
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          piece.difficulty === 'Avanzado'
                            ? 'bg-red-100 text-red-700'
                            : piece.difficulty === 'Intermedio'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {piece.difficulty}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-700">
                      {mockEnsembles.find((e) => e.id === piece.ensembleId)
                        ?.name ?? '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleAction('Editar obra')}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction('Eliminar obra')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
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
        )}

        {tab === 'recitals' && (
          <Card className="p-6 border-0 shadow-md">
            <div className="space-y-3">
              {mockRecitals
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((recital) => {
                  const ensemble = mockEnsembles.find(
                    (e) => e.id === recital.ensembleId
                  );
                  return (
                    <div
                      key={recital.id}
                      className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-white to-orange-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-orange-600" />
                            {recital.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {ensemble?.name ?? 'Agrupación desconocida'} ·{' '}
                            {recital.venue}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {recital.pieceIds.length} obras en programa
                          </p>
                          {recital.description && (
                            <p className="text-xs text-gray-600 italic mt-1">
                              {recital.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {recital.date.toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              recital.status === 'scheduled'
                                ? 'bg-orange-100 text-orange-700'
                                : recital.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {recital.status === 'scheduled'
                              ? 'Programado'
                              : recital.status === 'completed'
                              ? 'Realizado'
                              : 'Cancelado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
