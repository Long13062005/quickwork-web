/**
 * Password strength evaluation hook
 */

import { useState, useCallback } from 'react';
import { PASSWORD_PATTERNS, PASSWORD_STRENGTH_COLORS, PASSWORD_STRENGTH_LABELS } from '../constants/auth.constants';

/**
 * Password strength evaluation result
 */
interface PasswordStrengthResult {
  strength: number;
  strengthText: string;
  strengthColor: string;
  updatePassword: (password: string) => void;
  reset: () => void;
}

/**
 * Hook for evaluating password strength
 * @returns Password strength utilities and state
 */
export function usePasswordStrength(): PasswordStrengthResult {
  const [strength, setStrength] = useState(0);

  /**
   * Evaluate password strength based on criteria
   * @param password - Password to evaluate
   * @returns Strength score (0-5)
   */
  const evaluatePasswordStrength = useCallback((password: string): number => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    
    // Character type checks
    if (PASSWORD_PATTERNS.UPPERCASE.test(password)) score++;
    if (PASSWORD_PATTERNS.LOWERCASE.test(password)) score++;
    if (PASSWORD_PATTERNS.NUMBERS.test(password)) score++;
    if (PASSWORD_PATTERNS.SPECIAL_CHARS.test(password)) score++;
    
    return score;
  }, []);

  /**
   * Update password and recalculate strength
   * @param password - New password value
   */
  const updatePassword = useCallback((password: string): void => {
    const newStrength = evaluatePasswordStrength(password);
    setStrength(newStrength);
  }, [evaluatePasswordStrength]);

  /**
   * Reset password strength to initial state
   */
  const reset = useCallback((): void => {
    setStrength(0);
  }, []);

  /**
   * Get strength text label
   */
  const strengthText = PASSWORD_STRENGTH_LABELS[strength as keyof typeof PASSWORD_STRENGTH_LABELS] || 'Very Weak';

  /**
   * Get strength color class
   */
  const strengthColor = PASSWORD_STRENGTH_COLORS[strength as keyof typeof PASSWORD_STRENGTH_COLORS] || 'bg-red-400';

  return {
    strength,
    strengthText,
    strengthColor,
    updatePassword,
    reset,
  };
}
