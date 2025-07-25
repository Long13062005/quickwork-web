/**
 * CV Upload Component
 * Handles CV file upload with drag and drop support
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCV } from '../hooks/useCV';
import { 
  SUPPORTED_CV_FILE_TYPES, 
  MAX_CV_FILE_SIZE, 
  FILE_TYPE_DISPLAY_NAMES 
} from '../types/cv.types';

interface CVUploadProps {
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export const CVUpload: React.FC<CVUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className = ''
}) => {
  const { uploadCV, uploading, uploadProgress, error } = useCV();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    if (!SUPPORTED_CV_FILE_TYPES.includes(file.type)) {
      const supportedTypes = SUPPORTED_CV_FILE_TYPES.map(type => 
        FILE_TYPE_DISPLAY_NAMES[type] || type
      ).join(', ');
      const errorMsg = `Unsupported file type. Please upload: ${supportedTypes}`;
      toast.error(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file size
    if (file.size > MAX_CV_FILE_SIZE) {
      const errorMsg = `File size too large. Maximum size is ${Math.round(MAX_CV_FILE_SIZE / 1024 / 1024)}MB`;
      toast.error(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    setSelectedFile(file);
  }, [onUploadError]);

  // Handle file input change
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      await uploadCV({ 
        file: selectedFile,
        label: selectedFile.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        description: `CV uploaded on ${new Date().toLocaleDateString()}`
      });
      toast.success('CV uploaded successfully!');
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to upload CV';
      toast.error(errorMsg);
      onUploadError?.(errorMsg);
    }
  }, [selectedFile, uploadCV, onUploadSuccess, onUploadError]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className={`cv-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={SUPPORTED_CV_FILE_TYPES.join(',')}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {/* Upload Icon */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ scale: dragActive ? 1.1 : 1 }}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full"
          >
            <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>

          {selectedFile ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {FILE_TYPE_DISPLAY_NAMES[selectedFile.type] || selectedFile.type} • {Math.round(selectedFile.size / 1024)} KB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop your CV here or click to browse
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports: PDF, DOC, DOCX • Max size: {Math.round(MAX_CV_FILE_SIZE / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploading...
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {uploadProgress.percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress.percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className="mt-4 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload CV'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearSelection}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      )}
    </div>
  );
};
