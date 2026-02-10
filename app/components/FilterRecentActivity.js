import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ConfirmationModal from "./ConfirmationModal";
import { setSelectedActivitiesFilter } from "../actions";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";
import { retrieveItem } from "../config/utils";

const FilterRecentActivity = ({ setSelectedActivitiesFilter, query }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [showModal, setShowModal] = useState(false);

  const { selectedActivities = [] } = query;

  useEffect(() => {
    const getSelectedActivities = async () => {
      const selectedActivities =
        (await retrieveItem("selectedActivities")) || [];
      setSelectedActivitiesFilter(selectedActivities);
    };
    getSelectedActivities();
  }, []);

  const setRecentActivitiesFilter = (activity) => {
    const origLength = selectedActivities.length;
    const activities = selectedActivities.filter((a) => a !== activity);
    if (activities.length === origLength) {
      activities.push(activity);
    }
    setSelectedActivitiesFilter(activities);
  };

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
                  selectedActivities.find((activity) => activity === "new_lmx")
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("new_lmx")}
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
                    selectedActivities.find(
                      (activity) => activity === "new_lmx",
                    )
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
                  selectedActivities.find(
                    (activity) => activity === "remove_machine",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("remove_machine")}
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
                    selectedActivities.find(
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
                  selectedActivities.find(
                    (activity) => activity === "new_condition",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("new_condition")}
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
                    selectedActivities.find(
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
                  selectedActivities.find((activity) => activity === "new_msx")
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("new_msx")}
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
                    selectedActivities.find(
                      (activity) => activity === "new_msx",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  High Scores
                </Text>
              </Pressable>
              <Pressable
                style={[
                  s.container,
                  selectedActivities.find(
                    (activity) => activity === "confirm_location",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("confirm_location")}
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
                    selectedActivities.find(
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
                  selectedActivities.find(
                    (activity) => activity === "add_location",
                  )
                    ? s.containerSelected
                    : s.containerNotSelected,
                ]}
                onPress={() => setRecentActivitiesFilter("add_location")}
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
                    selectedActivities.find(
                      (activity) => activity === "add_location",
                    )
                      ? s.activeTitleStyle
                      : s.inactiveTitleStyle,
                  ]}
                >
                  Locations added
                </Text>
              </Pressable>
              <PbmButton
                title="Apply Filters"
                onPress={() => setShowModal(false)}
              />
            </View>
          </Pressable>
        </ConfirmationModal>
      )}
      <Pressable
        style={({ pressed }) => [
          s.filterIconPressable,
          pressed && s.filterIconPressed,
        ]}
        onPress={() => setShowModal(true)}
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
      height: 60,
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
  setSelectedActivityFilter: PropTypes.func,
};

const mapStateToProps = ({ query }) => ({ query });
const mapDispatchToProps = (dispatch) => ({
  setSelectedActivitiesFilter: (activity) =>
    dispatch(setSelectedActivitiesFilter(activity)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterRecentActivity);
