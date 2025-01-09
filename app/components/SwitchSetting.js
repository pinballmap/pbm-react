import { Platform, StyleSheet, View } from "react-native";
import { Text } from "./index";
import { Switch } from "@rneui/themed";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const SwitchSetting = ({ title, description, value, onValueChange }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View>
      <View style={[s.title, { marginBottom: 4 }]}>
        <Text style={s.titleText}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: -8,
        }}
      >
        <Text style={[s.descriptionText, { flex: 1 }]}>{description}</Text>
        <Switch
          value={value}
          onValueChange={() => {
            // Sends the new checked value
            return onValueChange(!value);
          }}
          trackColor={s.switchTrackColor}
          ios_backgroundColor={s.iosTrackColor}
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    title: {
      paddingTop: 10,
    },
    titleText: {
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text2,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
      lineHeight: 22,
      marginLeft: 15,
      marginRight: 15,
    },
    switchTrackColor: {
      true: theme.purple,
      false: theme.theme === "dark" ? theme.red2 : theme.base4, // Not used on iOS
    },
    iosTrackColor: theme.theme === "dark" ? theme.red2 : theme.base4,
  });

export default SwitchSetting;
