import React from "react";
import PropTypes from "prop-types";
import Mapbox from "@rnmapbox/maps";
import IosMarker from "./IosMarker";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMapLocation } from "../actions";
import { selectingMapMarker } from "../selectors";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC);

const MarkerDot = React.memo(({ numMachines, icon, selected }) => {
  return (
    <IosMarker numMachines={numMachines} icon={icon} selected={selected} />
  );
});

MarkerDot.propTypes = {
  numMachines: PropTypes.number,
};

const CustomMapMarker = React.memo(({ marker, selectedLocation }) => {
  const { num_machines, lat, lon, id, icon } = marker;
  const dispatch = useDispatch();
  const isBlocking = useSelector(selectingMapMarker);

  return (
    <>
      <Mapbox.PointAnnotation
        id={JSON.stringify(id)}
        coordinate={[Number(lon), Number(lat)]}
        anchor={{ x: 0.5, y: 0.5 }}
        onSelected={() => !isBlocking && dispatch(setSelectedMapLocation(id))}
      >
        <MarkerDot
          numMachines={num_machines}
          icon={icon}
          locationId={id}
          selected={selectedLocation}
        />
      </Mapbox.PointAnnotation>
    </>
  );
});

CustomMapMarker.propTypes = {
  marker: PropTypes.object,
  navigation: PropTypes.object,
};

export default CustomMapMarker;
