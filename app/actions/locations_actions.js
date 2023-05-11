import Geocode from "react-geocode";
import {
  FETCHING_LOCATION_TYPES,
  FETCHING_LOCATION_TYPES_SUCCESS,
  FETCHING_LOCATION_TYPES_FAILURE,
  FETCHING_LOCATIONS,
  FETCHING_LOCATIONS_SUCCESS,
  FETCHING_LOCATIONS_FAILURE,
  SELECT_LOCATION_LIST_FILTER_BY,
  SET_MAX_ZOOM,
  UPDATE_COORDINATES,
  UPDATE_BOUNDS,
} from "./types";
import { getData } from "../config/request";
import { getDistance, coordsToBounds } from "../utils/utilityFunctions";

const STANDARD_DISTANCE = 5.5;

Geocode.setApiKey(process.env.GOOGLE_MAPS_KEY);

export const fetchLocationTypes = (url) => (dispatch) => {
  dispatch({ type: FETCHING_LOCATION_TYPES });

  return getData(url)
    .then((data) => dispatch(getLocationTypeSuccess(data)))
    .catch((err) => dispatch(getLocationTypeFailure(err)));
};

export const getLocationTypeSuccess = (data) => {
  return {
    type: FETCHING_LOCATION_TYPES_SUCCESS,
    locationTypes: data.location_types,
  };
};

export const getLocationTypeFailure = () => ({
  type: FETCHING_LOCATION_TYPES_FAILURE,
});

export const getFilterState = (filterState) => {
  const {
    machineId,
    locationType,
    numMachines,
    selectedOperator,
    viewByFavoriteLocations,
  } = filterState;
  const filtersNoMachines =
    !!machineId ||
    !!locationType ||
    !!selectedOperator ||
    !!viewByFavoriteLocations;
  const filteringByTwoMachines = !filtersNoMachines && numMachines === "2";
  const filteringByMoreMachines = !filtersNoMachines && numMachines > 2;
  const filterApplied = filtersNoMachines || numMachines > 0;
  return filteringByTwoMachines
    ? 300
    : filteringByMoreMachines
    ? numMachines * 100
    : filterApplied
    ? 500
    : 200;
};

export const getLocationsByBounds =
  ({ swLat, swLon, neLat, neLon }) =>
  (dispatch, getState) => {
    const {
      machineId,
      locationType,
      numMachines,
      selectedOperator,
      filterByMachineVersion,
    } = getState().query;
    const machineQueryString = machineId ? `by_machine_id=${machineId};` : "";
    const locationTypeQueryString = locationType
      ? `by_type_id=${locationType};`
      : "";
    const numMachinesQueryString = numMachines
      ? `by_at_least_n_machines_type=${numMachines};`
      : "";
    const byOperator = selectedOperator
      ? `by_operator_id=${selectedOperator};`
      : "";
    const url = `/locations/within_bounding_box.json?swlat=${swLat};swlon=${swLon};nelat=${neLat};nelon=${neLon};${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}`;
    dispatch({ type: FETCHING_LOCATIONS });
    return getData(url)
      .then((data) => {
        dispatch(getLocationsSuccess(data, machineId, filterByMachineVersion));
      })
      .catch((err) => dispatch(getLocationsFailure(err)));
  };

export const getLocations =
  (lat = "", lon = "", distance = STANDARD_DISTANCE) =>
  (dispatch, getState) => {
    dispatch({ type: FETCHING_LOCATIONS });

    const {
      machineId,
      locationType,
      numMachines,
      selectedOperator,
      curLat,
      curLon,
      filterByMachineVersion,
    } = getState().query;
    const machineQueryString = machineId ? `by_machine_id=${machineId};` : "";
    const locationTypeQueryString = locationType
      ? `by_type_id=${locationType};`
      : "";
    const numMachinesQueryString = numMachines
      ? `by_at_least_n_machines_type=${numMachines};`
      : "";
    const byOperator = selectedOperator
      ? `by_operator_id=${selectedOperator};`
      : "";
    const url = `/locations/closest_by_lat_lon.json?lat=${
      lat ? lat : curLat
    };lon=${
      lon ? lon : curLon
    };${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}max_distance=${distance};send_all_within_distance=1;no_details=1`;

    return getData(url)
      .then((data) =>
        dispatch(getLocationsSuccess(data, machineId, filterByMachineVersion)),
      )
      .catch((err) => dispatch(getLocationsFailure(err)));
  };

export const getLocationsConsideringZoom =
  (lat, lon, latDelta = 0.1, lonDelta = 0.1, distance) =>
  (dispatch, getState) => {
    const viewableMax = getFilterState(getState().query);
    const viewableLat = getDistance(
      lat - 0.5 * latDelta,
      lon,
      lat + 0.5 * latDelta,
      lon,
    );
    const viewableLon = getDistance(
      lat,
      lon - 0.5 * lonDelta,
      lat,
      lon + 0.5 * lonDelta,
    );
    const viewableDist = viewableLat > viewableLon ? viewableLat : viewableLon;
    const maxZoom = viewableLat > viewableMax || viewableLon > viewableMax;

    dispatch({ type: SET_MAX_ZOOM, maxZoom });
    if (distance || !maxZoom) {
      dispatch(getLocations(lat, lon, distance ? distance : viewableDist));
    }
  };

export const updateFilterLocations = () => (dispatch, getState) => {
  const viewableMax = getFilterState(getState().query);
  const { curLat, curLon, latDelta, lonDelta } = getState().query;
  const viewableLat = getDistance(
    curLat - 0.5 * latDelta,
    curLon,
    curLat + 0.5 * latDelta,
    curLon,
  );
  const viewableLon = getDistance(
    curLat,
    curLon - 0.5 * lonDelta,
    curLat,
    curLon + 0.5 * lonDelta,
  );
  const viewableDist = viewableLat > viewableLon ? viewableLat : viewableLon;
  const maxZoom = viewableLat > viewableMax || viewableLon > viewableMax;

  dispatch({ type: SET_MAX_ZOOM, maxZoom });
  if (!maxZoom) {
    dispatch(getLocations(curLat, curLon, viewableDist));
  }
};

export const updateCoordinates =
  (lat, lon, latDelta = 0.1, lonDelta = 0.1) =>
  (dispatch) => {
    dispatch({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta });
  };

export const updateBounds = (bounds) => (dispatch) => {
  dispatch({ type: UPDATE_BOUNDS, bounds });
};

export const triggerUpdateBounds = (bounds) => (dispatch) => {
  dispatch({ type: UPDATE_BOUNDS, bounds, triggerUpdateBounds: true });
};

export const updateCoordinatesAndGetLocations =
  (lat, lon, latDelta = 0.1, lonDelta = 0.1) =>
  (dispatch) => {
    dispatch({ type: UPDATE_COORDINATES, lat, lon, latDelta, lonDelta });
    dispatch(getLocations(lat, lon));
  };

export const getLocationsSuccess = (
  data,
  machineId,
  filterByMachineVersion,
) => {
  let locations = data.locations ? data.locations : [];
  if (machineId && filterByMachineVersion) {
    locations = locations.filter((location) =>
      location.machine_ids.includes(machineId),
    );
  }
  return {
    type: FETCHING_LOCATIONS_SUCCESS,
    locations,
  };
};

export const getLocationsFailure = () => (dispatch) => {
  dispatch({ type: FETCHING_LOCATIONS_FAILURE });
};

export const selectLocationListFilterBy = (idx) => {
  return {
    type: SELECT_LOCATION_LIST_FILTER_BY,
    idx,
  };
};

export const getLocationsByRegion = (region) => (dispatch) => {
  const { lat, lon, effective_radius } = region;

  const getDelta = () => {
    // Approximate hacks for an appropriate zoom depending on region's effective radius
    switch (true) {
      case effective_radius > 301:
        return 14;
      case effective_radius >= 300:
        return 8;
      case effective_radius >= 250:
        return 7;
      case effective_radius >= 200:
        return 5.5;
      case effective_radius >= 150:
        return 4.5;
      case effective_radius >= 125:
        return 4;
      case effective_radius >= 100:
        return 3;
      case effective_radius >= 50:
        return 1.25;
      case effective_radius > 25:
        return 0.8;
      default:
        return 0.5;
    }
  };

  const delta = getDelta();
  const bounds = coordsToBounds({
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    latDelta: delta,
    lonDelta: delta,
  });
  dispatch({ type: UPDATE_BOUNDS, bounds, triggerUpdateBounds: true });
};
