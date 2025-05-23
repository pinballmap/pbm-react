import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, ScrollView } from "react-native";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";

const NotLoggedIn = ({ onPress, text }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <ScrollView style={s.container}>
      <Text style={s.hiya}>{text}</Text>
      <PbmButton title={"Log In"} onPress={onPress} />
    </ScrollView>
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
      fontStyle: Platform.OS === "android" ? undefined : "italic",
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
