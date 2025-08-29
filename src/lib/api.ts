import { config } from './env';
import type {
  ApiResponse,
  ErrorResponse,
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectDeploymentResponse,
  ProjectsListResponse,
  EscrowAddressResponse,
  PaymentInitiationRequest,
  CryptoPaymentRequest,
  PaymentResponse,
  CryptoPaymentResponse,
  InvestmentsResponse,
} from '@/types';

const API_BASE_URL = config.API_BASE_URL;
const POLYGONSCAN_URL = config.POLYGONSCAN_URL;

class ApiService {
  private getAuthHeaders(): HeadersInit {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({ detail: 'Unknown error', error_code: 'UNKNOWN_ERROR' }));
        console.error('API Error response:', errorData);
        
        // Handle 401 Unauthorized errors
        if (response.status === 401) {
          // Clear the expired token
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            // Dispatch a custom event to notify the app about token expiration
            window.dispatchEvent(new CustomEvent('tokenExpired'));
          }
          throw new Error('Token expired. Please log in again.');
        }
        
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Request error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication endpoints
  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  // Project endpoints
  async getProjects(params?: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<ProjectsListResponse>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/projects/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ProjectsListResponse>(endpoint);
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<ProjectDeploymentResponse>> {
    return this.request<ProjectDeploymentResponse>('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async getProjectEscrowAddress(projectId: string): Promise<ApiResponse<EscrowAddressResponse>> {
    return this.request<EscrowAddressResponse>(`/projects/${projectId}/escrow-address`);
  }

  // Payment endpoints
  async initiatePayment(paymentData: PaymentInitiationRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.request<PaymentResponse>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async initiateCryptoPayment(paymentData: CryptoPaymentRequest): Promise<ApiResponse<CryptoPaymentResponse>> {
    return this.request<CryptoPaymentResponse>('/payments/crypto', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentResponse>> {
    return this.request<PaymentResponse>(`/payments/${paymentId}/status`);
  }

  async getUserInvestments(): Promise<ApiResponse<InvestmentsResponse>> {
    return this.request<InvestmentsResponse>('/payments/investments');
  }

  // Utility methods
  getPolygonscanUrl(address: string): string {
    return `${POLYGONSCAN_URL}/address/${address}`;
  }

  getPolygonscanTxUrl(txHash: string): string {
    return `${POLYGONSCAN_URL}/tx/${txHash}`;
  }

  // Legacy methods for backward compatibility
  async getUserProjects(): Promise<ApiResponse<Project[]>> {
    // This endpoint might not exist in the new API, so we'll filter from all projects
    const response = await this.getProjects();
    if (response.data) {
      // Filter projects owned by current user (this would need to be implemented based on user context)
      return { data: response.data.projects };
    }
    return { error: response.error || 'Failed to fetch user projects' };
  }

  async deleteProject(id: string): Promise<ApiResponse<unknown>> {
    // This endpoint might not exist in the new API
    return this.request<unknown>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 