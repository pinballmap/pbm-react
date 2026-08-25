import { StyleSheet, Switch, View } from "react-native";
import { Text } from "./index";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const SwitchSetting = ({ title, description, value, onValueChange }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View style={s.container}>
      <View>
        <Text style={[s.titleText, s.bold]}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={[s.descriptionText, s.italic, { flex: 1 }]}>
          {description}
        </Text>
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
    italic: {
      fontFamily: "Nunito",
      fontWeight: "400",
      fontStyle: "italic",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    container: {
      marginVertical: 15,
      marginHorizontal: 10,
    },
    titleText: {
      textAlign: "center",
      fontSize: 18,
      color: theme.text,
      marginBottom: 2,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text2,
      lineHeight: 22,
      marginLeft: 5,
      marginRight: 15,
    },
  });

export default SwitchSetting;
