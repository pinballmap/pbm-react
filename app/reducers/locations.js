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
  LOCATION_MACHINE_REMOVED,
  MACHINE_ADDED_TO_LOCATION,
  SET_SELECTED_MAP_LOCATION,
} from "../actions/types";

export const initialState = {
  isFetchingLocationTypes: false,
  locationTypes: [],
  isFetchingMarkers: false,
  mapMarkers: [],
  isFetchingList: false,
  listLocations: [],
  listPagy: null,
  selectedLocationListFilter: 0,
  selectedMapLocation: null,
  selectedMapLocationDetails: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_LOCATION_TYPES:
      return {
        ...state,
        isFetchingLocationTypes: true,
      };
    case FETCHING_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        isFetchingLocationTypes: false,
        locationTypes: action.locationTypes,
      };
    case FETCHING_LOCATION_TYPES_FAILURE:
      return {
        ...state,
        isFetchingLocationTypes: false,
        locationTypes: [],
      };
    case FETCHING_MAP_MARKERS:
      return {
        ...state,
        isFetchingMarkers: true,
      };
    case FETCHING_MAP_MARKERS_SUCCESS:
      return {
        ...state,
        isFetchingMarkers: false,
        mapMarkers: action.features,
      };
    case FETCHING_MAP_MARKERS_FAILURE:
      return {
        ...state,
        isFetchingMarkers: false,
        mapMarkers: [],
      };
    case FETCHING_LIST_LOCATIONS:
      return {
        ...state,
        isFetchingList: true,
      };
    case FETCHING_LIST_LOCATIONS_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        listLocations: action.locations,
        listPagy: action.pagy,
      };
    case FETCHING_LIST_LOCATIONS_FAILURE:
      return {
        ...state,
        isFetchingList: false,
        listLocations: [],
        listPagy: null,
      };
    case FETCHING_SELECTED_LOCATION_DETAILS_SUCCESS:
      return {
        ...state,
        selectedMapLocationDetails: action.location,
      };
    case SELECT_LOCATION_LIST_FILTER_BY:
      return {
        ...state,
        selectedLocationListFilter: action.idx,
      };
    case LOCATION_MACHINE_REMOVED: {
      const { location_id } = action;
      const mapMarkers = state.mapMarkers.map((feature) => {
        if (feature.id === location_id) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              machine_count: feature.properties.machine_count - 1,
            },
          };
        }
        return feature;
      });
      return { ...state, mapMarkers };
    }
    case MACHINE_ADDED_TO_LOCATION: {
      const { location_id } = action;
      const mapMarkers = state.mapMarkers.map((feature) => {
        if (feature.id === location_id) {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              machine_count: feature.properties.machine_count + 1,
            },
          };
        }
        return feature;
      });
      return { ...state, mapMarkers };
    }
    case SET_SELECTED_MAP_LOCATION: {
      return {
        ...state,
        selectedMapLocation: action.id,
        selectedMapLocationDetails: action.id
          ? state.selectedMapLocationDetails
          : null,
      };
    }
    default:
      return state;
  }
};
