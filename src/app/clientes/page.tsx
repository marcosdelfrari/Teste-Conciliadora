"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Cliente } from "@/types";
import { clienteService } from "@/services/clienteService";
import { veiculoService } from "@/services/veiculoService";
import { Plus, Edit, Trash2, Car, Phone, User } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculosPorCliente, setVeiculosPorCliente] = useState<
    Record<number, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const [clientesData, veiculosData] = await Promise.all([
        clienteService.getAll(),
        veiculoService.getAll(),
      ]);

      setClientes(clientesData);

      const contagem: Record<number, number> = {};
      veiculosData.forEach((veiculo) => {
        if (veiculo.client_id) {
          contagem[veiculo.client_id] = (contagem[veiculo.client_id] || 0) + 1;
        }
      });
      setVeiculosPorCliente(contagem);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Recarrega dados quando a página ganha foco (usuário volta de outra página)
  useEffect(() => {
    const handleFocus = () => {
      fetchClientes();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleDelete = async (cliente: Cliente) => {
    if (!cliente.id) return;

    const veiculosCount = veiculosPorCliente[cliente.id] || 0;

    if (veiculosCount > 0) {
      toast.error(
        `Não é possível excluir ${cliente.name}. Cliente possui ${veiculosCount} veículo(s) associado(s).`
      );
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o cliente ${cliente.name}?`)) {
      return;
    }

    try {
      setDeleting(cliente.id);
      await clienteService.delete(cliente.id);
      toast.success("Cliente excluído com sucesso!");
      fetchClientes();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente");
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
              Clientes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Lista de todos os clientes cadastrados
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/clientes/novo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Link>
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow p-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum cliente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando um novo cliente.
            </p>
            <div className="mt-6">
              <Link
                href="/clientes/novo"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <li key={cliente.id}>
                  <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.name}
                          </div>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-400 mr-1" />
                          <div className="text-sm text-gray-500">
                            {cliente.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/clientes/${cliente.id}/veiculos`}
                        className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        title="Ver veículos do cliente"
                      >
                        <Car className="h-4 w-4 mr-1" />
                        <span className="font-medium">
                          {veiculosPorCliente[cliente.id!] || 0}
                        </span>
                        <span className="ml-1">
                          veículo
                          {(veiculosPorCliente[cliente.id!] || 0) !== 1
                            ? "s"
                            : ""}
                        </span>
                      </Link>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/clientes/${cliente.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(cliente)}
                          disabled={deleting === cliente.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Excluir cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Car className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                💡 Dica: Associação de Veículos
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  • Clique no número de veículos para ver todos os veículos de
                  um cliente
                </p>
                <p>• Um cliente pode ter múltiplos veículos associados</p>
                <p>
                  • Para cadastrar um veículo, vá em &quot;Veículos&quot; →
                  &quot;Novo Veículo&quot; e selecione o cliente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
