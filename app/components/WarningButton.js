import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../theme-context";

const WarningButton = ({ title, margin, onPress, leftIcon }) => {
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
      {leftIcon}
      <Text style={s.titleStyle}>{title}</Text>
    </Pressable>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    titleStyle: {
      fontSize: 16,
      fontFamily: "Nunito-Bold",
      textTransform: "capitalize",
      color: "white",
    },
    buttonStyle: {
      borderRadius: 25,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.red2,
      height: 40,
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
      marginVertical: 15,
    },
    pressed: {
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: "#a8434a",
    },
  });

export default WarningButton;
