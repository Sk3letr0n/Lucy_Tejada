/**
 * Contexto de Autenticación
 * Gestiona el estado global de autenticación y usuario
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '@/lib/types';
import { getMockUserByEmail, mockUsers } from '@/lib/mockData';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Buscar usuario en datos mock
      const user = getMockUserByEmail(credentials.email);

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token simulado
      const token = `token_${user.id}_${Date.now()}`;

      // Guardar en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const register = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verificar que el email no exista
      if (getMockUserByEmail(email)) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario (simulado)
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: 'student',
        createdAt: new Date(),
      };

      // Generar token
      const token = `token_${newUser.id}_${Date.now()}`;

      // Guardar en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      setAuthState({
        user: newUser,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    isAuthenticated: authState.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
