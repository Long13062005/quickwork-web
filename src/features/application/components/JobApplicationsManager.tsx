/**
 * Job Applications Manager Component
 * Allows employers to view and manage applications for a specific job
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobApplications, updateApplicationStatus } from '../applicationSlice';
import EmployerApplicationCard from './EmployerApplicationCard';
import type { RootState, AppDispatch } from '../../../store';
import type { JobResponse } from '../../../types/job.types';
import type { ApplicationStatus } from '../../../types/application.types';
import { APPLICATION_STATUS_OPTIONS } from '../../../types/application.types';

interface JobApplicationsManagerProps {
  job: JobResponse;
  onClose: () => void;
}

const JobApplicationsManager: React.FC<JobApplicationsManagerProps> = ({
  job,
  onClose
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading, error, totalElements } = useSelector(
    (state: RootState) => state.application
  );
  
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Load applications when component mounts
  useEffect(() => {
    dispatch(fetchJobApplications({ jobId: job.id, page: currentPage, size: pageSize }));
  }, [dispatch, job.id, currentPage]);

  // Handle status update
  const handleStatusUpdate = async (id: number, status: ApplicationStatus, notes?: string) => {
    try {
      await dispatch(updateApplicationStatus({ id, status, notes })).unwrap();
      // Refresh applications after successful update
      dispatch(fetchJobApplications({ jobId: job.id, page: currentPage, size: pageSize }));
    } catch (error) {
      console.error('Failed to update application status:', error);
      throw error;
    }
  };

  // Filter applications based on status
  const filteredApplications = applications.filter(app => 
    statusFilter === 'ALL' || app.status === statusFilter
  );

  // Get application statistics
  const getApplicationStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: applications.length,
      pending: stats.PENDING || 0,
      reviewed: stats.REVIEWED || 0,
      shortlisted: stats.SHORTLISTED || 0,
      rejected: stats.REJECTED || 0,
      accepted: stats.ACCEPTED || 0
    };
  };

  const stats = getApplicationStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-zinc-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Applications for "{job.title}"
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {job.location} • {job.type}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-b border-gray-200 dark:border-zinc-700 p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.reviewed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Reviewed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.shortlisted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Shortlisted
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.accepted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Accepted
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.rejected}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rejected
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 dark:border-zinc-700 p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'ALL')}
              className="text-sm border border-gray-300 dark:border-zinc-600 rounded-md px-3 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Applications</option>
              {APPLICATION_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredApplications.length} of {totalElements} applications
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 mb-4">❌</div>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {statusFilter === 'ALL' ? 'No applications yet' : `No ${statusFilter.toLowerCase()} applications`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statusFilter === 'ALL' 
                  ? 'Applications will appear here once job seekers start applying.'
                  : `Try changing the filter to see applications with different statuses.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <EmployerApplicationCard
                  key={application.id}
                  application={application}
                  onStatusUpdate={handleStatusUpdate}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredApplications.length > 0 && (
          <div className="border-t border-gray-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage + 1} of {Math.ceil(totalElements / pageSize)}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={(currentPage + 1) * pageSize >= totalElements}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JobApplicationsManager;
