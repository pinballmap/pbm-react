import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";
import { setSelectedMapLocation } from "../actions";
import { useDispatch } from "react-redux";

const iconStyles = {
  iconImage: [
    "step",
    ["zoom"],
    [
      "case",
      ["<=", ["get", "machine_count"], 1],
      "marker_z_1",
      [
        "case",
        ["<=", ["get", "machine_count"], 9],
        "marker_z_2",
        "marker_z_10",
      ],
    ],
    8,
    ["get", "icon"],
  ],
  iconAllowOverlap: true,
  iconSize: [
    "interpolate",
    ["linear"],
    ["zoom"],
    1,
    0.14,
    4,
    0.3,
    9,
    0.6,
    22,
    0.8,
  ],

  textSize: ["interpolate", ["linear"], ["zoom"], 11, 20, 24, 26],
  symbolSortKey: ["get", "order"],
  textField: ["step", ["zoom"], "", 8, ["get", "machine_count"]],
  textAllowOverlap: true,
  textColor: ["get", "textColor"],
  textOffset: [0, 0.05],
  textFont: ["Nunito Sans ExtraBold"],
};

const textFloat = (theme) => ({
  textField: [
    "step",
    ["zoom"],
    ["case", [">=", ["get", "machine_count"], 10], ["get", "name"], ""],
    13,
    ["case", [">=", ["get", "machine_count"], 2], ["get", "name"], ""],
    14,
    ["get", "name"],
  ],
  textSize: ["interpolate", ["linear"], ["zoom"], 11, 16, 24, 22],
  textJustify: "center",
  textVariableAnchor: ["bottom", "top", "right", "left"],
  textRadialOffset: 1.4,
  textAllowOverlap: false,
  textColor: theme === "dark" ? "#f0f9ff" : "#463333",
  textHaloColor: theme === "dark" ? "#222221" : "#eeeaea",
  textHaloWidth: 1,
  textFont: ["Nunito Sans SemiBold"],
  iconAllowOverlap: false,
  symbolSortKey: ["get", "textOrder"],
});

const CustomMapMarkers = React.memo(() => {
  const theme = useTheme();
  const locations = useSelector((state) => getMapLocations(state, theme.theme));
  const features = {
    type: "FeatureCollection",
    features: locations,
  };
  const dispatch = useDispatch();

  return (
    <Mapbox.ShapeSource
      id={"shape-source-id-0"}
      shape={features}
      hitbox={{ width: 1, height: 1 }}
      onPress={(e) => {
        dispatch(setSelectedMapLocation(Number(e.features[0].id)));
      }}
    >
      <Mapbox.SymbolLayer id={"symbol-id1"} style={iconStyles} />
      <Mapbox.Images
        images={{
          marker_1: require("../assets/marker-1.png"),
          marker_2: require("../assets/marker-2.png"),
          marker_2Heart: require("../assets/marker-2Heart.png"),
          marker_2_1_sel: require("../assets/marker-2-1-sel.png"),
          marker_10: require("../assets/marker-10.png"),
          marker_10Heart: require("../assets/marker-10Heart.png"),
          marker_10_sel: require("../assets/marker-10-sel.png"),
          marker_z_1: require("../assets/marker-z-1.png"),
          marker_z_2: require("../assets/marker-z-2.png"),
          marker_z_10: require("../assets/marker-z-10.png"),
          marker_z_sel: require("../assets/marker-z-sel.png"),
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
