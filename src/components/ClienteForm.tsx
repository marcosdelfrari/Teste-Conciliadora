"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Cliente } from "@/types";
import { Save, X } from "lucide-react";

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: Omit<Cliente, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

export default function ClienteForm({
  cliente,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Cliente, "id">>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: cliente?.name || "",
      phone: cliente?.phone || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {cliente ? "Editar Cliente" : "Novo Cliente"}
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Digite o nome do cliente"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                errors.phone ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Digite o telefone do cliente"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
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
            disabled={isLoading}
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
