/**
 * Navbar - Barra de navegacion superior
 * Muestra informacion del usuario, notificaciones y opciones de cuenta
 * 
 * Diseno: Moderno + Clasico (Educativo)
 * - Fondo: Blanco con sombra suave
 * - Colores: Azul academico, gris oscuro
 * - Efectos: Transiciones fluidas, hover effects
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface NavbarProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export default function Navbar({ onMenuToggle, isMobileMenuOpen = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesion cerrada correctamente');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      student: 'Alumno',
      teacher: 'Docente',
      admin: 'Administrador',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      student: 'bg-blue-100 text-blue-800',
      teacher: 'bg-green-100 text-green-800',
      admin: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y titulo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LC</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Lucy Tejada</h1>
            </div>
          </div>

          {/* Opciones derechas */}
          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user?.role || '')}`}>
                    {getRoleLabel(user?.role || '')}
                  </p>
                </div>
              </button>

              {/* Dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesion
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
