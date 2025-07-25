/**
 * CV Page
 * Main page for CV management
 */

import { motion } from 'framer-motion';
import { CVManager } from '../features/cv/components/CVManager';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function CVPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Resume Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload and manage your CV files
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle variant="compact" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CVManager />
        </motion.div>
      </main>
    </div>
  );
}
