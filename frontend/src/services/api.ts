const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export interface ApiError {
  detail: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(data: any) {
    const response = await this.request<{ access_token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getMe() {
    return this.request<any>('/api/auth/me');
  }

  // Cohorts
  async getCohorts() {
    return this.request<any[]>('/api/cohorts');
  }

  async getCohort(id: string) {
    return this.request<any>(`/api/cohorts/${id}`);
  }

  async createCohort(data: any) {
    return this.request<any>('/api/cohorts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCohort(id: string, data: any) {
    return this.request<any>(`/api/cohorts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCohort(id: string) {
    return this.request<void>(`/api/cohorts/${id}`, {
      method: 'DELETE',
    });
  }

  // Campus Leads
  async getCampusLeads() {
    return this.request<any[]>('/api/campus-leads');
  }

  async getCampusLead(id: string) {
    return this.request<any>(`/api/campus-leads/${id}`);
  }

  async createCampusLead(data: any) {
    return this.request<any>('/api/campus-leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampusLead(id: string, data: any) {
    return this.request<any>(`/api/campus-leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Messages & Channels
  async getChannels() {
    return this.request<any[]>('/api/messages/channels');
  }

  async createChannel(data: any) {
    return this.request<any>('/api/messages/channels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(channelId: string) {
    return this.request<any[]>(`/api/messages/${channelId}`);
  }

  async sendMessage(channelId: string, data: any) {
    return this.request<any>(`/api/messages/${channelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async toggleStar(channelId: string, messageId: string) {
    return this.request<any>(`/api/messages/${channelId}/${messageId}/star`, {
      method: 'PUT',
    });
  }

  async deleteMessage(channelId: string, messageId: string) {
    return this.request<void>(`/api/messages/${channelId}/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents() {
    return this.request<any[]>('/api/events');
  }

  async createEvent(data: any) {
    return this.request<any>('/api/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request<any>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request<void>(`/api/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Profile
  async getProfile() {
    return this.request<any>('/api/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Stats
  async getStats(category: string) {
    return this.request<any[]>(`/api/stats/${category}`);
  }

  async updateStats(category: string, stats: any[]) {
    return this.request<any[]>(`/api/stats/${category}`, {
      method: 'PUT',
      body: JSON.stringify({ stats }),
    });
  }
}

export const api = new ApiService();