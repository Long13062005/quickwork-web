/**
 * Job card component for displaying job listings
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { JobResponse } from '../../../types/job.types';

interface JobCardProps {
  job: JobResponse;
  onClick?: (job: JobResponse) => void;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, className = '' }) => {
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

  const formatJobType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatDeadline = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Expired';
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `${diffInDays} days left`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks left`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className={`bg-white dark:bg-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-zinc-700 cursor-pointer ${className}`}
      onClick={() => onClick?.(job)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <span className="mr-2">🏢</span>
              <span className="text-sm">{job.employer?.email || 'Company'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(job.postedDate)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              job.status === 'OPEN' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        {/* Job Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">💰</span>
            <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏰</span>
            <span>{formatJobType(job.type)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📅</span>
            <span>{formatDeadline(job.applicationDeadline)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Required Skills Preview */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="border-t border-gray-200 dark:border-zinc-700 pt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{job.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;
