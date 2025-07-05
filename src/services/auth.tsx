import { api } from '../services/api';
import { clearAuthCookies } from '../utils/cookieUtils';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; }
export interface ChangePasswordPayload { currentPassword: string; newPassword: string; confirmPassword: string; }
// Updated to match backend ProfileEntity structure
export interface UserProfile { 
  id: number; 
  userId: number;
  email?: string; 
  fullName: string;
  phone?: string;
  address?: string;
  summary?: string;
  profileType: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
  skills?: string[];
  experiences?: string[];
  companyName?: string;
  companyWebsite?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const authAPI = {
  login: (data: LoginPayload) => api.post<UserProfile>('/auth/login', data),
  register: (data: RegisterPayload) => api.post<UserProfile>('/auth/register', data),
  changePassword: (data: ChangePasswordPayload) => api.post('/auth/change-password', data),
  checkEmailExist: (email: string) => api.get<boolean>(`/auth/check-email?email=${encodeURIComponent(email)}`),
  logout: async () => {
    console.log('authAPI: Starting logout process...');
    const isSecure = window.location.protocol === 'https:';
    console.log('authAPI: Environment:', isSecure ? 'HTTPS (secure cookies)' : 'HTTP (non-secure)');
    
    try {
      console.log('authAPI: Calling backend logout endpoint at /auth/logout');
      console.log('authAPI: Backend will receive refreshToken cookie and invalidate it in database');
      // Call backend logout endpoint with credentials to ensure cookies are sent
      const response = await api.post('/auth/logout');
      console.log('authAPI: Backend logout successful - token invalidated and refreshToken cookie cleared');
      return response;
    } catch (error) {
      console.warn('authAPI: Backend logout failed, clearing cookies manually:', error);
      // Even on error, proceed with local cookie cleanup to ensure user is logged out
      clearAuthCookies();
      throw error;
    } finally {
      console.log('authAPI: Logout process completed');
    }
  },
};