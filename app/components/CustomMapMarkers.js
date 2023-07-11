import React from "react";
import PropTypes from "prop-types";
import CustomMapMarker from "./CustomMapMarker";
import { useSelector } from "react-redux";
import { getMapLocations, selectedMapLocation } from "../selectors";

const CustomMapMarkers = React.memo(() => {
  const mapLocations = useSelector(getMapLocations);
  const selectedMarkerId = useSelector(selectedMapLocation);

  return mapLocations.map((l) => {
    const id = selectedMarkerId === l.id ? `${l.id}-selected` : l.id;
    return (
      <CustomMapMarker
        id={id}
        key={id}
        marker={l}
        selectedLocation={selectedMarkerId === l.id}
      />
    );
  });
});

CustomMapMarkers.propTypes = {
  navigation: PropTypes.object,
};

export default CustomMapMarkers;
