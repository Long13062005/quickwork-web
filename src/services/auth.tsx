import { api } from '../services/api';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; fullName: string; }
export interface UserProfile { id: number; email: string; fullName: string; }

export const authAPI = {
  login: (data: LoginPayload) => api.post<UserProfile>('/auth/login', data),
  register: (data: RegisterPayload) => api.post<UserProfile>('/auth/register', data),
  checkEmailExist: (email: string) => api.get<boolean>(`/auth/check-email?email=${encodeURIComponent(email)}`),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get<UserProfile>('/auth/me'),
};