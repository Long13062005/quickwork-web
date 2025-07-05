/**
 * Job listing page - main jobs view
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, searchJobsAdvanced } from '../features/job/jobSlice';
import JobCard from '../features/job/components/JobCard';
import JobSearch from '../features/job/components/JobSearch';
import type { RootState, AppDispatch } from '../store';
import type { JobResponse, JobSearchParams } from '../types/job.types';

const JobListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobs, loading, error, totalPages, currentPage, totalElements } = useSelector((state: RootState) => state.job);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({});
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load initial jobs
    dispatch(fetchJobs({ page: 0, size: 10 }));
  }, [dispatch]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover opportunities from top companies and take the next step in your career
          </p>
        </motion.div>

        {/* Search Section */}
        <div className="mb-8">
          <JobSearch 
            onSearch={handleSearch} 
            loading={isSearching}
          />
        </div>

        {/* Results Header */}
        {!loading && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Object.keys(searchParams).length > 0 ? 'Search Results' : 'All Jobs'}
              </h2>
              <span className="text-gray-600 dark:text-gray-400">
                {totalElements} jobs found
              </span>
            </div>
            
            {Object.keys(searchParams).length > 0 && (
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {searchParams.keyword && `Keywords: "${searchParams.keyword}"`}
                {searchParams.location && ` • Location: "${searchParams.location}"`}
                {searchParams.type && ` • Type: ${searchParams.type}`}
                {searchParams.minSalary && ` • Min Salary: $${searchParams.minSalary.toLocaleString()}`}
                {searchParams.maxSalary && ` • Max Salary: $${searchParams.maxSalary.toLocaleString()}`}
              </div>
            )}
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {isSearching ? 'Searching jobs...' : 'Loading jobs...'}
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
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or browse all available jobs
            </p>
            <button
              onClick={() => handleSearch({})}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              View All Jobs
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
              className="bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-medium py-2 px-6 rounded-md border border-gray-300 dark:border-zinc-600 transition-colors"
            >
              Load More Jobs
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobListing;
