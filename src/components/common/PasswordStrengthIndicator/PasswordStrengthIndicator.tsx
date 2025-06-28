/**
 * Password strength indicator component
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Props for PasswordStrengthIndicator component
 */
interface PasswordStrengthIndicatorProps {
  /** Password strength score (0-5) */
  strength: number;
  /** Text description of strength */
  strengthText: string;
  /** Color class for strength bars */
  strengthColor: string;
  /** Whether to reduce motion effects */
  shouldReduceMotion?: boolean;
}

/**
 * Password strength indicator with animated bars
 * @param props - Component props
 * @returns JSX element containing the strength indicator
 */
export function PasswordStrengthIndicator({
  strength,
  strengthText,
  strengthColor,
  shouldReduceMotion = false,
}: PasswordStrengthIndicatorProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
      className="mt-1.5"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-zinc-600 dark:text-zinc-400">
          Password Strength: {strengthText}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : i * 0.05,
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              i < strength 
                ? strengthColor
                : 'bg-gray-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
