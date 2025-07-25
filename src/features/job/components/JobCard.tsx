/**
 * Job card component for displaying job listings
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { JobResponse } from '../../../types/job.types';

interface JobCardProps {
  job: JobResponse;
  onClick?: (job: JobResponse) => void;
  className?: string;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: (jobId: number) => void;
}

// Icons
const BookmarkIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onClick, 
  className = '',
  showBookmark = true,
  isBookmarked = false,
  onBookmarkToggle
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  
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
    
    if (diffInDays === 0) return t('jobs.today');
    if (diffInDays === 1) return t('jobs.yesterday');
    if (diffInDays < 7) return t('jobs.daysAgo', { days: diffInDays });
    if (diffInDays < 30) return t('jobs.weeksAgo', { weeks: Math.floor(diffInDays / 7) });
    return date.toLocaleDateString();
  };

  const formatDeadline = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return t('jobs.expired');
    if (diffInDays === 0) return t('jobs.today');
    if (diffInDays === 1) return t('jobs.tomorrow');
    if (diffInDays < 7) return t('jobs.daysLeft', { days: diffInDays });
    if (diffInDays < 30) return t('jobs.weeksLeft', { weeks: Math.floor(diffInDays / 7) });
    return date.toLocaleDateString();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(job);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get current bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedJobs');
    const bookmarkedJobs = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarkedJobs.filter((bookmarkedJob: any) => bookmarkedJob.id !== job.id);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
    } else {
      // Add to bookmarks
      const updatedBookmarks = [...bookmarkedJobs, job];
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
    }
    
    onBookmarkToggle?.(job.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `${job.title} at ${job.employer?.email || 'Company'}`,
        url: `${window.location.origin}/jobs/${job.id}`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}?apply=true`);
  };

  return (
    <motion.div
      className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-100 dark:border-slate-700 cursor-pointer relative group ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Action Buttons Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showActions ? 1 : 0 }}
        className="absolute top-3 right-3 flex space-x-2 z-10"
      >
        {showBookmark && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isBookmarked 
                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600'
            }`}
            title={isBookmarked ? t('jobs.removeBookmark') : t('jobs.addBookmark')}
          >
            <BookmarkIcon className="w-4 h-4" filled={isBookmarked} />
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShareClick}
          className="p-2 rounded-full bg-white/80 text-slate-600 hover:bg-white hover:text-pink-600 backdrop-blur-sm transition-colors"
          title={t('jobs.shareJob')}
        >
          <ShareIcon className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-16"> {/* Add padding to avoid overlap with action buttons */}
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-slate-600 dark:text-slate-400 mb-2">
              <span className="mr-2">🏢</span>
              <span className="text-sm">{job.employer?.email || t('jobs.company')}</span>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <span className="mr-1">📍</span>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">💰</span>
              <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center">
              <span className="mr-1">⏰</span>
              <span>{formatJobType(job.type)}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">🎯</span>
              <span>{job.requiredExperience} {t('jobs.yearsExp')}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Required Skills Preview */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('jobs.requiredSkills')}</p>
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-xs bg-rose-100 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  +{job.requiredSkills.length - 3} {t('jobs.more')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer with Status and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-rose-100 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.status === 'OPEN' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
            }`}>
              {job.status === 'OPEN' ? t('jobs.status.open') : t('jobs.status.closed')}
            </span>
            
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(job.postedDate)}
            </span>
            
            <span className={`text-xs font-medium ${
              new Date(job.applicationDeadline) < new Date() 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {formatDeadline(job.applicationDeadline)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApplyClick}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-1"
          >
            <span>{t('jobs.apply')}</span>
            <ExternalLinkIcon className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
