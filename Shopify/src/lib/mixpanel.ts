import mixpanel from 'mixpanel-browser';

// 1. Determine which token to use
const isProd = import.meta.env.PROD; // Vite automatically sets this
const token = isProd 
  ? import.meta.env.VITE_MIXPANEL_TOKEN_PROD 
  : import.meta.env.VITE_MIXPANEL_TOKEN_DEV;

// 2. Initialize with safety checks
if (token) {
  mixpanel.init(token, { 
    debug: !isProd, // Shows logs in console only during development
    track_pageview: true 
  });
}

export const Analytics = {
  identify: (id: string) => {
    if (token) mixpanel.identify(id);
  },
  trackLogin: (method: string) => {
    if (token) {
      mixpanel.track('Login Success', { 'Method': method });
    }
  },
  reset: () => {
    mixpanel.reset();
  }
};