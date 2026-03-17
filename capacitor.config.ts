import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tracker.app',
  appName: 'Tracker',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
