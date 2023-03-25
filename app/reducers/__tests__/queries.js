import * as types from "../../actions/types";
import queryReducer, { initialState } from "../queries.js";

const getInitialState = () => {
  return {
    currQueryString: "",
    locationId: "",
    locationName: "",
    curLat: null,
    curLon: null,
    latDelta: null,
    lonDelta: null,
  };
};

describe("queries reducer", () => {
  it("should return correct default state", () => {
    expect(queryReducer(undefined, {})).toEqual(initialState);
  });

  it("should return current state when action is not recognized", () => {
    const state = getInitialState();
    const action = {
      type: "NOBODY_KNOWS_WHAT_THIS_ACTION_DOES",
    };

    const result = queryReducer(state, action);
    expect(result).toEqual(state);
  });

  it("should properly update state when the query changes", () => {
    let state = getInitialState();
    const action = {
      type: types.UPDATE_QUERY,
      payload: "New query!",
    };

    const result = queryReducer(state, action);
    expect(result.currQueryString).toEqual(action.payload);
  });

  it("should properly update state when the location id changes", () => {
    let state = getInitialState();
    const action = {
      type: types.SET_LOCATION_ID,
      id: 31,
      name: "Cool place to play",
    };

    const result = queryReducer(state, action);
    expect(result.currQueryString).toBeFalsy();
    expect(result.locationId).toEqual(action.id);
    expect(result.locationName).toEqual(action.name);
  });

  it("should properly update state when the coordinates change", () => {
    let state = getInitialState();
    const action = {
      type: types.UPDATE_COORDINATES,
      lat: 123,
      lon: 456,
      latDelta: 0.1,
      lonDelta: 0.22,
    };

    const result = queryReducer(state, action);
    expect(result.curLat).toEqual(action.lat);
    expect(result.curLon).toEqual(action.lon);
    expect(result.latDelta).toEqual(action.latDelta);
    expect(result.lonDelta).toEqual(action.lonDelta);
  });

  it("should properly update state when the selected machine changes", () => {
    let state = getInitialState();
    const action = {
      type: types.SET_SELECTED_MACHINE,
      machineId: 456,
    };

    const result = queryReducer(state, action);
    expect(result.machineId).toEqual(action.machineId);
  });

  it("should properly update state when the selected location type changes", () => {
    let state = getInitialState();
    const action = {
      type: types.SET_SELECTED_LOCATION_TYPE,
      locationType: 1,
    };

    const result = queryReducer(state, action);
    expect(result.locationType).toEqual(action.locationType);
  });

  it("should properly update state when the selected number of machines changes", () => {
    let state = getInitialState();
    const action = {
      type: types.SET_SELECTED_NUM_MACHINES,
      num: 4,
    };

    const result = queryReducer(state, action);
    expect(result.numMachines).toEqual(action.num);
  });
});
