import React from "react";
import PropTypes from "prop-types";
import CustomMapMarker from "./CustomMapMarker";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";

const CustomMapMarkers = React.memo(({ navigation }) => {
  const mapLocations = useSelector(getMapLocations);
  return mapLocations.map((l) => {
    {
      console.log("mapLocations ID " + l.id);
    }
    return (
      <CustomMapMarker
        id={`${l.id}_${Date.now()}`}
        key={`${l.id}_${Date.now()}`}
        marker={l}
        navigation={navigation}
      />
    );
  });
});

CustomMapMarkers.propTypes = {
  navigation: PropTypes.object,
};

export default CustomMapMarkers;
