import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "../theme-context";

const PbmText = ({
  style,
  onPress,
  onLayout,
  children,
  maxFontSizeMultiplier,
  numberOfLines,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Text
      selectable={true}
      style={[s.text, style]}
      onPress={onPress}
      onLayout={onLayout}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

PbmText.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onLayout: PropTypes.func,
  children: PropTypes.node,
  maxFontSizeMultiplier: PropTypes.number,
  numberOfLines: PropTypes.number,
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
  });

export default PbmText;
