import {
  FETCHING_LOCATION,
  FETCHING_LOCATION_SUCCESS,
  FETCHING_LOCATION_FAILURE,
  LOCATION_METADATA_SUCCESS,
  FETCHING_LMX_SUCCESS,
  LMX_MUTATED,
  LOCATION_DETAILS_CONFIRMED,
  SET_SELECTED_LMX,
  LOCATION_MACHINE_REMOVED,
  ADDING_MACHINE_TO_LOCATION,
  MACHINE_ADDED_TO_LOCATION,
  MACHINE_ADDED_TO_LOCATION_FAILURE,
  UPDATING_LOCATION_DETAILS,
  LOCATION_DETAILS_UPDATED,
  ADD_MACHINE_TO_LIST,
  REMOVE_MACHINE_FROM_LIST,
  CLEAR_SELECTED_STATE,
  SUGGESTING_LOCATION,
  LOCATION_SUGGESTED,
  RESET_SUGGEST_LOCATION,
  SET_SELECTED_OPERATOR,
  SET_SELECTED_LOCATION_TYPE,
  IC_ENABLED_UPDATED,
} from "../actions/types";

const moment = require("moment");

export const initialState = {
  isFetchingLocation: false,
  isFetchingLmx: false,
  lmxMutated: false,
  location: {},
  confirmationMessage: "",
  curLmx: null,
  addingMachineToLocation: false,
  updatingLocationDetails: false,
  machineList: [],
  operator: null,
  locationType: null,
  isSuggestingLocation: false,
  locationSuggested: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_LOCATION:
      return {
        ...state,
        isFetchingLocation: true,
      };
    case FETCHING_LOCATION_SUCCESS:
      return {
        ...state,
        isFetchingLocation: false,
        lmxMutated: false,
        location: action.location,
      };
    case LOCATION_METADATA_SUCCESS:
      return {
        ...state,
        lmxMutated: false,
        location: {
          ...state.location,
          ...action.location,
          location_machine_xrefs: state.location.location_machine_xrefs,
        },
      };
    case FETCHING_LOCATION_FAILURE:
      return {
        ...state,
        isFetchingLocations: false,
        location: {},
      };
    case LOCATION_DETAILS_CONFIRMED:
      return {
        ...state,
        location: {
          ...state.location,
          last_updated_by_username: action.username,
          date_last_updated: moment().format("YYYY-MM-DD"),
        },
      };
    case SET_SELECTED_LMX:
      return {
        ...state,
        isFetchingLmx: true,
        curLmx: action.lmx,
      };
    case LMX_MUTATED:
      return {
        ...state,
        lmxMutated: true,
      };
    case FETCHING_LMX_SUCCESS: {
      const location_machine_xrefs = state.location.location_machine_xrefs?.map(
        (m) =>
          m.id === action.lmx.id
            ? { ...m, updated_at: action.lmx.updated_at }
            : m,
      );
      return {
        ...state,
        isFetchingLmx: false,
        curLmx: action.lmx,
        location: {
          ...state.location,
          location_machine_xrefs,
        },
      };
    }
    case LOCATION_MACHINE_REMOVED: {
      const location_machine_xrefs =
        state.location.location_machine_xrefs.filter(
          (m) => m.id !== action.lmx,
        );

      return {
        ...state,
        curLmx: null,
        location: {
          ...state.location,
          last_updated_by_username: action.username,
          date_last_updated: moment().format("YYYY-MM-DD"),
          location_machine_xrefs,
        },
      };
    }
    case IC_ENABLED_UPDATED: {
      const location_machine_xrefs = state.location.location_machine_xrefs.map(
        (m) => {
          if (m.id === action.machine.id) {
            return { ...m, ic_enabled: action.machine.ic_enabled };
          }
          return m;
        },
      );

      return {
        ...state,
        location: {
          ...state.location,
          location_machine_xrefs,
        },
      };
    }
    case ADDING_MACHINE_TO_LOCATION:
      return {
        ...state,
        addingMachineToLocation: true,
      };
    case MACHINE_ADDED_TO_LOCATION:
      return {
        ...state,
        addingMachineToLocation: false,
      };
    case MACHINE_ADDED_TO_LOCATION_FAILURE:
      return {
        ...state,
        addingMachineToLocation: false,
      };
    case UPDATING_LOCATION_DETAILS:
      return {
        ...state,
        updatingLocationDetails: true,
      };
    case LOCATION_DETAILS_UPDATED: {
      const { phone, website, description, operator_id, location_type_id } =
        action.data.location;
      return {
        ...state,
        updatingLocationDetails: false,
        location: {
          ...state.location,
          last_updated_by_username: action.username,
          date_last_updated: moment().format("YYYY-MM-DD"),
          phone,
          website,
          description,
          operator_id,
          location_type_id,
        },
      };
    }
    case ADD_MACHINE_TO_LIST:
      return {
        ...state,
        machineList: state.machineList.concat([action.machine]),
      };

    case REMOVE_MACHINE_FROM_LIST: {
      const { id } = action.machine;
      const machineList = state.machineList.filter((m) => m.id !== id);
      return {
        ...state,
        machineList,
      };
    }
    case CLEAR_SELECTED_STATE:
      return {
        ...state,
        machineList: [],
        operator: null,
        locationType: null,
      };
    case SUGGESTING_LOCATION:
      return {
        ...state,
        isSuggestingLocation: true,
        locationSuggested: false,
      };
    case LOCATION_SUGGESTED:
      return {
        ...state,
        isSuggestingLocation: false,
        locationSuggested: true,
      };
    case RESET_SUGGEST_LOCATION:
      return {
        ...state,
        isSuggestingLocation: false,
        locationSuggested: false,
      };
    case SET_SELECTED_OPERATOR:
      return {
        ...state,
        operator: action.id,
      };
    case SET_SELECTED_LOCATION_TYPE:
      return {
        ...state,
        locationType: action.id,
      };
    default:
      return state;
  }
};
