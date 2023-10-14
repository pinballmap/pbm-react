import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";
import { setSelectedMapLocation } from "../actions";
import { useDispatch } from "react-redux";

const iconStyles = {
  iconImage: ["step", ["get", "num_machines"], "one", 10, "moreOne"],
  iconAllowOverlap: true,
  iconSize: ["interpolate", ["linear"], ["zoom"], 11, 0.1, 24, 0.2],
  textSize: ["interpolate", ["linear"], ["zoom"], 11, 16, 24, 32],
  iconOffset: [0, -80],
  iconOpacity: 0.85,
  symbolSortKey: ["get", "num_machines"],
  textField: ["get", "num_machines"],
  textAllowOverlap: true,
  textColor: "#ffffff",
  textOffset: [0, -0.65],
  textFont: ["Nunito Sans Bold"],
};

const textFloat = {
  textField: [
    "step",
    ["zoom"],
    ["case", [">=", ["get", "num_machines"], 10], ["get", "name"], ""],
    13,
    ["get", "name"],
  ],
  textOffset: [1.5, -1.25],
  textJustify: "left",
  // textRadialOffset: 1.5,
  textVariableAnchor: ["left", "bottom"],
  // textAnchor: "top-left",
  textAllowOverlap: false,
  textColor: "#c83737",
  textFont: ["Nunito Sans SemiBold"],
  iconAllowOverlap: false,
};

const CustomMapMarkers = React.memo(() => {
  const locations = useSelector(getMapLocations);
  const features = {
    type: "FeatureCollection",
    features: locations,
  };
  const dispatch = useDispatch();

  return (
    <Mapbox.ShapeSource
      id={"shape-source-id-0"}
      shape={features}
      hitbox={{ width: 10, height: 10 }}
      onPress={(e) => {
        dispatch(setSelectedMapLocation(e.features[0].id));
      }}
    >
      <Mapbox.SymbolLayer id={"symbol-id1"} style={iconStyles} />
      <Mapbox.Images
        images={{
          one: require("../assets/marker-draft5.png"),
          moreOne: require("../assets/marker-draft4.png"),
        }}
      />
      <Mapbox.SymbolLayer
        id={"symbol-id2"}
        style={textFloat}
        minZoomLevel={11}
        maxZoomLevel={24}
      />
    </Mapbox.ShapeSource>
  );
});

CustomMapMarkers.propTypes = {
  navigation: PropTypes.object,
};

export default CustomMapMarkers;
