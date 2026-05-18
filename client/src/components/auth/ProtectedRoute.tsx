/**
 * ProtectedRoute - Componente para proteger rutas
 * Verifica autenticacion y rol del usuario
 */

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  const roleAllowed = (() => {
    if (!requiredRole) return true;
    if (!user) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  })();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!roleAllowed) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, roleAllowed, navigate]);

  if (isLoading || !isAuthenticated || !roleAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
