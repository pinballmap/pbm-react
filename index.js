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
  Appearance.addChangeListener(({ colorScheme }) => {
    if (selectedTheme === THEME_SYSTEM_SETTING_VALUE) {
      // Update theme only if "system" theme is selected
      updateSelectedTheme(
        colorScheme === THEME_DARK ? THEME_DARK : THEME_LIGHT,
      );
    }
  });

  const [selectedTheme, updateSelectedTheme] = useState(
    THEME_SYSTEM_SETTING_VALUE,
  );

  useEffect(() => {
    retrieveItem(KEY_THEME).then((theme) => {
      updateSelectedTheme(theme ? theme : THEME_SYSTEM_SETTING_VALUE);
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

  const calculateTheme = (newTheme) => {
    switch (newTheme) {
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

  const setTheme = (newTheme) => {
    updateSelectedTheme(calculateTheme(newTheme));
  };

  return (
    <ThemeContext.Provider
      value={{
        setTheme,
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
