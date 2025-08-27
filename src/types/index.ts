// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  user_type: 'investor' | 'sme';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  name: string;
  user_type: 'investor' | 'sme';
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  symbol: string;
  description: string;
  category: string;
  target_amount: number;
  price_per_token: number;
  total_supply: number;
  raised_amount: number;
  end_date: string;
  risk_level: 'Low' | 'Medium' | 'High';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  owner_id: string;
  owner_name: string;
  token_contract_address: string;
  escrow_contract_address: string;
  token_deployment_tx: string;
  escrow_deployment_tx: string;
  image_url?: string;
  business_plan_url?: string;
  whitepaper_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDeploymentResponse {
  project_id: string;
  token_contract_address: string;
  escrow_contract_address: string;
  token_deployment_tx: string;
  escrow_deployment_tx: string;
  deployment_status: string;
}

export interface CreateProjectRequest {
  name: string;
  symbol: string;
  description: string;
  category: string;
  target_amount: number;
  price_per_token: number;
  total_supply: number;
  end_date: string;
  risk_level: 'Low' | 'Medium' | 'High';
  image_url?: string;
  business_plan_url?: string;
  whitepaper_url?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  price_per_token?: number;
}

export interface ProjectsListResponse {
  projects: Project[];
  total: number;
  limit: number;
  offset: number;
}

export interface EscrowAddressResponse {
  escrow_address: string;
  project_id: string;
}

// Payment Types
export interface PaymentInitiationRequest {
  project_id: string;
  amount: number;
  currency: string;
  payment_method: 'sepa';
}

export interface CryptoPaymentRequest {
  project_id: string;
  amount: number;
  crypto_currency: string;
}

export interface PaymentResponse {
  payment_id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  circle_payment_id?: string;
  bank_details?: {
    iban: string;
    bic: string;
    account_holder: string;
    reference: string;
  };
  escrow_address?: string;
  blockchain_tx_hash?: string;
  tokens_allocated?: number;
  created_at: string;
  completed_at?: string;
}

export interface CryptoPaymentResponse {
  payment_id: string;
  project_id: string;
  amount: number;
  crypto_currency: string;
  escrow_address: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at: string;
}

export interface Investment {
  id: string;
  project_id: string;
  project_name: string;
  project_symbol: string;
  amount: number;
  currency: string;
  tokens_allocated: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  blockchain_tx_hash?: string;
  created_at: string;
}

export interface InvestmentsResponse {
  investments: Investment[];
  total: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  detail: string;
  error_code: string;
}

// Legacy types for backward compatibility
export type TokenProject = Project;
export interface PaymentMethod {
  type: 'crypto' | 'fiat';
  currency: string;
}
export type PaymentStatus = PaymentResponse;
export type ProjectFormData = CreateProjectRequest;
export type PaymentInitiation = PaymentResponse;