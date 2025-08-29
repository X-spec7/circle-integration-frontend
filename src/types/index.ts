// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ErrorResponse {
  detail: string;
  error_code: string;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  user_type: 'investor' | 'sme';
  created_at: string;
}

// Authentication types
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
  user: User;
}

// Project types
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
  image_url?: string | null;
  business_plan_url?: string | null;
  whitepaper_url?: string | null;
  created_at: string;
  updated_at: string;
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
  symbol?: string;
  description?: string;
  category?: string;
  target_amount?: number;
  price_per_token?: number;
  total_supply?: number;
  end_date?: string;
  risk_level?: 'Low' | 'Medium' | 'High';
  image_url?: string;
  business_plan_url?: string;
  whitepaper_url?: string;
}

export interface ProjectDeploymentResponse {
  project: Project;
  token_contract_address: string;
  escrow_contract_address: string;
  token_deployment_tx: string;
  escrow_deployment_tx: string;
}

export interface ProjectsListResponse {
  projects: Project[];
  total: number;
  limit: number;
  offset: number;
}

export interface EscrowAddressResponse {
  escrow_address: string;
}

// Payment types
export interface PaymentInitiationRequest {
  project_id: string;
  amount: number;
  currency: string;
  payment_method: string;
}

export interface CryptoPaymentRequest {
  project_id: string;
  amount: number;
  crypto_currency: string;
}

export interface PaymentResponse {
  payment_id: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  currency: string;
  created_at: string;
}

export interface CryptoPaymentResponse {
  payment_id: string;
  escrow_address: string;
  amount: number;
  crypto_currency: string;
  created_at: string;
}

export interface Investment {
  id: string;
  project_id: string;
  project_name: string;
  amount: number;
  tokens_received: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}

export interface InvestmentsResponse {
  investments: Investment[];
  total: number;
}

// Legacy types for backward compatibility
export type TokenProject = Project;
export type PaymentStatus = PaymentResponse;
export type ProjectFormData = CreateProjectRequest;
export type PaymentInitiation = PaymentResponse; 