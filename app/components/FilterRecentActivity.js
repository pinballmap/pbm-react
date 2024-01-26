import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, ListItem } from "@rneui/base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmationModal from "./ConfirmationModal";
import { setSelectedActivitiesFilter } from "../actions";
import { ThemeContext } from "../theme-context";
import PbmButton from "./PbmButton";

let deviceWidth = Dimensions.get("window").width;

const FilterRecentActivity = ({ setSelectedActivitiesFilter, query }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [showModal, setShowModal] = useState(false);

  const { selectedActivities = [] } = query;

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
        <ConfirmationModal>
          <View style={s.header}>
            <Text style={s.filterTitle}>Filter Recent Activity</Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={45}
              onPress={() => setShowModal(false)}
              style={s.xButton}
            />
          </View>
          <View>
            <ListItem
              containerStyle={
                selectedActivities.find((activity) => activity === "new_lmx")
                  ? s.containerBg
                  : s.containerNotSelected
              }
              onPress={() => setRecentActivitiesFilter("new_lmx")}
            >
              <Avatar>
                {
                  <MaterialCommunityIcons
                    name="plus-box"
                    size={32}
                    color="#58a467"
                  />
                }
              </Avatar>
              <ListItem.Content>
                <ListItem.Title
                  style={
                    selectedActivities.find(
                      (activity) => activity === "new_lmx",
                    )
                      ? s.activeTitleStyle
                      : s.titleStyle
                  }
                >
                  Added Machines
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem
              containerStyle={
                selectedActivities.find(
                  (activity) => activity === "remove_machine",
                )
                  ? s.containerBg
                  : s.containerNotSelected
              }
              onPress={() => setRecentActivitiesFilter("remove_machine")}
            >
              <Avatar>
                {
                  <MaterialCommunityIcons
                    name="minus-box"
                    size={32}
                    color="#f56f79"
                  />
                }
              </Avatar>
              <ListItem.Content>
                <ListItem.Title
                  style={
                    selectedActivities.find(
                      (activity) => activity === "remove_machine",
                    )
                      ? s.activeTitleStyle
                      : s.titleStyle
                  }
                >
                  Removed Machines
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem
              containerStyle={
                selectedActivities.find(
                  (activity) => activity === "new_condition",
                )
                  ? s.containerBg
                  : s.containerNotSelected
              }
              onPress={() => setRecentActivitiesFilter("new_condition")}
            >
              <Avatar>
                {
                  <MaterialCommunityIcons
                    name="comment-text"
                    size={32}
                    color="#6cbffe"
                  />
                }
              </Avatar>
              <ListItem.Content>
                <ListItem.Title
                  style={
                    selectedActivities.find(
                      (activity) => activity === "new_condition",
                    )
                      ? s.activeTitleStyle
                      : s.titleStyle
                  }
                >
                  New Comments
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem
              containerStyle={
                selectedActivities.find((activity) => activity === "new_msx")
                  ? s.containerBg
                  : s.containerNotSelected
              }
              onPress={() => setRecentActivitiesFilter("new_msx")}
            >
              <Avatar>
                {
                  <MaterialCommunityIcons
                    name="numeric"
                    size={32}
                    color="#eeb152"
                  />
                }
              </Avatar>
              <ListItem.Content>
                <ListItem.Title
                  style={
                    selectedActivities.find(
                      (activity) => activity === "new_msx",
                    )
                      ? s.activeTitleStyle
                      : s.titleStyle
                  }
                >
                  High Scores
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <ListItem
              containerStyle={
                selectedActivities.find(
                  (activity) => activity === "confirm_location",
                )
                  ? s.containerBg
                  : s.containerNotSelected
              }
              onPress={() => setRecentActivitiesFilter("confirm_location")}
            >
              <Avatar>
                {
                  <MaterialCommunityIcons
                    name="clipboard-check"
                    size={32}
                    color="#d473df"
                  />
                }
              </Avatar>
              <ListItem.Content>
                <ListItem.Title
                  style={
                    selectedActivities.find(
                      (activity) => activity === "confirm_location",
                    )
                      ? s.activeTitleStyle
                      : s.titleStyle
                  }
                >
                  Location Confirmations
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <PbmButton
              title="Apply Filters"
              onPress={() => setShowModal(false)}
            />
          </View>
        </ConfirmationModal>
      )}
      <Button
        onPress={() => setShowModal(true)}
        containerStyle={{ width: deviceWidth < 325 ? 60 : 70 }}
        title="Filter"
        accessibilityLabel="Filter"
        titleStyle={{
          color: theme.purple2,
          fontSize: deviceWidth < 325 ? 16 : 18,
          fontFamily: "Nunito-Bold",
          marginTop: Platform.OS === "android" ? 3 : 0,
        }}
        type="clear"
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    containerNotSelected: {
      backgroundColor: theme.base1,
    },
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      height: 40,
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
      color: theme.text3,
      fontFamily: "Nunito-Bold",
    },
    activeTitleStyle: {
      color: theme.pink1,
      fontFamily: "Nunito-Bold",
    },
    containerBg: {
      backgroundColor: theme.pink2,
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
