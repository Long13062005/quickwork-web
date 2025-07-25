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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
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

/**
 * Job validation schema
 */
export const jobValidationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Job title must be at least 3 characters')
    .max(100, 'Job title must be less than 100 characters')
    .required('Job title is required'),
  
  description: Yup.string()
    .min(10, 'Job description must be at least 10 characters')
    .max(5000, 'Job description must be less than 5000 characters')
    .required('Job description is required'),
  
  location: Yup.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .required('Location is required'),
  
  minSalary: Yup.number()
    .min(0, 'Minimum salary must be greater than or equal to 0')
    .max(10000000, 'Minimum salary must be less than 10,000,000')
    .required('Minimum salary is required'),
  
  maxSalary: Yup.number()
    .min(0, 'Maximum salary must be greater than or equal to 0')
    .max(10000000, 'Maximum salary must be less than 10,000,000')
    .test('max-greater-than-min', 'Maximum salary must be greater than minimum salary', function(value) {
      const { minSalary } = this.parent;
      if (minSalary && value && value <= minSalary) {
        return false;
      }
      return true;
    })
    .required('Maximum salary is required'),
  
  type: Yup.string()
    .oneOf(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE'], 'Invalid job type')
    .required('Job type is required'),
  
  requiredSkills: Yup.array()
    .of(Yup.string().min(1, 'Skill cannot be empty').max(50, 'Skill must be less than 50 characters'))
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills allowed')
    .required('Required skills are required'),
  
  requiredExperience: Yup.number()
    .min(0, 'Required experience must be greater than or equal to 0')
    .max(50, 'Required experience must be less than 50 years')
    .required('Required experience is required'),
  
  applicationDeadline: Yup.date()
    .min(new Date(), 'Application deadline must be in the future')
    .required('Application deadline is required'),
  
  status: Yup.string()
    .oneOf(['OPEN', 'CLOSED', 'DRAFT'], 'Invalid job status')
    .required('Job status is required'),
});

/**
 * Job search validation schema
 */
export const jobSearchValidationSchema = Yup.object({
  keyword: Yup.string()
    .max(100, 'Keyword must be less than 100 characters'),
  
  location: Yup.string()
    .max(100, 'Location must be less than 100 characters'),
  
  minSalary: Yup.number()
    .min(0, 'Minimum salary must be greater than or equal to 0')
    .max(10000000, 'Minimum salary must be less than 10,000,000'),
  
  maxSalary: Yup.number()
    .min(0, 'Maximum salary must be greater than or equal to 0')
    .max(10000000, 'Maximum salary must be less than 10,000,000')
    .test('max-greater-than-min', 'Maximum salary must be greater than minimum salary', function(value) {
      const { minSalary } = this.parent;
      if (minSalary && value && value <= minSalary) {
        return false;
      }
      return true;
    }),
  
  type: Yup.string()
    .oneOf(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'FREELANCE'], 'Invalid job type'),
});
