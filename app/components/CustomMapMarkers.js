import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";

const circleStyles = {
  circleColor: [
    "match",
    ["get", "val"],
    "foo",
    "#6FBF73",
    "bar",
    "#FF784E",
    "baz",
    "#FFAC33",
    "#ccc",
  ],
  circleSortKey: ["step", ["get", "order"], 1.0, 1, 5.0, 2, 10.0, 3, 1],
  circleRadius: 20,
};

const CustomMapMarkers = React.memo(() => {
  const locations = useSelector(getMapLocations);
  const features = {
    type: "FeatureCollection",
    features: locations,
  };

  return (
    <Mapbox.ShapeSource id={"shape-source-id-0"} shape={features}>
      <Mapbox.CircleLayer id={"circle-layer"} style={circleStyles} />
      <Mapbox.SymbolLayer
        id={"symbol-id"}
        style={{ textField: ["get", "num_machines"] }}
      />
    </Mapbox.ShapeSource>
  );
});

CustomMapMarkers.propTypes = {
  navigation: PropTypes.object,
};

export default CustomMapMarkers;
