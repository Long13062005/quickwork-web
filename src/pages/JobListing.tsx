/**
 * Job listing page - main jobs view
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJobs, searchJobsAdvanced } from '../features/job/jobSlice';
import JobCard from '../features/job/components/JobCard';
import JobSearch from '../features/job/components/JobSearch';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import type { RootState, AppDispatch } from '../store';
import type { JobResponse, JobSearchParams } from '../types/job.types';

const JobListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const { t } = useLanguage();
  const { jobs, loading, error, totalPages, currentPage, totalElements } = useSelector((state: RootState) => state.job);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({});
  const [isSearching, setIsSearching] = useState(false);
  const [initialSearchValues, setInitialSearchValues] = useState<JobSearchParams>({});

  useEffect(() => {
    // Extract search parameters from URL
    const keyword = urlSearchParams.get('keyword') || '';
    const location = urlSearchParams.get('location') || '';
    
    const urlParams: JobSearchParams = {};
    if (keyword) urlParams.keyword = keyword;
    if (location) urlParams.location = location;
    
    setInitialSearchValues(urlParams);
    
    // If there are URL parameters, search with them
    if (Object.keys(urlParams).length > 0) {
      setSearchParams(urlParams);
      dispatch(searchJobsAdvanced({ ...urlParams, page: 0, size: 10 }));
    } else {
      // Load initial jobs
      dispatch(fetchJobs({ page: 0, size: 10 }));
    }
  }, [dispatch, urlSearchParams]);

  const handleSearch = async (params: JobSearchParams) => {
    setSearchParams(params);
    setIsSearching(true);
    
    try {
      if (Object.keys(params).length === 0) {
        // If no search params, fetch all jobs
        await dispatch(fetchJobs({ page: 0, size: 10 }));
      } else {
        // Use advanced search
        await dispatch(searchJobsAdvanced({ ...params, page: 0, size: 10 }));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleJobClick = (job: JobResponse) => {
    navigate(`/jobs/${job.id}`);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    if (Object.keys(searchParams).length === 0) {
      dispatch(fetchJobs({ page: nextPage, size: 10 }));
    } else {
      dispatch(searchJobsAdvanced({ ...searchParams, page: nextPage, size: 10 }));
    }
  };

  const hasMore = currentPage < totalPages - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-900 dark:via-zinc-900 dark:to-slate-800 relative overflow-hidden transition-all duration-500">
      {/* Enhanced background overlay patterns */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/5 via-transparent to-pink-50/8 dark:from-rose-900/3 dark:via-transparent dark:to-pink-900/5" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-orange-50/3 to-rose-50/6 dark:from-transparent dark:via-orange-900/2 dark:to-rose-900/4" />
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-repeat" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)",
        backgroundSize: "20px 20px"
      }} />
      
      {/* Floating ambient background elements */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-rose-300/10 via-pink-300/5 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          rotate: [360, 180, 0],
          scale: [1, 0.9, 1]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-3/4 right-1/3 w-80 h-80 bg-gradient-radial from-orange-300/8 via-amber-300/4 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, 60, 0],
          y: [0, -40, 0],
          rotate: [0, -90, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
        className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-radial from-pink-300/6 via-rose-300/3 to-transparent rounded-full blur-2xl"
      />
      
      {/* Additional ambient particles */}
      <motion.div
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/3 left-3/4 w-32 h-32 bg-gradient-radial from-orange-300/6 to-transparent rounded-full blur-2xl"
      />
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          y: [0, -25, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7
        }}
        className="absolute bottom-1/3 left-1/5 w-40 h-40 bg-gradient-radial from-pink-300/4 to-transparent rounded-full blur-2xl"
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation Bar */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-center mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-rose-100 dark:border-slate-700"
        >
          {/* Left side - Back to Home */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-all duration-300 font-medium"
          >
            <motion.svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            {t('buttons.backToHome')}
          </motion.button>
          
          {/* Center - Page Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden sm:block"
          >
            {/* <h1 className="text-xl font-bold bg-gradient-to-r from-matcha to-sakura bg-clip-text text-transparent">
              {'Job Listings'}
            </h1> */}
          </motion.div>
          
          {/* Right side - Controls */}
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ThemeToggle variant="compact" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LanguageSwitcher />
            </motion.div>
          </div>
        </motion.nav>
        
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center mb-12"
        >
          {/* Floating decoration elements */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-rose-300/30 to-pink-300/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -8, 0] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -top-4 -right-12 w-16 h-16 bg-gradient-to-br from-orange-300/30 to-amber-300/20 rounded-full blur-xl"
          />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-rose-600 to-pink-600 dark:from-slate-200 dark:via-rose-400 dark:to-pink-400 bg-clip-text text-transparent mb-6"
          >
            {t('jobs.findDreamJob')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('jobs.discoverOpportunities')}
          </motion.p>
          
          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto mt-6 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
          />
        </motion.div>

        {/* Enhanced Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-10"
        >
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-rose-100 dark:border-slate-700">
            <JobSearch 
              onSearch={handleSearch} 
              loading={isSearching}
              initialValues={initialSearchValues}
            />
          </div>
        </motion.div>

        {/* Enhanced Results Header */}
        {!loading && !isSearching && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-rose-100/10 dark:border-slate-700/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {Object.keys(searchParams).length > 0 ? t('jobs.searchResults') : t('jobs.allJobs')}
                  </h2>
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-sm font-medium"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-2 h-2 bg-rose-500 dark:bg-rose-400 rounded-full mr-2"
                    />
                    {totalElements} {t('jobs.jobsFound')}
                  </motion.span>
                </motion.div>
              </div>
              
              {Object.keys(searchParams).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-200 dark:border-rose-800/30"
                >
                  <div className="flex flex-wrap gap-2 text-sm text-rose-700 dark:text-rose-300">
                    {searchParams.keyword && (
                      <span className="bg-rose-100 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                        {t('jobs.keywords')}: "{searchParams.keyword}"
                      </span>
                    )}
                    {searchParams.location && (
                      <span className="bg-rose-100 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                        {t('jobs.location')}: "{searchParams.location}"
                      </span>
                    )}
                    {searchParams.type && (
                      <span className="bg-rose-100 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                        {t('jobs.type')}: {searchParams.type}
                      </span>
                    )}
                    {searchParams.minSalary && (
                      <span className="bg-rose-100 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                        {t('jobs.minSalary')}: ${searchParams.minSalary.toLocaleString()}
                      </span>
                    )}
                    {searchParams.maxSalary && (
                      <span className="bg-rose-100 dark:bg-rose-900/20 px-2 py-1 rounded-md">
                        {t('jobs.maxSalary')}: ${searchParams.maxSalary.toLocaleString()}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
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
        {(loading || isSearching) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 dark:border-rose-400"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {isSearching ? t('jobs.searchingJobs') : t('jobs.loadingJobs')}
            </p>
          </motion.div>
        )}

        {/* Job Grid */}
        {!loading && !isSearching && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  onClick={handleJobClick}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !isSearching && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {t('jobs.noJobsFound')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t('jobs.adjustSearchCriteria')}
            </p>
            <button
              onClick={() => handleSearch({})}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {t('jobs.viewAllJobs')}
            </button>
          </motion.div>
        )}

        {/* Load More Button */}
        {!loading && !isSearching && jobs.length > 0 && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleLoadMore}
              className="bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-3 px-8 rounded-lg border border-rose-200 dark:border-slate-600 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-xl"
            >
              {t('jobs.loadMoreJobs')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobListing;
