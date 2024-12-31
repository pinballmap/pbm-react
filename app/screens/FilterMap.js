import React, { useContext, useEffect } from "react";
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
  locationTypeName,
  operatorName,
  hasFilterSelected,
  query,
  navigation,
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
    dispatch(updateNumMachinesSelected(getNumMachines(idx)));
  };

  const updateViewFavorites = (idx) => {
    dispatch(updateViewFavoriteLocations(idx));
  };

  const setFilterByMachineVersion = (idx, machine_group_id) => {
    dispatch(setMachineVersionFilter(idx === 0 ? machine_group_id : undefined));
  };

  const goToFindLocationType = () => {
    navigation.navigate("FindLocationType", {
      onGoBack: (id) => {
        dispatch(selectedLocationTypeFilter(id));
      },
    });
  };

  const goToFindOperator = () => {
    navigation.navigate("FindOperator", {
      onGoBack: (id) => {
        dispatch(selectedOperatorFilter(id));
      },
    });
  };

  const goToMap = () => {
    navigation.navigate("MapTab", {
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
              dispatch(setMachineFilter());
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
          <Text
            style={s.bottomTabClear}
            onPress={() => dispatch(clearFilters())}
          >
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
      color: theme.text2,
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
      boxShadow:
        theme.theme == "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3))",
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
      boxShadow:
        theme.theme == "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3))",
      overflow: "visible",
    },
    bottomTabClear: {
      textDecorationLine: "underline",
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      color: theme.theme == "dark" ? "#e3fae5" : theme.text,
    },
    bottomTabApplyButton: {
      boxShadow:
        theme.theme == "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3)",
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

export default connect(mapStateToProps)(FilterMap);
