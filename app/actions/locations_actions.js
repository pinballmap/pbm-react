import {
  FETCHING_LOCATION_TYPES,
  FETCHING_LOCATION_TYPES_SUCCESS,
  FETCHING_LOCATION_TYPES_FAILURE,
  FETCHING_MAP_MARKERS,
  FETCHING_MAP_MARKERS_SUCCESS,
  FETCHING_MAP_MARKERS_FAILURE,
  FETCHING_LIST_LOCATIONS,
  FETCHING_LIST_LOCATIONS_SUCCESS,
  FETCHING_LIST_LOCATIONS_FAILURE,
  FETCHING_SELECTED_LOCATION_DETAILS_SUCCESS,
  SELECT_LOCATION_LIST_FILTER_BY,
  UPDATE_BOUNDS,
  SET_SELECTED_MAP_LOCATION,
  FETCHING_MAP_AREA_MACHINE_IDS_SUCCESS,
} from "./types";
import { getData } from "../config/request";
import { atLeastMinZoom, coordsToBounds } from "../utils/utilityFunctions";

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

const buildFilterQueryString = (query, userId) => {
  const {
    machineId,
    machineIds = [],
    machineGroupId,
    icFilter,
    locationType,
    locationTypeIds = [],
    numMachines,
    selectedOperator,
    viewByFavoriteLocations,
  } = query;
  const machineQueryString =
    machineIds.length > 1
      ? machineIds.map((id) => `by_machine_id[]=${id}`).join("&") + "&"
      : machineGroupId
        ? `by_machine_group_id=${machineGroupId}&`
        : machineIds.length === 1
          ? `by_machine_single_id=${machineIds[0]}&`
          : machineId
            ? `by_machine_single_id=${machineId}&`
            : "";
  const locationTypeQueryString =
    locationTypeIds.length > 1
      ? locationTypeIds.map((id) => `by_type_id[]=${id}`).join("&") + "&"
      : locationTypeIds.length === 1
        ? `by_type_id=${locationTypeIds[0]}&`
        : locationType
          ? `by_type_id=${locationType}&`
          : "";
  const icQueryString =
    icFilter && machineIds.length === 1
      ? machineGroupId
        ? `by_machine_id_ic=${machineIds[0]}&`
        : `by_machine_single_id_ic=${machineIds[0]}&`
      : "";
  const numMachinesQueryString = numMachines
    ? `by_at_least_n_machines_type=${numMachines}&`
    : "";
  const byOperator = selectedOperator
    ? `by_operator_id=${selectedOperator}&`
    : "";
  const byUserFaved =
    viewByFavoriteLocations && userId ? `user_faved=${userId}&` : "";
  return `${machineQueryString}${icQueryString}${locationTypeQueryString}${numMachinesQueryString}${byOperator}${byUserFaved}`;
};

export const getMapMarkers =
  ({ swLat, swLon, neLat, neLon }) =>
  (dispatch, getState) => {
    const { query, user } = getState();
    const filterParams = buildFilterQueryString(query, user.id);
    const url = `/locations/within_bounding_box.geojson?swlat=${swLat}&swlon=${swLon}&nelat=${neLat}&nelon=${neLon}&${filterParams}no_details=2`;
    dispatch({ type: FETCHING_MAP_MARKERS });
    return getData(url)
      .then((data) =>
        dispatch({
          type: FETCHING_MAP_MARKERS_SUCCESS,
          features: data.features ?? [],
        }),
      )
      .catch(() => dispatch({ type: FETCHING_MAP_MARKERS_FAILURE }));
  };

// Sort order for list requests. Index matches the ButtonGroup in LocationList:
// 0=Near, 1=A-Z, 2=# Pins, 3=Date
const ORDER_BY_MAP = ["distance", "name", "machine_count", "updated_at"];
const DEFAULT_LIST_LIMIT = 50;

export const getListLocations =
  ({ swLat, swLon, neLat, neLon }, page = 1, filterIdx = 0) =>
  (dispatch, getState) => {
    const { query, user } = getState();
    const filterParams = buildFilterQueryString(query, user.id);
    const isNear = filterIdx === 0;
    const orderBy = ORDER_BY_MAP[filterIdx] ?? "name";
    const nearParams =
      isNear && user.lat && user.lon
        ? `&user_lat=${user.lat}&user_lon=${user.lon}`
        : "";
    const url = `/locations/within_bounding_box.json?swlat=${swLat}&swlon=${swLon}&nelat=${neLat}&nelon=${neLon}&${filterParams}no_details=1&limit=${DEFAULT_LIST_LIMIT}&page=${page}&order_by=${orderBy}${nearParams}`;
    dispatch({ type: FETCHING_LIST_LOCATIONS });
    return getData(url)
      .then((data) =>
        dispatch({
          type: FETCHING_LIST_LOCATIONS_SUCCESS,
          locations: data.locations ?? [],
          pagy: data.pagy ?? null,
        }),
      )
      .catch(() => dispatch({ type: FETCHING_LIST_LOCATIONS_FAILURE }));
  };

export const fetchSelectedLocationDetails = (id) => (dispatch) => {
  return getData(`/locations/${id}.json?no_details=2`)
    .then((data) =>
      dispatch({
        type: FETCHING_SELECTED_LOCATION_DETAILS_SUCCESS,
        location: data,
      }),
    )
    .catch((err) => console.log(err));
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

export const selectLocationListFilterBy = (idx) => {
  return {
    type: SELECT_LOCATION_LIST_FILTER_BY,
    idx,
  };
};

export const getLocationsByRegion = (region) => (dispatch) => {
  const { lat, lon, effective_radius } = region;

  const getDelta = () => {
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

export const getMapAreaMachineIds = () => (dispatch, getState) => {
  const { query, user } = getState();
  const { swLat, swLon, neLat, neLon } = query;
  const filterParams = buildFilterQueryString(query, user.id);
  const url = `/locations/within_bounding_box.json?swlat=${swLat}&swlon=${swLon}&nelat=${neLat}&nelon=${neLon}&${filterParams}machines_only=1`;
  return getData(url)
    .then((data) =>
      dispatch({
        type: FETCHING_MAP_AREA_MACHINE_IDS_SUCCESS,
        machineIds: data.machine_ids ?? [],
      }),
    )
    .catch(() => {});
};

// Convenience: re-fetch markers using the currently stored bounds + filters.
// Use this after filter changes instead of the old updateFilterLocations.
export const reloadMapMarkers = () => (dispatch, getState) => {
  const { swLat, swLon, neLat, neLon } = getState().query;
  dispatch(getMapMarkers({ swLat, swLon, neLat, neLon }));
};

export const setSelectedMapLocation = (id) => (dispatch) => {
  dispatch({ type: SET_SELECTED_MAP_LOCATION, id });
  if (id) {
    dispatch(fetchSelectedLocationDetails(id));
  }
};
