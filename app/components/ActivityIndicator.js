import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styledActivityIndicator = () => {
  const s = getStyles();

  return (
    <View style={s.container}>
      <ActivityIndicator color="#fe46b0" />
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default styledActivityIndicator;
