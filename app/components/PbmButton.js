import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { ThemeContext } from "../theme-context";

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
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 6,
          elevation: 6,
        },
        containerStyle ? containerStyle : styles.margin15,
      ]}
    />
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    blueButton: {
      backgroundColor: theme.theme == "dark" ? "#736aaf" : "#8e83ce",
      width: "100%",
      borderRadius: 25,
    },
    titleStyle: {
      color: "white",
      fontSize: 16,
      fontFamily: "boldFont",
    },
    disabledStyle: {
      backgroundColor: theme.white,
    },
    disabledTitleStyle: {
      color: theme.pink3,
      fontFamily: "boldFont",
    },
    margin15: {
      marginHorizontal: 40,
      marginVertical: 15,
    },
  });

PbmButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  iconPosition: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  buttonStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  titleStyle: PropTypes.object,
};

export default PbmButton;
