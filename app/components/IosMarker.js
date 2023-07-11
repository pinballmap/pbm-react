import React, { useContext } from "react";
import { Platform, View } from "react-native";
import Text from "./PbmText";
import PropTypes from "prop-types";
import { ThemeContext } from "../theme-context";

const IosMarker = React.memo(({ numMachines, selected }) => {
  const { theme } = useContext(ThemeContext);
  let dotFontMargin, dotWidthHeight;
  if (numMachines < 10) {
    dotFontMargin = 2;
    dotWidthHeight = 34;
  } else if (numMachines < 20) {
    dotFontMargin = 4;
    dotWidthHeight = 38;
  } else if (numMachines < 100) {
    dotFontMargin = 6;
    dotWidthHeight = 42;
  } else {
    dotFontMargin = 9;
    dotWidthHeight = 46;
  }
  return (
    <View
      style={{
        width: dotWidthHeight,
        height: dotWidthHeight,
        borderRadius: dotWidthHeight / 2,
        borderWidth: 3,
        borderColor: theme.theme == "dark" ? "#d898e7" : "#ecd0f2",
        backgroundColor: selected ? theme.pink1 : theme.text2,
      }}
    >
      <Text
        style={{
          color: theme.dot,
          fontFamily: "boldFont",
          textAlign: "center",
          fontSize: 18,
          marginTop: Platform.OS === "ios" ? dotFontMargin : dotFontMargin - 1,
        }}
      >
        {numMachines}
      </Text>
    </View>
  );
});

IosMarker.propTypes = {
  numMachines: PropTypes.number,
};

export default IosMarker;
