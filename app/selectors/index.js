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
const faveLocations = ({ user }) => user.faveLocations;

export const getMapLocations = createSelector(
  [mapLocations, faveLocations],
  (locations = [], faveLocations = []) => {
    return locations.map((loc) => ({
      city: loc.city,
      state: loc.state,
      street: loc.street,
      zip: loc.zip,
      name: loc.name,
      num_machines: loc.num_machines,
      lat: loc.lat,
      lon: loc.lon,
      id: loc.id,
      icon:
        faveLocations.findIndex((fave) => fave.location_id === loc.id) > -1
          ? "heart"
          : "dot",
    }));
  },
);

export const selectedMapLocation = ({ locations }) =>
  locations.selectedMapLocation;
export const selectingMapMarker = ({ locations }) => locations.isBlocking;

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
