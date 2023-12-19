import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";
import { setSelectedMapLocation } from "../actions";
import { useDispatch } from "react-redux";

const iconStyles = {
  iconImage: ["get", "icon"],
  iconAllowOverlap: true,
  iconSize: ["interpolate", ["linear"], ["zoom"], 11, 0.4, 24, 0.6],
  textSize: ["interpolate", ["linear"], ["zoom"], 11, 18, 24, 26],
  iconOpacity: ["step", ["get", "num_machines"], 0.85, 2, 0.9],
  symbolSortKey: ["get", "order"],
  textField: ["get", "num_machines"],
  textAllowOverlap: true,
  textColor: "#ffffff",
  textOffset: [0, 0.04],
  textFont: ["Nunito Sans Bold"],
};

const textFloat = (theme) => ({
  textField: [
    "step",
    ["zoom"],
    ["case", [">=", ["get", "num_machines"], 10], ["get", "name"], ""],
    13,
    ["case", [">=", ["get", "num_machines"], 2], ["get", "name"], ""],
    14,
    ["get", "name"],
  ],
  textSize: ["interpolate", ["linear"], ["zoom"], 11, 16, 24, 24],
  textJustify: "center",
  textVariableAnchor: ["bottom", "top", "right", "left"],
  textRadialOffset: 1.2,
  textAllowOverlap: false,
  textColor: theme === "dark" ? "#f3ecab" : "#553a3a",
  textFont: ["Nunito Sans Bold"],
  iconAllowOverlap: false,
  symbolSortKey: ["get", "textOrder"],
});

const CustomMapMarkers = React.memo(() => {
  const theme = useTheme();
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
        dispatch(setSelectedMapLocation(Number(e.features[0].id)));
      }}
    >
      <Mapbox.SymbolLayer id={"symbol-id1"} style={iconStyles} />
      <Mapbox.Images
        images={{
          one: require("../assets/marker-one.png"),
          moreOne: require("../assets/marker-more.png"),
          oneHeart: require("../assets/marker-one-heart.png"),
          moreOneHeart: require("../assets/marker-more-heart.png"),
          oneSelected: require("../assets/marker-one-selected.png"),
          moreOneSelected: require("../assets/marker-more-selected.png"),
        }}
      />
      <Mapbox.SymbolLayer
        id={"symbol-id2"}
        style={textFloat(theme.theme)}
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
