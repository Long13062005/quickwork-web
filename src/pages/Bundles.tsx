/**
 * Bundles Page
 * Displays subscription plans: Free, VIP, and VIP+
 * Allows users to compare and select their preferred plan
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import QuickworkLogo from '../assets/Quickwork_logo.png';

// Icons
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CrownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 6L9.5 1L4 3.5L6.5 9L12 6ZM12 6L14.5 1L20 3.5L17.5 9L12 6ZM12 6V18L20 20H4L12 6Z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

interface BundleFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface Bundle {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: BundleFeature[];
  popular?: boolean;
  premium?: boolean;
  buttonText: string;
  buttonStyle: string;
  icon: React.ReactNode;
}

export default function Bundles() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const bundles: Bundle[] = [
    {
      id: 'free',
      name: t('bundles.free.name'),
      price: 0,
      period: selectedPeriod === 'monthly' ? t('bundles.perMonth') : t('bundles.perYear'),
      description: t('bundles.free.description'),
      features: [
        { name: t('bundles.features.basicProfile'), included: true },
        { name: t('bundles.features.jobSearch'), included: true },
        { name: t('bundles.features.applications'), included: true, description: t('bundles.features.applicationsLimit') },
        { name: t('bundles.features.messaging'), included: false },
        { name: t('bundles.features.analytics'), included: false },
        { name: t('bundles.features.prioritySupport'), included: false },
        { name: t('bundles.features.advancedSearch'), included: false },
        { name: t('bundles.features.profileBoost'), included: false },
        { name: t('bundles.features.premiumBadge'), included: false },
      ],
      buttonText: t('bundles.free.button'),
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      icon: <CheckIcon className="w-6 h-6" />
    },
    {
      id: 'vip',
      name: t('bundles.vip.name'),
      price: selectedPeriod === 'monthly' ? 19.99 : 199.99,
      period: selectedPeriod === 'monthly' ? t('bundles.perMonth') : t('bundles.perYear'),
      description: t('bundles.vip.description'),
      popular: true,
      features: [
        { name: t('bundles.features.basicProfile'), included: true },
        { name: t('bundles.features.jobSearch'), included: true },
        { name: t('bundles.features.applications'), included: true, description: t('bundles.features.unlimitedApplications') },
        { name: t('bundles.features.messaging'), included: true },
        { name: t('bundles.features.analytics'), included: true },
        { name: t('bundles.features.prioritySupport'), included: true },
        { name: t('bundles.features.advancedSearch'), included: true },
        { name: t('bundles.features.profileBoost'), included: false },
        { name: t('bundles.features.premiumBadge'), included: false },
      ],
      buttonText: t('bundles.vip.button'),
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
      icon: <StarIcon className="w-6 h-6" />
    },
    {
      id: 'vip_plus',
      name: t('bundles.vipPlus.name'),
      price: selectedPeriod === 'monthly' ? 39.99 : 399.99,
      period: selectedPeriod === 'monthly' ? t('bundles.perMonth') : t('bundles.perYear'),
      description: t('bundles.vipPlus.description'),
      premium: true,
      features: [
        { name: t('bundles.features.basicProfile'), included: true },
        { name: t('bundles.features.jobSearch'), included: true },
        { name: t('bundles.features.applications'), included: true, description: t('bundles.features.unlimitedApplications') },
        { name: t('bundles.features.messaging'), included: true },
        { name: t('bundles.features.analytics'), included: true },
        { name: t('bundles.features.prioritySupport'), included: true },
        { name: t('bundles.features.advancedSearch'), included: true },
        { name: t('bundles.features.profileBoost'), included: true },
        { name: t('bundles.features.premiumBadge'), included: true },
      ],
      buttonText: t('bundles.vipPlus.button'),
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
      icon: <CrownIcon className="w-6 h-6" />
    }
  ];

  const handleSelectBundle = (bundleId: string) => {
    if (bundleId === 'free') {
      // Handle free plan selection
      navigate('/dashboard');
    } else {
      // Handle paid plan selection - redirect to payment
      navigate(`/payment/${bundleId}`, { state: { period: selectedPeriod } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 mr-8 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>{t('buttons.backToHome')}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={QuickworkLogo} 
                  alt="Quickwork" 
                  className="w-8 h-8 rounded-lg shadow-md object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('bundles.title')}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('bundles.subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('bundles.hero.title')}
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('bundles.hero.subtitle')}
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={`text-sm font-medium ${selectedPeriod === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('bundles.monthly')}
            </span>
            <button
              onClick={() => setSelectedPeriod(selectedPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                selectedPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                  selectedPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${selectedPeriod === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {t('bundles.yearly')}
            </span>
            {selectedPeriod === 'yearly' && (
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
                {t('bundles.savePercent')}
              </span>
            )}
          </motion.div>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                bundle.popular 
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20' 
                  : bundle.premium 
                  ? 'border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              {/* Popular Badge */}
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('bundles.popular')}
                  </span>
                </div>
              )}
              
              {/* Premium Badge */}
              {bundle.premium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('bundles.premium')}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Bundle Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    bundle.id === 'free' 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : bundle.id === 'vip'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400'
                  }`}>
                    {bundle.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {bundle.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${bundle.price}
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                      /{bundle.period}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {bundle.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        feature.included 
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}>
                        {feature.included ? (
                          <CheckIcon className="w-3 h-3" />
                        ) : (
                          <span className="text-xs">×</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectBundle(bundle.id)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${bundle.buttonStyle} transform hover:scale-105 shadow-md hover:shadow-lg`}
                >
                  {bundle.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('bundles.faq.title')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('bundles.faq.subtitle')}
          </p>
          <button
            onClick={() => navigate('/support')}
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {t('bundles.faq.contactSupport')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
