import React from "react";
import { ActivityIndicator, StyleSheet, ScrollView } from "react-native";

const styledActivityIndicator = () => {
  const s = getStyles();

  return (
    <ScrollView contenContainerStyle={s.container}>
      <ActivityIndicator color="#fe46b0" />
    </ScrollView>
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
