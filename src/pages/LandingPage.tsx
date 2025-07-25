/**
 * Landing Page giống Indeed cho Quickwork
 * Thiết kế chuyên nghiệp với search bar trung tâm và layout tối ưu
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { useProfile } from '../features/profile/hooks/useProfile';
import type { RootState } from '../store';
import QuickworkLogo from '../assets/Quickwork_logo.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentProfile } = useProfile();
  const { t, language } = useLanguage();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [languageKey, setLanguageKey] = useState(0);

  // Update animation key when language changes
  useEffect(() => {
    setLanguageKey(prev => prev + 1);
  }, [language]);

  // Animation variants for text transitions
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Animated text component
  const AnimatedText: React.FC<{ 
    children: string; 
    className?: string; 
    as?: string;
    delay?: number;
  }> = ({ children, className = '', as = 'div', delay = 0 }) => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${children}-${languageKey}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={textVariants}
          transition={{ duration: 0.3, delay }}
          className={className}
        >
          {as === 'h1' ? (
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-rose-600 to-pink-600 dark:from-slate-200 dark:via-rose-400 dark:to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              {children}
            </h1>
          ) : as === 'h2' ? (
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-rose-600 dark:from-slate-200 dark:to-rose-400 bg-clip-text text-transparent mb-4">
              {children}
            </h2>
          ) : as === 'p' ? (
            <p className={className}>
              {children}
            </p>
          ) : (
            <span className={className}>
              {children}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchKeyword) searchParams.append('keyword', searchKeyword);
    if (searchLocation) searchParams.append('location', searchLocation);
    navigate(`/jobs?${searchParams.toString()}`);
    // Keep the search text in the inputs - don't clear them
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Navigate to role-specific dashboard
      if (currentProfile?.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (currentProfile?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard'); // Default to user dashboard for job seekers
      }
    } else {
      navigate('/auth/register');
    }
  };

  const handleDashboardClick = () => {
    // Navigate to role-specific dashboard
    if (currentProfile?.role === 'employer') {
      navigate('/employer/dashboard');
    } else if (currentProfile?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard'); // Default to user dashboard for job seekers
    }
  };

  const handleSignIn = () => {
    navigate('/auth/login');
  };

  const popularSearches = [
    t('search.softwareEngineer'), 
    t('search.marketingManager'), 
    t('search.dataAnalyst'), 
    t('search.productManager'), 
    t('search.uxDesigner'), 
    t('search.salesRep')
  ];

  const featuredCompanies = [
    { name: 'Google', logo: '🟢', openJobs: 234 },
    { name: 'Microsoft', logo: '🔵', openJobs: 189 },
    { name: 'Amazon', logo: '🟠', openJobs: 567 },
    { name: 'Apple', logo: '🍎', openJobs: 123 },
    { name: 'Netflix', logo: '🔴', openJobs: 89 },
    { name: 'Meta', logo: '💙', openJobs: 156 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 dark:from-slate-900 dark:via-zinc-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-rose-100 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img 
                  src={QuickworkLogo} 
                  alt="Quickwork" 
                  className="h-10 w-auto"
                />
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/jobs" className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-300">
                <AnimatedText className="inline-block">{t('header.findJobs')}</AnimatedText>
              </a>
              <a href="/jobs" className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-300">
                <AnimatedText className="inline-block">{t('header.companies')}</AnimatedText>
              </a>
              <a href="/bundles" className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-300">
                <AnimatedText className="inline-block">{t('header.bundles')}</AnimatedText>
              </a>
              <a href="#" className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-300">
                <AnimatedText className="inline-block">{t('header.careerAdvice')}</AnimatedText>
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={handleSignIn}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium transition-colors duration-300"
                  >
                    <AnimatedText className="inline-block">{t('header.signIn')}</AnimatedText>
                  </button>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <AnimatedText className="inline-block">{t('header.signUp')}</AnimatedText>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <AnimatedText className="inline-block">{t('header.dashboard')}</AnimatedText>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section với Search */}
      <section className="relative overflow-hidden">
        {/* Japanese-inspired pattern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-slate-800 dark:via-rose-900/20 dark:to-slate-900"></div>
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-orange-300 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <AnimatedText 
              as="h1" 
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-rose-600 to-pink-600 dark:from-slate-200 dark:via-rose-400 dark:to-pink-400 bg-clip-text text-transparent mb-6 leading-tight"
            >
              {t('hero.title')}
            </AnimatedText>
            <AnimatedText 
              as="p" 
              className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
              delay={0.1}
            >
              {t('hero.subtitle')}
            </AnimatedText>

            {/* Search Box - Enhanced Japanese Design */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-4xl mx-auto border border-rose-100 dark:border-slate-600 hover:shadow-3xl transition-all duration-500">
              <div className="flex-1 flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 border border-rose-100 dark:border-slate-500">
                <svg className="w-5 h-5 text-rose-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  key={`search-keyword-${languageKey}`}
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none text-lg font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex-1 flex items-center px-6 py-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-700 dark:to-slate-600 border border-orange-100 dark:border-slate-500">
                <svg className="w-5 h-5 text-orange-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  key={`search-location-${languageKey}`}
                  type="text"
                  placeholder={t('hero.locationPlaceholder')}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none text-lg font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 hover:from-rose-600 hover:via-pink-600 hover:to-orange-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-max"
              >
                <AnimatedText className="inline-block">{t('hero.searchButton')}</AnimatedText>
              </button>
            </div>

            {/* Popular Searches */}
            <div className="mt-8">
              <AnimatedText 
                as="p" 
                className="text-slate-600 dark:text-slate-400 mb-4 font-medium"
                delay={0.2}
              >
                {t('hero.popularSearches')}
              </AnimatedText>
              <div className="flex flex-wrap justify-center gap-3">
                <AnimatePresence mode="wait">
                  {popularSearches.map((search, index) => (
                    <motion.button
                      key={`${search}-${languageKey}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 + 0.3, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchKeyword(search);
                        // Navigate after setting the keyword so it stays in the input
                        setTimeout(() => {
                          navigate(`/jobs?keyword=${encodeURIComponent(search)}`);
                        }, 0);
                      }}
                      className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 dark:hover:from-slate-600 dark:hover:to-slate-500 text-slate-700 dark:text-slate-300 px-5 py-2 rounded-full border border-rose-200 dark:border-slate-600 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {search}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-white via-rose-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15,000+', label: t('stats.jobsDaily'), color: 'from-rose-500 to-pink-500' },
              { number: '2,500+', label: t('stats.companies'), color: 'from-pink-500 to-orange-500' },
              { number: '500K+', label: t('stats.candidates'), color: 'from-orange-500 to-amber-500' },
              { number: '98%', label: t('stats.satisfaction'), color: 'from-amber-500 to-rose-500' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-100 dark:border-slate-600"
              >
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                  {stat.number}
                </div>
                <AnimatedText 
                  className="text-slate-600 dark:text-slate-400 font-medium"
                  delay={index * 0.05}
                >
                  {stat.label}
                </AnimatedText>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-rose-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <AnimatedText 
              as="h2" 
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-rose-600 dark:from-slate-200 dark:to-rose-400 bg-clip-text text-transparent mb-4"
            >
              {t('companies.title')}
            </AnimatedText>
            <AnimatedText 
              as="p" 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              delay={0.1}
            >
              {t('companies.subtitle')}
            </AnimatedText>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredCompanies.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-rose-100 dark:border-slate-600 hover:border-rose-200 dark:hover:border-slate-500"
                onClick={() => navigate(`/jobs?company=${encodeURIComponent(company.name)}`)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{company.logo}</div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent font-medium">
                    {company.openJobs} <AnimatedText className="inline-block">{t('companies.jobs')}</AnimatedText>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-gradient-to-r from-white via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <AnimatedText 
              as="h2" 
              className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-orange-600 dark:from-slate-200 dark:to-orange-400 bg-clip-text text-transparent mb-4"
            >
              {t('categories.title')}
            </AnimatedText>
            <AnimatedText 
              as="p" 
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              delay={0.1}
            >
              {t('categories.subtitle')}
            </AnimatedText>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '💻', name: t('categories.it'), jobs: '3,245', gradient: 'from-blue-500 to-purple-500' },
              { icon: '📊', name: t('categories.finance'), jobs: '1,892', gradient: 'from-green-500 to-emerald-500' },
              { icon: '🏥', name: t('categories.healthcare'), jobs: '987', gradient: 'from-red-500 to-pink-500' },
              { icon: '🎓', name: t('categories.education'), jobs: '654', gradient: 'from-yellow-500 to-orange-500' },
              { icon: '🏭', name: t('categories.manufacturing'), jobs: '1,456', gradient: 'from-gray-500 to-slate-500' },
              { icon: '🛒', name: t('categories.retail'), jobs: '2,134', gradient: 'from-rose-500 to-pink-500' },
              { icon: '📱', name: t('categories.marketing'), jobs: '876', gradient: 'from-purple-500 to-indigo-500' },
              { icon: '⚖️', name: t('categories.legal'), jobs: '432', gradient: 'from-amber-500 to-orange-500' }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer border border-rose-100 dark:border-slate-600 hover:border-rose-200 dark:hover:border-slate-500"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <AnimatedText 
                    as="h3" 
                    className="font-semibold text-slate-800 dark:text-slate-200 mb-2 text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors"
                    delay={index * 0.02}
                  >
                    {category.name}
                  </AnimatedText>
                  <p className={`text-sm bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent font-medium`}>
                    {category.jobs} <AnimatedText className="inline-block">{t('categories.jobCount')}</AnimatedText>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 relative overflow-hidden">
        {/* Japanese-inspired decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <AnimatedText 
              as="h2" 
              className="text-4xl font-bold text-white mb-4"
            >
              {t('howItWorks.title')}
            </AnimatedText>
            <AnimatedText 
              as="p" 
              className="text-xl text-white/90 max-w-2xl mx-auto"
              delay={0.1}
            >
              {t('howItWorks.subtitle')}
            </AnimatedText>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: t('howItWorks.step1.title'),
                description: t('howItWorks.step1.description'),
                icon: '👤'
              },
              {
                step: '02',
                title: t('howItWorks.step2.title'),
                description: t('howItWorks.step2.description'),
                icon: '🔍'
              },
              {
                step: '03',
                title: t('howItWorks.step3.title'),
                description: t('howItWorks.step3.description'),
                icon: '🎯'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="text-center text-white group"
              >
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full text-3xl font-bold mb-4 group-hover:bg-white/30 transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl">{step.icon}</div>
                </div>
                <AnimatedText 
                  as="h3" 
                  className="text-2xl font-semibold mb-4 group-hover:text-white/90 transition-colors"
                  delay={index * 0.05}
                >
                  {step.title}
                </AnimatedText>
                <AnimatedText 
                  as="p" 
                  className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors"
                  delay={index * 0.05 + 0.1}
                >
                  {step.description}
                </AnimatedText>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-white text-rose-600 hover:bg-slate-50 px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <AnimatedText className="inline-block">{t('howItWorks.getStarted')}</AnimatedText>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <img 
                  src={QuickworkLogo} 
                  alt="Quickwork" 
                  className="h-10 w-auto filter brightness-0 invert"
                />
              </div>
              <AnimatedText 
                as="p" 
                className="text-slate-400 leading-relaxed"
              >
                {t('footer.description')}
              </AnimatedText>
            </div>
            
            <div>
              <AnimatedText 
                as="h4" 
                className="font-semibold mb-6 text-lg bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent"
              >
                {t('footer.forCandidates')}
              </AnimatedText>
              <ul className="space-y-3 text-slate-400">
                <li><a href="/jobs" className="hover:text-rose-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.findJobs')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.createCV')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.careerAdvice')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.salary')}</AnimatedText>
                </a></li>
              </ul>
            </div>
            
            <div>
              <AnimatedText 
                as="h4" 
                className="font-semibold mb-6 text-lg bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent"
              >
                {t('footer.forEmployers')}
              </AnimatedText>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.postJobs')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.findCandidates')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.hrServices')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.marketReport')}</AnimatedText>
                </a></li>
              </ul>
            </div>
            
            <div>
              <AnimatedText 
                as="h4" 
                className="font-semibold mb-6 text-lg bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
              >
                {t('footer.aboutUs')}
              </AnimatedText>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.about')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.contact')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.terms')}</AnimatedText>
                </a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                  <AnimatedText className="inline-block">{t('footer.privacy')}</AnimatedText>
                </a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2025 Quickwork. <AnimatedText className="inline-block">{t('footer.copyright')}</AnimatedText>
              <span className="ml-2 text-rose-400"><AnimatedText className="inline-block">{t('footer.madeWith')}</AnimatedText></span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
