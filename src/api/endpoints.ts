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

export interface LoginRequest {
  terminal_id: number;
  email: string;
  password: string;
}

export interface CheckinRequest {
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
}

export const authAPI = {
  login: (data: LoginRequest) => api.post('/auth/login', data),
};

export const visitorAPI = {
  lookup: (query: string) => api.get(`/visitors/lookup?query=${encodeURIComponent(query)}`),
};

export const checkinAPI = {
  guestCheckin: (data: CheckinRequest) => {
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
      },
    });
  },
  
  accessCodeCheckin: (data: AccessCodeCheckinRequest) => 
    api.post('/checkin', data),
  
  lookupVisitor: (query: string) => 
    api.get(`/visitors/lookup?query=${encodeURIComponent(query)}`),
  
  getCheckins: () => api.get('/checkins'),
  
  approveCheckin: (id: number, comment?: string) => 
    api.put(`/checkin/${id}/approve`, { action: 'approved', comment }),
  
  rejectCheckin: (id: number) => 
    api.put(`/checkin/${id}/reject`, { action: 'rejected' }),
};

export default api;