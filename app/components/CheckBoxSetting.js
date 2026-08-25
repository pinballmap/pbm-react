import { StyleSheet, View } from "react-native";
import { Text } from "./index";
import Checkbox from "expo-checkbox";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const CheckBoxSetting = ({ title, description, onPress, checked }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View>
      <View style={[s.title, { marginBottom: 4 }]}>
        <Text style={[s.titleText, s.bold]}>{title}</Text>
      </View>
      <Checkbox
        value={checked}
        onValueChange={() => {
          return onPress(!checked);
        }}
        style={s.checkBoxContainer}
        color={theme.purple}
      />
      <Text style={[s.descriptionText, s.italic]}>{description}</Text>
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
    title: {
      paddingTop: 10,
    },
    titleText: {
      textAlign: "center",
      fontSize: 18,
      color: theme.text,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text2,
      lineHeight: 22,
      marginLeft: 15,
      marginRight: 15,
    },
    checkBoxContainer: {
      backgroundColor: theme.base1,
      marginVertical: -8,
    },
  });

export default CheckBoxSetting;
