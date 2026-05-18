/**
 * TeacherMusic - Vista del módulo de Música para docentes
 * Gestiona las agrupaciones que dirige, su repertorio y los próximos recitales.
 */

import React, { useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Music2,
  Users,
  CalendarDays,
  Disc3,
  Plus,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  getEnsemblesByDirector,
  getRepertoireByEnsemble,
  getRepertoireByTeacher,
  mockRecitals,
  mockTeachers,
  mockUsers,
} from '@/lib/mockData';
import { DAY_LABELS, DayOfWeek } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function TeacherMusic() {
  const { user } = useAuth();
  const teacher =
    mockTeachers.find((t) => t.userId === user?.id) ?? mockTeachers[0];
  const teacherId = teacher.id;

  const ensembles = getEnsemblesByDirector(teacherId);
  const teacherRepertoire = getRepertoireByTeacher(teacherId);

  const ensembleIds = useMemo(() => new Set(ensembles.map((e) => e.id)), [ensembles]);
  const recitals = useMemo(
    () => mockRecitals.filter((r) => ensembleIds.has(r.ensembleId)),
    [ensembleIds]
  );

  const [selectedEnsemble, setSelectedEnsemble] = useState<string | null>(
    ensembles[0]?.id ?? null
  );

  const handleAssignPiece = () =>
    toast.success('Apertura del formulario para asignar nueva obra...');
  const handleScheduleRecital = () =>
    toast.success('Apertura del formulario de programación de recital...');

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Módulo de Música
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona tus agrupaciones, repertorio y recitales programados.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAssignPiece}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-1" /> Asignar obra
            </Button>
            <Button
              onClick={handleScheduleRecital}
              variant="secondary"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <CalendarDays className="w-4 h-4 mr-1" /> Programar recital
            </Button>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Agrupaciones a cargo</p>
            <p className="text-3xl font-bold text-purple-700 mt-2">
              {ensembles.length}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Obras asignadas</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">
              {teacherRepertoire.length}
            </p>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Recitales en agenda</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">
              {recitals.length}
            </p>
          </Card>
        </div>

        {/* Selector de agrupación */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Agrupaciones
          </h2>
          {ensembles.length === 0 ? (
            <p className="text-gray-600">No diriges agrupaciones actualmente.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {ensembles.map((ensemble) => (
                  <button
                    key={ensemble.id}
                    onClick={() => setSelectedEnsemble(ensemble.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      selectedEnsemble === ensemble.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {ensemble.name}
                  </button>
                ))}
              </div>
              {ensembles
                .filter((e) => e.id === selectedEnsemble)
                .map((ensemble) => {
                  const pieces = getRepertoireByEnsemble(ensemble.id);
                  return (
                    <div key={ensemble.id} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          {DAY_LABELS[ensemble.rehearsalDay as DayOfWeek]} ·{' '}
                          {ensemble.rehearsalStart} - {ensemble.rehearsalEnd}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {ensemble.rehearsalRoom}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          {ensemble.memberIds.length} integrantes
                        </div>
                      </div>
                      {ensemble.description && (
                        <p className="text-sm text-gray-600 italic">
                          {ensemble.description}
                        </p>
                      )}

                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-2">
                          Repertorio asignado
                        </h3>
                        {pieces.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            Sin obras asignadas a esta agrupación.
                          </p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-200 text-left text-gray-600">
                                <th className="py-2 px-2">Obra</th>
                                <th className="py-2 px-2">Compositor</th>
                                <th className="py-2 px-2">Duración</th>
                                <th className="py-2 px-2">Dificultad</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pieces.map((piece) => (
                                <tr
                                  key={piece.id}
                                  className="border-b border-gray-100 hover:bg-purple-50"
                                >
                                  <td className="py-2 px-2 font-medium text-gray-900 flex items-center gap-2">
                                    <Disc3 className="w-3 h-3 text-purple-500" />
                                    {piece.title}
                                  </td>
                                  <td className="py-2 px-2 text-gray-700">
                                    {piece.composer}
                                  </td>
                                  <td className="py-2 px-2 text-gray-700">
                                    {piece.durationMin} min
                                  </td>
                                  <td className="py-2 px-2">
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
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </Card>

        {/* Recitales */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-orange-600" /> Recitales de mis
            agrupaciones
          </h2>
          {recitals.length === 0 ? (
            <p className="text-gray-600">No hay recitales programados.</p>
          ) : (
            <div className="space-y-3">
              {recitals
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((recital) => {
                  const ensemble = ensembles.find(
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
                            <Music2 className="w-4 h-4 text-orange-600" />
                            {recital.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {ensemble?.name} · {recital.venue}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {recital.pieceIds.length} obras en programa
                          </p>
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
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
