/**
 * Authentication related type definitions
 */

/**
 * User registration form values
 */
export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

/**
 * User login form values
 */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * User registration data for API
 */
export interface RegisterUserData {
  email: string;
  password: string;
}

/**
 * User login data for API
 */
export interface LoginUserData {
  email: string;
  password: string;
}

/**
 * Authentication response data
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User roles
 */
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  emailExists: boolean | null;
  emailCheckStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

/**
 * Field state for form validation
 */
export interface FieldState {
  hasError: boolean;
  hasValue: boolean;
  isValid: boolean;
  showSuccess: boolean;
}

/**
 * Form field states type
 */
export type FieldStates = Record<string, FieldState>;

/**
 * Navigation state for routing
 */
export interface NavigationState {
  email?: string;
  redirectTo?: string;
}

/**
 * Password strength levels
 */
export const PasswordStrength = {
  VERY_WEAK: 0,
  WEAK: 1,
  FAIR: 2,
  GOOD: 3,
  STRONG: 4,
} as const;

export type PasswordStrength = typeof PasswordStrength[keyof typeof PasswordStrength];

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
