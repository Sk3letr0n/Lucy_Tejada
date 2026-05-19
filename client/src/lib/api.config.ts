/**
 * api.config.ts — Motor central de peticiones HTTP.
 *
 * Crea una instancia de Axios apuntando a http://localhost:8080/api
 * y configura dos interceptores:
 *   1. REQUEST  → añade automáticamente el token JWT de localStorage en cada llamada
 *   2. RESPONSE → si el servidor responde 401, limpia la sesión y redirige al login
 */

import axios from 'axios';
import { environment } from '@/environments/environments';

const api = axios.create({
  baseURL: environment.apiUrl, // 'http://localhost:8080/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor de PETICIÓN ──────────────────────────────────────────────────
// Antes de enviar cualquier request, busca el token JWT en localStorage
// y lo añade al encabezado Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor de RESPUESTA ────────────────────────────────────────────────
// Si el servidor devuelve 401 (token vencido o inválido), limpia la sesión
// y redirige al usuario a la pantalla de login automáticamente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
