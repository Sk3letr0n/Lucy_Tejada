/**
 * TeacherSchedule - Pagina de horario para docentes
 * Muestra el horario de clases del docente
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, Users } from 'lucide-react';
import { getTeacherSchedules } from '@/lib/mockData';
import { DAYS_OF_WEEK } from '@/lib/constants';

export default function TeacherSchedule() {
  const teacherId = '1';
  const schedules = getTeacherSchedules(teacherId);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daySchedules = schedules.filter(s => s.day === selectedDay);

  const getDayLabel = (day: string): string => {
    const labels: Record<string, string> = {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miercoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
    };
    return labels[day] || day;
  };

  const getSubjectColor = (index: number): string => {
    const colors = [
      'from-blue-50 to-blue-100 border-l-4 border-blue-600',
      'from-green-50 to-green-100 border-l-4 border-green-600',
      'from-orange-50 to-orange-100 border-l-4 border-orange-600',
      'from-purple-50 to-purple-100 border-l-4 border-purple-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Horario</h1>
          <p className="text-gray-600 mt-2">Clases programadas de la semana</p>
        </div>

        {/* Selector de dias */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getDayLabel(day)}
            </button>
          ))}
        </div>

        {/* Horario del dia */}
        <div className="space-y-4">
          {daySchedules.length > 0 ? (
            daySchedules
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((schedule, index) => (
                <Card
                  key={schedule.id}
                  className={`p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br ${getSubjectColor(index)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{schedule.subjectName}</h3>
                      <p className="text-sm text-gray-600 mt-1">Codigo: {schedule.subjectName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hora */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Hora</p>
                        <p className="text-lg font-bold text-gray-900">
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Aula */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Aula</p>
                        <p className="text-lg font-bold text-gray-900">{schedule.classroom}</p>
                      </div>
                    </div>

                    {/* Estudiantes */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/50 rounded-lg">
                        <Users className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Estudiantes</p>
                        <p className="text-lg font-bold text-gray-900">22 / 30</p>
                      </div>
                    </div>
                  </div>

                  {/* Capacidad */}
                  {schedule.capacity && (
                    <div className="mt-4 pt-4 border-t border-gray-300/30">
                      <p className="text-xs text-gray-600 font-medium mb-2">Ocupacion del aula</p>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                          style={{ width: '73%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">22 / 30 asientos ocupados</p>
                    </div>
                  )}
                </Card>
              ))
          ) : (
            <Card className="p-8 border-0 shadow-md text-center">
              <p className="text-gray-600">No hay clases programadas para {getDayLabel(selectedDay)}</p>
            </Card>
          )}
        </div>

        {/* Resumen semanal */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen Semanal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Clases</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{schedules.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Horas de Clase</p>
              <p className="text-2xl font-bold text-green-600 mt-2">10</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Asignaturas</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">
                {new Set(schedules.map(s => s.subjectId)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
