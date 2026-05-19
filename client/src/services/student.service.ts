/**
 * student.service.ts — Servicio de estudiantes.
 *
 * Toma los datos del formulario y los despacha hacia el servidor en el puerto 8080.
 * Usa la instancia de Axios configurada en api.config.ts (JWT incluido automáticamente).
 *
 * Endpoints que usa:
 *   GET    /api/estudiantes               → listar todos
 *   POST   /api/estudiantes               → registrar nuevo estudiante
 *   DELETE /api/estudiantes/{id}          → eliminar
 *   GET    /api/certificados/estudiante/{id} → descargar PDF
 *   GET    /api/asistencias/estudiante/{id}  → asistencias del estudiante
 *   POST   /api/asistencias               → registrar asistencia
 */

import api from '@/lib/api.config';

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface EstudianteForm {
  nombre: string;
  email: string;
  programa: string;
}

export interface Estudiante extends EstudianteForm {
  id: number;
}

export interface AsistenciaForm {
  estudianteId: number;
  fecha: string;       // formato ISO: "2024-05-18"
  estado: 'presente' | 'ausente' | 'tarde';
  materia: string;
}

export interface Asistencia extends AsistenciaForm {
  id: number;
}

// ── Estudiantes ──────────────────────────────────────────────────────────────

/** Obtiene la lista completa de estudiantes del servidor */
export const getEstudiantes = (): Promise<Estudiante[]> =>
  api.get<Estudiante[]>('/estudiantes').then((r) => r.data);

/**
 * Envía los datos del formulario al servidor para registrar un nuevo estudiante.
 * El servidor devuelve el objeto guardado con su id asignado.
 */
export const registrarEstudiante = (datos: EstudianteForm): Promise<Estudiante> =>
  api.post<Estudiante>('/estudiantes', datos).then((r) => r.data);

/** Elimina un estudiante por su id */
export const eliminarEstudiante = (id: number): Promise<void> =>
  api.delete(`/estudiantes/${id}`).then(() => undefined);

// ── Asistencia ───────────────────────────────────────────────────────────────

/** Lista todas las asistencias registradas para un estudiante */
export const getAsistencias = (estudianteId: number): Promise<Asistencia[]> =>
  api.get<Asistencia[]>(`/asistencias/estudiante/${estudianteId}`).then((r) => r.data);

/** Registra un registro de asistencia */
export const registrarAsistencia = (datos: AsistenciaForm): Promise<Asistencia> =>
  api.post<Asistencia>('/asistencias', datos).then((r) => r.data);

// ── Certificados ─────────────────────────────────────────────────────────────

/**
 * Solicita al servidor el PDF del certificado de matrícula del estudiante
 * y lo descarga automáticamente en el navegador.
 */
export const descargarCertificado = async (estudianteId: number): Promise<void> => {
  const response = await api.get(`/certificados/estudiante/${estudianteId}`, {
    responseType: 'blob',
  });

  const url  = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href     = url;
  link.download = `certificado_estudiante_${estudianteId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
