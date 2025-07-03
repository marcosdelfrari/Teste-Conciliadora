"use client";

import React, { useState } from "react";
import { Car, Users, Menu, X } from "lucide-react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo e título */}
            <div className="flex items-center">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">Sistema de Cadastro</span>
                <span className="sm:hidden">Sistema</span>
              </h1>
            </div>

            {/* Menu desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/clientes"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Users className="h-4 w-4 mr-1" />
                Clientes
              </Link>
              <Link
                href="/veiculos"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                <Car className="h-4 w-4 mr-1" />
                Veículos
              </Link>
            </nav>

            {/* Botão do menu mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/clientes"
                  onClick={closeMenu}
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors flex items-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Clientes
                </Link>
                <Link
                  href="/veiculos"
                  onClick={closeMenu}
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-3 rounded-md text-base font-medium transition-colors flex items-center"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Veículos
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
