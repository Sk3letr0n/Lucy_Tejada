/**
 * NotificationsContext — Notificaciones en la app.
 *
 * Mantiene una lista de notificaciones del usuario (mensajes, recordatorios,
 * eventos del sistema) y expone funciones para marcarlas como leídas y agregar
 * notificaciones nuevas desde cualquier parte de la app.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id:        string;
  title:     string;
  message:   string;
  type:      NotificationType;
  timestamp: Date;
  read:      boolean;
  link?:     string;
}

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount:   number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead:    (id: string) => void;
  markAllAsRead: () => void;
  remove:        (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const NOTIFICACIONES_INICIALES: AppNotification[] = [
  {
    id:        'n1',
    title:     'Nueva calificación registrada',
    message:   'El profesor Ricardo Arbeláez registró una nueva nota en Violín Técnico.',
    type:      'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read:      false,
  },
  {
    id:        'n2',
    title:     'Recordatorio de recital',
    message:   'El Concierto de Apertura está programado para el 01 de junio.',
    type:      'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read:      false,
  },
  {
    id:        'n3',
    title:     'Asistencia actualizada',
    message:   'Tu asistencia de la clase de Banda Sinfónica fue registrada.',
    type:      'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read:      true,
  },
];

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICACIONES_INICIALES);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const addNotification: NotificationsContextType['addNotification'] = useCallback((n) => {
    setNotifications((prev) => [
      { ...n, id: `n_${Date.now()}`, timestamp: new Date(), read: false },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, remove }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return ctx;
};
