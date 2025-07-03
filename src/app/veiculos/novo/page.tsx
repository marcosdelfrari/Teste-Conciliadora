"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import VeiculoForm from "@/components/VeiculoForm";
import { Veiculo, Cliente } from "@/types";
import { veiculoService } from "@/services/veiculoService";
import { clienteService } from "@/services/clienteService";
import { Toaster, toast } from "react-hot-toast";

// Componente separado que usa useSearchParams
function NovoVeiculoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [preSelectedCliente, setPreSelectedCliente] = useState<Cliente | null>(
    null
  );

  useEffect(() => {
    const clienteId = searchParams.get("clienteId");
    if (clienteId) {
      const fetchCliente = async () => {
        try {
          const cliente = await clienteService.getById(Number(clienteId));
          setPreSelectedCliente(cliente);
        } catch (error) {
          console.error("Erro ao carregar cliente:", error);
        }
      };
      fetchCliente();
    }
  }, [searchParams]);

  const handleSubmit = async (data: Omit<Veiculo, "id">) => {
    try {
      setLoading(true);
      await veiculoService.create(data);
      toast.success("Veículo criado com sucesso!");

      const clienteId = searchParams.get("clienteId");
      if (clienteId) {
        router.push(`/clientes/${clienteId}/veiculos`);
      } else {
        router.push("/veiculos");
      }
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
      toast.error("Erro ao criar veículo");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const clienteId = searchParams.get("clienteId");
    if (clienteId) {
      router.push(`/clientes/${clienteId}/veiculos`);
    } else {
      router.push("/veiculos");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Novo Veículo
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {preSelectedCliente
            ? `Cadastrando veículo para ${preSelectedCliente.name}`
            : "Preencha os dados para cadastrar um novo veículo"}
        </p>
      </div>

      <VeiculoForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={loading}
        preSelectedClienteId={preSelectedCliente?.id}
      />
    </div>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Novo Veículo
        </h2>
        <p className="mt-1 text-sm text-gray-500">Carregando...</p>
      </div>
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

export default function NovoVeiculoPage() {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <NovoVeiculoContent />
      </Suspense>
    </Layout>
  );
}
