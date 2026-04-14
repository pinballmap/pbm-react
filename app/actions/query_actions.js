import {
  CLEAR_FILTERS,
  CLEAR_SEARCH_BAR_TEXT,
  SET_SEARCH_BAR_TEXT,
  SET_SELECTED_ACTIVITY_FILTER,
  SET_SELECTED_LOCATION_ACTIVITY_FILTER,
  CLEAR_ACTIVITY_FILTER,
  CLEAR_LOCATION_ACTIVITY_FILTER,
  SET_MACHINE_FILTER,
  SET_NUM_MACHINES_FILTER,
  SET_VIEW_FAVORITE_LOCATIONS_FILTER,
  SET_LOCATION_TYPE_FILTER,
  SET_OPERATOR_FILTER,
  SET_MACHINE_VERSION_FILTER,
  SET_IC_FILTER,
  SET_MANUFACTURER_FILTER,
} from "./types";
import { reloadMapMarkers } from "./locations_actions";

export const clearFilters = (updateLocations) => (dispatch) => {
  dispatch({ type: CLEAR_FILTERS });
  updateLocations && dispatch(reloadMapMarkers());
};
export const setMachineFilter = (machine) => (dispatch) => {
  dispatch({ type: SET_MACHINE_FILTER, machine });
};
export const setMachineFilterMulti = (machines) => (dispatch) => {
  dispatch({ type: SET_MACHINE_FILTER, machines });
};
export const selectedManufacturerFilter = (manufacturers) => (dispatch) => {
  dispatch({ type: SET_MANUFACTURER_FILTER, manufacturers });
};
export const setIcFilter = (value) => (dispatch) => {
  dispatch({ type: SET_IC_FILTER, icFilter: value });
};
export const setMachineVersionFilter = (machine_group_id) => (dispatch) => {
  dispatch({
    type: SET_MACHINE_VERSION_FILTER,
    machineGroupId: machine_group_id,
  });
};
export const updateNumMachinesSelected = (numMachines) => (dispatch) => {
  dispatch({ type: SET_NUM_MACHINES_FILTER, numMachines });
};
export const updateViewFavoriteLocations = (idx) => (dispatch) => {
  dispatch({
    type: SET_VIEW_FAVORITE_LOCATIONS_FILTER,
    viewByFavoriteLocations: Boolean(idx),
  });
};
export const selectedLocationTypeFilter = (locationType) => (dispatch) => {
  dispatch({ type: SET_LOCATION_TYPE_FILTER, locationType });
};
export const selectedLocationTypeFilterMulti =
  (locationTypeIds) => (dispatch) => {
    dispatch({ type: SET_LOCATION_TYPE_FILTER, locationTypeIds });
  };
export const selectedOperatorFilter = (selectedOperator) => (dispatch) => {
  dispatch({ type: SET_OPERATOR_FILTER, selectedOperator });
};

export const setSelectedActivitiesFilter = (selectedActivities) => ({
  type: SET_SELECTED_ACTIVITY_FILTER,
  selectedActivities,
});

export const clearActivityFilter = () => ({ type: CLEAR_ACTIVITY_FILTER });

export const setSelectedLocationActivitiesFilter = (
  selectedLocationActivities,
) => ({
  type: SET_SELECTED_LOCATION_ACTIVITY_FILTER,
  selectedLocationActivities,
});

export const clearLocationActivityFilter = () => ({
  type: CLEAR_LOCATION_ACTIVITY_FILTER,
});

export const clearSearchBarText = () => ({ type: CLEAR_SEARCH_BAR_TEXT });
export const setSearchBarText = (searchBarText) => ({
  type: SET_SEARCH_BAR_TEXT,
  searchBarText,
});
