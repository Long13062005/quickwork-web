/**
 * Job form component for creating and editing jobs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { jobValidationSchema } from '../../../utils/validation.schemas';
import { JOB_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from '../../../types/job.types';
import type { JobFormValues, JobRequest, JobResponse } from '../../../types/job.types';

interface JobFormProps {
  job?: JobResponse;
  onSubmit: (values: JobRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

const JobForm: React.FC<JobFormProps> = ({ 
  job, 
  onSubmit, 
  onCancel, 
  loading = false, 
  className = '' 
}) => {
  const isEditing = !!job;

  const initialValues: JobFormValues = {
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    minSalary: job?.minSalary || '',
    maxSalary: job?.maxSalary || '',
    type: job?.type || 'FULL_TIME',
    requiredSkills: job?.requiredSkills || [],
    requiredExperience: job?.requiredExperience || '',
    applicationDeadline: job?.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
    status: job?.status || 'DRAFT',
  };

  const handleSubmit = (values: JobFormValues) => {
    const jobData: JobRequest = {
      ...values,
      minSalary: Number(values.minSalary),
      maxSalary: Number(values.maxSalary),
      requiredSkills: values.requiredSkills.filter(skill => skill.length > 0),
      requiredExperience: Number(values.requiredExperience),
      applicationDeadline: new Date(values.applicationDeadline).toISOString(),
      status: values.status,
    };
    onSubmit(jobData);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Job' : 'Post a New Job'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
        >
          ×
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={jobValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Location and Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g., New York, NY"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Type *
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                >
                  {JOB_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="type" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Salary (USD) *
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
                  Maximum Salary (USD) *
                </label>
                <Field
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  placeholder="e.g., 80000"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="maxSalary" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Experience, Deadline, and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="requiredExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Experience (Years) *
                </label>
                <Field
                  type="number"
                  id="requiredExperience"
                  name="requiredExperience"
                  placeholder="e.g., 3"
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="requiredExperience" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Application Deadline *
                </label>
                <Field
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                />
                <ErrorMessage name="applicationDeadline" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Status *
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                >
                  {JOB_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={6}
                placeholder="Describe the job role, responsibilities, and what makes this position exciting..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white resize-y"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Skills *
              </label>
              <Field name="requiredSkills">
                {({ field, form }: { field: any; form: any }) => (
                  <div>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const skill = e.currentTarget.value.trim();
                          if (skill && !field.value.includes(skill)) {
                            form.setFieldValue('requiredSkills', [...field.value, skill]);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = field.value.filter((_: string, i: number) => i !== index);
                              form.setFieldValue('requiredSkills', newSkills);
                            }}
                            className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Field>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Type each skill and press Enter to add it
              </p>
              <ErrorMessage name="requiredSkills" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? '⏳ Saving...' : isEditing ? '✏️ Update Job' : '📝 Post Job'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors border border-gray-300 dark:border-zinc-600 rounded-md"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default JobForm;
