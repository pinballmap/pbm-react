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
export const selectedMapLocation = ({ locations }) =>
  locations.selectedMapLocation;

export const getMapLocations = createSelector(
  [mapLocations, faveLocations, selectedMapLocation],
  (locations = [], faveLocations = [], selectedMapLocation) => {
    return locations
      .sort((a, b) => a.machine_count - b.machine_count)
      .map((loc, index) => {
        const getIcon = () => {
          if (loc.id === selectedMapLocation) {
            return loc.machine_count < 10 ? "marker_2_1_sel" : "marker_10_sel";
          }
          const isFave =
            faveLocations.findIndex((fave) => fave.location_id === loc.id) > -1;

          if (loc.machine_count > 9) {
            return `marker_10${isFave ? "Heart" : ""}`;
          } else if (isFave) {
            return `marker_2Heart`;
          } else if (loc.machine_count > 1) {
            return `marker_2`;
          } else {
            return `marker_1`;
          }
        };
        const getTextColor = () => {
          const isFave =
            faveLocations.findIndex((fave) => fave.location_id === loc.id) > -1;

          if (
            loc.id === selectedMapLocation ||
            loc.machine_count > 1 ||
            isFave
          ) {
            return "#fdebfc";
          }

          // default case
          return "#4c504d";
        };
        return {
          type: "Feature",
          id: loc.id,
          properties: {
            order: index,
            textOrder: locations.length - index,
            machine_count: loc.machine_count,
            name: loc.name,
            icon: getIcon(),
            textColor: getTextColor(),
          },
          geometry: {
            type: "Point",
            coordinates: [Number(loc.lon), Number(loc.lat)],
          },
        };
      });
  },
);

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
