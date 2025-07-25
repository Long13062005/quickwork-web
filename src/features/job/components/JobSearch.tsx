/**
 * Enhanced Job search component with advanced filtering
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { jobSearchValidationSchema } from '../../../utils/validation.schemas';
import { JobType, JOB_TYPE_OPTIONS } from '../../../types/job.types';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { JobSearchParams } from '../../../types/job.types';

interface JobSearchProps {
  onSearch: (params: JobSearchParams) => void;
  loading?: boolean;
  className?: string;
  initialValues?: JobSearchParams;
}

interface JobSearchFormValues {
  keyword: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  type: JobType | '';
  experienceLevel: string;
  postedWithin: string;
  remoteOption: boolean;
}

const JobSearch: React.FC<JobSearchProps> = ({ onSearch, loading = false, className = '', initialValues = {} }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { t } = useLanguage();

  const initialFormValues: JobSearchFormValues = {
    keyword: initialValues.keyword || '',
    location: initialValues.location || '',
    minSalary: initialValues.minSalary?.toString() || '',
    maxSalary: initialValues.maxSalary?.toString() || '',
    type: initialValues.type || '',
    experienceLevel: initialValues.experienceLevel || '',
    postedWithin: initialValues.postedWithin?.toString() || '',
    remoteOption: initialValues.remoteOption || false,
  };

  const experienceLevels = [
    { value: '', label: t('jobs.allLevels') },
    { value: '0-1', label: t('jobs.experienceLevels.entry') },
    { value: '2-5', label: t('jobs.experienceLevels.midLevel') },
    { value: '5-10', label: t('jobs.experienceLevels.senior') },
    { value: '10+', label: t('jobs.experienceLevels.executive') },
  ];

  const postedWithinOptions = [
    { value: '', label: t('jobs.anytime') },
    { value: '1', label: t('jobs.postedWithin.lastDay') },
    { value: '7', label: t('jobs.postedWithin.lastWeek') },
    { value: '30', label: t('jobs.postedWithin.lastMonth') },
    { value: '90', label: t('jobs.postedWithin.last3Months') },
  ];

  const handleSubmit = (values: JobSearchFormValues) => {
    const searchParams: JobSearchParams = {
      keyword: values.keyword || undefined,
      location: values.location || undefined,
      minSalary: values.minSalary ? Number(values.minSalary) : undefined,
      maxSalary: values.maxSalary ? Number(values.maxSalary) : undefined,
      type: values.type || undefined,
      experienceLevel: values.experienceLevel || undefined,
      postedWithin: values.postedWithin ? Number(values.postedWithin) : undefined,
      remoteOption: values.remoteOption || undefined,
    };

    // Remove empty values
    const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        acc[key as keyof JobSearchParams] = value;
      }
      return acc;
    }, {} as JobSearchParams);

    onSearch(cleanParams);
  };

  return (
    <motion.div
      className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-rose-100 dark:border-slate-700 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        {t('jobs.findPerfectJob')}
      </h2>

      <Formik
        initialValues={initialFormValues}
        validationSchema={jobSearchValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="space-y-4">
            {/* Basic Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('jobs.jobTitleKeywords')}
                </label>
                <Field
                  type="text"
                  id="keyword"
                  name="keyword"
                  placeholder={t('jobs.keywordPlaceholder')}
                  className="w-full px-4 py-3 border border-rose-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700/80 dark:text-white backdrop-blur-sm bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-700 dark:to-slate-600"
                />
                <ErrorMessage name="keyword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('jobs.location')}
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  placeholder={t('jobs.locationPlaceholder')}
                  className="w-full px-4 py-3 border border-orange-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-700/80 dark:text-white backdrop-blur-sm bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-600"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Remote work toggle */}
            <div className="flex items-center">
              <Field
                type="checkbox"
                id="remoteOption"
                name="remoteOption"
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-rose-300 rounded"
              />
              <label htmlFor="remoteOption" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                {t('jobs.includeRemoteJobs')}
              </label>
            </div>

            {/* Advanced Search Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 text-sm font-medium flex items-center"
              >
                <span className={`transform transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
                <span className="ml-1">
                  {isAdvancedOpen ? t('jobs.hideAdvancedFilters') : t('jobs.showAdvancedFilters')}
                </span>
              </button>
            </div>

            {/* Advanced Filters */}
            {isAdvancedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border-t border-rose-200 dark:border-slate-700 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minSalary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('jobs.minSalary')}
                    </label>
                    <Field
                      type="number"
                      id="minSalary"
                      name="minSalary"
                      placeholder={t('jobs.minSalaryPlaceholder')}
                      min="0"
                      className="w-full px-3 py-2 border border-rose-200 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:text-white"
                    />
                    <ErrorMessage name="minSalary" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="maxSalary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('jobs.maxSalary')}
                    </label>
                    <Field
                      type="number"
                      id="maxSalary"
                      name="maxSalary"
                      placeholder={t('jobs.maxSalaryPlaceholder')}
                      min="0"
                      className="w-full px-3 py-2 border border-rose-200 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:text-white"
                    />
                    <ErrorMessage name="maxSalary" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('jobs.jobType')}
                    </label>
                    <Field
                      as="select"
                      id="type"
                      name="type"
                      className="w-full px-3 py-2 border border-rose-200 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="">{t('jobs.allTypes')}</option>
                      {JOB_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(`jobs.types.${option.value.toLowerCase()}`)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('jobs.experienceLevel')}
                    </label>
                    <Field
                      as="select"
                      id="experienceLevel"
                      name="experienceLevel"
                      className="w-full px-3 py-2 border border-rose-200 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:text-white"
                    >
                      {experienceLevels.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="experienceLevel" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                <div>
                  <label htmlFor="postedWithin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('jobs.postedWithin.label')}
                  </label>
                  <Field
                    as="select"
                    id="postedWithin"
                    name="postedWithin"
                    className="w-full px-3 py-2 border border-rose-200 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:text-white"
                  >
                    {postedWithinOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="postedWithin" component="div" className="text-red-500 text-sm mt-1" />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 disabled:from-rose-400 disabled:via-pink-400 disabled:to-orange-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <span className="mr-2">🔍</span>
                {loading ? t('jobs.searching') : t('jobs.searchJobs')}
              </button>
              <button
                type="button"
                onClick={() => resetForm()}
                className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors rounded-xl border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
              >
                {t('jobs.clear')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default JobSearch;
