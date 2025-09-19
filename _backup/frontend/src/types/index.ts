export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'portaria' | 'loja';
  store_id?: number;
  store?: Store;
}

export interface Store {
  id: number;
  name: string;
  shopping_id: number;
  shopping?: Shopping;
}

export interface Shopping {
  id: number;
  name: string;
  address: string;
}

export interface Package {
  id: number;
  store_id: number;
  code: string;
  courier: string;
  received_at: string;
  postal_type: 'simples' | 'registrada';
  volume_type: 'caixa' | 'envelope' | 'pacote' | 'sedex';
  observations?: string;
  status: 'pending' | 'collected' | 'returned' | 'deleted';
  collected_at?: string;
  collector_name?: string;
  collector_cpf?: string;
  photo_path?: string;
  signature_path?: string;
  store?: Store;
  logs?: PackageLog[];
  created_at: string;
  updated_at: string;
}

export interface PackageLog {
  id: number;
  package_id: number;
  user_id: number;
  action: 'created' | 'notified' | 'read' | 'collected' | 'returned' | 'deleted';
  details?: string;
  created_at: string;
  user?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}