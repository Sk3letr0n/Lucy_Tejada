/**
 * Register.tsx — Formulario de registro de estudiantes.
 *
 * Captura lo que escribe el usuario (nombre, email, programa, contraseña)
 * y activa el servicio para guardar el estudiante en el servidor (puerto 8080).
 *
 * Flujo:
 *   1. El usuario llena el formulario y presiona "Registrarse"
 *   2. Se llama a AuthContext.register() → POST /api/auth/register → JWT guardado
 *   3. También se llama a registrarEstudiante() → POST /api/estudiantes → perfil creado
 *   4. Se redirige al dashboard del estudiante
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { registrarEstudiante } from '@/services/student.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const PROGRAMAS = [
  'Música',
  'Danza',
  'Teatro',
  'Artes Plásticas',
  'Canto',
];

export default function Register() {
  const [nombre,    setNombre]    = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [programa,  setPrograma]  = useState('');
  const [cargando,  setCargando]  = useState(false);

  const { register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password || !programa) {
      toast.error('Por favor completa todos los campos.');
      return;
    }
    if (password !== confirmar) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);
    try {
      // 1. Crea el usuario con credenciales (guarda el JWT automáticamente)
      await register(email, password, nombre);

      // 2. Crea el perfil de estudiante en la tabla de estudiantes
      await registrarEstudiante({ nombre, email, programa });

      toast.success('¡Registro exitoso! Bienvenido al instituto.');
      navigate('/');
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : 'Error en el registro';
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-12">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lucy Tejada</h1>
          <p className="text-gray-600 text-sm">Registro de Nuevo Estudiante</p>
        </div>

        {/* Formulario */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">Crear cuenta</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nombre completo */}
              <div className="space-y-1">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: María García López"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={cargando}
                  className="h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={cargando}
                  className="h-11"
                />
              </div>

              {/* Programa */}
              <div className="space-y-1">
                <Label htmlFor="programa" className="text-sm font-medium text-gray-700">
                  Programa de estudio
                </Label>
                <select
                  id="programa"
                  value={programa}
                  onChange={(e) => setPrograma(e.target.value)}
                  required
                  disabled={cargando}
                  className="w-full h-11 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                >
                  <option value="">Selecciona un programa...</option>
                  {PROGRAMAS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={cargando}
                  className="h-11"
                />
              </div>

              {/* Confirmar contraseña */}
              <div className="space-y-1">
                <Label htmlFor="confirmar" className="text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </Label>
                <Input
                  id="confirmar"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  disabled={cargando}
                  className="h-11"
                />
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                disabled={cargando}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base mt-2"
              >
                {cargando ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrarse'
                )}
              </Button>
            </form>

            {/* Enlace al login */}
            <p className="text-center text-sm text-gray-500 mt-6">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
