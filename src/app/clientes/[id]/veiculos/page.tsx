"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Cliente, Veiculo } from "@/types";
import { clienteService } from "@/services/clienteService";
import { veiculoService } from "@/services/veiculoService";
import { Plus, Edit, Trash2, Car, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function ClienteVeiculosPage() {
  const params = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const clienteId = Number(params.id);

      if (isNaN(clienteId)) {
        toast.error("ID de cliente inválido");
        router.push("/clientes");
        return;
      }

      const [clienteData, veiculosData] = await Promise.all([
        clienteService.getById(clienteId),
        veiculoService.getByClienteId(clienteId),
      ]);

      setCliente(clienteData);
      setVeiculos(veiculosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados do cliente");
      router.push("/clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleDelete = async (veiculo: Veiculo) => {
    if (!veiculo.id) return;

    if (
      !confirm(`Tem certeza que deseja excluir o veículo ${veiculo.plate}?`)
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

  if (!cliente) {
    return (
      <Layout>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Cliente não encontrado
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/clientes")}
            className="inline-flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar aos Clientes
          </button>
        </div>

        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Veículos de {cliente.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {cliente.phone} • {veiculos.length} veículo(s) cadastrado(s)
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <Link
              href={`/clientes/${cliente.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Cliente
            </Link>
            <Link
              href={`/veiculos/novo?clienteId=${cliente.id}`}
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
              Nenhum veículo cadastrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {cliente.name} ainda não possui veículos cadastrados.
            </p>
            <div className="mt-6">
              <Link
                href={`/veiculos/novo?clienteId=${cliente.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Veículo
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {veiculos.map((veiculo) => (
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
                            {veiculo.plate}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            • {veiculo.model}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="text-xs text-gray-400">
                            Cadastrado em{" "}
                            {veiculo.created_at
                              ? new Date(veiculo.created_at).toLocaleDateString(
                                  "pt-BR"
                                )
                              : "Data não disponível"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/veiculos/${veiculo.id}/edit?fromClient=${cliente.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar veículo"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(veiculo)}
                        disabled={deleting === veiculo.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Excluir veículo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
