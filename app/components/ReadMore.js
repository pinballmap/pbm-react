import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeContext } from "../theme-context";

const ReadMore = ({ style, text, numLines }) => {
  const [showFullText, setShowFullText] = useState(false);

  const handlePress = () => {
    setShowFullText(!showFullText);
  };

  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View>
      <Text numberOfLines={showFullText ? 0 : numLines} style={[style]}>
        {text}
      </Text>
      {text.length > numLines * 20 && (
        <TouchableOpacity onPress={handlePress}>
          <Text style={s.link}>{showFullText ? "read less" : "read more"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
  });

ReadMore.propTypes = {
  style: PropTypes.array,
  text: PropTypes.string,
  numLines: PropTypes.number,
};

export default ReadMore;
