import api from "./api";
import { Cliente } from "@/types";

export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    try {
      const response = await api.get<Cliente[]>("/clients");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  },

  async getById(id: number): Promise<Cliente> {
    try {
      const response = await api.get<Cliente[]>("/clients");
      const cliente = response.data.find((c) => c.id === id);

      if (!cliente) {
        throw new Error(`Cliente com ID ${id} não encontrado`);
      }

      return cliente;
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  },

  async create(cliente: Omit<Cliente, "id">): Promise<Cliente> {
    const response = await api.post<Cliente>("/clients", cliente);
    return response.data;
  },

  async update(
    id: number,
    cliente: Partial<Omit<Cliente, "id">>
  ): Promise<Cliente> {
    const response = await api.put<Cliente>(`/clients/${id}`, cliente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  async getWithVeiculos(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clients?include=vehicles");
    return response.data;
  },
};
