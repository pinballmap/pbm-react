import { Platform, StyleSheet, View } from "react-native";
import { Text } from "./index";
import { Switch } from "@rneui/themed";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const SwitchSetting = ({ title, description, value, onValueChange }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View style={s.container}>
      <View>
        <Text style={s.titleText}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={[s.descriptionText, { flex: 1 }]}>{description}</Text>
        <Switch
          value={value}
          onValueChange={() => {
            // Sends the new checked value
            return onValueChange(!value);
          }}
          trackColor={{
            true: theme.purple,
            false: theme.theme === "dark" ? theme.red3 : theme.base4, // Not used on iOS
          }}
          ios_backgroundColor={
            theme.theme === "dark" ? theme.red3 : theme.base4
          }
        />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: 15,
      marginHorizontal: 15,
    },
    titleText: {
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
      marginBottom: 2,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text2,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
      lineHeight: 22,
      marginLeft: 5,
      marginRight: 15,
    },
  });

export default SwitchSetting;
