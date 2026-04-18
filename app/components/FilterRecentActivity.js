import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome6,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";
import {
  setSelectedActivitiesFilter,
  setActivityMachinesFilter,
  addMachineToList,
  clearSelectedState,
} from "../actions";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";

const FilterRecentActivity = ({
  setSelectedActivitiesFilter,
  setActivityMachinesFilter,
  addMachineToList,
  clearSelectedState,
  onNavigateToFindMachine,
  query,
  user,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const { loggedIn } = user;
  const navigation = useNavigation();
  const store = useStore();

  const [showModal, setShowModal] = useState(false);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [pendingActivityMachines, setPendingActivityMachines] = useState([]);

  const shouldReopenModal = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (shouldReopenModal.current) {
        shouldReopenModal.current = false;
        const machineList = store.getState().location.machineList;
        setPendingActivityMachines([...machineList]);
        setShowModal(true);
      }
    });
    return unsubscribe;
  }, [navigation]);

  const { selectedActivities = [], selectedActivityMachines = [] } = query;

  const openModal = () => {
    setPendingActivities(selectedActivities);
    setPendingActivityMachines(selectedActivityMachines);
    setShowModal(true);
  };

  const togglePendingActivity = (activity) => {
    const origLength = pendingActivities.length;
    const activities = pendingActivities.filter((a) => a !== activity);
    if (activities.length === origLength) {
      activities.push(activity);
    }
    setPendingActivities(activities);
  };

  const navigateToFindMachine = () => {
    onNavigateToFindMachine?.();
    clearSelectedState();
    pendingActivityMachines.forEach((m) => addMachineToList(m));
    shouldReopenModal.current = true;
    setShowModal(false);
    navigation.navigate("FindMachine", {
      multiSelect: true,
      showDone: pendingActivityMachines.length > 0,
    });
  };

  const applyFilters = () => {
    setSelectedActivitiesFilter(pendingActivities);
    setActivityMachinesFilter(pendingActivityMachines);
    setShowModal(false);
  };

  const specificMachinesSelected = pendingActivityMachines.length > 0;

  return (
    <View>
      {showModal && (
        <ConfirmationModal closeModal={() => setShowModal(false)}>
          <Pressable>
            <View style={s.header}>
              <Text style={s.filterTitle}>Filter Recent Activity</Text>
              <MaterialCommunityIcons
                name="close-circle"
                size={35}
                onPress={() => setShowModal(false)}
                style={s.xButton}
              />
            </View>
            <View>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find((activity) => activity === "new_lmx")
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("new_lmx")}
              >
                <MaterialCommunityIcons
                  name="plus-box"
                  size={32}
                  color="#58a467"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find((activity) => activity === "new_lmx")
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Added Machines
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find(
                    (activity) => activity === "remove_machine",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("remove_machine")}
              >
                <MaterialCommunityIcons
                  name="minus-box"
                  size={32}
                  color="#f56f79"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find(
                      (activity) => activity === "remove_machine",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Removed Machines
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find(
                    (activity) => activity === "new_condition",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("new_condition")}
              >
                <MaterialCommunityIcons
                  name="comment-text"
                  size={32}
                  color="#6cbffe"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find(
                      (activity) => activity === "new_condition",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Machine Comments
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find((activity) => activity === "new_msx")
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("new_msx")}
              >
                <MaterialCommunityIcons
                  name="numeric"
                  size={32}
                  color="#eeb152"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find((activity) => activity === "new_msx")
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Your Scores
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find(
                    (activity) => activity === "confirm_location",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("confirm_location")}
              >
                <MaterialCommunityIcons
                  name="clipboard-check"
                  size={32}
                  color="#d473df"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find(
                      (activity) => activity === "confirm_location",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Location Confirmations
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  pendingActivities.find(
                    (activity) => activity === "add_location",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => togglePendingActivity("add_location")}
              >
                <MaterialCommunityIcons
                  name="star-face"
                  size={32}
                  color="#ffe500"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    pendingActivities.find(
                      (activity) => activity === "add_location",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Locations added
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  specificMachinesSelected
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={navigateToFindMachine}
              >
                <MaterialCommunityIcons
                  name="format-list-checks"
                  size={32}
                  color="#4db8c8"
                  style={s.iconStyle}
                />
                <Text
                  style={[
                    s.titleStyle,
                    specificMachinesSelected
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  {specificMachinesSelected
                    ? `${pendingActivityMachines.length} Machine${pendingActivityMachines.length > 1 ? "s" : ""} Selected`
                    : "Specific Machines"}
                </Text>
              </Pressable>
              {loggedIn && (
                <Pressable
                  style={[
                    s.container,
                    pendingActivities.find(
                      (activity) => activity === "your_activity",
                    )
                      ? s.containerSelected
                      : s.containerNotSelected,
                  ]}
                  onPress={() => togglePendingActivity("your_activity")}
                >
                  <FontAwesome6
                    name="face-grin-beam"
                    size={32}
                    color="#7b97e3"
                    style={s.iconStyle}
                  />
                  <Text
                    style={[
                      s.titleStyle,
                      pendingActivities.find(
                        (activity) => activity === "your_activity",
                      )
                        ? s.activeTitleStyle
                        : s.inactiveTitleStyle,
                    ]}
                  >
                    Your Activity
                  </Text>
                </Pressable>
              )}
              <PbmButton title="Apply Filters" onPress={applyFilters} />
            </View>
          </Pressable>
        </ConfirmationModal>
      )}
      <Pressable
        style={({ pressed }) => [
          s.filterIconPressable,
          pressed && s.filterIconPressed,
        ]}
        onPress={openModal}
        hitSlop={{ top: 20, bottom: 20, left: 60, right: 10 }}
      >
        <Entypo name="sound-mix" size={24} style={s.filterIcon} />
      </Pressable>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      height: 55,
      paddingHorizontal: 15,
    },
    containerNotSelected: {
      backgroundColor: theme.base1,
    },
    containerSelected: {
      backgroundColor: theme.base3,
    },
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
    },
    filterTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-ExtraBold",
    },
    xButton: {
      position: "absolute",
      right: 3,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
    titleStyle: {
      fontSize: 17,
      fontFamily: "Nunito-Bold",
    },
    inactiveTitleStyle: {
      color: theme.text3,
    },
    activeTitleStyle: {
      color: theme.purple,
    },
    filterIcon: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple2,
    },
    iconStyle: {
      marginRight: 10,
    },
    filterIconPressable: {
      marginRight: 5,
      padding: 5,
    },
    filterIconPressed: {
      backgroundColor: theme.indigo4,
    },
  });

FilterRecentActivity.propTypes = {
  query: PropTypes.object,
  user: PropTypes.object,
  setSelectedActivitiesFilter: PropTypes.func,
  setActivityMachinesFilter: PropTypes.func,
  addMachineToList: PropTypes.func,
  clearSelectedState: PropTypes.func,
  onNavigateToFindMachine: PropTypes.func,
};

const mapStateToProps = ({ query, user }) => ({ query, user });
const mapDispatchToProps = (dispatch) => ({
  setSelectedActivitiesFilter: (activity) =>
    dispatch(setSelectedActivitiesFilter(activity)),
  setActivityMachinesFilter: (machines) =>
    dispatch(setActivityMachinesFilter(machines)),
  addMachineToList: (machine) => dispatch(addMachineToList(machine)),
  clearSelectedState: () => dispatch(clearSelectedState()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterRecentActivity);
