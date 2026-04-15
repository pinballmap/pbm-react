import React, { useContext, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { FlatList, Modal, Pressable, StyleSheet, View } from "react-native";
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
  setMachineYearFilter,
  setLocationIcFilter,
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
  minMachineYear,
  maxMachineYear,
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
    machineYearGte = null,
    machineYearLte = null,
    locationIcFilter = false,
  } = query;
  const { navigate } = navigation;

  const allYears = Array.from(
    { length: maxMachineYear - minMachineYear + 1 },
    (_, i) => minMachineYear + i,
  );

  const [yearModalTarget, setYearModalTarget] = useState(null); // 'gte' | 'lte'

  const updateYearGte = (val) =>
    dispatch(setMachineYearFilter(val, machineYearLte));
  const updateYearLte = (val) =>
    dispatch(setMachineYearFilter(machineYearGte, val));

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
                machineYearGte,
                machineYearLte,
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
            Machine year
          </Text>
          <View style={s.yearRangeContainer}>
            {[
              { label: "From", value: machineYearGte, target: "gte" },
              { label: "To", value: machineYearLte, target: "lte" },
            ].map(({ label, value, target }) => {
              const isGte = target === "gte";
              const update = isGte ? updateYearGte : updateYearLte;
              const minVal = isGte
                ? minMachineYear
                : (machineYearGte ?? minMachineYear);
              const maxVal = isGte
                ? (machineYearLte ?? maxMachineYear)
                : maxMachineYear;
              return (
                <View key={target} style={s.yearStepper}>
                  <Text style={s.yearLabel}>{label}</Text>
                  <View style={s.yearControls}>
                    <Pressable
                      onPress={() => {
                        if (value === null) return;
                        const next = value - 1;
                        update(next < minVal ? null : next);
                      }}
                      style={({ pressed }) => [
                        s.yearButton,
                        pressed && s.yearButtonPressed,
                      ]}
                    >
                      <Text style={s.yearButtonText}>−</Text>
                    </Pressable>
                    <Pressable onPress={() => setYearModalTarget(target)}>
                      <Text style={s.yearValue}>{value ?? "--"}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        if (value === null) {
                          update(isGte ? minVal : maxVal);
                        } else {
                          const next = value + 1;
                          update(next > maxVal ? null : next);
                        }
                      }}
                      style={({ pressed }) => [
                        s.yearButton,
                        pressed && s.yearButtonPressed,
                      ]}
                    >
                      <Text style={s.yearButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
          <Modal
            visible={yearModalTarget !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setYearModalTarget(null)}
          >
            <Pressable
              style={s.yearModalOverlay}
              onPress={() => setYearModalTarget(null)}
            >
              <View style={[s.yearModalContent, s.boxShadow]}>
                <FlatList
                  data={
                    yearModalTarget === "lte"
                      ? [...allYears].reverse()
                      : allYears
                  }
                  keyExtractor={(item) => String(item)}
                  initialScrollIndex={0}
                  getItemLayout={(_, index) => ({
                    length: 44,
                    offset: 44 * index,
                    index,
                  })}
                  renderItem={({ item }) => {
                    const currentVal =
                      yearModalTarget === "gte"
                        ? machineYearGte
                        : machineYearLte;
                    const isSelected = item === currentVal;
                    return (
                      <Pressable
                        onPress={() => {
                          if (yearModalTarget === "gte") updateYearGte(item);
                          else updateYearLte(item);
                          setYearModalTarget(null);
                        }}
                        style={({ pressed }) => [
                          s.yearModalItem,
                          isSelected && s.yearModalItemSelected,
                          pressed && s.yearButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            s.yearModalItemText,
                            isSelected && s.yearModalItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </Pressable>
                    );
                  }}
                />
              </View>
            </Pressable>
          </Modal>
          <Text style={[s.sectionTitle, s.marginTop25, s.paddingRL10]}>
            Has &gt; 0 Stern Insider Connected Machine
          </Text>
          <ButtonGroup
            onPress={(idx) => dispatch(setLocationIcFilter(idx === 1))}
            selectedIndex={locationIcFilter ? 1 : 0}
            buttons={["All", "With IC"]}
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
    yearRangeContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginHorizontal: 10,
      marginTop: 5,
    },
    yearStepper: {
      alignItems: "center",
    },
    yearLabel: {
      fontFamily: "Nunito-Bold",
      fontSize: 13,
      color: theme.text2,
      marginBottom: 4,
    },
    yearControls: {
      flexDirection: "row",
      alignItems: "center",
    },
    yearButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      alignItems: "center",
      justifyContent: "center",
    },
    yearButtonPressed: {
      opacity: 0.6,
    },
    yearButtonText: {
      fontSize: 20,
      color: theme.text2,
      fontFamily: "Nunito-Bold",
      lineHeight: 24,
    },
    yearValue: {
      width: 52,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    yearModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    yearModalContent: {
      backgroundColor: theme.white,
      borderRadius: 12,
      width: 160,
      maxHeight: 300,
      overflow: "hidden",
    },
    yearModalItem: {
      height: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    yearModalItemSelected: {
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
    },
    yearModalItemText: {
      fontSize: 16,
      fontFamily: "Nunito-Medium",
      color: theme.text,
    },
    yearModalItemTextSelected: {
      fontFamily: "Nunito-Bold",
      color: theme.text2,
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
  const allMachineYears = state.machines.machines
    .map((m) => m.year)
    .filter(Boolean);
  const minMachineYear = Math.min(...allMachineYears);
  const maxMachineYear = Math.max(...allMachineYears);

  return {
    locationTypeName,
    query,
    operatorName,
    hasFilterSelected,
    machineList,
    minMachineYear,
    maxMachineYear,
  };
};

export default connect(mapStateToProps)(FilterMap);
