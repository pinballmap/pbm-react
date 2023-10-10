import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import { useSelector } from "react-redux";
import { getMapLocations } from "../selectors";
// import markerDraft from '../assets/marker-draft2.png';

// const circleStyles = {
//   circleColor: [
//     "match",
//     ["get", "val"],
//     "foo",
//     "#6FBF73",
//     "bar",
//     "#FF784E",
//     "baz",
//     "#FFAC33",
//     "#ccc",
//   ],
//   circleSortKey: ["step", ["get", "order"], 1.0, 1, 5.0, 2, 10.0, 3, 1],
//   circleRadius: 20,
// };

const iconStyles = {
  // iconImage: 'icon',
  iconImage: ["step", ["get", "num_machines"], "one", 2, "moreOne"],
  // iconImage: {num_machines},
  iconAllowOverlap: true,
  iconSize: 0.1,
  symbolSortKey: ["get", "num_machines"],
  textField: ["get", "num_machines"],
  textAllowOverlap: true,
  textColor: "#ffffff",
};

// const textStyles = {
//   textField: ["get", "num_machines"],
//   textAllowOverlap: true,
//   iconAllowOverlap: true,
// }

const CustomMapMarkers = React.memo(() => {
  const locations = useSelector(getMapLocations);
  const features = {
    type: "FeatureCollection",
    features: locations,
  };

  return (
    <Mapbox.ShapeSource id={"shape-source-id-0"} shape={features}>
      {/* <Mapbox.CircleLayer id={"circle-layer"} style={circleStyles} /> */}
      <Mapbox.SymbolLayer id={"symbol-id1"} style={iconStyles} />
      <Mapbox.Images
        // images={{ icon: markerDraft }}
        images={{
          one: require("../assets/marker-draft3.png"),
          moreOne: require("../assets/marker-draft2.png"),
        }}
      />
      {/* <Mapbox.SymbolLayer
        id={"symbol-id"}
        style={textStyles}
      /> */}
    </Mapbox.ShapeSource>
  );
});

CustomMapMarkers.propTypes = {
  navigation: PropTypes.object,
};

export default CustomMapMarkers;
