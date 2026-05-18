/**
 * StudentMusic - Vista del módulo de Música para estudiantes
 * Muestra agrupaciones a las que pertenece, instrumento prestado,
 * repertorio asignado y próximos recitales.
 */

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Music2, Users, CalendarDays, MapPin, Clock, Disc3 } from 'lucide-react';
import {
  getEnsemblesForStudent,
  getInstrumentLoanedToStudent,
  getRecitalsForStudent,
  getRepertoireByEnsemble,
  mockStudents,
  mockUsers,
} from '@/lib/mockData';
import { DAY_LABELS, DayOfWeek } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentMusic() {
  const { user } = useAuth();
  const student = mockStudents.find((s) => s.userId === user?.id) ?? mockStudents[0];
  const studentId = student.id;

  const ensembles = getEnsemblesForStudent(studentId);
  const loanedInstruments = getInstrumentLoanedToStudent(studentId);
  const recitals = getRecitalsForStudent(studentId);

  const getDirectorName = (directorId: string) =>
    mockUsers.find((u) => u.id === directorId)?.name ??
    `Docente ${directorId}`;

  return (
    <ProtectedRoute requiredRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Vida Musical</h1>
          <p className="text-gray-600 mt-2">
            Tus agrupaciones, repertorio asignado y próximos conciertos.
          </p>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Agrupaciones</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {ensembles.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Instrumentos en préstamo
                </p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {loanedInstruments.length}
                </p>
              </div>
              <Music2 className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Recitales</p>
                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {recitals.length}
                </p>
              </div>
              <CalendarDays className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Agrupaciones */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Mis Agrupaciones
          </h2>
          {ensembles.length === 0 ? (
            <p className="text-gray-600">Aún no estás inscrito en ninguna agrupación.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ensembles.map((ensemble) => {
                const repertoire = getRepertoireByEnsemble(ensemble.id);
                return (
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
                      Director: {getDirectorName(ensemble.directorId)}
                    </p>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {DAY_LABELS[ensemble.rehearsalDay as DayOfWeek]} ·{' '}
                        {ensemble.rehearsalStart} - {ensemble.rehearsalEnd}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {ensemble.rehearsalRoom}
                      </div>
                    </div>
                    {repertoire.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Repertorio actual
                        </p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {repertoire.map((piece) => (
                            <li key={piece.id} className="flex items-center gap-2">
                              <Disc3 className="w-3 h-3 text-purple-500" />
                              <span className="font-medium">{piece.title}</span>
                              <span className="text-gray-500">— {piece.composer}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Instrumento prestado */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-blue-600" /> Instrumentos asignados
          </h2>
          {loanedInstruments.length === 0 ? (
            <p className="text-gray-600">
              No tienes instrumentos del instituto en préstamo actualmente.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loanedInstruments.map((inst) => (
                <div
                  key={inst.id}
                  className="p-4 rounded-lg border border-blue-200 bg-blue-50"
                >
                  <p className="text-xs font-semibold text-blue-700 uppercase">
                    {inst.family}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">
                    {inst.name}
                  </h3>
                  <p className="text-sm text-gray-600">Marca: {inst.brand ?? '—'}</p>
                  <p className="text-xs text-gray-500 mt-2">Serial: {inst.serial}</p>
                  {inst.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">{inst.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recitales */}
        <Card className="p-6 border-0 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-orange-600" /> Próximos recitales
          </h2>
          {recitals.length === 0 ? (
            <p className="text-gray-600">No tienes recitales programados.</p>
          ) : (
            <div className="space-y-3">
              {recitals.map((recital) => (
                <div
                  key={recital.id}
                  className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {recital.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {recital.venue}
                      </p>
                      {recital.description && (
                        <p className="text-xs text-gray-500 mt-1">
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
              ))}
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
