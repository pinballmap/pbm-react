import React, { useContext } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { Text } from "../components";
import { ThemeContext } from "../theme-context";

const ButtonGroupSetting = ({
  title,
  buttons,
  description,
  onPress,
  selectedIndex,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View>
      <View style={s.title}>
        <Text style={s.titleText}>{title}</Text>
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
      <Text style={s.descriptionText}>{description}</Text>
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
    buttonGroupContainer: {
      height: 40,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme === "dark" ? theme.base3 : theme.base4,
      boxShadow:
        theme.theme === "dark"
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
    selButtonStyle: {
      borderWidth: 2,
      borderColor: theme.theme === "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    innerBorderStyle: {
      width: 0,
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
  });

export default ButtonGroupSetting;
