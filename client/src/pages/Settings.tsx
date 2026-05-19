/**
 * Settings.tsx — Página de configuración del usuario.
 * Permite cambiar tema, idioma y preferencias de notificaciones.
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, Bell, Mail, Globe, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { notifications, remove, markAllAsRead } = useNotifications();
  const [emailAlerts,   setEmailAlerts]   = useState(true);
  const [pushAlerts,    setPushAlerts]    = useState(true);
  const [idioma,        setIdioma]        = useState<'es' | 'en'>('es');

  const aplicarTema = (nuevo: 'light' | 'dark') => {
    setTheme(nuevo);
    toast.success(`Tema cambiado a ${nuevo === 'light' ? 'claro' : 'oscuro'}`);
  };

  const limpiarNotificaciones = () => {
    notifications.forEach((n) => remove(n.id));
    toast.success('Notificaciones eliminadas');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">Personaliza la aplicación a tu gusto</p>
        </div>

        {/* Apariencia */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Apariencia</h3>
          <Label className="mb-2 block">Tema de la interfaz</Label>
          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => aplicarTema('light')}
              className="flex items-center gap-2"
            >
              <Sun className="w-4 h-4" /> Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => aplicarTema('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="w-4 h-4" /> Oscuro
            </Button>
          </div>
        </Card>

        {/* Idioma */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" /> Idioma
          </h3>
          <select
            value={idioma}
            onChange={(e) => {
              setIdioma(e.target.value as 'es' | 'en');
              toast.success('Preferencia de idioma guardada');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </Card>

        {/* Notificaciones */}
        <Card className="p-6 border-0 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Preferencias de notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-600" />
                <Label>Notificaciones push</Label>
              </div>
              <Switch checked={pushAlerts} onCheckedChange={(v) => {
                setPushAlerts(v);
                toast.success(`Notificaciones push ${v ? 'activadas' : 'desactivadas'}`);
              }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <Label>Alertas por correo</Label>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={(v) => {
                setEmailAlerts(v);
                toast.success(`Alertas por correo ${v ? 'activadas' : 'desactivadas'}`);
              }} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => {
              markAllAsRead();
              toast.success('Todas las notificaciones marcadas como leídas');
            }}>
              Marcar todas como leídas
            </Button>
            <Button
              variant="outline"
              onClick={limpiarNotificaciones}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar todas
            </Button>
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
