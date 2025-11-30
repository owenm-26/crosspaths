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
        NSAllowsArbitraryLoads: true,
        UIBackgroundModes: [
          "location",
          "fetch",
          "remote-notification"
        ],
        "NSLocationWhenInUseUsageDescription": "This app needs access to your location to show nearby users.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to your location in the background to provide continuous tracking.",
        "NSLocationAlwaysUsageDescription": "This app needs your location in the background."
      }
    },
    "plugins": [
      "expo-localization",
      "expo-background-fetch",
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 33,
            "targetSdkVersion": 33,
            "buildToolsVersion": "33.0.0"
          },
          "ios": {
            "deploymentTarget": "14.0"
          }
        }
      ],
      [
        "expo-task-manager",
        {
          "ios": {
            "minimumOSVersion": "14"
          }
        }
      ],
      [
        "expo-background-fetch",
        {
          "ios": {
            "minimumOSVersion": "14"
          }
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location.",
          "locationAlwaysPermission": "Allow $(PRODUCT_NAME) to use your location.",
          "locationWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location.",
          "isIosBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true
        }
      ]
    ],
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
      "expo-secure-store",
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