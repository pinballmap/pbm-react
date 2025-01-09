import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import React, { useState, useEffect } from "react";
import { Appearance, Platform } from "react-native";
import { retrieveItem } from "./app/config/utils";
import { ThemeContext } from "./app/theme-context";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { dark, standard } from "./app/utils/themes";
import { StatusBar } from "expo-status-bar";
import store from "./app/store";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppWrapper } from "./app/components";
import MapNavigator from "./app/config/router";
import * as Sentry from "@sentry/react-native";
import * as Device from "expo-device";
import {
  KEY_THEME,
  THEME_DARK,
  THEME_DARK_SETTING_VALUE,
  THEME_LIGHT,
  THEME_LIGHT_SETTING_VALUE,
  THEME_SYSTEM_SETTING_VALUE,
} from "./app/utils/constants";

Sentry.init({
  dsn: "https://057bae9b04f2410db6e4f1bd8d3eff2c@o1352308.ingest.sentry.io/6633526",
  debug: false,
});

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

// https://github.com/facebook/react-native/issues/19410
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-US");
}

const App = () => {
  const calculateTheme = (themePreference) => {
    switch (themePreference) {
      case THEME_SYSTEM_SETTING_VALUE:
        return Appearance.getColorScheme() === THEME_DARK
          ? THEME_DARK
          : THEME_LIGHT;
      case THEME_DARK_SETTING_VALUE:
        return THEME_DARK;
      case THEME_LIGHT_SETTING_VALUE:
        return THEME_LIGHT;
      default:
        return THEME_LIGHT; // Default
    }
  };

  // The actual theme, such as "dark" or ""
  const [selectedTheme, setSelectedTheme] = useState(
    calculateTheme(THEME_SYSTEM_SETTING_VALUE),
  );
  // The value for theme selected in the settings screen
  const [selectedThemePreference, setSelectedThemePreference] = useState(
    THEME_SYSTEM_SETTING_VALUE,
  );

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      // Update theme only if "system" preference is selected
      if (selectedThemePreference === THEME_SYSTEM_SETTING_VALUE) {
        setSelectedTheme(colorScheme === THEME_DARK ? THEME_DARK : THEME_LIGHT);
      }
    });

    return () => {
      listener.remove(); // Cleanup the listener on unmount
    };
  }, [selectedThemePreference]);

  useEffect(() => {
    retrieveItem(KEY_THEME).then((theme) => {
      setThemePreference(theme);
    });

    async function lockOrientation() {
      if (Device.deviceType.TABLET) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.ALL,
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      }
    }

    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    lockOrientation();
    prepare();
  }, []);

  const setThemePreference = (newThemePreference) => {
    setSelectedThemePreference(newThemePreference);
    setSelectedTheme(calculateTheme(newThemePreference));
  };

  return (
    <ThemeContext.Provider
      value={{
        setThemePreference,
        theme: selectedTheme === "dark" ? dark : standard,
      }}
    >
      <Provider store={store}>
        <AppWrapper>
          <NavigationContainer
            theme={selectedTheme === "dark" ? dark : standard}
          >
            <MapNavigator />
          </NavigationContainer>
        </AppWrapper>
      </Provider>
      <StatusBar
        style={selectedTheme === "dark" ? "light" : "dark"}
        translucent={true}
      />
    </ThemeContext.Provider>
  );
};

export default registerRootComponent(App);
