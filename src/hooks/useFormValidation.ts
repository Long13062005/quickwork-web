/**
 * Form validation utilities hook
 */

import { useState, useCallback } from 'react';
import type { FieldStates } from '../types/auth.types';

/**
 * Form validation hook result
 */
interface FormValidationResult {
  fieldStates: FieldStates;
  globalErrors: string[];
  setGlobalErrors: (errors: string[]) => void;
  updateFieldStates: (values: any, errors: any, touched: any) => void;
  clearAllErrors: () => void;
}

/**
 * Hook for managing form validation state
 * @param fieldNames - Array of field names to track
 * @returns Form validation utilities and state
 */
export function useFormValidation(fieldNames: string[]): FormValidationResult {
  const [fieldStates, setFieldStates] = useState<FieldStates>({});
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);

  /**
   * Update field states based on form values, errors, and touched state
   * @param values - Current form values
   * @param errors - Current form errors
   * @param touched - Current form touched state
   */
  const updateFieldStates = useCallback((values: any, errors: any, touched: any): void => {
    const newFieldStates: FieldStates = {};
    
    fieldNames.forEach((fieldName) => {
      const fieldValue = values[fieldName];
      const hasError = !!(errors[fieldName] && touched[fieldName]);
      const hasValue = !!fieldValue;
      const isValid = hasValue && !errors[fieldName];
      
      newFieldStates[fieldName] = {
        hasError,
        hasValue,
        isValid,
        showSuccess: isValid && !!touched[fieldName],
      };
    });
    
    setFieldStates(newFieldStates);
  }, [fieldNames]);

  /**
   * Clear all error states
   */
  const clearAllErrors = useCallback((): void => {
    setGlobalErrors([]);
    setFieldStates({});
  }, []);

  return {
    fieldStates,
    globalErrors,
    setGlobalErrors,
    updateFieldStates,
    clearAllErrors,
  };
}
