import React from "react";
import PropTypes from "prop-types";
import CustomMapMarker from "./CustomMapMarker";
import { useSelector } from "react-redux";
import { getMapLocations, selectedMapLocation } from "../selectors";

const CustomMapMarkers = React.memo(() => {
  const mapLocations = useSelector(getMapLocations);
  const selectedMarkerId = useSelector(selectedMapLocation);

  return mapLocations.map((l) => {
    // To trigger the pins to re-rerender upon selecting a location or hearting/unhearting we need to trigger an id change
    const id =
      selectedMarkerId === l.id
        ? `${l.id}-${l.icon}-selected`
        : `${l.id}-${l.icon}`;

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
