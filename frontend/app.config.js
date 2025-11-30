import 'dotenv/config';

export default {
  expo: {
    name: "frontend",
    slug: "frontend",  
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "frontend",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    // 🎯 Dynamic configuration - reads from environment
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000"
    },
    
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.crosspaths.app", 
      infoPlist: {
        "NSLocationWhenInUseUsageDescription": "This app needs access to your location to show nearby users.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to your location in the background to provide continuous tracking.",
        "NSLocationAlwaysUsageDescription": "This app needs your location in the background."
      }
    },
    
    android: {
      package: "com.crosspaths.app", 
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};