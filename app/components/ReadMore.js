import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../theme-context";

const ReadMore = ({ text, style }) => {
  const [showMore, setShowMore] = useState(false);
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View style={s.container}>
      {text.length > 100 ? (
        showMore ? (
          <Pressable
            style={({ pressed }) => [pressed ? s.pressed : undefined]}
            onPress={() => setShowMore(!showMore)}
          >
            <Text style={[style]}>{text}</Text>
            <Text style={s.link}>Read less</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [pressed ? s.pressed : undefined]}
            onPress={() => setShowMore(!showMore)}
          >
            <Text>
              <Text style={[style]}>{`${text.slice(0, 100)}... `}</Text>
              <Text style={s.link}>Read more</Text>
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
    container: {
      flexShrink: 1,
    },
    link: {
      textDecorationLine: "underline",
      textTransform: "uppercase",
      color: theme.blue4,
      fontFamily: "Nunito-SemiBold",
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
