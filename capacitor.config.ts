import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tracker.app',
  appName: 'Tracker',
  webDir: 'out',
  server: {
    url: 'https://tracker-fihe.onrender.com',
    cleartext: true,
  },
};

export default config;
