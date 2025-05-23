import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../theme-context";

const DropDownButton = ({ title, margin, onPress, rightIcon }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.buttonStyle,
        margin ? margin : s.margin,
        pressed ? s.pressed : undefined,
      ]}
    >
      <Text style={s.titleStyle}>{title}</Text>
      {rightIcon ? (
        rightIcon
      ) : (
        <MaterialIcons name="arrow-drop-down" style={s.dropdownIcon} />
      )}
    </Pressable>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    titleStyle: {
      fontSize: 16,
      fontFamily: "Nunito-Regular",
      textTransform: "capitalize",
      color: theme.text3,
    },
    buttonStyle: {
      borderRadius: 25,
      paddingHorizontal: 10,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
    },
    margin: {
      marginHorizontal: 20,
      marginTop: 0,
      marginBottom: 5,
    },
    dropdownIcon: {
      color: theme.text3,
      fontSize: 24,
      marginLeft: 5,
    },
    pressed: {
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: theme.theme == "dark" ? "#4d467d" : "#cccceb",
    },
  });

export default DropDownButton;
