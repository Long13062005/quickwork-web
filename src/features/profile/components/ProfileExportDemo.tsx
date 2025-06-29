/**
 * Profile Export Demo Component
 * Demonstrates the profile export functionality with sample data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SAMPLE_API_OUTPUTS, 
  useProfileApiTransform,
  demonstrateApiOutput 
} from '../utils/profileApiUtils';

const ProfileExportDemo: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<'jobSeeker' | 'employer'>('jobSeeker');
  const [exportedJson, setExportedJson] = useState<string>('');
  const { validateJobSeeker, validateEmployer } = useProfileApiTransform();

  const handleExportSample = (profileType: 'jobSeeker' | 'employer') => {
    const profile = SAMPLE_API_OUTPUTS[profileType];
    const jsonString = JSON.stringify(profile, null, 2);
    setExportedJson(jsonString);
    setSelectedProfile(profileType);
  };

  const handleDownloadSample = (profileType: 'jobSeeker' | 'employer') => {
    const profile = SAMPLE_API_OUTPUTS[profileType];
    const jsonString = JSON.stringify(profile, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample_${profileType}_profile.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const validateCurrentProfile = () => {
    const profile = SAMPLE_API_OUTPUTS[selectedProfile];
    if (selectedProfile === 'jobSeeker') {
      return validateJobSeeker(profile);
    } else {
      return validateEmployer(profile);
    }
  };

  const runConsoleDemo = () => {
    demonstrateApiOutput();
    alert('Check the browser console for demo output!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Export Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Demonstrates the API-compatible profile export functionality for both Job Seekers and Employers.
        </p>

        {/* Sample Profile Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Sample Profile Type
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleExportSample('jobSeeker')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedProfile === 'jobSeeker'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              👤 Job Seeker Profile
            </button>
            <button
              onClick={() => handleExportSample('employer')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedProfile === 'employer'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🏢 Employer Profile
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Export Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleDownloadSample(selectedProfile)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              📄 Download Sample JSON
            </button>
            <button
              onClick={runConsoleDemo}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              🖥️ Run Console Demo
            </button>
          </div>
        </div>

        {/* Validation Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Validation Status
          </h2>
          <div className={`p-4 rounded-lg ${
            validateCurrentProfile() 
              ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {validateCurrentProfile() ? '✅' : '❌'}
              </span>
              <span className={validateCurrentProfile() ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {validateCurrentProfile() 
                  ? `${selectedProfile === 'jobSeeker' ? 'Job Seeker' : 'Employer'} profile is valid`
                  : `${selectedProfile === 'jobSeeker' ? 'Job Seeker' : 'Employer'} profile validation failed`
                }
              </span>
            </div>
          </div>
        </div>

        {/* JSON Output */}
        {exportedJson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Exported JSON ({selectedProfile === 'jobSeeker' ? 'Job Seeker' : 'Employer'})
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {exportedJson}
              </pre>
            </div>
          </motion.div>
        )}

        {/* API Format Documentation */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            API Format Specification
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Job Seeker Format
              </h3>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• <code>userId</code>: number</li>
                  <li>• <code>profileType</code>: "JOB_SEEKER"</li>
                  <li>• <code>fullName</code>: string</li>
                  <li>• <code>phone</code>: string | null</li>
                  <li>• <code>address</code>: string | null</li>
                  <li>• <code>summary</code>: string | null</li>
                  <li>• <code>skills</code>: string[] | null</li>
                  <li>• <code>experiences</code>: string[] | null</li>
                  <li>• <code>companyName</code>: null</li>
                  <li>• <code>companyWebsite</code>: null</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Employer Format
              </h3>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• <code>userId</code>: number</li>
                  <li>• <code>profileType</code>: "EMPLOYER"</li>
                  <li>• <code>fullName</code>: string</li>
                  <li>• <code>phone</code>: string | null</li>
                  <li>• <code>address</code>: string | null</li>
                  <li>• <code>summary</code>: string | null</li>
                  <li>• <code>skills</code>: null</li>
                  <li>• <code>experiences</code>: null</li>
                  <li>• <code>companyName</code>: string | null</li>
                  <li>• <code>companyWebsite</code>: string | null</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileExportDemo;
