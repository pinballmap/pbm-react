import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UPDATE_BOUNDS,
  CLEAR_FILTERS,
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
  SET_MACHINE_TYPE_FILTER,
  SET_MACHINE_YEAR_FILTER,
  CLEAR_SEARCH_BAR_TEXT,
  SET_SEARCH_BAR_TEXT,
  TRIGGER_UPDATE_BOUNDS,
} from "../actions/types";
import { boundsToCoords } from "../utils/utilityFunctions";

export const initialState = {
  locationName: "",
  swLat: null,
  swLon: null,
  neLat: null,
  neLon: null,
  machineId: "",
  machineIds: [],
  machines: [],
  locationType: "",
  locationTypeIds: [],
  numMachines: 0,
  selectedOperator: "",
  selectedActivities: [],
  selectedLocationActivities: [],
  machine: {},
  viewByFavoriteLocations: false,
  machineGroupId: undefined,
  icFilter: false,
  manufacturerFilter: [],
  machineTypeFilter: "",
  machineYearGte: null,
  machineYearLte: null,
  searchBarText: "",
  triggerUpdateBounds: false,
  forceTriggerUpdateBounds: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_BOUNDS: {
      const { swLat, swLon, neLat, neLon } = action.bounds;
      const coords = boundsToCoords(action.bounds);
      const { triggerUpdateBounds = false, forceTriggerUpdateBounds = false } =
        action;

      AsyncStorage.setItem("lastCoords", JSON.stringify(coords));
      return {
        ...state,
        swLat,
        swLon,
        neLat,
        neLon,
        triggerUpdateBounds,
        forceTriggerUpdateBounds,
      };
    }
    case TRIGGER_UPDATE_BOUNDS: {
      return {
        ...state,
        forceTriggerUpdateBounds: true,
      };
    }
    case SET_MACHINE_FILTER: {
      if (action.machines) {
        const machines = action.machines;
        return {
          ...state,
          machines,
          machineIds: machines.map((m) => m.id),
          machineGroupId: undefined,
          icFilter: false,
          machineId: "",
          machine: {},
        };
      } else if (!action.machine) {
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
          machineGroupId: action.machine.machine_group_id,
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
    case SET_LOCATION_TYPE_FILTER: {
      if (action.locationTypeIds) {
        const ids = action.locationTypeIds;
        return {
          ...state,
          locationTypeIds: ids,
          locationType: ids.length === 1 ? ids[0] : "",
        };
      }
      return {
        ...state,
        locationType: action.locationType > -1 ? action.locationType : "",
        locationTypeIds: action.locationType > -1 ? [action.locationType] : [],
      };
    }
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
        machineIds: [],
        machines: [],
        locationType: "",
        locationTypeIds: [],
        numMachines: 0,
        selectedOperator: "",
        machine: {},
        viewByFavoriteLocations: false,
        machineGroupId: undefined,
        icFilter: false,
        manufacturerFilter: [],
        machineTypeFilter: "",
        machineYearGte: null,
        machineYearLte: null,
      };
    case SET_IC_FILTER:
      return {
        ...state,
        icFilter: action.icFilter,
      };
    case SET_MANUFACTURER_FILTER: {
      const manufacturers = action.manufacturers;
      if (manufacturers.length === 0) {
        return { ...state, manufacturerFilter: [] };
      }
      const filteredMachines = state.machines.filter((m) =>
        manufacturers.includes(m.manufacturer),
      );
      const machinesChanged = filteredMachines.length !== state.machines.length;
      return {
        ...state,
        manufacturerFilter: manufacturers,
        machines: filteredMachines,
        machineIds: filteredMachines.map((m) => m.id),
        machineGroupId: machinesChanged ? undefined : state.machineGroupId,
        icFilter: filteredMachines.length === 0 ? false : state.icFilter,
      };
    }
    case SET_SELECTED_ACTIVITY_FILTER: {
      AsyncStorage.setItem(
        "selectedActivities",
        JSON.stringify(action.selectedActivities),
      );
      return {
        ...state,
        selectedActivities: action.selectedActivities,
      };
    }
    case CLEAR_ACTIVITY_FILTER: {
      AsyncStorage.setItem("selectedActivities", JSON.stringify([]));

      return {
        ...state,
        selectedActivities: [],
      };
    }
    case SET_SELECTED_LOCATION_ACTIVITY_FILTER: {
      AsyncStorage.setItem(
        "selectedLocationActivities",
        JSON.stringify(action.selectedLocationActivities),
      );
      return {
        ...state,
        selectedLocationActivities: action.selectedLocationActivities,
      };
    }
    case CLEAR_LOCATION_ACTIVITY_FILTER: {
      AsyncStorage.setItem("selectedLocationActivities", JSON.stringify([]));

      return {
        ...state,
        selectedLocationActivities: [],
      };
    }
    case SET_MACHINE_VERSION_FILTER:
      return {
        ...state,
        machineGroupId: action.machineGroupId,
      };
    case SET_MACHINE_TYPE_FILTER:
      return {
        ...state,
        machineTypeFilter: action.machineType,
      };
    case SET_MACHINE_YEAR_FILTER:
      return {
        ...state,
        machineYearGte: action.gte,
        machineYearLte: action.lte,
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
