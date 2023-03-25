import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ActivityIndicator from "./ActivityIndicator";
import Text from "./PbmText";
import ConfirmationModal from "./ConfirmationModal";
import { getData } from "../config/request";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import getActivityIcon from "../utils/getActivityIcon";
const moment = require("moment");

const LocationActivity = ({ locationId }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [locationActivityModalOpen, setLocationActivityModalOpen] =
    useState(false);
  const [locationActivityLoading, setLocationActivityLoading] = useState(true);
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
        {time} by <Text style={s.pink}>{user_name}</Text>
      </Text>
    ) : (
      <Text style={s.date}>{time}</Text>
    );
    switch (submission_type) {
      case "new_lmx": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              <Text style={s.purple}>{machine_name}</Text> added
            </Text>
            {timeAndUser}
          </View>
        );
      }
      case "new_condition": {
        if (!comment)
          return (
            <View style={s.textContainer}>
              <Text style={s.pbmText}>{submission}</Text>
              <Text style={s.date}>{time}</Text>
            </View>
          );
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>{`"${comment}"`}</Text>
            <Text style={s.purple}>{machine_name}</Text>
            {timeAndUser}
          </View>
        );
      }
      case "remove_machine": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>
              <Text style={s.purple}>{machine_name}</Text> removed
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
              High score: {formatNumWithCommas(high_score)}
            </Text>
            <Text style={s.purple}>{machine_name}</Text>
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
        visible={locationActivityModalOpen}
        onRequestClose={() => {}}
        wide
        noPad
      >
        <>
          <View style={s.header}>
            <Text style={s.title}>Location Activity</Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={45}
              onPress={() => setLocationActivityModalOpen(false)}
              style={s.xButton}
            />
          </View>
          <ScrollView style={{ height: "80%" }}>
            {locationActivityLoading ? (
              <ActivityIndicator />
            ) : recentActivity.length === 0 ? (
              <Text style={s.problem}>No location activity found</Text>
            ) : (
              recentActivity
                .filter((activity) => {
                  const icon = getActivityIcon(activity.submission_type);
                  if (icon) {
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
          </ScrollView>
        </>
      </ConfirmationModal>
      <Pressable
        style={({ pressed }) => [
          s.activity,
          s.quickButton,
          pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
        ]}
        onPress={() => setLocationActivityModalOpen(true)}
      >
        <MaterialCommunityIcons
          name="newspaper-variant-outline"
          color={theme.text2}
          size={24}
          style={{
            height: 24,
            width: 24,
            justifyContent: "center",
            alignSelf: "center",
          }}
        />
      </Pressable>
    </>
  );
};

LocationActivity.propTypes = {
  loggedIn: PropTypes.bool,
  isUserFave: PropTypes.bool,
  locationId: PropTypes.number,
  addFavoriteLocation: PropTypes.func,
  removeFavoriteLocation: PropTypes.func,
  style: PropTypes.object,
  removeFavorite: PropTypes.func,
};

const getStyles = (theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      height: 40,
      justifyContent: "center",
    },
    title: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "extraBoldFont",
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -20,
      color: theme.red2,
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
      borderRadius: 18,
      height: 36,
      width: 36,
      alignSelf: "center",
      justifyContent: "center",
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      backgroundColor: theme.white,
    },
    pbmText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "regularFont",
    },
    date: {
      paddingTop: 6,
      fontSize: 16,
      color: theme.text3,
      fontFamily: "regularBoldFont",
    },
    pink: {
      color: theme.pink1,
      fontSize: 16,
      fontFamily: "regularBoldFont",
    },
    purple: {
      color: theme.purple,
      fontSize: 16,
      fontFamily: "regularBoldFont",
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
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
    },
    problem: {
      textAlign: "center",
      color: theme.text,
      fontFamily: "boldFont",
      marginTop: 20,
    },
    pressed: {
      borderColor: theme.pink2,
      borderWidth: 2,
      shadowColor: "transparent",
      opacity: 0.8,
    },
    notPressed: {
      borderColor: "transparent",
      borderWidth: 2,
      shadowColor: theme.shadow,
      opacity: 1.0,
    },
    textContainer: {
      width: "85%",
    },
  });

export default LocationActivity;
