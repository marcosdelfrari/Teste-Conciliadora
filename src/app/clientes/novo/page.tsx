"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import ClienteForm from "@/components/ClienteForm";
import { Cliente } from "@/types";
import { clienteService } from "@/services/clienteService";
import { Toaster, toast } from "react-hot-toast";

export default function NovoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Cliente, "id">) => {
    try {
      setLoading(true);
      await clienteService.create(data);
      toast.success("Cliente criado com sucesso!");
      router.push("/clientes");
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      toast.error("Erro ao criar cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/clientes");
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Novo Cliente
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os dados para cadastrar um novo cliente
          </p>
        </div>

        <ClienteForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
        />
      </div>
    </Layout>
  );
}
