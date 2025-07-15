/**
 * Job application form component with CV upload
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { applyToJobWithCV } from '../applicationSlice';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AppDispatch } from '../../../store';
import type { JobApplicationRequest } from '../../../types/application.types';
import type { JobResponse } from '../../../types/job.types';

interface JobApplicationFormProps {
  job: JobResponse;
  onSubmit?: (values: JobApplicationRequest) => void;
  onCancel: () => void;
  onSuccess?: () => void;
  loading?: boolean;
  className?: string;
}

const applicationValidationSchema = Yup.object({
  coverLetter: Yup.string()
    .min(50, 'Cover letter must be at least 50 characters')
    .max(2000, 'Cover letter must be less than 2000 characters'),
  cvFile: Yup.mixed().required('CV file is required')
});

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ 
  job, 
  onSubmit, 
  onCancel, 
  onSuccess,
  loading = false, 
  className = '' 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useLanguage();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const initialValues = {
    coverLetter: '',
    resumeUrl: '',
    cvFile: null
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        // Use legacy onSubmit if provided
        const applicationData: JobApplicationRequest = {
          jobId: job.id,
          coverLetter: values.coverLetter,
          resumeUrl: values.resumeUrl || undefined,
        };
        onSubmit(applicationData);
      } else {
        // Use new CV upload API
        await dispatch(applyToJobWithCV({
          jobId: job.id,
          data: {
            coverLetter: values.coverLetter,
            cvFile: values.cvFile
          }
        })).unwrap();
        
        toast.success(t('applications.applySuccess') || 'Application submitted successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(t('applications.applyError') || 'Failed to submit application');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, setFieldValue: any) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        setFieldValue('cvFile', file);
        setResumeFile(file);
      } else {
        toast.error(t('applications.invalidFileType') || 'Please select a valid file type (PDF, DOC, DOCX)');
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `From $${min.toLocaleString()}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return 'Salary not specified';
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
          Apply for Position
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Job Summary */}
      <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {job.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">💰</span>
            <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏰</span>
            <span>{job.type.replace('_', ' ')}</span>
          </div>
        </div>
        {job.employer?.email && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Company Contact: {job.employer.email}
          </p>
        )}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={applicationValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Letter *
              </label>
              <Field
                as="textarea"
                id="coverLetter"
                name="coverLetter"
                rows={8}
                placeholder="Tell the employer why you're the perfect fit for this role. Highlight your relevant experience, skills, and enthusiasm for the position..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white resize-y"
              />
              <ErrorMessage name="coverLetter" component="div" className="text-red-500 text-sm mt-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {values.coverLetter.length}/2000 characters (minimum 50)
              </p>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resume/CV
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg p-6">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="resume" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Upload your resume
                      </span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
                {resumeFile && (
                  <div className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-zinc-600 rounded-md p-3">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{resumeFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume URL (alternative) */}
            <div>
              <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or provide a link to your resume
              </label>
              <Field
                type="url"
                id="resumeUrl"
                name="resumeUrl"
                placeholder="https://your-resume-url.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:text-white"
              />
              <ErrorMessage name="resumeUrl" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* CV Upload (new) */}
            <div>
              <label htmlFor="cvFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload your CV *
              </label>
              <div
                className={`border-2 ${dragOver ? 'border-blue-500' : 'border-gray-300'} dark:border-zinc-600 rounded-lg p-6 transition-all`}
                onDragOver={(e) => { e.preventDefault(); handleDragOver(e); }}
                onDragLeave={(e) => { e.preventDefault(); handleDragLeave(e); }}
                onDrop={(e) => { handleDrop(e, setFieldValue); }}
              >
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="mt-4">
                    <Field
                      id="cvFile"
                      name="cvFile"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue('cvFile', file);
                          setResumeFile(file);
                        }
                      }}
                      className="sr-only"
                    />
                    <label htmlFor="cvFile" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                        {resumeFile ? resumeFile.name : 'Drag and drop your CV here or click to upload'}
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
                {resumeFile && (
                  <div className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-zinc-600 rounded-md p-3">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{resumeFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <ErrorMessage name="cvFile" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? '⏳ Submitting Application...' : '📄 Submit Application'}
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

export default JobApplicationForm;
