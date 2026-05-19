/**
 * MainLayout - Layout principal de la aplicacion
 * Envuelve Navbar, Sidebar y contenido principal
 * 
 * Diseno: Moderno + Clasico (Educativo)
 * - Estructura: Navbar fija + Sidebar + Contenido responsive
 * - Efectos: Transiciones suaves, animaciones
 */

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Navbar — ocupa su altura natural, no se mueve */}
      <Navbar
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />

      {/* Área bajo el navbar: sidebar siempre visible + contenido con scroll propio */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content — solo este panel hace scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
