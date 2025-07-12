/**
 * Job Favorites/Bookmarks page
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JobCard from '../features/job/components/JobCard';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import type { JobResponse } from '../types/job.types';

const JobFavorites: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load bookmarked jobs from localStorage or API
    loadBookmarkedJobs();
  }, []);

  const loadBookmarkedJobs = async () => {
    try {
      // For now, use localStorage. In production, this would be an API call
      const savedBookmarks = localStorage.getItem('bookmarkedJobs');
      if (savedBookmarks) {
        setBookmarkedJobs(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Failed to load bookmarked jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: JobResponse) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleBookmarkToggle = (jobId: number) => {
    const updatedJobs = bookmarkedJobs.filter(job => job.id !== jobId);
    setBookmarkedJobs(updatedJobs);
    
    // Update localStorage
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedJobs));
  };

  const handleBackToJobs = () => {
    navigate('/jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('jobs.loadingFavorites')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToJobs}
              className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('jobs.backToSearch')}
            </button>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('jobs.favorites.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('jobs.favorites.subtitle')}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('jobs.favorites.saved')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {bookmarkedJobs.length} {t('jobs.favorites.jobsSaved')}
                </p>
              </div>
              <div className="text-2xl">❤️</div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {bookmarkedJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bookmarkedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  onClick={handleJobClick}
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('jobs.favorites.empty')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {t('jobs.favorites.emptyDescription')}
            </p>
            <button
              onClick={handleBackToJobs}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              {t('jobs.favorites.startBrowsing')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobFavorites;
