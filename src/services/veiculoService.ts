import api from "./api";
import { Veiculo, Cliente } from "@/types";

interface ClienteComVeiculos extends Cliente {
  vehicles: Veiculo[];
}

export const veiculoService = {
  async getAll(): Promise<Veiculo[]> {
    try {
      // Busca todos os clientes com seus veículos para obter as associações
      const clientesResponse = await api.get<ClienteComVeiculos[]>(
        "/clients?include=vehicles"
      );

      // Busca todos os veículos para obter os dados básicos
      const veiculosResponse = await api.get<Veiculo[]>("/vehicles");

      // Mapeia os veículos com seus client_id
      const veiculosComCliente = veiculosResponse.data.map((veiculo) => {
        // Procura o client_id nos dados dos clientes
        let client_id = undefined;
        for (const cliente of clientesResponse.data) {
          const veiculoAssociado = cliente.vehicles?.find(
            (v) => v.id === veiculo.id
          );
          if (veiculoAssociado) {
            client_id = cliente.id;
            break;
          }
        }

        return {
          ...veiculo,
          client_id,
        };
      });

      return veiculosComCliente;
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      throw error;
    }
  },

  async getById(id: number): Promise<Veiculo> {
    try {
      // Busca todos os clientes com seus veículos para encontrar o client_id
      const clientesResponse = await api.get<ClienteComVeiculos[]>(
        "/clients?include=vehicles"
      );

      // Busca todos os veículos para obter os dados básicos
      const veiculosResponse = await api.get<Veiculo[]>("/vehicles");
      const veiculo = veiculosResponse.data.find((v) => v.id === id);

      if (!veiculo) {
        throw new Error(`Veículo com ID ${id} não encontrado`);
      }

      // Procura o client_id nos dados dos clientes
      let client_id = undefined;
      for (const cliente of clientesResponse.data) {
        const veiculoAssociado = cliente.vehicles?.find((v) => v.id === id);
        if (veiculoAssociado) {
          client_id = cliente.id;
          break;
        }
      }

      return {
        ...veiculo,
        client_id,
      };
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      throw error;
    }
  },

  async getByClienteId(clienteId: number): Promise<Veiculo[]> {
    try {
      const response = await api.get<ClienteComVeiculos[]>(
        "/clients?include=vehicles"
      );
      const cliente = response.data.find((c) => c.id === clienteId);

      if (!cliente) {
        return [];
      }

      return cliente.vehicles || [];
    } catch (error) {
      console.error("Erro ao buscar veículos do cliente:", error);
      throw error;
    }
  },

  async create(veiculo: Omit<Veiculo, "id">): Promise<Veiculo> {
    try {
      // Primeiro cria o veículo
      const response = await api.post<Veiculo>("/vehicles", {
        plate: veiculo.plate,
        model: veiculo.model,
      });

      const novoVeiculo = response.data;

      // Se tem client_id, faz a associação
      if (veiculo.client_id && novoVeiculo.id) {
        await api.post("/vehicles/associate", {
          vehicle_id: novoVeiculo.id,
          client_id: veiculo.client_id,
        });

        // Retorna o veículo com o client_id atualizado
        return {
          ...novoVeiculo,
          client_id: veiculo.client_id,
        };
      }

      return novoVeiculo;
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
      throw error;
    }
  },

  async update(
    id: number,
    veiculo: Partial<Omit<Veiculo, "id">>
  ): Promise<Veiculo> {
    try {
      // Atualiza os dados básicos do veículo
      const updateData = {
        plate: veiculo.plate,
        model: veiculo.model,
      };

      const response = await api.put<Veiculo>(`/vehicles/${id}`, updateData);
      const veiculoAtualizado = response.data;

      // Se há mudança de cliente, faz nova associação
      if (veiculo.client_id !== undefined) {
        await api.post("/vehicles/associate", {
          vehicle_id: id,
          client_id: veiculo.client_id,
        });

        return {
          ...veiculoAtualizado,
          client_id: veiculo.client_id,
        };
      }

      return veiculoAtualizado;
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  async associate(vehicleId: number, clientId: number): Promise<void> {
    try {
      await api.post("/vehicles/associate", {
        vehicle_id: vehicleId,
        client_id: clientId,
      });
    } catch (error) {
      console.error("Erro ao associar veículo:", error);
      throw error;
    }
  },
};
