/**
 * Job application card component for displaying application listings
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { JobApplicationResponse } from '../../../types/application.types';
import { canWithdrawApplication, APPLICATION_STATUS_OPTIONS } from '../../../types/application.types';

interface ApplicationCardProps {
  application: JobApplicationResponse;
  onWithdraw?: (id: number) => void;
  onView?: (application: JobApplicationResponse) => void;
  className?: string;
  showJobInfo?: boolean;
  showApplicantInfo?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onWithdraw, 
  onView,
  className = '',
  showJobInfo = true,
  showApplicantInfo = false
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (minSalary: number, maxSalary: number): string => {
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(0)}K`;
      } else {
        return `$${num}`;
      }
    };
    
    if (minSalary === maxSalary) {
      return formatNumber(minSalary);
    }
    return `${formatNumber(minSalary)} - ${formatNumber(maxSalary)}`;
  };

  const getStatusColor = (status: string): string => {
    const statusOption = APPLICATION_STATUS_OPTIONS.find(option => option.value === status);
    const colorMap: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colorMap[statusOption?.color || 'gray'] || colorMap.gray;
  };

  const handleCardClick = () => {
    if (onView) {
      onView(application);
    }
  };

  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onWithdraw && window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      onWithdraw(application.id);
    }
  };

  return (
    <motion.div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow ${onView ? 'cursor-pointer' : ''} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      whileHover={onView ? { scale: 1.02 } : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {showJobInfo && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {application.job.title}
            </h3>
          )}
          {showApplicantInfo && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {application.applicant.fullName}
            </h3>
          )}
          
          {showJobInfo && application.job.companyName && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {application.job.companyName}
            </p>
          )}
          
          {showApplicantInfo && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {application.applicant.email}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(application.status)}`}>
            {APPLICATION_STATUS_OPTIONS.find(option => option.value === application.status)?.label || application.status}
          </span>
        </div>
      </div>

      {/* Job/Application Details */}
      {showJobInfo && (
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{application.job.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">💰</span>
            <span>{formatSalary(application.job.minSalary, application.job.maxSalary)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏰</span>
            <span>{application.job.type.replace('_', ' ')}</span>
          </div>
        </div>
      )}

      {/* Application Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-1">📅</span>
            <span>Applied: {formatDate(application.appliedDate)}</span>
          </div>
          {application.lastUpdated !== application.appliedDate && (
            <div className="flex items-center">
              <span className="mr-1">🔄</span>
              <span>Updated: {formatDate(application.lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Preview */}
      {application.coverLetter && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cover Letter Preview:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {application.coverLetter}
          </p>
        </div>
      )}

      {/* Resume Link */}
      {application.resumeUrl && (
        <div className="mt-2">
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <span className="mr-1">📄</span>
            View Resume
          </a>
        </div>
      )}

      {/* Actions */}
      {onWithdraw && canWithdrawApplication(application.status as any) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleWithdraw}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            🚫 Withdraw Application
          </button>
        </div>
      )}

      {/* Notes (for employers) */}
      {application.notes && showApplicantInfo && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {application.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ApplicationCard;
