/**
 * Profile Success page - shown after successful profile submission
 * Displays the API output format and provides next steps
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import QuickworkLogo from '../assets/Quickwork_logo.png';
import type { ProfileApiOutput } from '../features/profile/types/profile.types';

interface LocationState {
  profileType: 'job_seeker' | 'employer';
  submittedData: ProfileApiOutput;
}

export default function ProfileSuccess(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // If no state, redirect to home
  React.useEffect(() => {
    if (!state?.submittedData) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.submittedData) {
    return <div>Loading...</div>;
  }

  const { profileType, submittedData } = state;
  const isJobSeeker = profileType === 'job_seeker';

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(submittedData, null, 2));
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(submittedData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${submittedData.fullName.replace(/\s+/g, '_')}_profile.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.img
            src={QuickworkLogo}
            alt="Quickwork"
            className="h-16 w-auto mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Profile Submitted Successfully! 🎉
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-2">
              Your {isJobSeeker ? 'Job Seeker' : 'Employer'} profile has been processed and is now active.
            </p>
          </motion.div>
        </div>

        {/* API Output Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              API Output Format
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
              >
                Copy JSON
              </button>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
              >
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              What's Next?
            </h3>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-300">
              {isJobSeeker ? (
                <>
                  <li>• Start browsing job opportunities</li>
                  <li>• Set up job alerts for your preferences</li>
                  <li>• Connect with potential employers</li>
                  <li>• Keep your profile updated</li>
                </>
              ) : (
                <>
                  <li>• Post your first job opening</li>
                  <li>• Browse qualified candidates</li>
                  <li>• Set up your company dashboard</li>
                  <li>• Manage your hiring pipeline</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Profile Information
            </h3>
            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <div><strong>Type:</strong> {submittedData.profileType}</div>
              <div><strong>Name:</strong> {submittedData.fullName}</div>
              <div><strong>Phone:</strong> {submittedData.phone || 'Not provided'}</div>
              <div><strong>Address:</strong> {submittedData.address || 'Not provided'}</div>
              {isJobSeeker && submittedData.skills && (
                <div><strong>Skills:</strong> {submittedData.skills.join(', ')}</div>
              )}
              {!isJobSeeker && submittedData.companyName && (
                <div><strong>Company:</strong> {submittedData.companyName}</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to={`/profile/${isJobSeeker ? 'job-seeker' : 'employer'}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
          >
            View My Profile
          </Link>
          
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
