"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import VeiculoForm from "@/components/VeiculoForm";
import { Veiculo } from "@/types";
import { veiculoService } from "@/services/veiculoService";
import { Toaster, toast } from "react-hot-toast";

// Componente separado que usa useSearchParams
function EditarVeiculoContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVeiculo = async () => {
      try {
        const id = Number(params.id);
        if (isNaN(id)) {
          toast.error("ID de veículo inválido");
          router.push("/veiculos");
          return;
        }

        const data = await veiculoService.getById(id);
        setVeiculo(data);
      } catch (error) {
        console.error("Erro ao carregar veículo:", error);
        toast.error("Erro ao carregar veículo");
        router.push("/veiculos");
      } finally {
        setLoading(false);
      }
    };

    fetchVeiculo();
  }, [params.id, router]);

  const handleSubmit = async (data: Omit<Veiculo, "id">) => {
    if (!veiculo?.id) return;

    try {
      setSaving(true);
      await veiculoService.update(veiculo.id, data);
      toast.success("Veículo atualizado com sucesso!");

      // Verifica se deve voltar para a página de veículos do cliente
      const fromClient = searchParams.get("fromClient");
      if (fromClient || data.client_id) {
        const clienteId = fromClient || data.client_id;
        router.push(`/clientes/${clienteId}/veiculos`);
      } else {
        router.push("/veiculos");
      }
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      toast.error("Erro ao atualizar veículo");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Verifica se deve voltar para a página de veículos do cliente
    const fromClient = searchParams.get("fromClient");
    if (fromClient || veiculo?.client_id) {
      const clienteId = fromClient || veiculo?.client_id;
      router.push(`/clientes/${clienteId}/veiculos`);
    } else {
      router.push("/veiculos");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!veiculo) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Veículo não encontrado
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Editar Veículo
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Atualize os dados do veículo {veiculo.plate}
          {veiculo.client_id && " (associado a um cliente)"}
        </p>
      </div>

      <VeiculoForm
        veiculo={veiculo}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={saving}
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
          Editar Veículo
        </h2>
        <p className="mt-1 text-sm text-gray-500">Carregando...</p>
      </div>
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );
}

export default function EditarVeiculoPage() {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <EditarVeiculoContent />
      </Suspense>
    </Layout>
  );
}
