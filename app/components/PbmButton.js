import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { ThemeContext } from "../theme-context";

const PbmButton = ({ title, margin, onPress, rightIcon, disabled }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.buttonStyle,
        margin ? margin : s.margin,
        pressed ? s.pressed : undefined,
        disabled ? { opacity: 0.5 } : { opacity: 1.0 },
      ]}
    >
      <Text style={s.titleStyle}>{title}</Text>
      {rightIcon}
    </Pressable>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    titleStyle: {
      fontSize: 16,
      fontFamily: "Nunito-Bold",
      textTransform: "capitalize",
      color: theme.theme == "dark" ? "white" : theme.purple,
    },
    buttonStyle: {
      borderRadius: 25,
      borderWidth: 1,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.theme == "dark" ? "#736aaf" : theme.base4,
      borderColor: theme.theme == "dark" ? "#736aaf" : "#a79de3",
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
      backgroundColor: theme.theme == "dark" ? "#5b5391" : "#cccceb",
      borderColor: theme.theme == "dark" ? "#5b5391" : "#86869c",
    },
  });

export default PbmButton;
