import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../theme-context";

const ReadMore = ({ text, style }) => {
  const [showMore, setShowMore] = useState(false);
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View>
      {text.length > 100 ? (
        showMore ? (
          <Pressable
            style={({ pressed }) => [pressed ? s.pressed : undefined]}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={[style]}>{text}</Text>
            <Text style={s.link}>Show less</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [pressed ? s.pressed : undefined]}
            onPress={() => setShowMore(!showMore)}
          >
            <Text>
              <Text style={[style]}>{`${text.slice(0, 100)}... `}</Text>
              <Text style={s.link}>Show more</Text>
            </Text>
          </Pressable>
        )
      ) : (
        <Text style={[style]}>{text}</Text>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    pressed: {
      opacity: 0.5,
    },
  });

ReadMore.propTypes = {
  style: PropTypes.array,
  text: PropTypes.string,
};

export default ReadMore;
