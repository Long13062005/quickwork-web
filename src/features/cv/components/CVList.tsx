/**
 * CV List Component
 * Displays list of user's CVs with actions
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCV } from '../hooks/useCV';
import { CVStatus, FILE_TYPE_DISPLAY_NAMES } from '../types/cv.types';
import type { CVEntity } from '../types/cv.types';

interface CVListProps {
  onCVSelect?: (cv: CVEntity) => void;
  className?: string;
}

export const CVList: React.FC<CVListProps> = ({
  onCVSelect,
  className = ''
}) => {
  const { 
    cvs, 
    loading, 
    error, 
    getMyCVs, 
    deleteCV, 
    downloadCV
  } = useCV();
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Load CVs on component mount
  useEffect(() => {
    getMyCVs();
  }, [getMyCVs]);

  // Handle CV deletion
  const handleDelete = useCallback(async (cv: CVEntity) => {
    if (window.confirm(`Are you sure you want to delete "${cv.originFilename}"?`)) {
      setDeletingIds(prev => new Set(prev).add(cv.id));
      try {
        await deleteCV(cv.id);
        toast.success('CV deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete CV');
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(cv.id);
          return newSet;
        });
      }
    }
  }, [deleteCV]);

  // Handle CV download
  const handleDownload = useCallback(async (cv: CVEntity) => {
    try {
      await downloadCV(cv.id, cv.originFilename);
      toast.success('CV downloaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download CV');
    }
  }, [downloadCV]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case CVStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case CVStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case CVStatus.DELETED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`cv-list ${className}`}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`cv-list ${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => getMyCVs()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className={`cv-list ${className}`}>
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No CVs found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Upload your first CV to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cv-list ${className}`}>
      <div className="space-y-4">
        {cvs.map((cv) => (
          <motion.div
            key={cv.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* File Icon */}
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* CV Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 
                      className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                      onClick={() => onCVSelect?.(cv)}
                    >
                      {cv.originFilename}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(cv.status)}`}>
                      {cv.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{FILE_TYPE_DISPLAY_NAMES[cv.fileType] || cv.fileType}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(cv.createdAt)}</span>
                    {cv.updatedAt !== cv.createdAt && (
                      <>
                        <span>•</span>
                        <span>Updated {formatDate(cv.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(cv)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Download CV"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.button>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(cv)}
                  disabled={deletingIds.has(cv.id)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Delete CV"
                >
                  {deletingIds.has(cv.id) ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
