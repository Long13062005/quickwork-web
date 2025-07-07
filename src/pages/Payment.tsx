/**
 * Payment Page
 * Handles payment processing for VIP and VIP+ bundles
 */

import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import QuickworkLogo from '../assets/Quickwork_logo.png';

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Payment() {
  const { bundleId } = useParams<{ bundleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const period = location.state?.period || 'monthly';

  // Bundle details
  const getBundleDetails = () => {
    switch (bundleId) {
      case 'vip':
        return {
          name: t('bundles.vip.name'),
          price: period === 'monthly' ? 19.99 : 199.99,
          description: t('bundles.vip.description'),
          color: 'blue'
        };
      case 'vip_plus':
        return {
          name: t('bundles.vipPlus.name'),
          price: period === 'monthly' ? 39.99 : 399.99,
          description: t('bundles.vipPlus.description'),
          color: 'purple'
        };
      default:
        return null;
    }
  };

  const bundle = getBundleDetails();

  useEffect(() => {
    if (!bundle) {
      navigate('/bundles');
    }
  }, [bundle, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // Redirect to success page or dashboard
    navigate('/dashboard');
  };

  if (!bundle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/bundles')}
                className="flex items-center space-x-2 mr-8 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>{t('auth.back')}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={QuickworkLogo} 
                  alt="Quickwork" 
                  className="w-8 h-8 rounded-lg shadow-md object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('payment.title')}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('payment.subtitle')}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('payment.orderSummary')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bundle.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {period === 'monthly' ? t('bundles.monthly') : t('bundles.yearly')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${bundle.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      /{period === 'monthly' ? t('bundles.perMonth') : t('bundles.perYear')}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{t('payment.subtotal')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${bundle.price}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{t('payment.tax')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
                </div>
                
                <div className="flex justify-between items-center py-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{t('payment.total')}</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">${bundle.price}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('payment.paymentDetails')}
              </h2>
              
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <CreditCardIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('payment.demo.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('payment.demo.description')}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <LockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('payment.demo.secure')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg ${
                    bundle.color === 'blue' 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? t('payment.processing') : t('payment.completePurchase')}
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                  <LockIcon className="w-4 h-4" />
                  <span className="text-sm">{t('payment.securePayment')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
