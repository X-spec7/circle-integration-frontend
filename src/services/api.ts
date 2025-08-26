const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Authentication endpoints
  async register(userData: {
    email: string;
    username: string;
    password: string;
    name: string;
    user_type: 'investor' | 'sme';
    company?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { username: string; password: string }): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/users/me');
  }

  // Project endpoints
  async getProjects(params?: {
    status?: string;
    category?: string;
    risk_level?: string;
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/projects/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getProject(id: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData: any): Promise<ApiResponse<any>> {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id: string, projectData: any): Promise<ApiResponse<any>> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse<any>> {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserProjects(): Promise<ApiResponse<any[]>> {
    return this.request('/projects/user/projects');
  }

  // Payment endpoints
  async initiatePayment(paymentData: {
    project_id: string;
    amount: number;
    payment_method: 'fiat' | 'crypto';
  }): Promise<ApiResponse<any>> {
    return this.request('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async initiateCryptoPayment(paymentData: {
    project_id: string;
    amount: number;
    wallet_address: string;
    currency: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/payments/crypto', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/${paymentId}/status`);
  }

  async confirmPayment(confirmationData: {
    payment_id: string;
    transaction_id: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: JSON.stringify(confirmationData),
    });
  }

  async getUserInvestments(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/payments/investments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getInvestmentDetails(investmentId: string): Promise<ApiResponse<any>> {
    return this.request(`/payments/investments/${investmentId}`);
  }
}

export const apiService = new ApiService(); 