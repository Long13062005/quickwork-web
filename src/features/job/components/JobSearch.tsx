/**
 * Job search component with advanced filtering
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { jobSearchValidationSchema } from '../../../utils/validation.schemas';
import { JobType, JOB_TYPE_OPTIONS } from '../../../types/job.types';
import type { JobSearchParams } from '../../../types/job.types';

interface JobSearchProps {
  onSearch: (params: JobSearchParams) => void;
  loading?: boolean;
  className?: string;
}

interface JobSearchFormValues {
  keyword: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  type: JobType | '';
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch, loading = false, className = '' }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const initialValues: JobSearchFormValues = {
    keyword: '',
    location: '',
    minSalary: '',
    maxSalary: '',
    type: '',
  };

  const handleSubmit = (values: JobSearchFormValues) => {
    const searchParams: JobSearchParams = {
      keyword: values.keyword || undefined,
      location: values.location || undefined,
      minSalary: values.minSalary ? Number(values.minSalary) : undefined,
      maxSalary: values.maxSalary ? Number(values.maxSalary) : undefined,
      type: values.type || undefined,
    };

    // Remove empty values
    const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '') {
        acc[key as keyof JobSearchParams] = value;
      }
      return acc;
    }, {} as JobSearchParams);

    onSearch(cleanParams);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Find Your Perfect Job
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={jobSearchValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="space-y-4">
            {/* Basic Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title or Keywords
                </label>
                <Field
                  type="text"
                  id="keyword"
                  name="keyword"
                  placeholder="e.g., Software Engineer, Marketing"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="keyword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., New York, Remote"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Advanced Search Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                {isAdvancedOpen ? '▲ Hide Advanced Filters' : '▼ Show Advanced Filters'}
              </button>
            </div>

            {/* Advanced Filters */}
            {isAdvancedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border-t border-gray-200 dark:border-zinc-700 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Salary
                    </label>
                    <Field
                      type="number"
                      id="minSalary"
                      name="minSalary"
                      placeholder="e.g., 50000"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                    />
                    <ErrorMessage name="minSalary" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Salary
                    </label>
                    <Field
                      type="number"
                      id="maxSalary"
                      name="maxSalary"
                      placeholder="e.g., 100000"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                    />
                    <ErrorMessage name="maxSalary" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Type
                  </label>
                  <Field
                    as="select"
                    id="type"
                    name="type"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {JOB_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? '🔍 Searching...' : '🔍 Search Jobs'}
              </button>
              <button
                type="button"
                onClick={() => resetForm()}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default JobSearch;
