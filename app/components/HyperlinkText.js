import React, { useContext } from "react";
import { Text, StyleSheet } from "react-native";
import { ThemeContext } from "../theme-context";
import * as WebBrowser from "expo-web-browser";

const HyperlinkText = ({ text }) => {
  const renderTextWithLinks = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    const { theme } = useContext(ThemeContext);
    const s = getStyles(theme);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Text
            key={index}
            style={[s.linkText, s.regular]}
            onPress={() => WebBrowser.openBrowserAsync(part)}
          >
            {part}
          </Text>
        );
      }
      return (
        <Text style={[s.notLinkText, s.regular]} key={index}>
          {part}
        </Text>
      );
    });
  };

  return <Text>{renderTextWithLinks()}</Text>;
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    linkText: {
      textDecorationLine: "underline",
      color: theme.blue4,
    },
    notLinkText: {
      color: theme.text,
    },
  });

export default HyperlinkText;
