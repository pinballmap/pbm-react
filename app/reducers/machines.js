import {
  FETCHING_MACHINES,
  FETCHING_MACHINES_SUCCESS,
  FETCHING_MACHINES_FAILURE,
  FETCHING_MAP_AREA_MACHINE_IDS_SUCCESS,
} from "../actions/types";

export const initialState = {
  isFetchingMachines: false,
  machines: [],
  mapAreaMachineIds: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_MACHINES:
      return {
        ...state,
        isFetchingMachines: true,
      };
    case FETCHING_MACHINES_SUCCESS: {
      const machines = action.machines.map((machine) => {
        return {
          ...machine,
          nameManYear: `${machine.name} (${machine.manufacturer}, ${machine.year})`,
        };
      });
      return {
        ...state,
        isFetchingMachines: false,
        machines,
      };
    }
    case FETCHING_MACHINES_FAILURE:
      return {
        ...state,
        isFetchingMachines: false,
        machines: [],
      };
    case FETCHING_MAP_AREA_MACHINE_IDS_SUCCESS:
      return {
        ...state,
        mapAreaMachineIds: action.machineIds,
      };
    default:
      return state;
  }
};
