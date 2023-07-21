import React from "react";
import { Platform, View } from "react-native";
import Text from "./PbmText";
import PropTypes from "prop-types";

const IosMarker = React.memo(({ numMachines, selected, icon }) => {
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

  const borderColor = selected
    ? "#daffd3"
    : icon === "heart"
    ? "#f8e5fd"
    : "#ecd0f2";
  const backgroundColor = selected
    ? "#60aa51"
    : icon === "heart"
    ? "#fe46b0"
    : "#5f4d61";

  return (
    <View
      style={{
        width: dotWidthHeight,
        height: dotWidthHeight,
        borderRadius: dotWidthHeight / 2,
        borderWidth: 3,
        borderColor,
        backgroundColor,
      }}
    >
      <Text
        style={{
          color: "#f5f5ff",
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
