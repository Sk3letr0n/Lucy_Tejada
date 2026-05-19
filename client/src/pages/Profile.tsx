/**
 * Profile.tsx — Página de perfil del usuario.
 * Muestra los datos del usuario autenticado y permite editarlos localmente.
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Mail, Shield, Save, KeyRound } from 'lucide-react';
import { ROLE_LABELS, UserRole } from '@/lib/constants';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(user?.name ?? '');
  const [email,  setEmail]  = useState(user?.email ?? '');

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    // Actualiza el usuario en localStorage para persistir entre recargas
    const stored = localStorage.getItem('user');
    if (stored) {
      const data = JSON.parse(stored);
      localStorage.setItem('user', JSON.stringify({ ...data, name: nombre, email }));
    }
    toast.success('Perfil actualizado correctamente');
  };

  const handleCambiarPassword = () => {
    toast.info('Funcionalidad de cambio de contraseña próximamente disponible.');
  };

  const rolLabel = user?.role ? ROLE_LABELS[user.role as UserRole] ?? user.role : '';

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto space-y-6">
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-2">Gestiona la información de tu cuenta</p>
          </div>

          {/* Tarjeta de avatar */}
          <Card className="p-6 border-0 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {nombre.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{nombre || 'Usuario'}</h2>
                <p className="text-sm text-gray-600">{email}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  {rolLabel}
                </span>
              </div>
            </div>
          </Card>

          {/* Formulario de información */}
          <Card className="p-6 border-0 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información personal</h3>
            <form onSubmit={handleGuardar} className="space-y-4">
              <div>
                <Label htmlFor="nombre" className="flex items-center gap-1 mb-1">
                  <UserIcon className="w-4 h-4" /> Nombre completo
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center gap-1 mb-1">
                  <Mail className="w-4 h-4" /> Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </form>
          </Card>

          {/* Seguridad */}
          <Card className="p-6 border-0 shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Seguridad</h3>
            <Button
              variant="outline"
              onClick={handleCambiarPassword}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Cambiar contraseña
            </Button>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
