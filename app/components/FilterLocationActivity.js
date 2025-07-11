import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ConfirmationModal from "./ConfirmationModal";
import { setSelectedLocationActivitiesFilter } from "../actions";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";
import { retrieveItem } from "../config/utils";

const FilterLocationActivity = ({
  setSelectedLocationActivitiesFilter,
  query,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [showModal, setShowModal] = useState(false);

  const { selectedLocationActivities = [] } = query;

  useEffect(() => {
    const getSelectedLocationActivities = async () => {
      const selectedLocationActivities =
        (await retrieveItem("selectedLocationActivities")) || [];
      setSelectedLocationActivitiesFilter(selectedLocationActivities);
    };
    getSelectedLocationActivities();
  }, []);

  const setLocationActivitiesFilter = (activity) => {
    const origLength = selectedLocationActivities.length;
    const activities = selectedLocationActivities.filter((a) => a !== activity);
    if (activities.length === origLength) {
      activities.push(activity);
    }
    setSelectedLocationActivitiesFilter(activities);
  };

  return (
    <View>
      <Entypo
        name="sound-mix"
        size={24}
        style={s.filterIcon}
        onPress={() => setShowModal(true)}
      />
      {showModal && (
        <ConfirmationModal>
          <View style={s.header}>
            <Text style={s.filterTitle}>Filter Location Activity</Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={45}
              onPress={() => setShowModal(false)}
              style={s.xButton}
            />
          </View>
          <View>
            <Pressable
              style={[
                s.container,
                selectedLocationActivities.find(
                  (activity) => activity === "new_lmx",
                )
                  ? s.containerSelected
                  : s.containerNotSelected,
              ]}
              onPress={() => setLocationActivitiesFilter("new_lmx")}
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
                  selectedLocationActivities.find(
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
                selectedLocationActivities.find(
                  (activity) => activity === "remove_machine",
                )
                  ? s.containerSelected
                  : s.containerNotSelected,
              ]}
              onPress={() => setLocationActivitiesFilter("remove_machine")}
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
                  selectedLocationActivities.find(
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
                selectedLocationActivities.find(
                  (activity) => activity === "new_condition",
                )
                  ? s.containerSelected
                  : s.containerNotSelected,
              ]}
              onPress={() => setLocationActivitiesFilter("new_condition")}
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
                  selectedLocationActivities.find(
                    (activity) => activity === "new_condition",
                  )
                    ? s.activeTitleStyle
                    : s.inactiveTitleStyle,
                ]}
              >
                New Comments
              </Text>
            </Pressable>
            <Pressable
              style={[
                s.container,
                selectedLocationActivities.find(
                  (activity) => activity === "new_msx",
                )
                  ? s.containerSelected
                  : s.containerNotSelected,
              ]}
              onPress={() => setLocationActivitiesFilter("new_msx")}
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
                  selectedLocationActivities.find(
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
                selectedLocationActivities.find(
                  (activity) => activity === "confirm_location",
                )
                  ? s.containerSelected
                  : s.containerNotSelected,
              ]}
              onPress={() => setLocationActivitiesFilter("confirm_location")}
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
                  selectedLocationActivities.find(
                    (activity) => activity === "confirm_location",
                  )
                    ? s.activeTitleStyle
                    : s.inactiveTitleStyle,
                ]}
              >
                Location Confirmations
              </Text>
            </Pressable>
            <PbmButton
              title="Apply Filters"
              onPress={() => setShowModal(false)}
            />
          </View>
        </ConfirmationModal>
      )}
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
      right: -20,
      top: -20,
      color: theme.red2,
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
      position: "absolute",
      right: 0,
      bottom: 0,
      paddingRight: 30,
      color: theme.theme == "dark" ? theme.pink1 : theme.purple2,
    },
    iconStyle: {
      marginRight: 10,
    },
  });

FilterLocationActivity.propTypes = {
  query: PropTypes.object,
  setSelectedActivityFilter: PropTypes.func,
};

const mapStateToProps = ({ query }) => ({ query });
const mapDispatchToProps = (dispatch) => ({
  setSelectedLocationActivitiesFilter: (activity) =>
    dispatch(setSelectedLocationActivitiesFilter(activity)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilterLocationActivity);
