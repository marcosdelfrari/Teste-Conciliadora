"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import VeiculoForm from "@/components/VeiculoForm";
import { Veiculo, Cliente } from "@/types";
import { veiculoService } from "@/services/veiculoService";
import { clienteService } from "@/services/clienteService";
import { Toaster, toast } from "react-hot-toast";

export default function NovoVeiculoPage() {
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
    <Layout>
      <Toaster position="top-right" />

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
    </Layout>
  );
}
