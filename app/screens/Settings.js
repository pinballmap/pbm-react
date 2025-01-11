import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { ThemeContext } from "../theme-context";
import { Screen } from "../components";
import { retrieveItem } from "../config/utils";
import { setInsiderConnectedBadgeDisplay, setUnitPreference } from "../actions";
import SwitchSetting from "../components/SettingsSwitch";
import ButtonGroupSetting from "../components/SettingsButtonGroup";
import { KEY_THEME, THEME_DEFAULT_VALUE } from "../utils/constants";

const Settings = ({
  user,
  setUnitPreference,
  setDisplayInsiderConnectedBadge,
}) => {
  const { setThemePreference, theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [selectedTheme, setSelectedTheme] = useState(THEME_DEFAULT_VALUE);

  useEffect(() => {
    retrieveItem(KEY_THEME).then((theme) =>
      setSelectedTheme(theme ?? THEME_DEFAULT_VALUE),
    );
  });

  const updateThemePref = (idx) => {
    if (idx === selectedTheme) return;

    setSelectedTheme(idx);
    AsyncStorage.setItem(KEY_THEME, idx.toString());
    setThemePreference(idx);
  };

  const updateUnitPref = (idx) => {
    setUnitPreference(idx);
  };

  const updateInsiderConnectedBadgeChange = (newSelectedValue) => {
    setDisplayInsiderConnectedBadge(newSelectedValue);
    // updateInsiderConnectedBadge(newSelectedValue);
  };

  return (
    <Screen>
      <View style={s.background}>
        <SwitchSetting
          title="Insider Connected Badge"
          description={
            "Show Insider Connected badge on the location details screen."
          }
          onValueChange={updateInsiderConnectedBadgeChange}
          value={user.displayInsiderConnectedBadgePreference}
          s={s}
        />
        <ButtonGroupSetting
          title="App Theme"
          buttons={["OS Theme", "Light", "Dark"]}
          description="Choose the theme to use for the app."
          onPress={updateThemePref}
          selectedIndex={selectedTheme}
          s={s}
        />
        <ButtonGroupSetting
          title="Distance Unit"
          buttons={["Miles", "Kilometers"]}
          description="Choose your preferred distance measurement unit."
          onPress={updateUnitPref}
          selectedIndex={user.unitPreference ? 1 : 0}
          s={s}
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
    pageTitle: {
      paddingTop: 10,
    },
    pageTitleText: {
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    text: {
      fontSize: 14,
      color: theme.text2,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
      lineHeight: 22,
      marginLeft: 15,
      marginRight: 15,
    },
    buttonGroupContainer: {
      height: 40,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme === "dark" ? theme.base3 : theme.base4,
      boxShadow:
        theme.theme === "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3))",
      overflow: "visible",
      marginHorizontal: 15,
    },
    buttonGroupInactive: {
      color: theme.text2,
      fontSize: 14,
      fontFamily: "Nunito-Medium",
    },
    innerBorderStyle: {
      width: 0,
    },
    selButtonStyle: {
      borderWidth: 2,
      borderColor: theme.theme === "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    checkBoxContainer: {
      backgroundColor: theme.base1,
      marginVertical: -8,
    },
    checkBoxCheckedColor: theme.purple,
    checkBoxTextStyle: {
      fontSize: 16,
      color: theme.text,
    },
    switchTrackColor: {
      false: theme.base3,
      true: theme.purple,
    },
    switchThumbColors: {
      false: theme.base3,
      true: theme.white,
    },
  });

Settings.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  setUnitPreference: PropTypes.func,
  setDisplayInsiderConnectedBadge: PropTypes.func,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  setUnitPreference: (unitPreference) =>
    dispatch(setUnitPreference(unitPreference)),
  setDisplayInsiderConnectedBadge: (displayInsiderConnectedBadgePreference) => {
    return dispatch(
      setInsiderConnectedBadgeDisplay(displayInsiderConnectedBadgePreference),
    );
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
