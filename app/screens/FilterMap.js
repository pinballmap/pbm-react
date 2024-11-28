import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { DropDownButton, Screen, Text } from "../components";
import {
  updateNumMachinesSelected,
  updateViewFavoriteLocations,
  selectedLocationTypeFilter,
  selectedOperatorFilter,
  clearFilters,
  setMachineFilter,
  setMachineVersionFilter,
  updateFilterLocations,
} from "../actions";
import {
  getLocationTypeName,
  getOperatorName,
  filterSelected,
} from "../selectors";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const dispatch = useDispatch();

  const { machine, numMachines, viewByFavoriteLocations, machineGroupId } =
    query;
  const { navigate } = navigation;

  useEffect(
    () =>
      navigation.addListener("blur", () => {
        // Only update filter locations when going back to the map- FindMachine, FindOperator, etc also cause blur to
        // trigger, but we do not want to fire off the new request until the user leaves the filter screen for the map.
        if (navigation.getState().routes.length === 1) {
          dispatch(updateFilterLocations());
        }
      }),
    [navigation],
  );

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
        return 0;
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

  const goToMap = () => {
    navigation.navigate("MapStack", {
      previous_screen: "FilterMap",
      type: "filter",
    });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Screen>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={[s.sectionTitle, s.paddingFirst]}>
            Locations with this machine
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
                ...This machine version, or all
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
            Limit by number of machines
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
            Location type
          </Text>
          <DropDownButton
            title={locationTypeName}
            onPress={() => goToFindLocationType()}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Operator
          </Text>
          <DropDownButton
            title={operatorName}
            onPress={() => goToFindOperator()}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Saved locations or all
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
        </View>
      </Screen>
      {hasFilterSelected ? (
        <View style={s.bottomTab}>
          <Text style={s.bottomTabClear} onPress={clearFilters}>
            Clear Filters
          </Text>
          <View style={s.bottomTabApplyButton}>
            <Text style={s.bottomTabApply} onPress={() => goToMap()}>
              Apply Filters
            </Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    sectionTitle: {
      textAlign: "center",
      fontSize: 16,
      fontFamily: "Nunito-Bold",
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
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
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
      fontFamily: "Nunito-Medium",
    },
    innerBorderStyle: {
      width: 0,
    },
    selButtonStyle: {
      borderWidth: 2,
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
      fontFamily: "Nunito-Medium",
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    bottomTab: {
      position: "fixed",
      bottom: 0,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme.white,
      width: "100%",
      height: 80,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
    },
    bottomTabClear: {
      textDecorationLine: "underline",
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      color: theme.theme == "dark" ? "#e3fae5" : theme.text,
    },
    bottomTabApplyButton: {
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
      borderRadius: 30,
      backgroundColor: theme.purple,
    },
    bottomTabApply: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      fontFamily: "Nunito-Bold",
      fontSize: 15,
      color: "#ffffff",
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
