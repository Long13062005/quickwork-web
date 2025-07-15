/**
 * Job application card component for displaying application listings
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { ApplicationEntity } from '../../../types/application.types';
import { canWithdrawApplication, APPLICATION_STATUS_OPTIONS } from '../../../types/application.types';

interface ApplicationCardProps {
  application: ApplicationEntity;
  onWithdraw?: (id: number) => void;
  onView?: (application: ApplicationEntity) => void;
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
  const { t } = useLanguage();

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
    if (onWithdraw && window.confirm(t('applications.actions.confirmWithdraw'))) {
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
              {application.jobTitle}
            </h3>
          )}
          {showApplicantInfo && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {application.userEmail}
            </h3>
          )}
          
          {showJobInfo && application.employerEmail && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Employer: {application.employerEmail}
            </p>
          )}
          
          {showApplicantInfo && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {application.userEmail}
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
            <span>{application.jobLocation}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">💰</span>
            <span>{formatSalary(application.minSalary, application.maxSalary)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏰</span>
            <span>{application.jobType.replace('_', ' ')}</span>
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
        </div>
      </div>

      {/* Job Description Preview */}
      {showJobInfo && application.jobDescription && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Job Description:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {application.jobDescription}
          </p>
        </div>
      )}

      {/* Required Skills */}
      {showJobInfo && application.requiredSkills && application.requiredSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {application.requiredSkills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {application.requiredSkills.length > 5 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{application.requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {onWithdraw && canWithdrawApplication(application.status as any) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={handleWithdraw}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            🚫 {t('applications.actions.withdraw')}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ApplicationCard;
