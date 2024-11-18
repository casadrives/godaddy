import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.casadrive.app',
  appName: 'CasaDrive',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#FFFFFF",
      overlaysWebView: false,
    },
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keyAlias: null,
      keyPassword: null,
      releaseType: 'APK',
    }
  }
}

export default config;