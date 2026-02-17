
import { User, SystemLog } from "../types";

/**
 * LaravelAuthService handles communication with the backend folder's Laravel API.
 */
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8000' 
  : window.location.origin;

const API_BASE_URL = `${BACKEND_URL}/api`;
let csrfInitialized = false;

function getCookie(name: string): string | null {
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
      .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null
  );
}

export const AuthService = {
  async ensureCsrf() {
    if (csrfInitialized) return;
    try {
      const response = await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, { 
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (!response.ok) {
        throw new Error(`CSRF initialization failed with status: ${response.status}`);
      }
      
      csrfInitialized = true;
    } catch (e) {
      console.error("CSRF Error:", e);
      csrfInitialized = false;
    }
  },

  async request(endpoint: string, options: RequestInit = {}) {
    if (options.method && options.method !== 'GET') {
      await this.ensureCsrf();
    }

    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
      const xsrfToken = getCookie('XSRF-TOKEN');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...((options.headers as Record<string, string>) || {}),
      };

      if (xsrfToken && options.method && options.method !== 'GET') {
        headers['X-XSRF-TOKEN'] = xsrfToken;
      }

      const response = await fetch(url, {
        ...options,
        credentials: 'include', 
        headers: headers,
      });

      if (response.status === 204) return null;
      
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) throw new Error(text || `Request failed with status ${response.status}`);
        return text;
      }
      
      if (!response.ok) {
        if (response.status === 419) {
          csrfInitialized = false;
          throw new Error("Security session expired. Please refresh the page.");
        }
        
        const errorMsg = data.errors 
          ? Object.values(data.errors).flat()[0] 
          : data.message || 'Server error';
        throw new Error(errorMsg as string);
      }

      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error("Cannot connect to the backend server. Please ensure the Laravel server is running at " + BACKEND_URL);
      }
      throw error;
    }
  },

  async fetchAllUsers(): Promise<User[]> {
    try {
      const data = await this.request('/users', { method: 'GET' });
      return data || [];
    } catch (e) {
      console.error("Failed to fetch users:", e);
      return [];
    }
  },

  async requestOtp(email: string) {
    try {
      const data = await this.request('/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { ...data, success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async verifyOtpAndLogin(email: string, otp: string) {
    try {
      const data = await this.request('/login-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      return { ...data, user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async login(email: string, pass: string) {
    try {
      const data = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });
      return { ...data, user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async forgotPassword(email: string) {
    try {
      const data = await this.request('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return { ...data, success: true, message: data.message, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email: string, otp: string, pass: string, passConfirm: string) {
    try {
      const data = await this.request('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          otp, 
          password: pass, 
          password_confirmation: passConfirm 
        }),
      });
      return { ...data, user: data.user, success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async register(email: string, pass: string, name: string, role: string) {
    try {
      const data = await this.request('/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          email, 
          password: pass, 
          password_confirmation: pass,
          role 
        }),
      });
      return { ...data, user: data.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (e) {
      console.warn("Logout request failed locally.");
    }
  },

  async checkSession(): Promise<User | null> {
    try {
      const data = await this.request('/user', { method: 'GET' });
      return data;
    } catch (e) {
      return null;
    }
  },

  async fetchSystemLogs(): Promise<SystemLog[]> {
    try {
      const data = await this.request('/system-logs', { method: 'GET' });
      return data;
    } catch (e) {
      console.error("Failed to fetch system logs:", e);
      return [];
    }
  }
};
