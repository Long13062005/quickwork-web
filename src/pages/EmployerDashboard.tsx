/**
 * Employer Dashboard Page
 * Main dashboard for employers after profile completion
 * Shows job postings, applications, analytics, and hiring tools
 */

import { useEffect, useState, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProfile } from '../features/profile/hooks/useProfile';
import { PageLoader } from '../components/PageLoader';
import { AuthContext } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

// Simple SVG icons as components
const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: 'full_time' | 'part_time' | 'contract' | 'remote';
  applications: number;
  views: number;
  posted: string;
  status: 'active' | 'paused' | 'closed';
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: string;
  skills: string[];
  appliedFor: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';
  avatar?: string;
}

interface EmployerStats {
  activeJobs: number;
  totalApplications: number;
  candidates: number;
  hires: number;
}

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { currentProfile, loading, fetchMyProfile } = useProfile();
  const { t } = useLanguage();
  const [stats, setStats] = useState<EmployerStats>({
    activeJobs: 0,
    totalApplications: 0,
    candidates: 0,
    hires: 0
  });
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);

  const handleLogout = useCallback(async () => {
    try {
      toast.loading(t('dashboard.user.loggingOut'), { id: 'logout' });
      
      // Set a timeout to dismiss the loading toast if navigation takes too long
      const timeoutId = setTimeout(() => {
        toast.dismiss('logout');
      }, 3000); // 3 seconds should be enough for most logout operations
      
      await logout();
      
      // Clear the timeout since logout completed successfully
      clearTimeout(timeoutId);
      
      // Immediately dismiss the loading toast
      toast.dismiss('logout');
      
      // Redirect to auth page after successful logout
      navigate('/auth');
      
    } catch (error: any) {
      console.error('Logout error:', error);
      // Replace the loading toast with an error toast
      toast.error(t('dashboard.user.logoutFailed'), { id: 'logout' });
      
      // Redirect to auth page even if logout failed
      navigate('/auth');
    }
  }, [logout, navigate]);

  // Redirect non-employer users to appropriate dashboard
  useEffect(() => {
    if (currentProfile) {
      if (currentProfile.role === 'admin') {
        console.log('Admin user detected, redirecting to admin dashboard');
        navigate('/admin/dashboard');
        return;
      } else if (currentProfile.role === 'jobseeker') {
        console.log('Job seeker user detected, redirecting to user dashboard');
        navigate('/dashboard');
        return;
      }
    }
  }, [currentProfile, navigate]);

  useEffect(() => {
    fetchMyProfile();
    loadDashboardData();
  }, [fetchMyProfile]);

  const loadDashboardData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      activeJobs: 5,
      totalApplications: 127,
      candidates: 45,
      hires: 3
    });

    setJobPostings([
      {
        id: '1',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        type: 'full_time',
        applications: 24,
        views: 156,
        posted: '5 days ago',
        status: 'active'
      },
      {
        id: '2',
        title: 'UX Designer',
        department: 'Design',
        type: 'full_time',
        applications: 18,
        views: 89,
        posted: '1 week ago',
        status: 'active'
      },
      {
        id: '3',
        title: 'Product Manager',
        department: 'Product',
        type: 'full_time',
        applications: 31,
        views: 203,
        posted: '2 weeks ago',
        status: 'paused'
      }
    ]);

    setRecentCandidates([
      {
        id: '1',
        name: 'Sarah Johnson',
        title: 'Senior Frontend Developer',
        experience: '5+ years',
        skills: ['React', 'TypeScript', 'Node.js'],
        appliedFor: 'Senior Frontend Developer',
        appliedDate: '2024-01-15',
        status: 'new'
      },
      {
        id: '2',
        name: 'Michael Chen',
        title: 'Full Stack Engineer',
        experience: '3+ years',
        skills: ['React', 'Python', 'AWS'],
        appliedFor: 'Senior Frontend Developer',
        appliedDate: '2024-01-14',
        status: 'reviewing'
      },
      {
        id: '3',
        name: 'Emily Davis',
        title: 'UX Designer',
        experience: '4+ years',
        skills: ['Figma', 'Design Systems', 'Research'],
        appliedFor: 'UX Designer',
        appliedDate: '2024-01-13',
        status: 'interview'
      }
    ]);
  };

  const getStatusColor = (status: JobPosting['status'] | Candidate['status']) => {
    switch (status) {
      case 'active': case 'hired': return 'text-green-600 bg-green-50';
      case 'interview': return 'text-blue-600 bg-blue-50';
      case 'reviewing': case 'paused': return 'text-yellow-600 bg-yellow-50';
      case 'closed': case 'rejected': return 'text-red-600 bg-red-50';
      case 'new': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCompanyName = () => {
    // Use the current profile to get company name
    if (currentProfile?.role === 'employer') {
      return currentProfile.companyName || 'Your Company';
    }
    return 'Your Company';
  };

  // Re-implement loading state when profile module is rebuilt
  if (loading) {
    return <PageLoader />;
  }

  const companyName = getCompanyName();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.employer.welcomeBack').replace('{name}', companyName)}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('dashboard.employer.readyToHire')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle variant="compact" />
              <button 
                onClick={() => navigate('/jobs/post')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {t('dashboard.actions.postJob')}
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <CogIcon className="w-6 h-6" />
              </button>
              
              {/* Profile info loaded from profile API */}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentProfile ? 
                  `${currentProfile.firstName} ${currentProfile.lastName} | Employer` : 
                  'Loading profile...'
                }
              </span>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-sm text-sm"
                aria-label="Logout"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                <span>{t('dashboard.user.logout')}</span>
              </motion.button>
              
              <div 
                onClick={() => navigate('/profile/employer')}
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
                title="Edit your company profile"
              >
                {currentProfile?.profilePicture ? (
                  <img 
                    src={currentProfile.profilePicture} 
                    alt={`${companyName} logo`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {companyName[0] || 'C'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.activeJobs')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <UsersIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.totalApplications')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.candidates')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.candidates}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <ChartIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.hires')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hires}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Postings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('dashboard.employer.jobPostings')}
                  </h2>
                  <button 
                    onClick={() => navigate('/jobs/manage')}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    {t('dashboard.actions.manageJobs')}
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{job.department}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="capitalize">{job.type.replace('_', ' ')}</span>
                          <span>{job.applications} applications</span>
                          <span>{job.views} views</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Posted {job.posted}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                          View Applications
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <NavLink 
                  to="/jobs/manage"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <span className="text-gray-400 dark:text-gray-300 mr-3">📋</span>
                  <span className="text-gray-700 dark:text-gray-200">Manage Jobs</span>
                </NavLink>
                <NavLink 
                  to="/jobs"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <span className="text-gray-400 dark:text-gray-300 mr-3">🔍</span>
                  <span className="text-gray-700 dark:text-gray-200">Browse Jobs</span>
                </NavLink>
                
                <NavLink 
                  to="/profile/employer"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">Company Profile</span>
                </NavLink>
                
                <NavLink 
                  to="/change-password"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <CogIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">Change Password</span>
                </NavLink>
              </div>
            </motion.div>

            {/* Recent Candidates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Candidates</h3>
                <button 
                  onClick={() => navigate('/candidates')}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{candidate.name}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">{candidate.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Applied for {candidate.appliedFor}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
