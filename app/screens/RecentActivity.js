import React, { useContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getData } from "../config/request";
import {
  ActivityIndicator,
  ButtonGroup,
  FilterRecentActivity,
  Text,
} from "../components";
import { formatNumWithCommas, boundsToCoords } from "../utils/utilityFunctions";
import { clearActivityFilter } from "../actions";
import getActivityIcon from "../utils/getActivityIcon";

const moment = require("moment");

const RecentActivity = ({ query, clearActivityFilter, navigation, user }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [fetchingRecentActivity, setFetchingRecentActivity] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [btnIdx, setBtnIdx] = useState(0);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const { selectedActivities = [], swLat, swLon, neLat, neLon } = query;
  const { lat, lon } = boundsToCoords({ swLat, swLon, neLat, neLon });
  const distanceUnit = user.unitPreference ? "kilometers" : "miles";
  const distanceUnitAbbrev = user.unitPreference ? "ki" : "mi";
  const buttons = [
    `10 ${distanceUnitAbbrev}`,
    `50 ${distanceUnitAbbrev}`,
    `150 ${distanceUnitAbbrev}`,
  ];

  useEffect(() => {
    navigation.setOptions({ headerRight: () => <FilterRecentActivity /> });
  }, []);

  const fetchData = useCallback(
    (_, distance) => {
      // Once the recent activity screen is mounted, it never unmounts for the app. With that in mind, we typically
      // want to get a fresh request of the recent activity when the screen is focused with the exception being if the
      // user has come from navigating to a location detail screen via the recent activity list.
      // To accomplish this behavior, we have to now explicitly call fetchData when the user updates the search radius
      // and we must track if the data should be refreshed (i.e. not coming back from location details)
      if (distance || shouldRefresh) {
        setFetchingRecentActivity(true);
        getData(
          `/user_submissions/list_within_range.json?lat=${lat}&lon=${lon}&max_distance=${
            distance || maxDistance
          }`,
        ).then((data) => {
          setFetchingRecentActivity(false);
          setRecentActivity(data.user_submissions);
        });
      }
      setShouldRefresh(true);
    },
    [lat, lon, maxDistance, shouldRefresh],
  );

  useEffect(
    () => navigation.addListener("focus", fetchData),
    [navigation, lat, lon, maxDistance, shouldRefresh],
  );

  const updateIdx = (selectedIdx) => {
    const distanceMap = [10, 50, 150];
    setBtnIdx(selectedIdx);
    setMaxDistance(distanceMap[selectedIdx]);
    fetchData(null, distanceMap[selectedIdx]);
  };

  const getSubmission = (activity) => {
    const {
      submission_type,
      city_name,
      high_score,
      location_name,
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
      <Text style={[s.date, s.italic]}>{time}</Text>
    );
    switch (submission_type) {
      case "new_lmx": {
        return (
          <View style={s.textContainer}>
            <Text style={[s.pbmText, s.marginB8]}>
              <Text style={s.machineName}>{machine_name}</Text> added to{" "}
              <Text style={s.locationName}>{location_name}</Text> in {city_name}
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "new_condition": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>{`"${comment}"`}</Text>
            <Text style={[s.machineName, s.marginB8]}>{machine_name}</Text>
            <Text style={s.pbmText}>
              <Text style={s.locationName}>{location_name}</Text> in {city_name}
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "remove_machine": {
        return (
          <View style={s.textContainer}>
            <Text style={[s.pbmText, s.marginB8]}>
              <Text style={s.machineName}>{machine_name}</Text> removed from{" "}
              <Text style={s.locationName}>{location_name}</Text> in {city_name}
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "new_msx": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              High score: {formatNumWithCommas(high_score)}
            </Text>
            <Text style={[s.machineName, s.marginB8]}>{machine_name}</Text>
            <Text style={s.pbmText}>
              <Text style={s.locationName}>{location_name}</Text> in {city_name}
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "confirm_location": {
        return (
          <View style={s.textContainer}>
            <Text style={[s.pbmText, s.marginB8]}>
              Line-up confirmed at{" "}
              <Text style={s.locationName}>{location_name}</Text> in {city_name}
            </Text>
            {timeAndUser}
          </View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      <ButtonGroup
        onPress={updateIdx}
        selectedIndex={btnIdx}
        buttons={buttons}
        containerStyle={s.buttonGroupContainer}
        textStyle={s.buttonGroupInactive}
        selectedButtonStyle={s.selButtonStyle}
        selectedTextStyle={s.selTextStyle}
        innerBorderStyle={s.innerBorderStyle}
      />
      {selectedActivities.length ? (
        <View style={s.filterView}>
          <Text style={s.filter}>Clear applied filters</Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={24}
            onPress={() => clearActivityFilter()}
            style={s.xButton}
          />
        </View>
      ) : null}
      <ScrollView style={{ marginTop: 10 }}>
        {fetchingRecentActivity ? (
          <ActivityIndicator />
        ) : recentActivity.length === 0 ? (
          <Text
            style={s.problem}
          >{`No recent map edits within ${maxDistance} ${distanceUnit} of the map's current position.`}</Text>
        ) : (
          recentActivity
            .filter((activity) => {
              const submissionTypeIcon = getActivityIcon(
                activity.submission_type,
              );

              const showType = selectedActivities.length
                ? selectedActivities.find((a) => a === activity.submission_type)
                : true;

              if (submissionTypeIcon && showType) {
                activity.submissionTypeIcon = submissionTypeIcon;
                return activity;
              }
            })
            .map((activity) => (
              <Pressable
                key={activity.id}
                onPress={() => {
                  setShouldRefresh(false);
                  navigation.navigate("LocationDetails", {
                    id: activity.location_id,
                  });
                }}
              >
                {({ pressed }) => (
                  <View
                    style={[
                      s.list,
                      s.flexi,
                      pressed ? s.pressed : s.notPressed,
                    ]}
                  >
                    <View style={{ width: "15%" }}>
                      {activity.submissionTypeIcon}
                    </View>
                    {getSubmission(activity)}
                  </View>
                )}
              </Pressable>
            ))
        )}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    pbmText: {
      color: theme.text2,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    marginB8: {
      marginBottom: 8,
    },
    date: {
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
      fontFamily: "Nunito-Medium",
    },
    locationName: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
    },
    machineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    filterView: {
      backgroundColor: theme.base3,
      marginTop: 10,
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
    xButton: {
      color: theme.red2,
      marginLeft: 8,
    },
    pressed: {
      borderColor: theme.pink2,
      borderWidth: 2,
      opacity: 0.8,
      shadowOpacity: 0,
      elevation: 0,
    },
    notPressed: {
      borderColor: "transparent",
      borderWidth: 2,
      opacity: 1.0,
    },
    buttonGroupContainer: {
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
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
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    textContainer: {
      width: "85%",
    },
  });

RecentActivity.propTypes = {
  query: PropTypes.object,
  user: PropTypes.object,
  navigation: PropTypes.object,
  clearActivityFilter: PropTypes.func,
};

const mapStateToProps = ({ query, user }) => ({ query, user });
const mapDispatchToProps = (dispatch) => ({
  clearActivityFilter: () => dispatch(clearActivityFilter()),
});
export default connect(mapStateToProps, mapDispatchToProps)(RecentActivity);
