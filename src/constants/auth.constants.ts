/**
 * Authentication related constants
 */

/**
 * Success messages for user feedback
 */
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Account created successfully! Signing you in... ✨',
  LOGIN_SUCCESS: 'Welcome back! 🎉',
  LOGOUT_SUCCESS: 'You have been logged out successfully',
  EMAIL_VERIFIED: 'Email verified successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
} as const;

/**
 * Error messages for user feedback
 */
export const ERROR_MESSAGES = {
  REGISTER_FAILED: 'Registration failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before logging in',
  ACCOUNT_LOCKED: 'Your account has been temporarily locked',
} as const;

/**
 * Validation constants
 */
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
} as const;

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: true,
} as const;

/**
 * Password strength criteria patterns
 */
export const PASSWORD_PATTERNS = {
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBERS: /[0-9]/,
  SPECIAL_CHARS: /[^A-Za-z0-9]/,
} as const;

/**
 * Password strength colors for UI
 */
export const PASSWORD_STRENGTH_COLORS = {
  0: 'bg-red-400',
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-blue-400',
  5: 'bg-green-400',
} as const;

/**
 * Password strength text labels
 */
export const PASSWORD_STRENGTH_LABELS = {
  0: 'Very Weak',
  1: 'Very Weak',
  2: 'Weak',
  3: 'Fair',
  4: 'Good',
  5: 'Strong',
} as const;

/**
 * Authentication API endpoints
 */
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  CHECK_EMAIL: '/auth/check-email',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  REMEMBER_ME: 'remember_me',
} as const;

/**
 * Form field names
 */
export const FORM_FIELDS = {
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  AGREE_TO_TERMS: 'agreeToTerms',
  REMEMBER_ME: 'rememberMe',
} as const;

/**
 * Animation durations for consistent UI timing
 */
export const ANIMATION_DURATIONS = {
  FAST: 0.1,
  NORMAL: 0.3,
  SLOW: 0.6,
  FIELD_VALIDATION: 0.2,
  FORM_SUBMISSION: 0.4,
} as const;

/**
 * Debounce delays for form validation
 */
export const DEBOUNCE_DELAYS = {
  EMAIL_CHECK: 500,
  FIELD_VALIDATION: 300,
  SEARCH: 400,
} as const;
