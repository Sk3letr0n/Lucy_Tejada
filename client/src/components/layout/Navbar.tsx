/**
 * Navbar - Barra de navegacion superior
 * Incluye notificaciones desplegables, menú de usuario con perfil/configuración/cierre de sesión.
 */

import React, { useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, AppNotification } from '@/contexts/NotificationsContext';
import {
  Bell, LogOut, User, Menu, X, Settings as SettingsIcon,
  Info, AlertTriangle, CheckCircle, XCircle, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface NavbarProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  student: 'Alumno',
  teacher: 'Docente',
  admin:   'Administrador',
};

const ROLE_COLORS: Record<string, string> = {
  student: 'bg-blue-100 text-blue-800',
  teacher: 'bg-green-100 text-green-800',
  admin:   'bg-orange-100 text-orange-800',
};

const NOTIF_ICONS: Record<AppNotification['type'], React.ReactNode> = {
  info:    <Info className="w-4 h-4 text-blue-600" />,
  success: <CheckCircle className="w-4 h-4 text-green-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-orange-600" />,
  error:   <XCircle className="w-4 h-4 text-red-600" />,
};

/** Devuelve un texto relativo simple ("hace 5 min", "hace 2 h", "ayer"). */
function tiempoRelativo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 1)   return 'Justo ahora';
  if (min < 60)  return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1)   return 'ayer';
  return `hace ${d} d`;
}

export default function Navbar({ onMenuToggle, isMobileMenuOpen = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove } = useNotifications();
  const [, navigate] = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotifOpen,    setIsNotifOpen]    = React.useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef    = useRef<HTMLDivElement>(null);

  // Cierra dropdowns al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const handleOpenProfile = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };

  const handleOpenSettings = () => {
    setIsUserMenuOpen(false);
    navigate('/settings');
  };

  const handleNotifClick = (n: AppNotification) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
      setIsNotifOpen(false);
    }
  };

  return (
    <nav className="flex-shrink-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-200" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Lucy Tejada</h1>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Notificaciones */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen((v) => !v)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          markAllAsRead();
                          toast.success('Notificaciones marcadas como leídas');
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`group px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleNotifClick(n)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{NOTIF_ICONS[n.type]}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm ${!n.read ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white`}>
                                  {n.title}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); remove(n.id); }}
                                  className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-600 transition"
                                  aria-label="Eliminar notificación"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{tiempoRelativo(n.timestamp)}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Menú de usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${ROLE_COLORS[user?.role || ''] || 'bg-gray-100 text-gray-800'}`}>
                    {ROLE_LABELS[user?.role || ''] || user?.role}
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleOpenProfile}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleOpenSettings}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Configuración
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
