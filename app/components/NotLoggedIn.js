import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";

const NotLoggedIn = ({ onPress, text }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View style={s.container}>
      <Text style={s.hiya}>{text}</Text>
      <PbmButton
        title={"Log In"}
        onPress={onPress}
        accessibilityLabel="Log In"
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base1,
    },
    hiya: {
      fontFamily: "Nunito-Italic",
      paddingHorizontal: 15,
      paddingBottom: 10,
      paddingTop: 25,
      color: theme.text2,
      textAlign: "center",
    },
  });

NotLoggedIn.propTypes = {
  navigation: PropTypes.object,
  text: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

export default NotLoggedIn;
