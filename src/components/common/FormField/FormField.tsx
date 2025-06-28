/**
 * Reusable form field component with validation states
 */

import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { motion } from 'framer-motion';
import type { FieldState } from '../../../types/auth.types';

/**
 * Props for FormField component
 */
interface FormFieldProps {
  /** Field name for Formik */
  name: string;
  /** Field type (text, email, password, etc.) */
  type: string;
  /** Field label text */
  label: string;
  /** Placeholder text */
  placeholder: string;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Current field state for styling */
  fieldState?: FieldState;
  /** Whether to reduce motion effects */
  shouldReduceMotion?: boolean;
  /** Custom onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Custom onBlur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Reusable form field component with validation styling and animations
 * @param props - Component props
 * @returns JSX element containing the form field
 */
export function FormField({
  name,
  type,
  label,
  placeholder,
  autoComplete,
  disabled = false,
  fieldState,
  shouldReduceMotion = false,
  onChange,
  onBlur,
}: FormFieldProps): React.JSX.Element {
  
  /**
   * Get field styling based on validation state
   */
  const getFieldClassName = (): string => {
    const baseClasses = `
      w-full px-3 py-2.5 text-sm lg:text-base border rounded-lg outline-none transition-all duration-200
      focus:ring-2 focus:ring-red-400/20 dark:focus:ring-pink-400/20
      disabled:opacity-50 disabled:cursor-not-allowed
      text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500
      hover:border-red-300 dark:hover:border-pink-400 hover:shadow-sm
    `;

    if (fieldState?.hasError) {
      return `${baseClasses} border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20`;
    }
    
    if (fieldState?.isValid) {
      return `${baseClasses} border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-950/20`;
    }
    
    return `${baseClasses} border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800`;
  };

  return (
    <div className="relative">
      <label 
        htmlFor={name} 
        className="block text-xs lg:text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
      >
        {label}
      </label>
      
      <div className="relative">
        <Field
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={getFieldClassName()}
          disabled={disabled}
          {...(onChange ? { onChange } : {})}
          {...(onBlur ? { onBlur } : {})}
        />
        
        {/* Field State Icons */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          {fieldState?.hasError && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <svg 
                className="w-4 h-4 text-red-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
            </motion.div>
          )}
          
          {fieldState?.showSuccess && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <svg 
                className="w-4 h-4 text-green-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Animated Error Message */}
      <ErrorMessage name={name}>
        {(msg) => (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
            className="text-red-500 text-sm mt-2 font-medium"
          >
            {msg}
          </motion.div>
        )}
      </ErrorMessage>
    </div>
  );
}
