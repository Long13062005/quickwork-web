/**
 * Job detail page - individual job view
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, clearCurrentJob } from '../features/job/jobSlice';
import { applyForJob, checkApplicationStatus } from '../features/application/applicationSlice';
import { useProfile } from '../features/profile/hooks/useProfile';
import { parseJobId } from '../services/job';
import JobApplicationForm from '../features/application/components/JobApplicationForm';
import type { RootState, AppDispatch } from '../store';
import type { JobApplicationRequest } from '../types/application.types';
import toast from 'react-hot-toast';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentJob, loading, error } = useSelector((state: RootState) => state.job);
  const { loading: appLoading } = useSelector((state: RootState) => state.application);
  const { currentProfile } = useProfile();
  
  // Local state for application
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    if (id) {
      const jobId = parseJobId(id);
      if (jobId !== null) {
        dispatch(fetchJobById(jobId));
      } else {
        console.error('Invalid job ID:', id);
        navigate('/jobs', { replace: true });
      }
    }
    
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [id, dispatch, navigate]);

  // Check if user has already applied for this job
  useEffect(() => {
    if (currentJob && currentProfile?.role === 'jobseeker') {
      setCheckingApplication(true);
      dispatch(checkApplicationStatus(currentJob.id))
        .unwrap()
        .then((result) => {
          setHasApplied(result.hasApplied);
        })
        .catch((error) => {
          console.error('Failed to check application status:', error);
        })
        .finally(() => {
          setCheckingApplication(false);
        });
    }
  }, [currentJob, currentProfile, dispatch]);

  const handleApplyClick = () => {
    if (!currentProfile) {
      toast.error('Please complete your profile before applying');
      navigate('/profile/jobseeker');
      return;
    }
    
    if (currentProfile.role !== 'jobseeker') {
      toast.error('Only job seekers can apply for jobs');
      return;
    }
    
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (applicationData: JobApplicationRequest) => {
    if (!currentJob) return;
    
    try {
      await dispatch(applyForJob({ 
        jobId: currentJob.id, 
        applicationData 
      })).unwrap();
      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setHasApplied(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleApplicationCancel = () => {
    setShowApplicationForm(false);
  };

  const formatSalary = (minSalary: number, maxSalary: number): string => {
    const formatNumber = (num: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };
    
    if (minSalary === maxSalary) {
      return formatNumber(minSalary);
    }
    return `${formatNumber(minSalary)} - ${formatNumber(maxSalary)}`;
  };

  const formatJobType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-2">
              Job Not Found
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Back to Jobs
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Job Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Back to Jobs
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            <span className="mr-2">←</span>
            Back to Jobs
          </button>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentJob.title}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <span className="mr-2">🏢</span>
                <span className="text-lg">{currentJob.employer?.email || 'Company'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentJob.status === 'OPEN' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {currentJob.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Posted {formatDate(currentJob.postedDate)}
              </span>
            </div>
          </div>

          {/* Job Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="mr-2">📍</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">{currentJob.location}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="mr-2">💰</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">{formatSalary(currentJob.minSalary, currentJob.maxSalary)}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="mr-2">⏰</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">{formatJobType(currentJob.type)}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="mr-2">📅</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</span>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold">{formatDate(currentJob.applicationDeadline)}</p>
            </div>
          </div>

          {/* Apply Section - Job Seekers Only */}
          {currentProfile?.role === 'jobseeker' && (
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hasApplied ? (
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      ✅ You have already applied for this position
                    </span>
                  ) : (
                    <span>Ready to apply? Submit your application below.</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {checkingApplication ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : hasApplied ? (
                    <button
                      onClick={() => navigate('/my-applications')}
                      className="bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-900 dark:text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      View My Applications
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyClick}
                      disabled={appLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {appLoading ? '⏳ Applying...' : '📄 Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Info for Non-Job Seekers */}
          {(!currentProfile || currentProfile.role !== 'jobseeker') && (
            <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Contact: {currentJob.employer?.email || 'Not specified'}
                </div>
                <button
                  onClick={() => window.open(`mailto:${currentJob.employer?.email}?subject=Application for ${currentJob.title}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  📧 Contact Employer
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Job Description
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {currentJob.description}
            </p>
          </div>
        </motion.div>

        {/* Required Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {currentJob.requiredSkills.map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Experience & Deadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Required Experience
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {currentJob.requiredExperience} {currentJob.requiredExperience === 1 ? 'year' : 'years'} of experience
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Application Deadline
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {formatDate(currentJob.applicationDeadline)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Explore more opportunities or return to job listings.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/jobs')}
                className="bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-900 dark:text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                ← Back to Jobs
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                � More Jobs
              </button>
            </div>
          </div>
        </motion.div>

        {/* Job Application Form Modal */}
        {showApplicationForm && currentJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <JobApplicationForm
                job={currentJob}
                onSubmit={handleApplicationSubmit}
                onCancel={handleApplicationCancel}
                loading={appLoading}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
