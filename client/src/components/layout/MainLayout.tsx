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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
