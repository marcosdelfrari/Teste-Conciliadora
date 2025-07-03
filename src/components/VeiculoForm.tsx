"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Veiculo, Cliente } from "@/types";
import { Save, X } from "lucide-react";
import { clienteService } from "@/services/clienteService";

interface VeiculoFormProps {
  veiculo?: Veiculo;
  onSubmit: (data: Omit<Veiculo, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
  preSelectedClienteId?: number;
}

const schema = yup.object({
  plate: yup
    .string()
    .required("Placa é obrigatória")
    .min(7, "Placa deve ter pelo menos 7 caracteres"),
  model: yup
    .string()
    .required("Modelo é obrigatório")
    .min(2, "Modelo deve ter pelo menos 2 caracteres"),
  client_id: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === 0 ? undefined : value
    )
    .nullable()
    .optional(),
});

export default function VeiculoForm({
  veiculo,
  onSubmit,
  onCancel,
  isLoading = false,
  preSelectedClienteId,
}: VeiculoFormProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);

  // Determina se deve mostrar o campo de cliente
  const isEditMode = !!veiculo;
  const hasPreSelection = !!preSelectedClienteId;
  const showClientField = isEditMode || hasPreSelection;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      plate: veiculo?.plate || "",
      model: veiculo?.model || "",
      client_id: veiculo?.client_id || preSelectedClienteId || 0,
    },
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clienteService.getAll();
        setClientes(data);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      } finally {
        setLoadingClientes(false);
      }
    };

    fetchClientes();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {veiculo ? "Editar Veículo" : "Novo Veículo"}
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="plate"
              className="block text-sm font-medium text-gray-700"
            >
              Placa
            </label>
            <input
              type="text"
              id="plate"
              {...register("plate")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.plate ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Ex: ABC-1234"
              style={{ textTransform: "uppercase" }}
            />
            {errors.plate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.plate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700"
            >
              Modelo
            </label>
            <input
              type="text"
              id="model"
              {...register("model")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.model ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Digite o modelo do veículo"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">
                {errors.model.message}
              </p>
            )}
          </div>

          {showClientField && (
            <div className="sm:col-span-2">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium text-gray-700"
              >
                Cliente
              </label>
              <select
                id="client_id"
                {...register("client_id", { valueAsNumber: true })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                  errors.client_id ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loadingClientes}
              >
                <option value={0}>
                  {loadingClientes ? "Carregando..." : "Selecione um cliente"}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} - {cliente.phone}
                  </option>
                ))}
              </select>
              {errors.client_id && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.client_id.message}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || loadingClientes}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </form>
  );
}
