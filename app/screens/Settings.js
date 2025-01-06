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
import { CheckBox } from "@rneui/themed";
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
  const [checkedTestCheckBox, updateCheckedTestCheckbox] = useState(false);

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

  const testCheckBoxChange = (newCheckedValue) => {
    updateCheckedTestCheckbox(newCheckedValue);
  };

  const SettingCheckBox = ({
    title,
    description,
    checkTitle,
    onPress,
    checked,
  }) => {
    return (
      <View>
        <View style={[s.pageTitle, { marginBottom: 4 }]}>
          <Text style={s.pageTitleText}>{title}</Text>
        </View>
        <CheckBox
          checked={checked}
          title={checkTitle}
          onPress={() => {
            // Sends the new checked value
            return onPress(!checked);
          }}
          containerStyle={{ backgroundColor: theme.base1, marginVertical: -8 }}
          fontFamily="Nunito-Bold"
          textStyle={{ fontSize: 16, color: theme.text }}
          checkedColor={theme.purple}
        />
        <Text style={s.text}>{description}</Text>
      </View>
    );
  };

  const ButtonGroupSetting = ({
    title,
    buttons,
    description,
    onPress,
    selectedIndex,
  }) => {
    return (
      <View>
        <View style={s.pageTitle}>
          <Text style={s.pageTitleText}>{title}</Text>
        </View>
        <ButtonGroup
          onPress={onPress}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
        <Text style={s.text}>{description}</Text>
      </View>
    );
  };

  return (
    <Screen>
      <View style={s.background}>
        <SettingCheckBox
          title="CheckBox test"
          checkTitle="CheckBox title"
          description={"Testing how a checkbox setting looks."}
          onPress={testCheckBoxChange}
          checked={checkedTestCheckBox}
        />
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
      boxShadow:
        theme.theme == "dark"
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
