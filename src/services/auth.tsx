import { api } from '../services/api';

export interface LoginPayload { email: string; password: string; }
export interface UserProfile { id: number; email: string; fullName: string; }

export const authAPI = {
  login: (data: LoginPayload) => api.post<UserProfile>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get<UserProfile>('/auth/me'),
};