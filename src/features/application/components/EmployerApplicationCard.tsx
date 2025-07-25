/**
 * Employer Application Card Component
 * Displays application information for employers with management actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { JobApplicationResponse, ApplicationStatus } from '../../../types/application.types';
import { APPLICATION_STATUS_OPTIONS, getApplicationStatusColor } from '../../../types/application.types';

interface EmployerApplicationCardProps {
  application: JobApplicationResponse;
  onStatusUpdate: (id: number, status: ApplicationStatus, notes?: string) => Promise<void>;
  loading?: boolean;
}

const EmployerApplicationCard: React.FC<EmployerApplicationCardProps> = ({
  application,
  onStatusUpdate,
  loading = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(application.status);
  const [notes, setNotes] = useState(application.notes || '');

  const handleStatusUpdate = async () => {
    if (selectedStatus === application.status) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(application.id, selectedStatus, notes);
    } catch (error) {
      console.error('Failed to update application status:', error);
      // Reset to original status on error
      setSelectedStatus(application.status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const color = getApplicationStatusColor(status);
    const statusOption = APPLICATION_STATUS_OPTIONS.find(option => option.value === status);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200`}>
        {statusOption?.label || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {application.applicant.fullName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {application.applicant.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Applied on {formatDate(application.appliedDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(application.status)}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {showDetails ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Job Information */}
      <div className="bg-gray-50 dark:bg-zinc-700 rounded-md p-3 mb-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Position: {application.job.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {application.job.location} • {application.job.type}
        </p>
        {application.job.minSalary && application.job.maxSalary && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${application.job.minSalary.toLocaleString()} - ${application.job.maxSalary.toLocaleString()}
          </p>
        )}
      </div>

      {/* Status Management */}
      <div className="border-t border-gray-200 dark:border-zinc-600 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
            className="text-sm border border-gray-300 dark:border-zinc-600 rounded-md px-3 py-1 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUpdating || loading}
          >
            {APPLICATION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {selectedStatus !== application.status && (
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          )}
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
            Notes:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm border border-gray-300 dark:border-zinc-600 rounded-md px-3 py-2 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Add notes about this application..."
            disabled={isUpdating || loading}
          />
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-zinc-600 pt-4 mt-4"
        >
          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Cover Letter
              </h4>
              <div className="bg-gray-50 dark:bg-zinc-700 rounded-md p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Resume
              </h4>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                📄 View Resume
              </a>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Application Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Applied on {formatDate(application.appliedDate)}
              </div>
              {application.lastUpdated !== application.appliedDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Last updated on {formatDate(application.lastUpdated)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmployerApplicationCard;
