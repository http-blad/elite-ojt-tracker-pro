
import { User } from "../types";

/**
 * LaravelAuthService handles communication with the backend folder's Laravel API.
 */
const API_BASE_URL = 'http://localhost:8000/api';

export const AuthService = {
  /**
   * Internal request helper to handle JSON parsing and Laravel error responses.
   */
  async request(endpoint: string, options: RequestInit = {}) {
    // In a development environment, you would call /sanctum/csrf-cookie first.
    // For this simulation, we proceed with standard API headers.
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.errors 
        ? Object.values(data.errors).flat()[0] 
        : data.message || 'Authentication error';
      throw new Error(errorMsg as string);
    }

    return data;
  },

  /**
   * Attempt to login with the Laravel backend.
   */
  async login(email: string, pass: string) {
    try {
      const data = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Register a new user in the Laravel database. app/json
   */
  async register(email: string, pass: string, name: string, role: string) {
    try {
      const data = await this.request('/register', {
        method: 'POST',
        
        body: JSON.stringify({ 
          name, 
          email, 
          password: pass, 
          password_confirmation: pass, // Standard Laravel confirmation field
          role 
        }),
      });
      return { user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  /**
   * Log out and destroy the Laravel session.
   */
  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Logout request failed, clearing local session state.");
    }
  },

  /**
   * Verify session existence with the server.
   */
  async checkSession(): Promise<User | null> {
    try {
      const data = await this.request('/user', { method: 'GET' });
      return data;
    } catch (e) {
      return null;
    }
  }
};
