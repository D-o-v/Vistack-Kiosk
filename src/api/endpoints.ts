import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Interfaces
export interface LoginRequest {
  terminal_id: number;
  email: string;
  password: string;
}

export interface Terminal {
  id: number;
  name: string;
  location?: string;
  status?: string;
  organization_id: number;
}

export interface RegisterUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  organization_name: string;
  organization_email: string;
  organization_phone: string;
}

export interface RegisterExistingOrgRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  organization_id: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Checkin Interfaces
export interface GuestCheckinRequest {
  access_category: number;
  checkin_method: string;
  purpose: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  host_id?: number;
  image?: File;
  document?: File;
  signature?: File;
}

export interface AccessCodeCheckinRequest {
  access_code: string;
  checkin_method: string;
  terminal_id: number;
}

export interface CheckoutRequest {
  query: string;
  terminal_id: number;
}

export interface ApproveCheckinRequest {
  action: string;
  comment?: string;
}

export interface AssignTagRequest {
  visitor_tag: string;
  comment?: string;
}

// Notification Interfaces
export interface EmailNotificationRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Organization API
export const organizationAPI = {
  verifyOrganization: (code: string) => api.get(`/auth/organizations/verify?code=${code}`),
};

// Terminals API (deprecated - use organization verification)
export const terminalsAPI = {
  getTerminals: async () => {
    // Fallback terminals if organization verification fails
    return {
      data: {
        data: [
          { id: 1, name: 'Main Entrance', location: 'Lobby', status: 'active', organization_id: 1 },
          { id: 2, name: 'Reception Desk', location: 'Front Desk', status: 'active', organization_id: 1 },
          { id: 3, name: 'Security Gate', location: 'Gate A', status: 'active', organization_id: 1 }
        ]
      }
    };
  },
};

// Auth API
export const authAPI = {
  // Verify organization
  verifyOrganization: (code: string) => 
    api.get(`/auth/organizations/verify?code=${code}`),
  // Register new organization + admin user
  registerUser: (data: RegisterUserRequest) => 
    api.post('/auth/registeruser', data),
  
  // Register new user (join existing org)
  register: (data: RegisterExistingOrgRequest) => 
    api.post('/auth/register', data),
  
  // Terminal user login
  login: (data: LoginRequest) => 
    api.post('/auth/login', data),
  
  // Update profile
  updateProfile: (data: { first_name?: string; last_name?: string }) => 
    api.put('/user/profile', data),
  
  // Forgot password
  forgotPassword: (data: ForgotPasswordRequest) => 
    api.post('/auth/forgot-password', data),
  
  // Reset password
  resetPassword: (data: ResetPasswordRequest) => 
    api.post('/auth/reset-password', data),
  
  // Logout
  logout: () => 
    api.post('/logout'),
  
  // Send email notification
  sendEmailNotification: (data: EmailNotificationRequest) => 
    api.post('/notifications/email', data),
};

// Visitor API
export const visitorAPI = {
  // Lookup visitor by email or phone
  lookup: (query: string) => 
    api.get(`/visitors/lookup?query=${encodeURIComponent(query)}`),
};

// Checkin API
export const checkinAPI = {
  // Guest/Visitor checkin (without access code)
  guestCheckin: (data: GuestCheckinRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return axios.post(`${BASE_URL}/checkin`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Accept': 'application/json',
      },
    });
  },
  
  // Checkin with access code
  accessCodeCheckin: (data: AccessCodeCheckinRequest) => 
    api.post('/checkin', data),
  
  // QR Code checkin
  qrCheckin: (accessCode: string) => {
    const terminalId = parseInt(localStorage.getItem('terminal_id') || '2');
    return api.post('/checkin', {
      access_code: accessCode,
      checkin_method: 'qr',
      terminal_id: terminalId
    });
  },
  
  // Checkout visitor
  checkout: (data: CheckoutRequest) => 
    api.post('/checkout', data),
  
  // List user checkins
  getCheckins: () => 
    api.get('/checkins'),
  
  // Approve checkin
  approveCheckin: (id: number, data: ApproveCheckinRequest) => 
    api.put(`/checkin/${id}/approve`, data),
  
  // Reject checkin
  rejectCheckin: (id: number) => 
    api.put(`/checkin/${id}/reject`, { action: 'rejected' }),
  
  // Assign visitor tag
  assignTag: (id: number, data: AssignTagRequest) => 
    api.put(`/checkin/${id}/assign-tag`, data),
};

export default api;