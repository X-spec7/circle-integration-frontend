export interface TokenProject {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  totalSupply: number;
  currentRaised: number;
  targetAmount: number;
  pricePerToken: number;
  endDate: string;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Completed' | 'Upcoming';
}

export interface PaymentMethod {
  type: 'crypto' | 'fiat';
  currency: string;
}

export interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  transactionId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'investor' | 'sme';
  createdAt: string;
  portfolio?: number; // For investors
  company?: string; // For SMEs
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
  targetAmount: number;
  pricePerToken: number;
  totalSupply: number;
  endDate: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  image?: File;
  businessPlan?: File;
  whitepaper?: File;
}