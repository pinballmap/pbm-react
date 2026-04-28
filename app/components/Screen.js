import React, { useContext, forwardRef } from "react";
import PropTypes from "prop-types";
import { ScrollView } from "react-native";
import { ThemeContext } from "../theme-context";

const Screen = forwardRef((props, ref) => {
  const { theme } = useContext(ThemeContext);

  return (
    <ScrollView
      ref={ref}
      {...props}
      scrollIndicatorInsets={{ right: 1 }}
      style={{ flex: 1, backgroundColor: theme.base1 }}
    >
      {props.children}
    </ScrollView>
  );
});

Screen.propTypes = {
  children: PropTypes.node,
};

export default Screen;
