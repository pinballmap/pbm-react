import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
import { ButtonGroup } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { Screen, Text } from "../components";
import { retrieveItem } from "../config/utils";
import { setUnitPreference } from "../actions";

const Settings = ({ user, setUnitPreference }) => {
  const { toggleDefaultTheme, toggleDarkTheme, theme } =
    useContext(ThemeContext);
  const s = getStyles(theme);

  const [selectedDefault, updateSelectedDefault] = useState(0);
  const [selectedDark, updateSelectedDark] = useState(1);

  useEffect(() => {
    retrieveItem("defaultThemeOverride").then(
      (defaultThemeOverride) =>
        defaultThemeOverride && updateSelectedDefault(1),
    );

    retrieveItem("darkThemeOverride").then(
      (darkThemeOverride) => darkThemeOverride && updateSelectedDark(0),
    );
  });

  const updateDefaultPref = (idx) => {
    if (idx === selectedDefault) return;

    updateSelectedDefault(idx);
    AsyncStorage.setItem("defaultThemeOverride", JSON.stringify(idx === 1));
    toggleDefaultTheme();
  };

  const updateDarkPref = (idx) => {
    if (idx === selectedDark) return;

    updateSelectedDark(idx);
    AsyncStorage.setItem("darkThemeOverride", JSON.stringify(idx === 0));
    toggleDarkTheme();
  };

  const updateUnitPref = (idx) => {
    setUnitPreference(idx);
  };

  return (
    <Screen>
      <View style={s.background}>
        <View style={s.pageTitle}>
          <Text style={s.pageTitleText}>Light Mode Theme</Text>
        </View>
        <ButtonGroup
          onPress={updateDefaultPref}
          selectedIndex={selectedDefault}
          buttons={["Light", "Dark"]}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
        <Text
          style={s.text}
        >{`When your phone is in Light Mode, use our Light theme or our Dark theme.`}</Text>
        <View style={s.pageTitle}>
          <Text style={s.pageTitleText}>Dark Mode Theme</Text>
        </View>
        <ButtonGroup
          onPress={updateDarkPref}
          selectedIndex={selectedDark}
          buttons={["Light", "Dark"]}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
        <Text
          style={s.text}
        >{`When your phone is in Dark Mode, stick with a Dark theme or switch to Light theme.`}</Text>
        <View style={s.pageTitle}>
          <Text style={s.pageTitleText}>Distance Unit</Text>
        </View>
        <ButtonGroup
          onPress={updateUnitPref}
          selectedIndex={user.unitPreference ? 1 : 0}
          buttons={["Miles", "Kilometers"]}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
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
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
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
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
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
