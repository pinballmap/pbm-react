import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import React, { useState, useEffect } from "react";
import { Appearance, Platform } from "react-native";
import { retrieveItem } from "./app/config/utils";
import { ThemeContext } from "./app/theme-context";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { dark, isThemeDark, standard } from "./app/utils/themes";
import { StatusBar } from "expo-status-bar";
import store from "./app/store";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import { AppWrapper } from "./app/components";
import MapNavigator from "./app/config/router";
import * as Sentry from "@sentry/react-native";
import * as Device from "expo-device";
import {
  KEY_DARK_THEME_OVERRIDE,
  KEY_DEFAULT_THEME_OVERRIDE,
  THEME_DARK,
  THEME_LIGHT,
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

const defaultTheme = Appearance.getColorScheme();

// https://github.com/facebook/react-native/issues/19410
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-US");
}

const App = () => {
  const [selectedTheme, setSelectedTheme] = useState(
    isThemeDark(defaultTheme) ? THEME_DARK : THEME_LIGHT,
  );

  useEffect(() => {
    retrieveItem(KEY_DEFAULT_THEME_OVERRIDE).then(
      (defaultThemeOverride) =>
        !isThemeDark(defaultTheme) &&
        defaultThemeOverride &&
        setSelectedTheme(THEME_DARK),
    );

    retrieveItem(KEY_DARK_THEME_OVERRIDE).then(
      (darkThemeOverride) =>
        isThemeDark(defaultTheme) &&
        darkThemeOverride &&
        setSelectedTheme(THEME_LIGHT),
    );

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

  const toggleDefaultTheme = () =>
    !isThemeDark(defaultTheme) &&
    setSelectedTheme(isThemeDark(selectedTheme) ? THEME_LIGHT : THEME_DARK);
  const toggleDarkTheme = () =>
    isThemeDark(defaultTheme) &&
    setSelectedTheme(isThemeDark(selectedTheme) ? THEME_LIGHT : THEME_DARK);

  return (
    <ThemeContext.Provider
      value={{
        toggleDefaultTheme,
        toggleDarkTheme,
        theme: isThemeDark(selectedTheme) ? dark : standard,
      }}
    >
      <Provider store={store}>
        <AppWrapper>
          <NavigationContainer
            theme={isThemeDark(selectedTheme) ? dark : standard}
          >
            <MapNavigator />
          </NavigationContainer>
        </AppWrapper>
      </Provider>
      <StatusBar
        style={isThemeDark(selectedTheme) ? "light" : "dark"}
        translucent={true}
      />
    </ThemeContext.Provider>
  );
};

export default registerRootComponent(App);
