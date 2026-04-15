import React, { useContext, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ButtonGroup, DropDownButton, Screen, Text } from "../components";
import {
  updateNumMachinesSelected,
  updateViewFavoriteLocations,
  selectedLocationTypeFilterMulti,
  selectedOperatorFilter,
  clearFilters,
  setMachineFilterMulti,
  setMachineVersionFilter,
  setIcFilter,
  selectedManufacturerFilter,
  setMachineTypeFilter,
  reloadMapMarkers,
  getMapAreaMachineIds,
  clearSelectedState,
  addMachineToList,
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
  machineList,
  navigation,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const dispatch = useDispatch();

  const {
    machines = [],
    locationTypeIds = [],
    numMachines,
    viewByFavoriteLocations,
    machineGroupId,
    icFilter,
    manufacturerFilter = [],
    machineTypeFilter = "",
  } = query;
  const { navigate } = navigation;

  const navigatingToFindMachine = useRef(false);
  const machineListRef = useRef(machineList);
  useEffect(() => {
    machineListRef.current = machineList;
  }, [machineList]);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Only update filter locations when going back to the map- FindMachine, FindOperator, etc also cause blur to
      // trigger, but we do not want to fire off the new request until the user leaves the filter screen for the map.
      if (navigation.getState().routes.length === 1) {
        dispatch(reloadMapMarkers());
      }
    });
    const unsubscribeFocus = navigation.addListener("focus", () => {
      if (navigatingToFindMachine.current) {
        navigatingToFindMachine.current = false;
        dispatch(setMachineFilterMulti(machineListRef.current));
      }
    });
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [navigation]);

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
      multiSelect: true,
      selectedIds: locationTypeIds,
      onGoBack: (ids) => {
        dispatch(selectedLocationTypeFilterMulti(ids));
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
    navigation.navigate("MapTab", { pop: true });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Screen>
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <Text style={[s.sectionTitle, s.paddingFirst]}>
            Locations with this machine
          </Text>
          <DropDownButton
            title={
              machines.length > 1
                ? "Multiple machines"
                : machines.length === 1
                  ? machines[0].name
                  : "All"
            }
            onPress={() => {
              dispatch(clearSelectedState());
              machines.forEach((m) => dispatch(addMachineToList(m)));
              navigatingToFindMachine.current = true;
              dispatch(getMapAreaMachineIds());
              navigate("FindMachine", {
                machineFilter: true,
                multiSelect: true,
                showDone: machines.length > 0,
                manufacturerFilter,
                machineTypeFilter,
              });
            }}
            margin={s.dropdownMargin}
          />
          {machines.length === 1 && machines[0].machine_group_id && (
            <>
              <Text
                style={[s.sectionTitle, s.marginTop25, s.paddingRL10, s.pink]}
              >
                ...This machine version, or all
              </Text>
              <ButtonGroup
                onPress={(idx) =>
                  setFilterByMachineVersion(idx, machines[0].machine_group_id)
                }
                selectedIndex={machineGroupId ? 0 : 1}
                buttons={["All Versions", "Selected Version"]}
                containerStyle={[s.buttonGroupContainer, s.boxShadow]}
                textStyle={s.buttonGroupInactive}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
              />
            </>
          )}
          {machines.length === 1 && machines[0].ic_eligible && (
            <>
              <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
                Has Stern Insider Connected?
              </Text>
              <ButtonGroup
                onPress={(idx) => dispatch(setIcFilter(idx === 1))}
                selectedIndex={icFilter ? 1 : 0}
                buttons={["Doesn't matter", "Has IC"]}
                containerStyle={[s.buttonGroupContainer, s.boxShadow]}
                textStyle={s.buttonGroupInactive}
                selectedButtonStyle={s.selButtonStyle}
                selectedTextStyle={s.selTextStyle}
                innerBorderStyle={s.innerBorderStyle}
              />
            </>
          )}
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Manufacturer
          </Text>
          <DropDownButton
            title={
              manufacturerFilter.length > 1
                ? "Multiple manufacturers"
                : manufacturerFilter.length === 1
                  ? manufacturerFilter[0]
                  : "All"
            }
            onPress={() =>
              navigation.navigate("FindManufacturer", {
                selectedManufacturers: manufacturerFilter,
                onGoBack: (manufacturers) => {
                  dispatch(selectedManufacturerFilter(manufacturers));
                },
              })
            }
            margin={s.dropdownMargin}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Machine type
          </Text>
          <ButtonGroup
            onPress={(idx) =>
              dispatch(setMachineTypeFilter(idx === 1 ? "em" : ""))
            }
            selectedIndex={machineTypeFilter === "em" ? 1 : 0}
            buttons={["All", "EM"]}
            containerStyle={[s.buttonGroupContainer, s.boxShadow]}
            textStyle={s.buttonGroupInactive}
            selectedButtonStyle={s.selButtonStyle}
            selectedTextStyle={s.selTextStyle}
            innerBorderStyle={s.innerBorderStyle}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Limit by number of machines
          </Text>
          <ButtonGroup
            onPress={setNumMachinesSelected}
            selectedIndex={getIdx(numMachines)}
            buttons={["All", "2+", "5+", "10+", "20+"]}
            containerStyle={[s.buttonGroupContainer, s.boxShadow]}
            textStyle={s.buttonGroupInactive}
            selectedButtonStyle={s.selButtonStyle}
            selectedTextStyle={s.selTextStyle}
            innerBorderStyle={s.innerBorderStyle}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Location type
          </Text>
          <DropDownButton
            title={
              locationTypeIds.length > 1 ? "Multiple types" : locationTypeName
            }
            onPress={() => goToFindLocationType()}
            margin={s.dropdownMargin}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Operator
          </Text>
          <DropDownButton
            title={operatorName}
            onPress={() => goToFindOperator()}
            margin={s.dropdownMargin}
          />
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Saved locations or all
          </Text>
          <ButtonGroup
            onPress={updateViewFavorites}
            selectedIndex={viewByFavoriteLocations ? 1 : 0}
            buttons={["All", "My Saved"]}
            containerStyle={[s.buttonGroupContainer, s.boxShadow]}
            textStyle={s.buttonGroupInactive}
            selectedButtonStyle={s.selButtonStyle}
            selectedTextStyle={s.selTextStyle}
            innerBorderStyle={s.innerBorderStyle}
          />
        </View>
      </Screen>
      {hasFilterSelected ? (
        <View style={[s.bottomTab, s.boxShadow]}>
          <Text
            style={s.bottomTabClear}
            onPress={() => dispatch(clearFilters())}
          >
            Clear Filters
          </Text>
          <View style={[s.bottomTabApplyButton, s.boxShadow]}>
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
      marginBottom: 5,
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
    dropdownMargin: {
      marginHorizontal: 10,
      marginTop: 0,
      marginBottom: 5,
    },
    buttonGroupContainer: {
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
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
    },
    bottomTabClear: {
      textDecorationLine: "underline",
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      color: theme.theme == "dark" ? "#e3fae5" : theme.text,
    },
    bottomTabApplyButton: {
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
    boxShadow: {
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
  });

const mapStateToProps = (state) => {
  const { query } = state;
  const locationTypeName = getLocationTypeName(state);
  const operatorName = getOperatorName(state);
  const hasFilterSelected = filterSelected(state);
  const machineList = state.location.machineList;

  return {
    locationTypeName,
    query,
    operatorName,
    hasFilterSelected,
    machineList,
  };
};

export default connect(mapStateToProps)(FilterMap);
