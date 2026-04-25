/**
 * AdminAudit - Pagina de auditoria para admin
 * Muestra registro de todos los cambios y accesos al sistema
 */

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Filter, Download } from 'lucide-react';
import { mockAuditLogs } from '@/lib/mockData';
import { toast } from 'sonner';

export default function AdminAudit() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const filteredLogs = selectedAction
    ? mockAuditLogs.filter(log => log.action === selectedAction)
    : mockAuditLogs;

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'bg-blue-100 text-blue-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-orange-100 text-orange-800',
      DELETE: 'bg-red-100 text-red-800',
      VIEW: 'bg-purple-100 text-purple-800',
      EXPORT: 'bg-indigo-100 text-indigo-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getResourceColor = (resource: string) => {
    const colors: Record<string, string> = {
      Authentication: 'bg-blue-50',
      Grade: 'bg-green-50',
      Attendance: 'bg-orange-50',
      Student: 'bg-purple-50',
      Schedule: 'bg-indigo-50',
    };
    return colors[resource] || 'bg-gray-50';
  };

  const handleExportLogs = () => {
    toast.success('Descargando logs de auditoria...');
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registro de Auditoria</h1>
            <p className="text-gray-600 mt-2">Historial de cambios y accesos al sistema</p>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Filtros */}
        <Card className="p-4 border-0 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filtrar por accion:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAction(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedAction === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas
            </button>
            {['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'].map((action) => (
              <button
                key={action}
                onClick={() => setSelectedAction(action)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedAction === action
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </Card>

        {/* Tabla de logs */}
        <Card className="p-6 border-0 shadow-md overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eventos Registrados</h2>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border border-gray-200 ${getResourceColor(log.resource)} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{log.resource}</span>
                      {log.resourceId && (
                        <span className="text-xs text-gray-600">ID: {log.resourceId}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">{log.userName}</span> realizo esta accion
                    </p>
                    {log.changes && (
                      <div className="text-xs text-gray-600 bg-white/50 p-2 rounded">
                        <p className="font-mono">
                          {JSON.stringify(log.changes).substring(0, 100)}...
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-600 font-medium">
                      {new Date(log.timestamp).toLocaleDateString('es-ES')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                    </p>
                    {log.ipAddress && (
                      <p className="text-xs text-gray-500 mt-1">{log.ipAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Estadisticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total de Eventos</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{mockAuditLogs.length}</p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <p className="text-sm text-gray-600 font-medium">Logins</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {mockAuditLogs.filter(l => l.action === 'LOGIN').length}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <p className="text-sm text-gray-600 font-medium">Cambios</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {mockAuditLogs.filter(l => ['CREATE', 'UPDATE', 'DELETE'].includes(l.action)).length}
            </p>
          </Card>

          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <p className="text-sm text-gray-600 font-medium">Usuarios Activos</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {new Set(mockAuditLogs.map(l => l.userId)).size}
            </p>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
