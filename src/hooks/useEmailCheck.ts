/**
 * Custom hook for debounced email existence checking
 * Provides optimized email checking with debouncing and caching
 */

import { useCallback, useRef } from 'react';
import { useAppDispatch } from '../hooks';
import { checkEmailExist, clearEmailCheck } from '../features/auth/AuthSlice';

/**
 * Hook for debounced email existence checking
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with debouncedCheckEmail function
 */
export const useEmailCheck = (delay: number = 500) => {
  const dispatch = useAppDispatch();
  const timeoutRef = useRef<number | undefined>(undefined);
  const lastEmailRef = useRef<string>('');

  /**
   * Debounced email check function
   * @param email - Email address to check
   * @param onStart - Optional callback when check starts
   * @param onComplete - Optional callback when check completes
   */
  const debouncedCheckEmail = useCallback(
    (
      email: string,
      onStart?: () => void,
      onComplete?: (exists: boolean | null) => void
    ) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Skip if email is invalid or same as last checked
      if (!email || !email.includes('@') || email === lastEmailRef.current) {
        return;
      }

      // Clear previous check status
      dispatch(clearEmailCheck());

      // Set up debounced check
      timeoutRef.current = window.setTimeout(async () => {
        try {
          onStart?.();
          lastEmailRef.current = email;
          
          const result = await dispatch(checkEmailExist(email));
          
          if (checkEmailExist.fulfilled.match(result)) {
            onComplete?.(result.payload);
          } else {
            onComplete?.(null);
          }
        } catch (error) {
          console.error('Email check failed:', error);
          onComplete?.(null);
        }
      }, delay);
    },
    [dispatch, delay]
  );

  /**
   * Cancel any pending email check
   */
  const cancelCheck = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  /**
   * Clear email check state
   */
  const clearCheck = useCallback(() => {
    dispatch(clearEmailCheck());
    lastEmailRef.current = '';
  }, [dispatch]);

  return {
    debouncedCheckEmail,
    cancelCheck,
    clearCheck,
  };
};
