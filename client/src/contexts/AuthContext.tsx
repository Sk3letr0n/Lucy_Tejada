import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '@/lib/types';
import api from '@/lib/api.config';
import { getMockUserByEmail } from '@/lib/mockData';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Forma en la que el servidor responde a /api/auth/login y /api/auth/register
interface ServerAuthResponse {
  token:  string;
  id:     number;
  email:  string;
  nombre: string;
  rol:    string;
}

/** Convierte la respuesta del servidor al formato User que usa la app */
function serverResponseToUser(data: ServerAuthResponse): User {
  return {
    id:        String(data.id),
    email:     data.email,
    name:      data.nombre,
    role:      data.rol as User['role'],
    createdAt: new Date(),
  };
}

/**
 * Intenta login contra el servidor real.
 * Si el servidor no está disponible (error de red), usa los datos mock locales.
 * Si el servidor responde 401, lanza error de credenciales inválidas.
 */
async function attemptLogin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  try {
    const { data } = await api.post<ServerAuthResponse>('/auth/login', credentials);
    return { user: serverResponseToUser(data), token: data.token };
  } catch (error: unknown) {
    const hasResponse = !!(error as { response?: unknown })?.response;

    // Si el servidor respondió con 401 → credenciales inválidas (no hay fallback)
    if (hasResponse) {
      throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    }

    // Si no hay respuesta → servidor no disponible, usar mock local
    console.warn('[Auth] Servidor no disponible, usando datos locales de desarrollo.');
    const mockUser = getMockUserByEmail(credentials.email);
    if (!mockUser || credentials.password !== 'password') {
      throw new Error('Credenciales inválidas.');
    }
    const token = `mock_token_${mockUser.id}_${Date.now()}`;
    return { user: mockUser, token };
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user:            null,
    token:           null,
    isAuthenticated: false,
    isLoading:       true,
    error:           null,
  });

  // Siempre limpiar la sesión al cargar la página (login requerido en cada visita)
  useEffect(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  }, []);

  /** LOGIN — intenta el servidor real; si no responde, usa mock local */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, token } = await attemptLogin(credentials);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({ user, token, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Credenciales inválidas';
      setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: msg });
      throw new Error(msg);
    }
  };

  /** LOGOUT — borra la sesión local */
  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
  };

  /** REGISTER — llama a POST /api/auth/register en el servidor */
  const register = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data } = await api.post<ServerAuthResponse>('/auth/register', {
        email,
        password,
        nombre: name,
        rol: 'student',
      });
      const user = serverResponseToUser(data);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({ user, token: data.token, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: string } })?.response?.data ?? 'Error en el registro';
      setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false, error: String(msg) });
      throw new Error(String(msg));
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
