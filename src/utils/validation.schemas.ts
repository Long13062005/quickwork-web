/**
 * Centralized Yup validation schemas for authentication forms
 */

import * as Yup from 'yup';
import { VALIDATION_RULES } from '../constants/auth.constants';

/**
 * Registration form validation schema
 */
export const registerValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`)
    .required('Email is required'),
  
  password: Yup.string()
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`)
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions'),
});

/**
 * Login form validation schema
 */
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`)
    .required('Email is required'),
  
  password: Yup.string()
    .required('Password is required'),
  
  rememberMe: Yup.boolean(),
});

/**
 * Email validation schema (for standalone email checks)
 */
export const emailValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`)
    .required('Email is required'),
});

/**
 * Password validation schema (for password reset)
 */
export const passwordValidationSchema = Yup.object({
  password: Yup.string()
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, `Password must be less than ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} characters`)
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION_RULES.EMAIL_MAX_LENGTH} characters`)
    .required('Email is required'),
});
