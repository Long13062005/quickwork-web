/**
 * Admin Dashboard Page
 * Main dashboard for admin users after authentication
 * Shows user management, job moderation, and system statistics
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
const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  newSignups: number;
  activeJobs: number;
  flaggedContent: number;
  systemHealth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobseeker' | 'employer' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'banned';
  lastActive: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { currentProfile, loading, fetchMyProfile } = useProfile();
  const { t } = useLanguage();
  
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobs: 0,
    newSignups: 0,
    activeJobs: 0,
    flaggedContent: 0,
    systemHealth: 0
  });
  
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

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
    fetchMyProfile();
    loadDashboardData();
  }, [fetchMyProfile]);

  // Redirect non-admin users to appropriate dashboard
  useEffect(() => {
    if (currentProfile) {
      if (currentProfile.role === 'jobseeker') {
        console.log('Job seeker user detected, redirecting to user dashboard');
        navigate('/dashboard');
        return;
      } else if (currentProfile.role === 'employer') {
        console.log('Employer user detected, redirecting to employer dashboard');
        navigate('/employer/dashboard');
        return;
      }
    }
  }, [currentProfile, navigate]);

  const loadDashboardData = async () => {
    // Mock data - replace with actual API calls
    setStats({
      totalUsers: 245,
      totalJobs: 128,
      newSignups: 12,
      activeJobs: 86,
      flaggedContent: 3,
      systemHealth: 98
    });

    setRecentUsers([
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'jobseeker',
        status: 'active',
        lastActive: '2 hours ago'
      },
      {
        id: '2',
        name: 'Acme Corporation',
        email: 'hr@acmecorp.com',
        role: 'employer',
        status: 'active',
        lastActive: '1 day ago'
      },
      {
        id: '3',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 'jobseeker',
        status: 'pending',
        lastActive: 'Just now'
      },
      {
        id: '4',
        name: 'Tech Solutions Ltd',
        email: 'recruit@techsolutions.com',
        role: 'employer',
        status: 'inactive',
        lastActive: '5 days ago'
      },
      {
        id: '5',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'jobseeker',
        status: 'banned',
        lastActive: '14 days ago'
      }
    ]);
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'inactive': return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
      case 'banned': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

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
                {t('dashboard.admin.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('dashboard.admin.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle variant="compact" />
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <CogIcon className="w-6 h-6" />
              </button>
              
              {/* Profile info loaded from profile API */}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentProfile ? 
                  `${currentProfile.firstName} ${currentProfile.lastName} | Admin` : 
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
                <span>{t('dashboard.admin.logout')}</span>
              </motion.button>
              
              {/* Admin Avatar - Clickable to edit profile */}
              <div 
                onClick={() => navigate('/profile/admin')}
                className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
                title="Edit your profile"
              >
                {currentProfile?.profilePicture ? (
                  <img 
                    src={currentProfile.profilePicture} 
                    alt={`${currentProfile.firstName}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {currentProfile?.firstName ? currentProfile.firstName.charAt(0).toUpperCase() : 'A'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg self-start">
                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.totalUsers')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg self-start">
                <BriefcaseIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.totalJobs')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg self-start">
                <UsersIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.newSignups')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newSignups}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg self-start">
                <BriefcaseIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.activeJobs')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeJobs}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg self-start">
                <ShieldIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.flaggedContent')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.flaggedContent}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg self-start">
                <ChartIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.admin.systemHealth')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.systemHealth}%</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('dashboard.admin.recentUsers')}
                  </h2>
                  <button 
                    onClick={() => navigate('/admin/users')}
                    className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    {t('dashboard.admin.viewAllUsers')}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard.admin.user')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard.admin.role')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard.admin.status')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('dashboard.admin.lastActive')}
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">{t('dashboard.admin.actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                              <span className="text-indigo-700 dark:text-indigo-400 font-semibold">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 capitalize">
                            {t(`dashboard.admin.${user.role}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)} capitalize`}>
                            {t(`dashboard.admin.${user.status}`)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastActive}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            {t('dashboard.admin.view')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.admin.adminActions')}</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/users/new')}
                className="w-full flex items-center px-4 py-3 text-left bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                <UsersIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.createUser')}</span>
              </button>
              <button 
                onClick={() => navigate('/admin/roles')}
                className="w-full flex items-center px-4 py-3 text-left bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors"
              >
                <ShieldIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.manageRoles')}</span>
              </button>
              <button 
                onClick={() => navigate('/admin/jobs/review')}
                className="w-full flex items-center px-4 py-3 text-left bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
              >
                <BriefcaseIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.reviewJobs')}</span>
              </button>
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="w-full flex items-center px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                <ChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.viewAnalytics')}</span>
              </button>
              
              <NavLink 
                to="/profile/admin"
                className="w-full flex items-center px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors no-underline"
              >
                <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.updateProfile')}</span>
              </NavLink>
              
              <NavLink 
                to="/change-password"
                className="w-full flex items-center px-4 py-3 text-left bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors no-underline"
              >
                <CogIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.changePassword')}</span>
              </NavLink>
              
              <button 
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{t('dashboard.admin.systemSettings')}</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('dashboard.admin.quickStats')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('dashboard.admin.storageUsage')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">43%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" style={{ width: '43%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-600 dark:text-gray-400">{t('dashboard.admin.apiUsage')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">67%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-green-500 dark:bg-green-400 h-1.5 rounded-full" style={{ width: '67%' }}></div>
                </div>
                
                <div className="flex justify-between text-sm mt-3">
                  <span className="text-gray-600 dark:text-gray-400">{t('dashboard.admin.databaseLoad')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">28%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-purple-500 dark:bg-purple-400 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
