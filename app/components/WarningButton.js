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
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Button
      title={title}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      buttonStyle={s.redButton}
      titleStyle={s.titleStyle}
      containerViewStyle={{ alignSelf: "stretch" }}
      containerStyle={[
        {
          overflow: "visible",
          borderRadius: 25,
          shadowColor: theme.shadow,
          backgroundColor: theme.base1,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 6,
          elevation: 6,
        },
        containerStyle ? containerStyle : s.margin15,
      ]}
    />
  );
};

WarningButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
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
      fontFamily: "boldFont",
    },
    redButton: {
      backgroundColor: theme.red2,
      width: "100%",
      borderRadius: 25,
    },
  });

export default WarningButton;
