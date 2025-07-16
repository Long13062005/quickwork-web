/**
 * User Dashboard Page
 * Main dashboard for job seekers after profile completion
 * Shows job recommendations, applications, profile stats, and quick actions
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
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchApplicationStatistics, fetchMyApplications } from '../features/application/applicationSlice';
import { fetchJobs } from '../features/job/jobSlice';
import type { JobSeekerProfile, EmployerProfile, AdminProfile } from '../features/profile/types/profile.types';

// Simple SVG icons as components
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 6L9.5 1L4 3.5L6.5 9L12 6ZM12 6L14.5 1L20 3.5L17.5 9L12 6ZM12 6V18L20 20H4L12 6Z" />
  </svg>
);

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  logo?: string;
}

interface DashboardStats {
  profileViews: number;
  applications: number;
  interviews: number;
  profileCompletion: number;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { currentProfile, loading, fetchMyProfile } = useProfile();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const { statistics, applications } = useAppSelector(state => state.application);
  const { jobs, loading: jobsLoading } = useAppSelector(state => state.job);
  
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    applications: 0,
    interviews: 0,
    profileCompletion: 0
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchMyProfile();
        await loadDashboardData();
        // Fetch application statistics
        dispatch(fetchApplicationStatistics());
        dispatch(fetchMyApplications());
        // Fetch job listings
        dispatch(fetchJobs({ page: 0, size: 6 })); // Get 6 jobs for recommendations
      } catch (error) {
        console.error('Failed to load profile or dashboard data:', error);
        toast.error('Failed to load profile data. Please refresh the page.');
      }
    };

    loadProfile();
  }, [fetchMyProfile, dispatch]);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (currentProfile && currentProfile.role === 'admin') {
      console.log('Admin user detected, redirecting to admin dashboard');
      navigate('/admin/dashboard');
      return;
    }
  }, [currentProfile, navigate]);

  // Update stats when application statistics are loaded
  useEffect(() => {
    if (statistics) {
      setStats(prevStats => ({
        ...prevStats,
        applications: statistics.total
      }));
    }
  }, [statistics]);

  // Update recent applications when applications are loaded
  useEffect(() => {
    if (applications && applications.length > 0) {
      // Take the 3 most recent applications
      const recentApps = applications
        .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
        .slice(0, 3)
        .map(app => {
          // Map backend status to component status
          let mappedStatus: Application['status'] = 'pending';
          switch (app.status) {
            case 'ACCEPTED':
              mappedStatus = 'accepted';
              break;
            case 'INTERVIEW_SCHEDULED':
            case 'INTERVIEW_COMPLETED':
              mappedStatus = 'interview';
              break;
            case 'REVIEWED':
            case 'SHORTLISTED':
              mappedStatus = 'reviewing';
              break;
            case 'REJECTED':
              mappedStatus = 'rejected';
              break;
            default:
              mappedStatus = 'pending';
          }
          
          return {
            id: app.id.toString(),
            jobTitle: app.jobTitle,
            company: app.employerEmail, // Use employerEmail as company name for now
            appliedDate: app.appliedDate,
            status: mappedStatus
          };
        });
      setRecentApplications(recentApps);
    }
  }, [applications]);

  const loadDashboardData = async () => {
    try {
      // Calculate profile completion based on current profile
      const calculateProfileCompletion = () => {
        if (!currentProfile) return 0;
        
        let completedFields = 0;
        const totalFields = 6; // Adjust based on required fields
        
        if (currentProfile.firstName) completedFields++;
        if (currentProfile.lastName) completedFields++;
        if (currentProfile.profilePicture) completedFields++;
        
        if (currentProfile.role === 'jobseeker') {
          const jobseekerProfile = currentProfile as JobSeekerProfile;
          if (jobseekerProfile.professionalTitle) completedFields++;
          if (jobseekerProfile.skills && jobseekerProfile.skills.length > 0) completedFields++;
          if (jobseekerProfile.bio) completedFields++;
        } else if (currentProfile.role === 'employer') {
          const employerProfile = currentProfile as EmployerProfile;
          if (employerProfile.companyName) completedFields++;
          if (employerProfile.industry) completedFields++;
          if (employerProfile.companyDescription) completedFields++;
        } else if (currentProfile.role === 'admin') {
          const adminProfile = currentProfile as AdminProfile;
          if (adminProfile.title) completedFields++;
          if (adminProfile.bio) completedFields++;
          if (adminProfile.phone) completedFields++;
        }
        
        return Math.round((completedFields / totalFields) * 100);
      };

      // Mock data - replace with actual API calls
      setStats({
        profileViews: 24,
        applications: statistics ? statistics.total : 0, // Use actual count from statistics
        interviews: 3,
        profileCompletion: calculateProfileCompletion()
      });

      // Job recommendations will come from Redux store
      // Recent applications will be populated from API in useEffect
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data.');
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'interview': return 'text-blue-600 bg-blue-50';
      case 'reviewing': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return <CheckIcon className="w-4 h-4" />;
      case 'interview': return <EyeIcon className="w-4 h-4" />;
      case 'reviewing': return <ClockIcon className="w-4 h-4" />;
      case 'rejected': return <XIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return t('dashboard.activity.accepted');
      case 'interview': return t('dashboard.activity.interview');
      case 'reviewing': return t('dashboard.activity.reviewing');
      case 'rejected': return t('dashboard.activity.rejected');
      default: return t('dashboard.activity.pending');
    }
  };

  // TODO: Re-implement loading state when profile module is rebuilt
  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('dashboard.user.welcomeBack').replace('{name}', 
                  currentProfile?.firstName && currentProfile?.lastName ? 
                    `${currentProfile.firstName} ${currentProfile.lastName}` : 
                    currentProfile?.firstName ? currentProfile.firstName : 'User'
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('dashboard.user.readyToFind')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle variant="compact" />
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              
              {/* Profile info loaded from profile API */}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentProfile ? 
                  (currentProfile.role === 'jobseeker' ? t('dashboard.user.jobSeekerProfile') : 
                   currentProfile.role === 'employer' ? t('dashboard.user.employerProfile') : 
                   currentProfile.role === 'admin' ? t('dashboard.user.adminProfile') : 
                   t('dashboard.user.userProfile')) : 
                  t('dashboard.user.loadingProfile')
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
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CogIcon className="w-6 h-6" />
              </button>
              <div 
                onClick={() => {
                  // Navigate to the appropriate profile based on role
                  if (currentProfile?.role === 'jobseeker') {
                    navigate('/profile/job-seeker');
                  } else if (currentProfile?.role === 'employer') {
                    navigate('/profile/employer');
                  } else if (currentProfile?.role === 'admin') {
                    navigate('/profile/admin');
                  } else {
                    navigate('/profile');
                  }
                }}
                className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors"
                title={t('dashboard.user.editProfile')}
              >
                {currentProfile?.profilePicture ? (
                  <img 
                    src={currentProfile.profilePicture} 
                    alt={`${currentProfile.firstName || 'User'}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {currentProfile?.firstName ? currentProfile.firstName.charAt(0).toUpperCase() : 'U'}
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
                <EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.profileViews')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.profileViews}</p>
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
                <DocumentIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.applications')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.applications}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.interviews')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviews}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('dashboard.stats.profileComplete')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.profileCompletion}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Recommendations */}
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
                    {t('dashboard.jobs.recommendedJobs')}
                  </h2>
                  <button 
                    onClick={() => navigate('/jobs')}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    {t('dashboard.jobs.viewAll')}
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {jobsLoading ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading jobs...
                  </div>
                ) : jobs && jobs.length > 0 ? (
                  jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{job.employer.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{job.location}</span>
                            <span className="capitalize">
                              {job.type === 'FULL_TIME' ? t('dashboard.jobs.fullTime') :
                               job.type === 'PART_TIME' ? t('dashboard.jobs.partTime') :
                               job.type === 'CONTRACT' ? t('dashboard.jobs.contract') :
                               job.type === 'FREELANCE' ? t('dashboard.jobs.remote') :
                               job.type}
                            </span>
                            <span>
                              {job.minSalary && job.maxSalary 
                                ? `$${job.minSalary.toLocaleString()} - $${job.maxSalary.toLocaleString()}`
                                : 'Salary not specified'}
                            </span>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                              {job.status === 'OPEN' ? 'Open' : job.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            {t('dashboard.jobs.apply')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    No jobs available at the moment.
                  </div>
                )}
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.actions.quickActions')}</h3>
              <div className="space-y-3">
                <NavLink 
                  to="/jobs"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.browseJobs')}</span>
                </NavLink>
                
                <NavLink 
                  to="/applications"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.viewApplications')}</span>
                </NavLink>
                
                <NavLink 
                  to="/profile/job-seeker"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.editProfile')}</span>
                </NavLink>
                
                <button 
                  onClick={() => navigate('/resume')}
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <DocumentIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.updateResume')}</span>
                </button>
                
                <NavLink 
                  to="/bundles"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <CrownIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.viewBundles')}</span>
                </NavLink>
                
                <NavLink 
                  to="/jobs/favorites"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <HeartIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.favoriteJobs')}</span>
                </NavLink>
                
                <NavLink 
                  to="/change-password"
                  className="w-full flex items-center px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors no-underline"
                >
                  <CogIcon className="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3" />
                  <span className="text-gray-700 dark:text-gray-200">{t('dashboard.actions.changePassword')}</span>
                </NavLink>
              </div>
            </motion.div>

            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.activity.recentApplications')}</h3>
                <button 
                  onClick={() => navigate('/applications')}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  {t('dashboard.jobs.viewAll')}
                </button>
              </div>
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{app.jobTitle}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">{app.company}</p>
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1 capitalize">{getStatusText(app.status)}</span>
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
