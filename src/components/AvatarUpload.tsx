/**
 * AvatarUpload Component
 * Interactive avatar upload component with Firebase Storage integration
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
// TODO: Re-import when profile module is rebuilt
// import type { Profile } from '../features/profile/types/profile.types';

interface AvatarUploadProps {
  profile: any; // TODO: Replace with proper Profile type when profile module is rebuilt
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showProgressBar?: boolean;
  showDeleteButton?: boolean;
  className?: string;
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
}

const AVATAR_SIZES = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24'
};

/**
 * AvatarUpload component
 */
export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  profile,
  size = 'lg',
  showProgressBar = true,
  showDeleteButton = true,
  className = '',
  onUploadSuccess,
  onUploadError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { isUploading, progress, uploadAvatar, deleteAvatar, validateFile } = useAvatarUpload({
    userId: profile.userId,
    onSuccess: () => {
      onUploadSuccess?.();
    },
    onError: (error) => {
      onUploadError?.(error);
    },
    withProgress: showProgressBar
  });

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }
    uploadAvatar(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow same file to be selected again
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (profile.avatar) {
      deleteAvatar(profile.avatar);
    }
  };

  const getAvatarDisplay = () => {
    if (profile.avatarUrl) {
      return (
        <img 
          src={profile.avatarUrl} 
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    
    // Fallback to initials
    const initials = `${profile.firstName?.charAt(0) || ''}${profile.lastName?.charAt(0) || ''}`.toUpperCase();
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
        {initials || 'U'}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Avatar container */}
      <motion.div
        className={`
          relative ${AVATAR_SIZES[size]} cursor-pointer group
          ${isDragOver ? 'scale-105' : ''}
          transition-transform duration-200
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar image */}
        <div className="relative w-full h-full">
          {getAvatarDisplay()}
          
          {/* Upload overlay */}
          <AnimatePresence>
            {(isDragOver || isUploading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Upload status indicator */}
        {isUploading && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border border-white border-t-transparent rounded-full"
            />
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      {showProgressBar && isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full"
        >
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            {Math.round(progress)}% uploaded
          </p>
        </motion.div>
      )}

      {/* Delete button */}
      {showDeleteButton && profile.avatarUrl && !isUploading && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAvatar();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
          title="Delete avatar"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      )}

      {/* Drop zone text */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full mt-2 w-full text-center"
        >
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Drop image here to upload
          </p>
        </motion.div>
      )}
    </div>
  );
};
