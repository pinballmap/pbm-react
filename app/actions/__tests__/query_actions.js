import * as queryActions from "../query_actions";
import * as types from "../types";

describe("testing query actions", () => {
  it("dispatched the expected action when the query is updated", () => {
    const query = "my new query";
    const expectedAction = {
      type: types.UPDATE_QUERY,
      payload: query,
    };

    expect(queryActions.updateQuery(query)).toEqual(expectedAction);
  });

  it("dispatched the expected action when the location is updated", () => {
    const id = 678;
    const name = "new fun place";
    const expectedAction = {
      type: types.SET_LOCATION_ID,
      id,
      name,
    };

    expect(queryActions.setLocationId(id, name)).toEqual(expectedAction);
  });

  it("dispatched the expected action when current coordinates are updated", () => {
    const lat = 123;
    const lon = 456;
    const latDelta = 0.1;
    const lonDelta = 0.22;

    const expectedAction = {
      type: types.UPDATE_COORDINATES,
      lat,
      lon,
      latDelta,
      lonDelta,
    };

    expect(
      queryActions.updateCurrCoordindates(lat, lon, latDelta, lonDelta),
    ).toEqual(expectedAction);
  });

  it("dispatched the expected action when a machine is selected", () => {
    const machineId = 456;

    const expectedAction = {
      type: types.SET_SELECTED_MACHINE,
      machineId,
    };

    expect(queryActions.setSelectedMachine(machineId)).toEqual(expectedAction);
  });

  it("dispatched the expected action when a location type is selected", () => {
    const locationType = 1;

    const expectedAction = {
      type: types.SET_SELECTED_LOCATION_TYPE,
      locationType,
    };

    expect(queryActions.setSelectedLocationType(locationType)).toEqual(
      expectedAction,
    );
  });

  it("dispatched the expected action when number of machines is selected", () => {
    const num = 3;

    const expectedAction = {
      type: types.SET_SELECTED_NUM_MACHINES,
      num,
    };

    expect(queryActions.setSelectedNumMachines(num)).toEqual(expectedAction);
  });
});
