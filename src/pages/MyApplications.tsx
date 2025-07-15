/**
 * My Applications page for job seekers
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyApplications, withdrawApplication, fetchApplicationStatistics } from '../features/application/applicationSlice';
import ApplicationCard from '../features/application/components/ApplicationCard';
import type { RootState, AppDispatch } from '../store';

const MyApplications: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { myApplications, statistics, loading, error } = useSelector((state: RootState) => state.application);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchMyApplications());
    dispatch(fetchApplicationStatistics());
  }, [dispatch]);

  const handleWithdrawApplication = async (id: number) => {
    try {
      await dispatch(withdrawApplication(id)).unwrap();
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    }
  };

  const filteredApplications = filterStatus === 'all' 
    ? myApplications 
    : myApplications.filter(app => app.status === filterStatus);

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: myApplications.length,
      PENDING: 0,
      REVIEWED: 0,
      SHORTLISTED: 0,
      INTERVIEW_SCHEDULED: 0,
      OFFERED: 0,
      REJECTED: 0,
    };

    myApplications.forEach(app => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your job applications and their status
          </p>
        </motion.div>

        {/* Statistics */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalApplications}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.pendingApplications}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{statistics.shortlistedApplications}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{statistics.interviewsScheduled}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Interviews</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.offersReceived}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Offers</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.rejectedApplications}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200 dark:border-zinc-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Applications', count: statusCounts.all },
                { key: 'PENDING', label: 'Pending', count: statusCounts.PENDING },
                { key: 'REVIEWED', label: 'Reviewed', count: statusCounts.REVIEWED },
                { key: 'SHORTLISTED', label: 'Shortlisted', count: statusCounts.SHORTLISTED },
                { key: 'INTERVIEW_SCHEDULED', label: 'Interviews', count: statusCounts.INTERVIEW_SCHEDULED },
                { key: 'OFFERED', label: 'Offers', count: statusCounts.OFFERED },
                { key: 'REJECTED', label: 'Rejected', count: statusCounts.REJECTED },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    filterStatus === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

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
        {loading && filteredApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your applications...</p>
          </motion.div>
        )}

        {/* Applications List */}
        {!loading && filteredApplications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ApplicationCard
                    application={application}
                    onWithdraw={handleWithdrawApplication}
                    showJobInfo={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {filterStatus === 'all' ? 'No applications yet' : `No ${filterStatus.toLowerCase()} applications`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus === 'all' 
                ? 'Start applying for jobs to see your applications here'
                : `You don't have any applications with ${filterStatus.toLowerCase()} status`
              }
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => navigate('/jobs')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                🔍 Browse Jobs
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
