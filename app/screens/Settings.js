import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { ThemeContext } from "../theme-context";
import { Screen, ButtonGroupSetting, SwitchSetting } from "../components";
import { retrieveItem } from "../config/utils";
import { setInsiderConnectedBadgeDisplay, setUnitPreference } from "../actions";
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
