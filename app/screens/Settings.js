import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { ThemeContext } from "../theme-context";
import { Screen, ButtonGroupSetting } from "../components";
import { retrieveItem } from "../config/utils";
import { setUnitPreference } from "../actions";
import {
  KEY_DEFAULT_THEME_OVERRIDE,
  KEY_DARK_THEME_OVERRIDE,
} from "../utils/constants";

const Settings = ({ user, setUnitPreference }) => {
  const { toggleDefaultTheme, toggleDarkTheme, theme } =
    useContext(ThemeContext);
  const s = getStyles(theme);

  const [selectedDefault, updateSelectedDefault] = useState(0);
  const [selectedDark, updateSelectedDark] = useState(1);

  useEffect(() => {
    retrieveItem(KEY_DEFAULT_THEME_OVERRIDE).then(
      (defaultThemeOverride) =>
        defaultThemeOverride && updateSelectedDefault(1),
    );

    retrieveItem(KEY_DARK_THEME_OVERRIDE).then(
      (darkThemeOverride) => darkThemeOverride && updateSelectedDark(0),
    );
  });

  const updateDefaultPref = (idx) => {
    if (idx === selectedDefault) return;

    updateSelectedDefault(idx);
    AsyncStorage.setItem(KEY_DEFAULT_THEME_OVERRIDE, JSON.stringify(idx === 1));
    toggleDefaultTheme();
  };

  const updateDarkPref = (idx) => {
    if (idx === selectedDark) return;

    updateSelectedDark(idx);
    AsyncStorage.setItem(KEY_DARK_THEME_OVERRIDE, JSON.stringify(idx === 0));
    toggleDarkTheme();
  };

  const updateUnitPref = (idx) => {
    setUnitPreference(idx);
  };

  return (
    <Screen>
      <View style={s.background}>
        <ButtonGroupSetting
          title="Light Mode Theme"
          buttons={["Light", "Dark"]}
          description="When your phone is in Light Mode, use our Light theme or our Dark theme."
          onPress={updateDefaultPref}
          selectedIndex={selectedDefault}
        />
        <ButtonGroupSetting
          title="Dark Mode Theme"
          buttons={["Light", "Dark"]}
          description="When your phone is in Dark Mode, stick with a Dark theme or switch to Light theme."
          onPress={updateDarkPref}
          selectedIndex={selectedDark}
        />
        <ButtonGroupSetting
          title="Distance Unit"
          buttons={["Miles", "Kilometers"]}
          description="Choose your preferred distance measurement unit."
          onPress={updateUnitPref}
          selectedIndex={user.unitPreference ? 1 : 0}
        />
      </View>
    </Screen>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
  });

Settings.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  setUnitPreference: PropTypes.func,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  setUnitPreference: (unitPreference) =>
    dispatch(setUnitPreference(unitPreference)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
