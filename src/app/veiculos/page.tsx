"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Veiculo, Cliente } from "@/types";
import { veiculoService } from "@/services/veiculoService";
import { clienteService } from "@/services/clienteService";
import { Plus, Edit, Trash2, Car, User } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Record<number, Cliente>>({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [veiculosData, clientesData] = await Promise.all([
        veiculoService.getAll(),
        clienteService.getAll(),
      ]);

      setVeiculos(veiculosData);

      const clientesMap: Record<number, Cliente> = {};
      clientesData.forEach((cliente) => {
        if (cliente.id) {
          clientesMap[cliente.id] = cliente;
        }
      });
      setClientes(clientesMap);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recarrega dados quando a página ganha foco (usuário volta de outra página)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleDelete = async (veiculo: Veiculo) => {
    if (!veiculo.id) return;

    const cliente = veiculo.client_id ? clientes[veiculo.client_id] : null;
    if (
      !confirm(
        `Tem certeza que deseja excluir o veículo ${veiculo.plate} do cliente ${cliente?.name}?`
      )
    ) {
      return;
    }

    try {
      setDeleting(veiculo.id);
      await veiculoService.delete(veiculo.id);
      toast.success("Veículo excluído com sucesso!");
      fetchData();
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      toast.error("Erro ao excluir veículo");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Veículos
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Lista de todos os veículos cadastrados
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/veiculos/novo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Link>
          </div>
        </div>

        {veiculos.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow p-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum veículo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece cadastrando um novo veículo.
            </p>
            <div className="mt-6">
              <Link
                href="/veiculos/novo"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Veículo
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {veiculos.map((veiculo) => {
                const cliente = veiculo.client_id
                  ? clientes[veiculo.client_id]
                  : null;
                return (
                  <li key={veiculo.id}>
                    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Car className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {veiculo.plate} - {veiculo.model}
                            </div>
                          </div>
                          <div className="flex items-center mt-1">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <div className="text-sm text-gray-500">
                              {cliente
                                ? `${cliente.name} - ${cliente.phone}`
                                : "Cliente não encontrado"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/veiculos/${veiculo.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(veiculo)}
                          disabled={deleting === veiculo.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
