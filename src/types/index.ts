export interface TokenProject {
  id: string;
  owner_id: string;
  name: string;
  symbol: string;
  description: string;
  category: string;
  target_amount: string;
  price_per_token: string;
  total_supply: number;
  current_raised: string;
  end_date: string;
  risk_level: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'active' | 'completed' | 'rejected';
  image_url?: string;
  business_plan_url?: string;
  whitepaper_url?: string;
  token_contract_address?: string;
  escrow_contract_address?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaymentMethod {
  type: 'crypto' | 'fiat';
  currency: string;
}

export interface PaymentStatus {
  payment_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: string;
  currency: string;
  transaction_hash?: string;
  circle_payment_id?: string;
  circle_transfer_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  user_type: 'investor' | 'sme';
  company?: string;
  status: string;
  is_active: boolean;
  is_verified: boolean;
  wallet_address?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ProjectFormData {
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

export interface Investment {
  id: string;
  user_id: string;
  project_id: string;
  amount: string;
  tokens_received: number;
  payment_method: 'fiat' | 'crypto';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
}

export interface PaymentInitiation {
  payment_id: string;
  status: string;
  bank_details?: {
    iban: string;
    bic: string;
    account_name: string;
    reference: string;
  };
  escrow_address?: string;
  amount: string;
  currency: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}