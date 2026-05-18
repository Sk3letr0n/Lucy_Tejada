/**
 * Sidebar - Barra lateral de navegacion
 * Menu de navegacion segun el rol del usuario
 * 
 * Diseno: Moderno + Clasico (Educativo)
 * - Fondo: Azul muy oscuro (#0f172a)
 * - Texto: Blanco/Azul claro
 * - Efectos: Hover effects, transiciones suaves
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Users,
  Clock,
  FileText,
  ClipboardList,
  Settings,
  ChevronRight,
  Music2,
} from 'lucide-react';

import { ROLE_LABELS, UserRole } from '@/lib/constants';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  const getMenuItems = (): MenuItem[] => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/student/dashboard' },
          { label: 'Mis Notas', icon: <BookOpen className="w-5 h-5" />, path: '/student/grades' },
          { label: 'Progreso Academico', icon: <BarChart3 className="w-5 h-5" />, path: '/student/progress' },
          { label: 'Horario', icon: <Clock className="w-5 h-5" />, path: '/student/schedule' },
          { label: 'Música', icon: <Music2 className="w-5 h-5" />, path: '/student/music' },
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/teacher/dashboard' },
          { label: 'Calificaciones', icon: <BookOpen className="w-5 h-5" />, path: '/teacher/grades' },
          { label: 'Asistencia', icon: <ClipboardList className="w-5 h-5" />, path: '/teacher/attendance' },
          { label: 'Estadisticas', icon: <BarChart3 className="w-5 h-5" />, path: '/teacher/analytics' },
          { label: 'Reportes', icon: <FileText className="w-5 h-5" />, path: '/teacher/reports' },
          { label: 'Horario', icon: <Clock className="w-5 h-5" />, path: '/teacher/schedule' },
          { label: 'Música', icon: <Music2 className="w-5 h-5" />, path: '/teacher/music' },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
          { label: 'Estudiantes', icon: <Users className="w-5 h-5" />, path: '/admin/students' },
          { label: 'Docentes', icon: <Users className="w-5 h-5" />, path: '/admin/teachers' },
          { label: 'Asignaturas', icon: <BookOpen className="w-5 h-5" />, path: '/admin/subjects' },
          { label: 'Horarios', icon: <Clock className="w-5 h-5" />, path: '/admin/schedule' },
          { label: 'Música', icon: <Music2 className="w-5 h-5" />, path: '/admin/music' },
          { label: 'Reportes', icon: <FileText className="w-5 h-5" />, path: '/admin/reports' },
          { label: 'Auditoria', icon: <ClipboardList className="w-5 h-5" />, path: '/admin/audit' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => location === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-gradient-to-b from-sidebar to-sidebar border-r border-sidebar-border transition-all duration-300 z-40 overflow-y-auto pt-20 lg:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Logo en sidebar (solo mobile) */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">LC</span>
              </div>
              <div>
                <p className="text-sm font-bold text-sidebar-foreground">Lucy</p>
                <p className="text-xs text-sidebar-foreground/70">Tejada</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
                }`}
              >
                <span className={`${isActive(item.path) ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive(item.path) && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-6 h-px bg-sidebar-border"></div>

          {/* Footer Menu */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all duration-200">
              <Settings className="w-5 h-5 text-sidebar-foreground/70" />
              <span className="flex-1 text-left text-sm font-medium">Configuracion</span>
            </button>
          </nav>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-sidebar-accent/20 border border-sidebar-accent rounded-lg">
            <p className="text-xs text-sidebar-foreground/80 font-medium mb-2">Rol Actual</p>
            <p className="text-sm font-bold text-sidebar-accent-foreground capitalize">
              {user?.role ? ROLE_LABELS[user.role as UserRole] ?? user.role : 'Invitado'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
