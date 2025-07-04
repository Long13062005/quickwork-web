import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

// Disable error tracking in development environment
if (import.meta.env.DEV) {
  // Block Sentry and other error tracking services in development
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    if (url.includes('sentry.io') || url.includes('ingest.sentry.io')) {
      console.log('🚫 Blocked Sentry request in development:', url);
      return Promise.reject(new Error('Sentry blocked in development'));
    }
    return originalFetch.apply(this, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </Provider>
);