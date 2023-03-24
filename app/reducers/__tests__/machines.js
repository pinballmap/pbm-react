import * as types from "../../actions/types";
import machinesReducer, { initialState } from "../machines.js";

const getInitialState = () => {
  return {
    isFetchingMachines: false,
    machines: [],
  };
};

describe("machines reducer", () => {
  it("should return correct default state", () => {
    expect(machinesReducer(undefined, {})).toEqual(initialState);
  });

  it("should return current state when action is not recognized", () => {
    const state = getInitialState();
    const action = {
      type: "NOBODY_KNOWS_WHAT_THIS_ACTION_DOES",
    };

    const result = machinesReducer(state, action);
    expect(result).toEqual(state);
  });

  it("should properly update state when requesting machines", () => {
    let state = getInitialState();
    const action = {
      type: types.FETCHING_MACHINES,
    };

    const result = machinesReducer(state, action);
    expect(result.isFetchingMachines).toBeTruthy();
  });

  it("should properly update state when successfully receivng machines", () => {
    let state = getInitialState();

    state.isFetchingMachines = true;

    const machines = [
      {
        id: 676,
        name: "Pirates of the Caribbean",
      },
      {
        id: 678,
        name: "Revenge From Mars",
      },
    ];

    const action = {
      type: types.FETCHING_MACHINES_SUCCESS,
      machines,
    };

    const result = machinesReducer(state, action);
    expect(result.isFetchingMachines).toBeFalsy();
    expect(result.machines).toEqual(machines);
  });

  it("should properly update state when failing to receive machines", () => {
    let state = getInitialState();

    state.isFetchingMachines = true;

    const machines = [];

    const action = {
      type: types.FETCHING_MACHINES_FAILURE,
    };

    const result = machinesReducer(state, action);
    expect(result.isFetchingMachines).toBeFalsy();
    expect(result.machines).toEqual(machines);
  });
});
