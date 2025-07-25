/**
 * Job filters and sorting component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

interface JobFiltersProps {
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onFilterChange?: (filters: JobFilterOptions) => void;
  className?: string;
}

interface JobFilterOptions {
  showRemoteOnly?: boolean;
  showOpenOnly?: boolean;
  salaryRange?: {
    min: number;
    max: number;
  };
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  onSortChange, 
  onFilterChange, 
  className = '' 
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('postedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<JobFilterOptions>({
    showRemoteOnly: false,
    showOpenOnly: true,
    salaryRange: undefined,
  });

  const sortOptions = [
    { value: 'postedDate', label: t('jobs.filters.sortBy.newest') },
    { value: 'title', label: t('jobs.filters.sortBy.title') },
    { value: 'minSalary', label: t('jobs.filters.sortBy.salary') },
    { value: 'applicationDeadline', label: t('jobs.filters.sortBy.deadline') },
  ];

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange?.(newSortBy, newSortOrder);
  };

  const handleFilterChange = (newFilters: Partial<JobFilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  return (
    <div className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('jobs.filters.title')}
          </h3>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            {isOpen ? t('jobs.filters.hide') : t('jobs.filters.show')}
          </button>
        </div>

        {/* Quick Sort Options - Always Visible */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('jobs.filters.sortBy.label')}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value, sortOrder)}
            className="text-sm border border-gray-300 dark:border-zinc-600 rounded-md px-2 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => handleSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title={sortOrder === 'asc' ? t('jobs.filters.sortDesc') : t('jobs.filters.sortAsc')}
          >
            <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
        </div>

        {/* Advanced Filters - Collapsible */}
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-4"
          >
            {/* Quick Filters */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showRemoteOnly}
                  onChange={(e) => handleFilterChange({ showRemoteOnly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('jobs.filters.remoteOnly')}
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showOpenOnly}
                  onChange={(e) => handleFilterChange({ showOpenOnly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t('jobs.filters.openOnly')}
                </span>
              </label>
            </div>

            {/* Salary Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('jobs.filters.salaryRange')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t('jobs.minSalary')}
                  value={filters.salaryRange?.min || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    handleFilterChange({
                      salaryRange: {
                        min: value || 0,
                        max: filters.salaryRange?.max || 999999,
                      }
                    });
                  }}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder={t('jobs.maxSalary')}
                  value={filters.salaryRange?.max || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    handleFilterChange({
                      salaryRange: {
                        min: filters.salaryRange?.min || 0,
                        max: value || 999999,
                      }
                    });
                  }}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setFilters({
                    showRemoteOnly: false,
                    showOpenOnly: true,
                    salaryRange: undefined,
                  });
                  setSortBy('postedDate');
                  setSortOrder('desc');
                  onFilterChange?.({
                    showRemoteOnly: false,
                    showOpenOnly: true,
                    salaryRange: undefined,
                  });
                  onSortChange?.('postedDate', 'desc');
                }}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {t('jobs.filters.clearAll')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobFilters;
