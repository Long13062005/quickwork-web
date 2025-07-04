/**
 * Authentication debugging utilities
 */

export const debugAuthState = () => {
  const authToken = localStorage.getItem('authToken');
  const cookies = document.cookie;
  const isSecure = window.location.protocol === 'https:';
  
  const authState = {
    hasToken: !!authToken,
    tokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
    hasCookies: cookies.length > 0,
    cookies: cookies,
    isSecure,
    domain: window.location.hostname,
    origin: window.location.origin,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  };
  
  console.group('🔍 Authentication Debug Info');
  console.log('Auth State:', authState);
  console.log('Full Token:', authToken);
  console.log('All Cookies:', document.cookie);
  console.groupEnd();
  
  return authState;
};

export const checkCookieCompatibility = () => {
  const isSecure = window.location.protocol === 'https:';
  const domain = window.location.hostname;
  
  console.group('🍪 Cookie Compatibility Check');
  console.log('Protocol:', window.location.protocol);
  console.log('Domain:', domain);
  console.log('Secure Context:', isSecure);
  console.log('SameSite Support:', 'cookie' in document && 'sameSite' in HTMLElement.prototype);
  
  if (!isSecure && domain !== 'localhost') {
    console.warn('⚠️  Non-secure context detected. Secure cookies may not work.');
  }
  
  if (domain === 'localhost') {
    console.info('ℹ️  Localhost detected - should work with both secure and non-secure cookies');
  }
  
  console.groupEnd();
};

export const testApiConnection = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1010/api';
  
  console.group('🌐 API Connection Test');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // First, try a basic connectivity test to the API base URL
    const baseResponse = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      credentials: 'include', // HTTPOnly cookie authentication
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Base API Response:', {
      status: baseResponse.status,
      statusText: baseResponse.statusText,
      headers: Object.fromEntries(baseResponse.headers.entries())
    });
    
    // Even if we get 404, it means the server is reachable
    if (baseResponse.status < 500) {
      console.log('✅ API server is reachable');
    }
    
    // Try the check-email endpoint which should exist
    console.log('Testing check-email endpoint...');
    const emailCheckResponse = await fetch(`${API_BASE_URL}/auth/check-email?email=debug@test.com`, {
      method: 'GET',
      credentials: 'include', // HTTPOnly cookie authentication
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Email Check Response:', {
      status: emailCheckResponse.status,
      statusText: emailCheckResponse.statusText
    });
    
    if (emailCheckResponse.ok) {
      console.log('✅ Auth endpoints are accessible');
    } else if (emailCheckResponse.status === 403) {
      console.log('⚠️  403 response - this may indicate authentication issues');
    }
    
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
    console.log('This could indicate:');
    console.log('- Backend server is not running on the expected port');
    console.log('- CORS issues between frontend and backend');
    console.log('- Network connectivity problems');
    console.log('- Incorrect VITE_API_URL configuration');
    console.log('- Firewall blocking the connection');
  }
  
  console.groupEnd();
};

export const runFullAuthDiagnostic = async () => {
  console.log('🚀 Running Full Authentication Diagnostic...');
  
  debugAuthState();
  checkCookieCompatibility();
  await testApiConnection();
  
  console.log('✅ Diagnostic Complete');
};
