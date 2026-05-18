/**
 * Pagina de Login
 * Autenticacion de usuarios en el sistema
 * 
 * Diseno: Moderno + Clasico (Educativo)
 * - Colores: Azul academico, verde educativo, naranja motivador
 * - Efectos: Gradientes suaves, sombras, transiciones fluidas
 * - Tipografia: Poppins (body), Lora (headings)
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('juan@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success('Bienvenido! Iniciando sesion...');
      navigate('/');
    } catch (error) {
      toast.error('Credenciales invalidas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setIsLoading(true);

    try {
      await login({ email: demoEmail, password: 'password' });
      toast.success('Bienvenido! Iniciando sesion...');
      navigate('/');
    } catch (error) {
      toast.error('Error en el inicio de sesion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-12">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lucy Tejada</h1>
          <p className="text-gray-600 text-sm">Sistema de Gestion Academica</p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="p-8">
            {/* Titulo del formulario */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenido</h2>
            <p className="text-gray-600 text-sm mb-6">Inicia sesion con tu cuenta</p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electronico
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Contrasena */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contrasena
                </label>
                <Input
                  type="password"
                  placeholder="oooooooo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Boton Login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Iniciando sesion...
                  </>
                ) : (
                  'Iniciar Sesion'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 font-medium">O prueba con</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('juan@example.com')}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 disabled:opacity-50"
              >
                Alumno (Juan Perez)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('carlos@example.com')}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200 disabled:opacity-50"
              >
                Docente (Ricardo Arbeláez)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@example.com')}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200 disabled:opacity-50"
              >
                Admin (Administrador)
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium">Credenciales de prueba</p>
                <p className="text-xs text-blue-700 mt-1">Usa cualquiera de los botones de demostracion para probar el sistema.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          2024 Instituto Educativo. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
