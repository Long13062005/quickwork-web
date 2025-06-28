/**
 * Email check status indicator component
 * Shows the status of email existence verification
 */

import React from 'react';
import { motion } from 'framer-motion';

interface EmailCheckStatusProps {
  /** Current status of email check */
  status: string;
  /** Whether email exists (null if check not completed) */
  emailExists: boolean | null;
  /** Whether to reduce motion for accessibility */
  shouldReduceMotion?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmailCheckStatus component for showing email verification status
 * @param props - Component props
 * @returns JSX element with email check status indicator
 */
export const EmailCheckStatus: React.FC<EmailCheckStatusProps> = ({
  status,
  emailExists,
  shouldReduceMotion = false,
  className = '',
}) => {
  // Don't render if status is idle
  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-4 h-4"
            >
              <svg
                className="w-full h-full text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </motion.div>
          ),
          text: 'Checking email availability...',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-700 dark:text-blue-300',
        };
      
      case 'succeeded':
        if (emailExists === true) {
          return {
            icon: (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ),
            text: 'Email already exists',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
            borderColor: 'border-red-200 dark:border-red-800',
            textColor: 'text-red-700 dark:text-red-300',
          };
        } else {
          return {
            icon: (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ),
            text: 'Email available',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            borderColor: 'border-green-200 dark:border-green-800',
            textColor: 'text-green-700 dark:text-green-300',
          };
        }
      
      case 'failed':
        return {
          icon: (
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ),
          text: 'Could not verify email',
          bgColor: 'bg-amber-50 dark:bg-amber-950/30',
          borderColor: 'border-amber-200 dark:border-amber-800',
          textColor: 'text-amber-700 dark:text-amber-300',
        };
      
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.2,
        ease: 'easeOut',
      }}
      className={`mt-2 p-2 rounded-md border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          {shouldReduceMotion ? (
            <div className="w-4 h-4">{config.icon}</div>
          ) : (
            config.icon
          )}
        </div>
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
    </motion.div>
  );
};
