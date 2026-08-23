import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";
import { ThemeContext } from "../theme-context";

const PbmText = ({ style, children, ...rest }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Text selectable style={[s.text, style]} {...rest}>
      {children}
    </Text>
  );
};

PbmText.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
  });

export default PbmText;
