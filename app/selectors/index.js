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
  query.machineIds?.length > 0 ||
  query.machineId !== "" ||
  query.locationTypeIds?.length > 0 ||
  query.locationType !== "" ||
  query.selectedOperator !== "" ||
  query.numMachines !== 0 ||
  query.viewByFavoriteLocations ||
  query.icFilter ||
  query.manufacturerFilter?.length > 0 ||
  query.machineTypeFilter !== ""
    ? true
    : false,
);

const mapMarkers = ({ locations }) => locations.mapMarkers;
const faveLocations = ({ user }) => user.faveLocations;
export const selectedMapLocation = ({ locations }) =>
  locations.selectedMapLocation;

export const getMapLocations = createSelector(
  [mapMarkers, faveLocations, selectedMapLocation],
  (markers = [], faveLocations = [], selectedMapLocation) => {
    return [...markers]
      .sort((a, b) => a.properties.machine_count - b.properties.machine_count)
      .map((feature, index) => {
        const id = feature.id;
        const { machine_count } = feature.properties;
        const isSelected = id === selectedMapLocation;
        const isFave =
          faveLocations.findIndex((fave) => fave.location_id === id) > -1;

        const icon = isSelected
          ? machine_count < 10
            ? "marker_2_1_sel"
            : "marker_10_sel"
          : machine_count > 9
            ? `marker_10${isFave ? "Heart" : ""}`
            : isFave
              ? "marker_2Heart"
              : machine_count > 1
                ? "marker_2"
                : "marker_1";

        const textColor =
          isSelected || (machine_count > 1 && !isFave) ? "#fdebfc" : "#4c504d";

        return {
          ...feature,
          properties: {
            ...feature.properties,
            order: index,
            textOrder: markers.length - index,
            icon,
            textColor,
            isSelected,
            isFave,
          },
        };
      });
  },
);

export const getSelectedMapLocation = ({ locations }) =>
  locations.selectedMapLocationDetails ?? null;
