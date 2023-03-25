import {
  FETCHING_REGIONS,
  FETCHING_REGIONS_SUCCESS,
  FETCHING_REGIONS_FAILURE,
  FETCHING_LOCATION_AND_MACHINE_COUNTS_SUCCESS,
} from "../actions/types";

export const initialState = {
  isFetchingRegions: false,
  regions: [],
  allMachinesCount: null,
  allLocationsCount: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_REGIONS:
      return {
        ...state,
        isFetchingRegions: true,
      };
    case FETCHING_REGIONS_SUCCESS:
      return {
        ...state,
        isFetchingRegions: false,
        regions: action.regions,
      };
    case FETCHING_REGIONS_FAILURE:
      return {
        ...state,
        isFetchingRegions: false,
        regions: [],
      };
    case FETCHING_LOCATION_AND_MACHINE_COUNTS_SUCCESS:
      return {
        ...state,
        allMachinesCount: action.allMachinesCount,
        allLocationsCount: action.allLocationsCount,
      };
    default:
      return state;
  }
};
