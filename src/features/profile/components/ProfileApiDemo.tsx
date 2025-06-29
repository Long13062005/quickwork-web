/**
 * Demo component to showcase the exact API output format
 * This demonstrates the Job Seeker and Employer profile transformations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SAMPLE_API_OUTPUTS } from '../utils/profileApiUtils';

const ProfileApiDemo: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'jobSeeker' | 'employer'>('jobSeeker');

  const handleCopyJson = async (data: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      alert('JSON copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const currentData = SAMPLE_API_OUTPUTS[selectedType];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Profile API Output Demo
        </h2>

        {/* Type Toggle */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedType('jobSeeker')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'jobSeeker'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setSelectedType('employer')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === 'employer'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Employer
          </button>
        </div>

        {/* Profile Info Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Profile Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{currentData.profileType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{currentData.fullName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{currentData.phone}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{currentData.address}</span>
            </div>
          </div>
        </div>

        {/* API Output */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              API Output (JSON)
            </h3>
            <button
              onClick={() => handleCopyJson(currentData)}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            >
              Copy JSON
            </button>
          </div>
          
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto"
          >
            <pre className="text-sm text-green-400 whitespace-pre-wrap">
              {JSON.stringify(currentData, null, 2)}
            </pre>
          </motion.div>
        </div>

        {/* Implementation Notes */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Implementation Notes:
          </h4>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Job Seekers have skills and experiences arrays</li>
            <li>• Employers have companyName and companyWebsite fields</li>
            <li>• Both share common fields: userId, fullName, phone, address, summary</li>
            <li>• Null values are explicitly set for unused fields per profile type</li>
            <li>• ProfileType is uppercase with underscore: "JOB_SEEKER" or "EMPLOYER"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileApiDemo;
