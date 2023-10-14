import { createSelector } from "reselect";

const locationTypes = ({ locations }) => locations.locationTypes;

const locationType = ({ query }) => query.locationType;

export const getLocationTypeName = createSelector(
  [locationTypes, locationType],
  (locationTypes, locationType) => {
    const type =
      locationType > -1
        ? locationTypes.find((location) => location.id === locationType)
        : false;
    if (type) return type.name;

    return "All";
  },
);

const operators = ({ operators }) => operators.operators;

const selectedOperator = ({ query }) => query.selectedOperator;

export const getOperatorName = createSelector(
  [operators, selectedOperator],
  (operators, selectedOperator) => {
    const operatorName =
      selectedOperator > -1
        ? operators.find((operator) => operator.id === selectedOperator)
        : false;
    if (operatorName) return operatorName.name;

    return "All";
  },
);

const queryState = ({ query }) => query;

export const filterSelected = createSelector(queryState, (query) =>
  query.machineId !== "" ||
  query.locationType !== "" ||
  query.selectedOperator !== "" ||
  query.numMachines !== 0 ||
  query.viewByFavoriteLocations
    ? true
    : false,
);

const mapLocations = ({ locations }) => locations.mapLocations;
//const faveLocations = ({ user }) => user.faveLocations;

export const getMapLocations = createSelector(
  [mapLocations],
  (locations = []) => {
    return locations.map((loc, index) => {
      return {
        type: "Feature",
        id: loc.id,
        properties: {
          order: index,
          num_machines: loc.num_machines,
          location_type_id: loc.location_type_id,
          name: loc.name,
        },
        geometry: {
          type: "Point",
          coordinates: [Number(loc.lon), Number(loc.lat)],
        },
      };
    });
  },
);

export const selectedMapLocation = ({ locations }) =>
  locations.selectedMapLocation;

export const getSelectedMapLocation = createSelector(
  [mapLocations, selectedMapLocation],
  (locations = [], selectedMapLocation) => {
    if (!selectedMapLocation) {
      return null;
    }
    const location = locations.find((l) => l.id === selectedMapLocation);
    return location;
  },
);
