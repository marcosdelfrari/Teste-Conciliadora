"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import ClienteForm from "@/components/ClienteForm";
import { Cliente } from "@/types";
import { clienteService } from "@/services/clienteService";
import { Toaster, toast } from "react-hot-toast";

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const id = Number(params.id);
        if (isNaN(id)) {
          toast.error("ID de cliente inválido");
          router.push("/clientes");
          return;
        }

        const data = await clienteService.getById(id);
        setCliente(data);
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        toast.error("Erro ao carregar cliente");
        router.push("/clientes");
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [params.id, router]);

  const handleSubmit = async (data: Omit<Cliente, "id">) => {
    if (!cliente?.id) return;

    try {
      setSaving(true);
      await clienteService.update(cliente.id, data);
      toast.success("Cliente atualizado com sucesso!");
      router.push("/clientes");
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/clientes");
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
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Editar Cliente
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Atualize os dados do cliente {cliente.name}
          </p>
        </div>

        <ClienteForm
          cliente={cliente}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={saving}
        />
      </div>
    </Layout>
  );
}
