import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  variant?: 'default' | 'profile' | 'compact';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ 
  variant = 'default', 
  className = '', 
  showLabel = false 
}: ThemeToggleProps) {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') === null &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'profile':
        return {
          button: 'relative inline-flex items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
          icon: 'w-5 h-5 transition-transform duration-200',
          label: 'ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'
        };
      case 'compact':
        return {
          button: 'p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          icon: 'w-4 h-4',
          label: 'ml-1.5 text-xs font-medium text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          button: 'p-2 rounded-full bg-white/30 dark:bg-zinc-800/30 border dark:border-zinc-600 transition',
          icon: 'w-5 h-5',
          label: 'ml-2 text-sm text-gray-600 dark:text-gray-400'
        };
    }
  };

  const styles = getVariantStyles();
  const themeLabel = darkMode ? 'Dark Mode' : 'Light Mode';

  return (
    <motion.button
      className={`${styles.button} ${className}`}
      onClick={() => setDarkMode(!darkMode)}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: variant === 'profile' ? 1.05 : 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      title={themeLabel}
    >
      <motion.div
        className={styles.icon}
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? (
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            className="text-blue-500 dark:text-blue-400"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        ) : (
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            className="text-yellow-500 dark:text-yellow-400"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        )}
      </motion.div>
      
      {showLabel && (
        <span className={styles.label}>
          {themeLabel}
        </span>
      )}
    </motion.button>
  );
}