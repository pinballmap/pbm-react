import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet } from "react-native";
import { ThemeContext } from "../theme-context";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";

const ScrollToTop = ({ visible, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  if (!visible) return null;

  return (
    <Pressable onPress={onPress} style={[s.upButton, s.boxShadow]}>
      <FontAwesome6
        name="arrow-up"
        iconStyle="solid"
        size={32}
        color={theme.white}
      />
    </Pressable>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    upButton: {
      justifyContent: "center",
      position: "absolute",
      right: 25,
      bottom: 25,
      backgroundColor: theme.purple,
      padding: 10,
      borderRadius: 15,
    },
    boxShadow: {
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
  });

ScrollToTop.propTypes = {
  visible: PropTypes.bool,
  onPress: PropTypes.func,
};

export default ScrollToTop;
