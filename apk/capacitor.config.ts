import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onexking.app',
  appName: '1xKING',
  server: {
    url: 'https://1xking.vercel.app/',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#141011",
      androidSplashResourceName: "splash",
      androidScaleType: "FIT_CENTER",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
