"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Users, Car, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { clienteService } from "@/services/clienteService";
import { veiculoService } from "@/services/veiculoService";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalVeiculos: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientes, veiculos] = await Promise.all([
          clienteService.getAll(),
          veiculoService.getAll(),
        ]);

        setStats({
          totalClientes: clientes.length,
          totalVeiculos: veiculos.length,
          loading: false,
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie clientes e seus veículos de forma simples
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Clientes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "Carregando..." : stats.totalClientes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/clientes"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Ver todos os clientes
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Car className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Veículos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading ? "Carregando..." : stats.totalVeiculos}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/veiculos"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Ver todos os veículos
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Média de Veículos/Cliente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.loading
                        ? "Carregando..."
                        : stats.totalClientes > 0
                        ? (stats.totalVeiculos / stats.totalClientes).toFixed(1)
                        : "0"}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="font-medium text-purple-600">
                  Estatística geral
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/clientes/novo"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                    <Plus className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Novo Cliente
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Cadastre um novo cliente no sistema
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586l-4.293 4.293Z" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/veiculos/novo"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                    <Plus className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Novo Veículo
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Associe um novo veículo a um cliente
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586l-4.293 4.293Z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
