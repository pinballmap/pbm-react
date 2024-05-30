import "dotenv/config";

export default {
  expo: {
    assetBundlePatterns: ["app/assets/images/*"],
    splash: {
      image: "app/assets/images/pbm-splash-2022.png",
      backgroundColor: "#47475f",
      resizeMode: "contain",
    },
    updates: {
      url: "https://u.expo.dev/7488ea00-6c89-11e9-8ab8-0157f5861c1f",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
    version: "5.3.16",
    slug: "pbm-app",
    owner: "pinballmap",
    name: "Pinball Map",
    scheme: "pinballmap",
    description:
      "Find public places to play pinball! Pinball Map is kept up to date by users and lists over 34,000 pinball machines.",
    privacy: "public",
    githubUrl: "https://github.com/pinballmap/pbm-react/",
    primaryColor: "#ebecff",
    extra: {
      eas: {
        projectId: "7488ea00-6c89-11e9-8ab8-0157f5861c1f",
      },
    },
    plugins: [
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsVersion: "11.3.0",
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD,
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "pinball-map",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "app/assets/fonts/Nunito-Regular.ttf",
            "app/assets/fonts/Nunito-Italic.ttf",
            "app/assets/fonts/Nunito-Medium.ttf",
            "app/assets/fonts/Nunito-SemiBold.ttf",
            "app/assets/fonts/Nunito-Bold.ttf",
            "app/assets/fonts/Nunito-ExtraBold.ttf",
            "app/assets/fonts/Nunito-Black.ttf",
          ],
        },
      ],
    ],
    ios: {
      bundleIdentifier: "net.isaacruiz.ppm",
      userInterfaceStyle: "automatic",
      icon: "app/assets/images/ios-icon.png",
      buildNumber: "186",
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Allow access to device location to show nearby places with pinball machines",
      },
      associatedDomains: [
        "applinks:pinballmap.com",
        "applinks:www.pinballmap.com",
      ],
      appStoreUrl:
        "https://itunes.apple.com/us/app/pinball-map/id359275713?mt=8",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_KEY,
        usesNonExemptEncryption: false,
      },
      entitlements: {
        "aps-environment": "development",
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryDiskSpace",
            NSPrivacyAccessedAPITypeReasons: ["E174.1", "85F4.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryFileTimestamp",
            NSPrivacyAccessedAPITypeReasons: ["0A2A.1", "3B52.1", "C617.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategorySystemBootTime",
            NSPrivacyAccessedAPITypeReasons: ["35F9.1"],
          },
          {
            NSPrivacyAccessedAPIType:
              "NSPrivacyAccessedAPICategoryUserDefaults",
            NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
          },
        ],
      },
    },
    android: {
      package: "com.pbm",
      userInterfaceStyle: "automatic",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_KEY,
        },
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE",
        "WRITE_EXTERNAL_STORAGE",
        "com.google.android.providers.gsf.permission.READ_GSERVICES",
      ],
      versionCode: 158,
      adaptiveIcon: {
        backgroundColor: "#ebecff",
        foregroundImage: "app/assets/images/adaptive-foreground.png",
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              host: "pinballmap.com",
              pathPrefix: "/suggest",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/saved",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/map",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/ca-central",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/ca-valley",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/sandiego",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/oregon-south",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/brisbane",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/cheyenne",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/wichita",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/minnesota",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/wisconsin",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/michigan-sw",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/michigan-north",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/memphis",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/montreal",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/delaware",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/chico",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/boise",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/connecticut",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/rhode-island",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/new-hampshire",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/west-oz",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/bellingham",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/richmond",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/philadelphia",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/centralpa",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/reno",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/eugene",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/champaign",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/nebraska",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/austin",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/manitoba",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/colorado",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/toronto",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/portland",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/indiana",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/bc",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/nashville",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/buffalo",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/youngstown",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/massachusetts",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/oklahoma",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/vermont",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/columbia-mo",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/raleigh-durham",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/san-antonio",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/columbia",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/cincinnati",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/calgary",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/atlanta",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/roanoke",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/bend",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/tucson",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/ottawa",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/louisville",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/dc",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/michigan-mid",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/jacksonville",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/spokane",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/chicago",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/pittsburgh",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/seattle",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/iowa",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/hawaii",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/birmingham",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/charlotte",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/tallahassee",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/maine",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/asheville",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/redding",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/detroit",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/newjersey",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/houston",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/southflorida",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/tampabay",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/baltimore",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/syracuse",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/lasvegas",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/utah",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/hudsonvalley",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/charleston",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/rochester",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/oceancity",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/cleveland",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/stlouis",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/columbus",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/sacramento",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/west-virginia",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/anchorage",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/nsw",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/japan",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/tricities",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/savannah",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/kansascity",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/phoenix",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/florida-central",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/albuquerque",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/dfw",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/nyc",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/la",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/arkansas",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/uk",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/bayarea",
              scheme: "https",
            },
            {
              host: "pinballmap.com",
              pathPrefix: "/finland",
              scheme: "https",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      playStoreUrl:
        "https://play.google.com/store/apps/details?id=com.pbm&hl=en",
      icon: "app/assets/images/android-icon.png",
    },
    platforms: ["android", "ios"],
    packagerOpts: {
      config: "metro.config.js",
      sourceExts: [
        "expo.ts",
        "expo.tsx",
        "expo.js",
        "expo.jsx",
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "wasm",
        "svg",
      ],
    },
  },
};
