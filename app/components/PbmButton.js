import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { isThemeDark } from "../utils/themes";

const PbmButton = ({
  title,
  accessibilityLabel,
  buttonStyle,
  containerStyle,
  titleStyle,
  onPress,
  icon,
  iconPosition,
  disabled,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <Button
      title={title}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      icon={icon}
      iconPosition={iconPosition}
      disabled={disabled}
      disabledStyle={styles.disabledStyle}
      disabledTitleStyle={styles.disabledTitleStyle}
      buttonStyle={buttonStyle ? buttonStyle : styles.blueButton}
      titleStyle={titleStyle ? titleStyle : styles.titleStyle}
      containerViewStyle={{ alignSelf: "stretch" }}
      containerStyle={[
        {
          overflow: "visible",
          borderRadius: 25,
          backgroundColor: theme.base1,
          boxShadow: isThemeDark(theme.theme)
            ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
            : "0 0 10 0 rgba(170, 170, 199, 0.3)",
        },
        containerStyle ? containerStyle : styles.margin15,
      ]}
    />
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    blueButton: {
      backgroundColor: isThemeDark(theme.theme) ? "#736aaf" : "#8e83ce",
      width: "100%",
      borderRadius: 25,
    },
    titleStyle: {
      color: "white",
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    disabledStyle: {
      backgroundColor: theme.white,
    },
    disabledTitleStyle: {
      color: theme.pink3,
      fontFamily: "Nunito-Bold",
    },
    margin15: {
      marginHorizontal: 40,
      marginVertical: 15,
    },
  });

export default PbmButton;
