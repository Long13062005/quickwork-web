/**
 * useProfileValidation hook
 * Handles profile form validation logic
 */

import { useState, useCallback } from 'react';
import * as Yup from 'yup';
import type {
  JobSeekerProfileFormData,
  EmployerProfileFormData,
  ProfileValidationErrors,
  UserRole,
} from '../types/profile.types';

/**
 * Validation schemas
 */
const baseProfileSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[+]?[\s\d-()]+$/, 'Invalid phone number format')
    .optional(),
  location: Yup.object({
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    timezone: Yup.string().required('Timezone is required'),
  }),
  bio: Yup.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  website: Yup.string()
    .url('Invalid website URL')
    .optional(),
  socialLinks: Yup.object({
    linkedin: Yup.string().url('Invalid LinkedIn URL').optional(),
    github: Yup.string().url('Invalid GitHub URL').optional(),
    twitter: Yup.string().url('Invalid Twitter URL').optional(),
    portfolio: Yup.string().url('Invalid Portfolio URL').optional(),
  }),
});

const jobSeekerProfileSchema = baseProfileSchema.shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Professional title is required'),
  summary: Yup.string()
    .min(50, 'Summary must be at least 50 characters')
    .max(2000, 'Summary must be less than 2000 characters')
    .required('Professional summary is required'),
  skills: Yup.array()
    .of(Yup.string())
    .min(3, 'At least 3 skills are required')
    .max(20, 'Maximum 20 skills allowed')
    .required('Skills are required'),
  experienceLevel: Yup.string()
    .oneOf(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .required('Experience level is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high')
    .required('Years of experience is required'),
  preferredRoles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one preferred role is required')
    .max(10, 'Maximum 10 preferred roles allowed')
    .required('Preferred roles are required'),
  salaryExpectation: Yup.object({
    min: Yup.number()
      .min(0, 'Minimum salary cannot be negative')
      .required('Minimum salary is required'),
    max: Yup.number()
      .min(Yup.ref('min'), 'Maximum salary must be greater than minimum')
      .required('Maximum salary is required'),
    currency: Yup.string()
      .required('Currency is required'),
  }),
  employmentTypes: Yup.array()
    .of(Yup.string().oneOf(['full_time', 'part_time', 'contract', 'freelance', 'internship']))
    .min(1, 'At least one employment type is required')
    .required('Employment types are required'),
  workLocationPreference: Yup.array()
    .of(Yup.string().oneOf(['remote', 'on_site', 'hybrid']))
    .min(1, 'At least one work location preference is required')
    .required('Work location preference is required'),
  availabilityDate: Yup.string()
    .required('Availability date is required'),
  isOpenToWork: Yup.boolean()
    .required('Open to work status is required'),
});

const employerProfileSchema = baseProfileSchema.shape({
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .required('Company name is required'),
  companySize: Yup.string()
    .required('Company size is required'),
  industry: Yup.string()
    .required('Industry is required'),
  companyDescription: Yup.string()
    .min(50, 'Company description must be at least 50 characters')
    .max(2000, 'Company description must be less than 2000 characters')
    .required('Company description is required'),
  companyWebsite: Yup.string()
    .url('Invalid company website URL')
    .optional(),
  foundedYear: Yup.number()
    .min(1800, 'Founded year seems too early')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),
  headquarters: Yup.object({
    city: Yup.string().required('Headquarters city is required'),
    state: Yup.string().required('Headquarters state is required'),
    country: Yup.string().required('Headquarters country is required'),
  }),
  benefits: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one benefit is required')
    .max(20, 'Maximum 20 benefits allowed')
    .required('Benefits are required'),
  culture: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one culture value is required')
    .max(15, 'Maximum 15 culture values allowed')
    .required('Culture values are required'),
  techStack: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one technology is required')
    .max(30, 'Maximum 30 technologies allowed')
    .required('Tech stack is required'),
});

/**
 * Hook return type
 */
interface UseProfileValidationReturn {
  // Validation state
  errors: ProfileValidationErrors | null;
  isValid: boolean;
  isValidating: boolean;

  // Validation methods
  validateField: (fieldName: string, value: any) => Promise<string | null>;
  validateForm: (formData: JobSeekerProfileFormData | EmployerProfileFormData, role: UserRole) => Promise<boolean>;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  setFieldError: (fieldName: string, error: string) => void;

  // Utility methods
  getFieldError: (fieldName: string) => string | undefined;
  hasFieldError: (fieldName: string) => boolean;
}

/**
 * Profile validation hook
 * @returns Validation state and methods
 */
export function useProfileValidation(): UseProfileValidationReturn {
  const [errors, setErrors] = useState<ProfileValidationErrors | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Get the appropriate validation schema based on role
   */
  const getValidationSchema = useCallback((role: UserRole) => {
    return role === 'job_seeker' ? jobSeekerProfileSchema : employerProfileSchema;
  }, []);

  /**
   * Validate a single field
   */
  const validateField = useCallback(async (fieldName: string, value: any): Promise<string | null> => {
    setIsValidating(true);
    
    try {
      // For nested field paths (e.g., 'location.city'), we need to handle them specially
      const fieldPath = fieldName.split('.');
      let schema: Yup.Schema<any> = jobSeekerProfileSchema; // Default schema
      
      // Navigate to the nested schema if needed
      for (let i = 0; i < fieldPath.length - 1; i++) {
        schema = (schema as any).fields[fieldPath[i]];
      }
      
      const fieldSchema = (schema as any).fields[fieldPath[fieldPath.length - 1]];
      
      if (fieldSchema) {
        await fieldSchema.validate(value);
      }
      
      // Clear error for this field if validation passes
      if (errors?.[fieldName]) {
        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
        setIsValid(Object.keys(newErrors).length === 0);
      }
      
      return null;
    } catch (error: any) {
      const errorMessage = error.message || 'Validation error';
      
      // Set error for this field
      const newErrors = { ...errors, [fieldName]: errorMessage };
      setErrors(newErrors);
      setIsValid(false);
      
      return errorMessage;
    } finally {
      setIsValidating(false);
    }
  }, [errors]);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(async (
    formData: JobSeekerProfileFormData | EmployerProfileFormData,
    role: UserRole
  ): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const schema = getValidationSchema(role);
      await schema.validate(formData, { abortEarly: false });
      
      // Clear all errors if validation passes
      setErrors(null);
      setIsValid(true);
      return true;
    } catch (error: any) {
      if (error.inner) {
        // Yup validation errors
        const validationErrors: ProfileValidationErrors = {};
        
        error.inner.forEach((err: any) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        
        setErrors(validationErrors);
        setIsValid(false);
      } else {
        // Single error
        setErrors({ general: error.message });
        setIsValid(false);
      }
      
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [getValidationSchema]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors(null);
    setIsValid(true);
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    if (errors?.[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(Object.keys(newErrors).length > 0 ? newErrors : null);
      setIsValid(Object.keys(newErrors).length === 0);
    }
  }, [errors]);

  /**
   * Set error for a specific field
   */
  const setFieldError = useCallback((fieldName: string, error: string) => {
    const newErrors = { ...errors, [fieldName]: error };
    setErrors(newErrors);
    setIsValid(false);
  }, [errors]);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return errors?.[fieldName] as string | undefined;
  }, [errors]);

  /**
   * Check if a field has an error
   */
  const hasFieldError = useCallback((fieldName: string): boolean => {
    return !!errors?.[fieldName];
  }, [errors]);

  return {
    // State
    errors,
    isValid,
    isValidating,

    // Methods
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setFieldError,

    // Utilities
    getFieldError,
    hasFieldError,
  };
}
