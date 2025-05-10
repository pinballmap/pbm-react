import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { ThemeContext } from "../theme-context";

const WarningButton = ({
  title,
  onPress,
  accessibilityLabel,
  containerStyle,
  icon,
  iconPosition,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Button
      title={title}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      icon={icon}
      iconPosition={iconPosition}
      buttonStyle={s.redButton}
      titleStyle={s.titleStyle}
      containerViewStyle={{ alignSelf: "stretch" }}
      containerStyle={[
        {
          overflow: "visible",
          borderRadius: 25,
          backgroundColor: theme.base1,
          shadowColor:
            theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        containerStyle ? containerStyle : s.margin15,
      ]}
    />
  );
};

WarningButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  iconPosition: PropTypes.string,
  icon: PropTypes.node,
  accessibilityLabel: PropTypes.string,
  containerStyle: PropTypes.object,
};

const getStyles = (theme) =>
  StyleSheet.create({
    margin15: {
      marginLeft: 40,
      marginRight: 40,
      marginTop: 15,
      marginBottom: 15,
    },
    titleStyle: {
      fontSize: 16,
      color: "white",
      textTransform: "capitalize",
      fontFamily: "Nunito-Bold",
    },
    redButton: {
      backgroundColor: theme.red2,
      width: "100%",
      borderRadius: 25,
    },
  });

export default WarningButton;
