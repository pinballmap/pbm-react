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
  UPDATE_BOUNDS,
  UPDATE_IGNORE_MAX_ZOOM,
  SET_SELECTED_MAP_LOCATION,
} from "./types";
import { getData } from "../config/request";
import { atLeastMinZoom, coordsToBounds } from "../utils/utilityFunctions";

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
    machineGroupId,
    locationType,
    numMachines,
    selectedOperator,
    viewByFavoriteLocations,
    ignoreZoom,
  } = filterState;
  const noFilterNeeded = !!selectedOperator || !!viewByFavoriteLocations;
  const filteringMachineOrType = !!machineId || !!locationType;
  const multipleFilters =
    (!!machineId && !!locationType) ||
    (filteringMachineOrType && numMachines > 1);
  const filteringByTwoMachines = numMachines === "2";
  const filteringByMoreMachines = numMachines > 2;
  const maxDelta = noFilterNeeded
    ? 100 // A large number so that all locations are included for Operator and Fave Locations
    : multipleFilters
      ? 80 // A pretty large delta when multiple filters are applied
      : filteringByTwoMachines
        ? 12
        : filteringByMoreMachines
          ? numMachines * 4
          : !!machineGroupId
            ? 20
            : filteringMachineOrType
              ? 40
              : 6;
  return {
    maxDelta,
    ignoreZoom,
  };
};

export const getLocationsByBounds =
  ({ swLat, swLon, neLat, neLon }) =>
  (dispatch, getState) => {
    const {
      machineId,
      locationType,
      numMachines,
      selectedOperator,
      machineGroupId,
      viewByFavoriteLocations,
    } = getState().query;
    const { id: userId } = getState().user;
    const machineQueryString = machineGroupId
      ? `by_machine_group_id=${machineGroupId}&`
      : machineId
        ? `by_machine_single_id=${machineId}&`
        : "";
    const locationTypeQueryString = locationType
      ? `by_type_id=${locationType}&`
      : "";
    const numMachinesQueryString = numMachines
      ? `by_at_least_n_machines_type=${numMachines}&`
      : "";
    const byOperator = selectedOperator
      ? `by_operator_id=${selectedOperator}&`
      : "";
    const byUserFaved =
      viewByFavoriteLocations && userId ? `user_faved=${userId}&` : "";
    const url = `/locations/within_bounding_box.json?swlat=${swLat}&swlon=${swLon}&nelat=${neLat}&nelon=${neLon}&${machineQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}${byUserFaved}no_details=1`;
    dispatch({ type: FETCHING_LOCATIONS });
    return getData(url)
      .then((data) => {
        dispatch(getLocationsSuccess(data));
      })
      .catch((err) => dispatch(getLocationsFailure(err)));
  };

export const getLocationsConsideringZoom = (bounds) => (dispatch, getState) => {
  const { neLat, neLon, swLat, swLon } = bounds;
  const { maxDelta, ignoreZoom } = getFilterState(getState().query);
  const latDelta = Math.abs(neLat - swLat);
  const lonDelta = Math.abs(neLon - swLon);
  const maxZoom = latDelta > maxDelta || lonDelta > maxDelta;

  dispatch({ type: SET_MAX_ZOOM, maxZoom });
  if (ignoreZoom || !maxZoom) {
    ignoreZoom && dispatch({ type: UPDATE_IGNORE_MAX_ZOOM, ignoreZoom: false });
    dispatch(getLocationsByBounds(bounds));
  }
};

export const updateFilterLocations = () => (dispatch, getState) => {
  const { swLat, swLon, neLat, neLon } = getState().query;
  const { maxDelta } = getFilterState(getState().query);
  const latDelta = Math.abs(neLat - swLat);
  const lonDelta = Math.abs(neLon - swLon);
  const maxZoom = latDelta > maxDelta || lonDelta > maxDelta;

  dispatch({ type: SET_MAX_ZOOM, maxZoom });
  if (!maxZoom) {
    dispatch(getLocationsByBounds({ neLat, neLon, swLat, swLon }));
  }
};

export const updateBounds = (bounds) => (dispatch) => {
  dispatch({ type: UPDATE_BOUNDS, bounds });
};

export const triggerUpdateBounds = (bounds) => (dispatch) => {
  dispatch({
    type: UPDATE_BOUNDS,
    bounds: atLeastMinZoom(bounds),
    triggerUpdateBounds: true,
  });
};

export const getLocationsSuccess = (data) => {
  return {
    type: FETCHING_LOCATIONS_SUCCESS,
    locations: data.locations ?? [],
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
  dispatch({ type: UPDATE_IGNORE_MAX_ZOOM, ignoreZoom: true });
};

export const setSelectedMapLocation = (id) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_MAP_LOCATION,
    id,
  });
};
