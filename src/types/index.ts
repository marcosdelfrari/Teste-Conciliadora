export interface Cliente {
  id?: number;
  name: string;
  phone: string;
  vehicles?: Veiculo[];
  created_at?: string;
  updated_at?: string;
}

export interface Veiculo {
  id?: number;
  plate: string;
  model: string;
  client_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteComVeiculos extends Cliente {
  vehicles: Veiculo[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
