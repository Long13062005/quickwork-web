/**
 * CV Manager Component
 * Main component for managing CVs - combines upload and list functionality
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CVUpload } from './CVUpload';
import { CVList } from './CVList';
import { useCV } from '../hooks/useCV';
import type { CVEntity } from '../types/cv.types';

interface CVManagerProps {
  className?: string;
}

export const CVManager: React.FC<CVManagerProps> = ({ className = '' }) => {
  const { totalElements } = useCV();
  const [activeTab, setActiveTab] = useState<'upload' | 'list'>('list');
  const [selectedCV, setSelectedCV] = useState<CVEntity | null>(null);

  // Handle successful upload
  const handleUploadSuccess = useCallback(() => {
    setActiveTab('list');
  }, []);

  // Handle CV selection
  const handleCVSelect = useCallback((cv: CVEntity) => {
    setSelectedCV(cv);
  }, []);

  // Tab content components
  const TabButton: React.FC<{ 
    tab: 'upload' | 'list'; 
    label: string; 
    icon: React.ReactNode; 
    count?: number 
  }> = ({ tab, label, icon, count }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveTab(tab)}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
        ${activeTab === tab 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`
          px-2 py-1 text-xs rounded-full
          ${activeTab === tab 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
          }
        `}>
          {count}
        </span>
      )}
    </motion.button>
  );

  return (
    <div className={`cv-manager ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          CV Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and manage your CV files
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total CVs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalElements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready to Use</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalElements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        <TabButton
          tab="list"
          label="My CVs"
          count={totalElements}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <TabButton
          tab="upload"
          label="Upload New"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          }
        />
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'list' && (
          <CVList onCVSelect={handleCVSelect} />
        )}
        
        {activeTab === 'upload' && (
          <CVUpload onUploadSuccess={handleUploadSuccess} />
        )}
      </div>

      {/* Selected CV Details Modal/Sidebar could go here */}
      {selectedCV && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCV(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CV Details
              </h3>
              <button
                onClick={() => setSelectedCV(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Filename</label>
                <p className="text-gray-900 dark:text-white">{selectedCV.originFilename}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <p className="text-gray-900 dark:text-white">{selectedCV.status}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedCV.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedCV.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
