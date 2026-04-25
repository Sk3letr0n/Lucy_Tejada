/**
 * Pagina Home
 * Pagina de inicio que redirige segun el estado de autenticacion
 */

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirigir segun el rol del usuario
        switch (user.role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}
