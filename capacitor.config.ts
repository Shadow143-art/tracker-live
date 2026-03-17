import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tracker.app',
  appName: 'Tracker',
  webDir: 'dist',
  server: {
    url: 'https://shadow143-art.github.io/tracker/',
    cleartext: true,
  },
};

export default config;
