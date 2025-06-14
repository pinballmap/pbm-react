import Geocode from "react-geocode";
import {
  CLEAR_FILTERS,
  CLEAR_SEARCH_BAR_TEXT,
  SET_SEARCH_BAR_TEXT,
  SET_SELECTED_ACTIVITY_FILTER,
  CLEAR_ACTIVITY_FILTER,
  SET_MACHINE_FILTER,
  SET_NUM_MACHINES_FILTER,
  SET_VIEW_FAVORITE_LOCATIONS_FILTER,
  SET_LOCATION_TYPE_FILTER,
  SET_OPERATOR_FILTER,
  SET_MACHINE_VERSION_FILTER,
} from "./types";
import { updateFilterLocations } from "./locations_actions";
Geocode.setApiKey(process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY);

export const clearFilters = (updateLocations) => (dispatch) => {
  dispatch({ type: CLEAR_FILTERS });
  updateLocations && dispatch(updateFilterLocations());
};
export const setMachineFilter = (machine) => (dispatch) => {
  dispatch({ type: SET_MACHINE_FILTER, machine });
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
export const selectedOperatorFilter = (selectedOperator) => (dispatch) => {
  dispatch({ type: SET_OPERATOR_FILTER, selectedOperator });
};

export const setSelectedActivitiesFilter = (selectedActivities) => ({
  type: SET_SELECTED_ACTIVITY_FILTER,
  selectedActivities,
});

export const clearActivityFilter = () => ({ type: CLEAR_ACTIVITY_FILTER });

export const clearSearchBarText = () => ({ type: CLEAR_SEARCH_BAR_TEXT });
export const setSearchBarText = (searchBarText) => ({
  type: SET_SEARCH_BAR_TEXT,
  searchBarText,
});
