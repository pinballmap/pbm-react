import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { FilterLocationActivity } from "../components";
import { ThemeContext } from "../theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ActivityIndicator from "./ActivityIndicator";
import Text from "./PbmText";
import ConfirmationModal from "./ConfirmationModal";
import { getData } from "../config/request";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import { clearLocationActivityFilter } from "../actions";
import getActivityIcon from "../utils/getActivityIcon";

const moment = require("moment");

const LocationActivity = ({
  query,
  clearLocationActivityFilter,
  locationId,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [locationActivityModalOpen, setLocationActivityModalOpen] =
    useState(false);
  const [locationActivityLoading, setLocationActivityLoading] = useState(true);
  const { selectedLocationActivities = [] } = query;
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (locationActivityModalOpen) {
      setLocationActivityLoading(true);
      getData(`/user_submissions/location.json?id=${locationId}`).then(
        (data) => {
          setLocationActivityLoading(false);
          setRecentActivity(data.user_submissions);
        },
      );
    }
  }, [locationActivityModalOpen]);

  const getText = (activity) => {
    const {
      submission_type,
      submission,
      high_score,
      machine_name,
      user_name,
      comment,
      updated_at,
    } = activity;
    const time = moment(updated_at).format("LL");
    const timeAndUser = user_name ? (
      <Text style={s.date}>
        <Text style={s.italic}>{time}</Text> by{" "}
        <Text style={s.username}>{user_name}</Text>
      </Text>
    ) : (
      <Text style={s.date}>{time}</Text>
    );
    switch (submission_type) {
      case "new_lmx": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              <Text style={s.machineName}>{machine_name}</Text> added
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "new_condition": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>{`"${comment}"`}</Text>
            <Text style={s.machineName}>{machine_name}</Text>
            {timeAndUser}
          </View>
        );
      }
      case "remove_machine": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              <Text style={s.machineName}>{machine_name}</Text> removed
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "new_msx": {
        if (!high_score)
          return (
            <View style={s.textContainer}>
              <Text style={s.pbmText}>{submission}</Text>
              <Text style={s.date}>{time}</Text>
            </View>
          );
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              High score:{" "}
              <Text style={s.score}>{formatNumWithCommas(high_score)}</Text>
            </Text>
            <Text style={s.machineName}>{machine_name}</Text>
            {timeAndUser}
          </View>
        );
      }
      case "confirm_location": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>Line-up confirmed</Text>
            {timeAndUser}
          </View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <ConfirmationModal
        closeModal={() => setLocationActivityModalOpen(false)}
        visible={locationActivityModalOpen}
        onRequestClose={() => {}}
        wide
        noPad
      >
        <>
          <Pressable>
            <View style={s.header}>
              <Text style={s.title}>Location Activity</Text>
              <FilterLocationActivity />
              <MaterialCommunityIcons
                name="close-circle"
                size={45}
                onPress={() => setLocationActivityModalOpen(false)}
                style={s.xButton}
              />
            </View>
          </Pressable>
          <ScrollView style={{ height: "80%" }}>
            <Pressable>
              {selectedLocationActivities.length ? (
                <View style={s.filterView}>
                  <Text style={s.filter}>Clear applied filters</Text>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    onPress={() => clearLocationActivityFilter()}
                    style={s.xButton2}
                  />
                </View>
              ) : null}
              {locationActivityLoading ? (
                <ActivityIndicator />
              ) : recentActivity.length === 0 ? (
                <Text style={s.problem}>No location activity found</Text>
              ) : (
                recentActivity
                  .filter((activity) => {
                    const icon = getActivityIcon(activity.submission_type);

                    const showType = selectedLocationActivities.length
                      ? selectedLocationActivities.find(
                          (a) => a === activity.submission_type,
                        )
                      : true;

                    if (icon && showType) {
                      activity.icon = icon;
                      return activity;
                    }
                  })
                  .map((activity) => (
                    <View key={activity.id} style={[s.list, s.flexi]}>
                      <View style={{ width: "15%" }}>{activity.icon}</View>
                      {getText(activity)}
                    </View>
                  ))
              )}
            </Pressable>
          </ScrollView>
        </>
      </ConfirmationModal>
      <View
        style={{ flexDirection: "column", alignItems: "center", width: "25%" }}
      >
        <Pressable
          style={({ pressed }) => [
            s.activity,
            s.quickButton,
            pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
          ]}
          onPress={() => setLocationActivityModalOpen(true)}
        >
          <MaterialCommunityIcons
            name="newspaper-variant-multiple-outline"
            color={theme.theme == "dark" ? theme.purpleLight : theme.purple}
            size={28}
            style={{
              height: 28,
              width: 28,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        </Pressable>
        <Text style={s.quickButtonText}>Activity</Text>
      </View>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
    },
    title: {
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
    xButton2: {
      color: theme.red2,
      marginLeft: 8,
    },
    activityButton: {
      right: 60,
    },
    quickButton: {
      borderWidth: 1,
      borderColor: theme.pink2,
      padding: 10,
      marginHorizontal: 4,
      zIndex: 10,
      borderRadius: 22,
      height: 44,
      width: 44,
      alignSelf: "center",
      justifyContent: "center",
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
      backgroundColor: theme.white,
    },
    quickButtonText: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.text,
      fontSize: 12,
      lineHeight: 14,
      marginTop: 8,
      textAlign: "center",
    },
    quickButtonPressed: {
      backgroundColor: theme.indigo4,
    },
    quickButtonNotPressed: {
      backgroundColor: theme.white,
    },
    pbmText: {
      color: theme.text2,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    score: {
      fontFamily: "Nunito-SemiBold",
    },
    date: {
      paddingTop: 6,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Regular",
    },
    italic: {
      fontFamily: "Nunito-Italic",
      color: theme.text3,
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    username: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.pink1,
      fontFamily: "Nunito-SemiBold",
    },
    machineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
    },
    flexi: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "space-around",
    },
    list: {
      padding: 10,
      borderRadius: 15,
      marginVertical: 8,
      marginHorizontal: 20,
      borderWidth: 0,
      backgroundColor: theme.white,
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
    problem: {
      textAlign: "center",
      color: theme.text,
      fontFamily: "Nunito-Bold",
      marginTop: 20,
    },
    textContainer: {
      width: "85%",
    },
    filterView: {
      backgroundColor: theme.base3,
      marginBottom: 10,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    filter: {
      fontSize: 14,
      textAlign: "center",
      color: theme.text,
      fontFamily: "Nunito-Bold",
      paddingVertical: 8,
    },
  });

LocationActivity.propTypes = {
  query: PropTypes.object,
  locationId: PropTypes.number,
  style: PropTypes.object,
  clearLocationActivityFilter: PropTypes.func,
};

const mapStateToProps = ({ query }) => ({ query });
const mapDispatchToProps = (dispatch) => ({
  clearLocationActivityFilter: () => dispatch(clearLocationActivityFilter()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationActivity);
