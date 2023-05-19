import {
  UPDATE_BOUNDS,
  CLEAR_FILTERS,
  SET_SELECTED_ACTIVITY_FILTER,
  CLEAR_ACTIVITY_FILTER,
  SET_MACHINE_FILTER,
  SET_NUM_MACHINES_FILTER,
  SET_VIEW_FAVORITE_LOCATIONS_FILTER,
  SET_LOCATION_TYPE_FILTER,
  SET_OPERATOR_FILTER,
  SET_MAX_ZOOM,
  SET_MACHINE_VERSION_FILTER,
  CLEAR_SEARCH_BAR_TEXT,
  SET_SEARCH_BAR_TEXT,
  UPDATE_IGNORE_MAX_ZOOM,
} from "../actions/types";

export const initialState = {
  locationName: "",
  swLat: 45.61322,
  swLon: -122.7587,
  neLat: 45.41322,
  neLon: -122.5587,
  machineId: "",
  locationType: "",
  numMachines: 0,
  selectedOperator: "",
  selectedActivity: "",
  machine: {},
  maxZoom: false,
  viewByFavoriteLocations: false,
  filterByMachineVersion: false,
  searchBarText: "",
  triggerUpdateBounds: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BOUNDS: {
      const { swLat, swLon, neLat, neLon } = action.bounds;
      const { triggerUpdateBounds = false } = action;
      return {
        ...state,
        swLat,
        swLon,
        neLat,
        neLon,
        triggerUpdateBounds,
      };
    }
    case UPDATE_IGNORE_MAX_ZOOM: {
      return {
        ...state,
        ignoreZoom: action.ignoreZoom,
      };
    }
    case SET_MACHINE_FILTER: {
      if (!action.machine) {
        return {
          ...state,
          machineId: "",
          machine: {},
        };
      } else {
        return {
          ...state,
          machineId: action.machine.id,
          machine: action.machine,
        };
      }
    }
    case SET_NUM_MACHINES_FILTER:
      return {
        ...state,
        numMachines: action.numMachines,
      };
    case SET_VIEW_FAVORITE_LOCATIONS_FILTER:
      return {
        ...state,
        viewByFavoriteLocations: action.viewByFavoriteLocations,
      };
    case SET_LOCATION_TYPE_FILTER:
      return {
        ...state,
        locationType: action.locationType > -1 ? action.locationType : "",
      };
    case SET_OPERATOR_FILTER:
      return {
        ...state,
        selectedOperator:
          action.selectedOperator > -1 ? action.selectedOperator : "",
      };
    case CLEAR_FILTERS:
      return {
        ...state,
        machineId: "",
        locationType: "",
        numMachines: 0,
        selectedOperator: "",
        machine: {},
        viewByFavoriteLocations: false,
      };
    case SET_SELECTED_ACTIVITY_FILTER:
      return {
        ...state,
        selectedActivity: action.selectedActivity,
      };
    case CLEAR_ACTIVITY_FILTER:
      return {
        ...state,
        selectedActivity: "",
      };
    case SET_MAX_ZOOM:
      return {
        ...state,
        maxZoom: action.maxZoom || false,
      };
    case SET_MACHINE_VERSION_FILTER:
      return {
        ...state,
        filterByMachineVersion: action.filterByMachineVersion,
      };
    case SET_SEARCH_BAR_TEXT:
      return {
        ...state,
        searchBarText: action.searchBarText,
      };
    case CLEAR_SEARCH_BAR_TEXT:
      return {
        ...state,
        searchBarText: "",
      };
    default:
      return state;
  }
};
