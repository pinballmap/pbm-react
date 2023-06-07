import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { DropDownButton, Screen, Text, WarningButton } from "../components";
import {
  updateNumMachinesSelected,
  updateViewFavoriteLocations,
  selectedLocationTypeFilter,
  selectedOperatorFilter,
  clearFilters,
  setMachineFilter,
  setMachineVersionFilter,
} from "../actions";
import {
  getLocationTypeName,
  getOperatorName,
  filterSelected,
} from "../selectors";

const FilterMap = ({
  updateNumMachinesSelected,
  updateViewFavoriteLocations,
  locationTypeName,
  operatorName,
  hasFilterSelected,
  query,
  navigation,
  selectedLocationTypeFilter,
  selectedOperatorFilter,
  clearFilters,
  setMachineFilter,
  setMachineVersionFilter,
  route,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const { machine, numMachines, viewByFavoriteLocations, machineGroupId } =
    query;
  const { navigate } = navigation;

  const getIdx = (value) => {
    switch (value) {
      case "2":
        return 1;
      case "5":
        return 2;
      case "10":
        return 3;
      case "20":
        return 4;
      default:
        return 0;
    }
  };

  const getNumMachines = (idx) => {
    switch (idx) {
      case 1:
        return "2";
      case 2:
        return "5";
      case 3:
        return "10";
      case 4:
        return "20";
      default:
        return "";
    }
  };

  const setNumMachinesSelected = (idx) => {
    updateNumMachinesSelected(getNumMachines(idx));
  };

  const updateViewFavorites = (idx) => {
    updateViewFavoriteLocations(idx);
  };

  const setFilterByMachineVersion = (idx, machine_group_id) => {
    setMachineVersionFilter(idx === 0 ? machine_group_id : undefined);
  };

  useEffect(() => {
    if (route.params?.setSelectedLocationType) {
      selectedLocationTypeFilter(route.params?.setSelectedLocationType);
    }
  }, [route.params?.setSelectedLocationType]);

  useEffect(() => {
    if (route.params?.setSelectedOperator) {
      selectedOperatorFilter(route.params?.setSelectedOperator);
    }
  }, [route.params?.setSelectedOperator]);

  const goToFindLocationType = () => {
    navigation.navigate("FindLocationType", {
      previous_screen: "FilterMap",
      type: "filter",
    });
  };

  const goToFindOperator = () => {
    navigation.navigate("FindOperator", {
      previous_screen: "FilterMap",
      type: "filter",
    });
  };

  return (
    <Screen>
      <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
        <Text style={[s.sectionTitle, s.paddingFirst]}>
          Only show locations with this machine:
        </Text>
        <DropDownButton
          title={machine && machine.name ? machine.name : "All"}
          onPress={() => {
            navigate("FindMachine", { machineFilter: true });
            setMachineFilter();
          }}
        />
        {machine && machine.machine_group_id && (
          <>
            <Text
              style={[s.sectionTitle, s.marginTop25, s.paddingRL10, s.pink]}
            >
              ...And only this machine version, or all:
            </Text>
            <ButtonGroup
              onPress={(idx) =>
                setFilterByMachineVersion(idx, machine.machine_group_id)
              }
              selectedIndex={machineGroupId ? 0 : 1}
              buttons={["All Versions", "Selected Version"]}
              containerStyle={s.buttonGroupContainer}
              textStyle={s.buttonGroupInactive}
              selectedButtonStyle={s.selButtonStyle}
              selectedTextStyle={s.selTextStyle}
              innerBorderStyle={s.innerBorderStyle}
            />
          </>
        )}
        <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
          Limit by number of machines per location:
        </Text>
        <ButtonGroup
          onPress={setNumMachinesSelected}
          selectedIndex={getIdx(numMachines)}
          buttons={["All", "2+", "5+", "10+", "20+"]}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
        <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
          Filter by location type:
        </Text>
        <DropDownButton
          title={locationTypeName}
          onPress={() => goToFindLocationType()}
        />
        <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
          Filter by operator:
        </Text>
        <DropDownButton
          title={operatorName}
          onPress={() => goToFindOperator()}
        />
        <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
          Only show my Saved locations:
        </Text>
        <ButtonGroup
          onPress={updateViewFavorites}
          selectedIndex={viewByFavoriteLocations ? 1 : 0}
          buttons={["All", "My Saved"]}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
        {hasFilterSelected ? (
          <WarningButton title={"Clear Filters"} onPress={clearFilters} />
        ) : null}
      </View>
    </Screen>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    border: {
      borderWidth: 2,
      borderColor: theme.indigo4,
    },
    sectionTitle: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "boldFont",
      color: theme.text3,
    },
    pink: {
      color: theme.pink1,
    },
    marginTop25: {
      marginTop: 25,
    },
    paddingRL10: {
      paddingHorizontal: 10,
    },
    paddingFirst: {
      paddingTop: 10,
      paddingHorizontal: 10,
    },
    buttonGroupContainer: {
      height: 40,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.base3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
    },
    buttonGroupInactive: {
      color: theme.text2,
      fontSize: 14,
      fontFamily: "mediumFont",
    },
    innerBorderStyle: {
      width: 0,
    },
    selButtonStyle: {
      borderWidth: 4,
      borderColor: theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
      fontFamily: "mediumFont",
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "boldFont",
    },
  });

FilterMap.propTypes = {
  query: PropTypes.object,
  operatorName: PropTypes.string,
  updateNumMachinesSelected: PropTypes.func,
  updateViewFavoriteLocations: PropTypes.func,
  clearFilters: PropTypes.func,
  navigation: PropTypes.object,
  selectedOperatorFilter: PropTypes.func,
  selectedLocationTypeFilter: PropTypes.func,
  locationTypeName: PropTypes.string,
  hasFilterSelected: PropTypes.bool,
  setMachineFilter: PropTypes.func,
  setMachineVersionFilter: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { query } = state;
  const locationTypeName = getLocationTypeName(state);
  const operatorName = getOperatorName(state);
  const hasFilterSelected = filterSelected(state);

  return {
    locationTypeName,
    query,
    operatorName,
    hasFilterSelected,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateNumMachinesSelected: (idx) => dispatch(updateNumMachinesSelected(idx)),
  selectedLocationTypeFilter: (type) =>
    dispatch(selectedLocationTypeFilter(type)),
  selectedOperatorFilter: (operator) =>
    dispatch(selectedOperatorFilter(operator)),
  clearFilters: () => dispatch(clearFilters()),
  setMachineFilter: () => dispatch(setMachineFilter()),
  updateViewFavoriteLocations: (idx) =>
    dispatch(updateViewFavoriteLocations(idx)),
  setMachineVersionFilter: (machine_group_id) =>
    dispatch(setMachineVersionFilter(machine_group_id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FilterMap);
