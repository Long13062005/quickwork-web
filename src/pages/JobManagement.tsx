/**
 * Job management page for employers
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyJobs, createJob, updateJob, deleteJob, clearError } from '../features/job/jobSlice';
import JobForm from '../features/job/components/JobForm';
import JobCard from '../features/job/components/JobCard';
import JobApplicationsManager from '../features/application/components/JobApplicationsManager';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import type { RootState, AppDispatch } from '../store';
import type { JobRequest, JobResponse } from '../types/job.types';

const JobManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { myJobs, loading, error } = useSelector((state: RootState) => state.job);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobResponse | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<JobResponse | null>(null);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
    dispatch(fetchMyJobs());
  }, [dispatch]);

  const handleCreateJob = async (jobData: JobRequest) => {
    try {
      await dispatch(createJob(jobData)).unwrap();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleUpdateJob = async (jobData: JobRequest) => {
    if (!editingJob) return;
    
    try {
      await dispatch(updateJob({ id: editingJob.id, jobData })).unwrap();
      setEditingJob(null);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm(t('jobManagement.confirmDelete'))) {
      try {
        await dispatch(deleteJob(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const handleEditJob = (job: JobResponse) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const handleShowApplications = (job: JobResponse) => {
    setSelectedJobForApplications(job);
    setShowApplications(true);
  };

  const handleCloseApplications = () => {
    setShowApplications(false);
    setSelectedJobForApplications(null);
  };

  const getJobStats = () => {
    const total = myJobs.length;
    const open = myJobs.filter(job => job.status === 'OPEN').length;
    const closed = myJobs.filter(job => job.status === 'CLOSED').length;
    const draft = myJobs.filter(job => job.status === 'DRAFT').length;
    
    return { total, open, closed, draft };
  };

  const stats = getJobStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Header with Back Button and Language Switcher */}
          <div className="flex items-center justify-between mb-4">
            {/* Back to Dashboard Button */}
            <motion.button
              onClick={() => navigate('/employer/dashboard')}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-300 font-medium"
            >
              <motion.svg 
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </motion.svg>
              {t('jobManagement.backToDashboard')}
            </motion.button>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('jobManagement.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {myJobs.length === 0 
                  ? t('jobManagement.emptyDescription')
                  : t('jobManagement.description')
                }
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className={`font-medium py-2 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                myJobs.length === 0
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
              }`}
            >
              {myJobs.length === 0 ? t('jobManagement.createFirstJob') : t('jobManagement.postNewJob')}
            </button>
          </div>
        </motion.div>

        {/* Statistics - Only show when there are jobs */}
        {myJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📊</div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('jobManagement.stats.totalJobs')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">✅</div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('jobManagement.stats.open')}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.open}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">❌</div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('jobManagement.stats.closed')}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.closed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">📝</div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('jobManagement.stats.draft')}</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.draft}</p>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Job Form Modal */}
        {showForm && (
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
              className="bg-white dark:bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <JobForm
                job={editingJob || undefined}
                onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
                onCancel={handleCancelForm}
                loading={loading}
                isFirstJob={myJobs.length === 0 && !editingJob}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Job Applications Manager Modal */}
        {showApplications && selectedJobForApplications && (
          <JobApplicationsManager
            job={selectedJobForApplications}
            onClose={handleCloseApplications}
          />
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 mr-2">❌</span>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('jobManagement.loading')}</p>
          </motion.div>
        )}

        {/* Job List */}
        {!loading && myJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('jobManagement.yourJobs')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <JobCard
                    job={job}
                    className="h-full"
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShowApplications(job)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                        title={t('jobManagement.viewApplications')}
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                        title={t('jobManagement.editJob')}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                        title={t('jobManagement.deleteJob')}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && myJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4"
          >
            <div className="max-w-md mx-auto">
              {/* Empty Status Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
                📭 {t('jobManagement.empty')}
              </div>
              
              <div className="text-8xl mb-6">🏢</div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('jobManagement.welcomeTitle')}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {t('jobManagement.welcomeDescription')}
              </p>
              
              {/* Benefits list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">👥</div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t('jobManagement.benefits.findTalent')}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">📊</div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    {t('jobManagement.benefits.trackApplications')}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    {t('jobManagement.benefits.quickHiring')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('jobManagement.postFirstJob')}
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t('jobManagement.quickStart')}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobManagement;
