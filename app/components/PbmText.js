import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "../theme-context";

const PbmText = ({ style, onPress, children }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Text selectable={true} style={[s.text, style]} onPress={onPress}>
      {children}
    </Text>
  );
};

PbmText.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  children: PropTypes.node,
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      color: theme.text,
      fontFamily: "regularFont",
    },
  });

export default PbmText;
