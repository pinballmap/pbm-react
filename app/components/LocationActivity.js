import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";

const moment = require("moment");

const LocationActivity = ({
  user,
  query,
  clearLocationActivityFilter,
  locationId,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const navigation = useNavigation();
  const [locationActivityModalOpen, setLocationActivityModalOpen] =
    useState(false);
  const [locationActivityLoading, setLocationActivityLoading] = useState(true);
  const { selectedLocationActivities = [] } = query;
  const [recentActivity, setRecentActivity] = useState([]);
  const [page, setPage] = useState(1);
  const [pagy, setPagy] = useState(null);
  const scrollViewRef = useRef(null);
  const filtersChangedRef = useRef(false);
  const { id: userId, loggedIn } = user;

  const yourActivitySelected =
    loggedIn && selectedLocationActivities.includes("your_activity");

  const buildSubmissionTypeParam = (activities) => {
    const types = activities.filter((a) => a !== "your_activity");
    return types.length
      ? types.map((a) => `&submission_type[]=${a}`).join("")
      : "";
  };

  useEffect(() => {
    if (locationActivityModalOpen) {
      setLocationActivityLoading(true);
      setPage(1);
      setPagy(null);
      const submissionTypeParam = buildSubmissionTypeParam(
        selectedLocationActivities,
      );
      const restrictTo = yourActivitySelected ? "" : "restrict_to=new_msx&";
      getData(
        `/user_submissions/location.json?id=${locationId}&${restrictTo}limit=50&page=1${submissionTypeParam}${loggedIn ? `&user_id=${userId}` : ""}`,
      )
        .then((data) => {
          setLocationActivityLoading(false);
          setRecentActivity(data.user_submissions ?? []);
          setPagy(data.pagy ?? null);
        })
        .catch(() => {
          setLocationActivityLoading(false);
          setRecentActivity([]);
        });
    }
  }, [locationActivityModalOpen]);

  useEffect(() => {
    if (!filtersChangedRef.current) {
      filtersChangedRef.current = true;
      return;
    }
    if (locationActivityModalOpen) {
      setLocationActivityLoading(true);
      setPage(1);
      const submissionTypeParam = buildSubmissionTypeParam(
        selectedLocationActivities,
      );
      const restrictTo = yourActivitySelected ? "" : "restrict_to=new_msx&";
      getData(
        `/user_submissions/location.json?id=${locationId}&${restrictTo}limit=50&page=1${submissionTypeParam}${loggedIn ? `&user_id=${userId}` : ""}`,
      )
        .then((data) => {
          setLocationActivityLoading(false);
          setRecentActivity(data.user_submissions ?? []);
          setPagy(data.pagy ?? null);
        })
        .catch(() => {
          setLocationActivityLoading(false);
          setRecentActivity([]);
        });
    }
  }, [selectedLocationActivities]);

  const goToPage = (newPage) => {
    setLocationActivityLoading(true);
    setPage(newPage);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    const submissionTypeParam = buildSubmissionTypeParam(
      selectedLocationActivities,
    );
    const restrictTo = yourActivitySelected ? "" : "restrict_to=new_msx&";
    getData(
      `/user_submissions/location.json?id=${locationId}&${restrictTo}limit=50&page=${newPage}${submissionTypeParam}${loggedIn ? `&user_id=${userId}` : ""}`,
    )
      .then((data) => {
        setLocationActivityLoading(false);
        setRecentActivity(data.user_submissions ?? []);
        setPagy(data.pagy ?? null);
      })
      .catch(() => {
        setLocationActivityLoading(false);
        setRecentActivity([]);
      });
  };

  const getText = (activity) => {
    const {
      submission_type,
      submission,
      high_score,
      machine_name,
      user_name,
      user_id,
      comment,
      created_at,
      user_operator_id,
      location_operator_id,
      admin_title,
      contributor_rank,
    } = activity;
    const time = moment(created_at).format("LL");
    let contributor_icon;
    if (contributor_rank == "Super Mapper") {
      contributor_icon = require("../assets/images/SuperMapper.png");
    } else if (contributor_rank == "Legendary Mapper") {
      contributor_icon = require("../assets/images/LegendaryMapper.png");
    } else if (contributor_rank == "Grand Champ Mapper") {
      contributor_icon = require("../assets/images/GrandChampMapper.png");
    }
    const timeAndUser = user_name ? (
      <Text style={s.date}>
        <Text style={s.italic}>{time}</Text> by{" "}
        <Text
          style={s.username}
          onPress={() => {
            if (user_id) {
              setLocationActivityModalOpen(false);
              navigation.navigate("UserProfilePublic", {
                userId: user_id,
                username: user_name,
              });
            }
          }}
        >
          {user_name}
        </Text>
        <View
          style={{
            height: 14,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {!!admin_title && (
            <MaterialCommunityIcons
              name="shield-account"
              size={15}
              style={s.rankIcon}
              color={theme.shield}
            />
          )}
          {!!contributor_rank && (
            <Image
              contentFit="contain"
              source={contributor_icon}
              style={s.rankIcon}
              contentPosition="bottom"
            />
          )}
          {!!user_operator_id && user_operator_id === location_operator_id && (
            <MaterialCommunityIcons
              name="wrench"
              style={[s.rankIcon, s.operatorIcon]}
              size={15}
              color={theme.wrench}
            />
          )}
        </View>
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
            <Text style={[s.pbmText, s.marginB8]}>{`"${comment}"`}</Text>
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
            <Text style={[s.pbmText, s.marginB8]}>
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
      case "add_location": {
        return (
          <View style={s.textContainer}>
            <Text style={s.pbmText}>New location added</Text>
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
                size={35}
                onPress={() => setLocationActivityModalOpen(false)}
                style={s.xButton}
              />
            </View>
          </Pressable>
          <ScrollView ref={scrollViewRef} style={{ height: "80%" }}>
            <Pressable>
              {selectedLocationActivities.length ? (
                <View style={s.filterView}>
                  <Text style={s.filter}>Clear filters</Text>
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
                    if (icon) {
                      activity.icon = icon;
                      return true;
                    }
                    return false;
                  })
                  .map((activity) => (
                    <View key={activity.id} style={[s.list, s.flexi]}>
                      <View style={{ width: "15%" }}>{activity.icon}</View>
                      {getText(activity)}
                    </View>
                  ))
              )}
              {pagy && pagy.pages > 1 && !locationActivityLoading && (
                <View style={s.paginationContainer}>
                  <Pressable
                    onPress={() => goToPage(page - 1)}
                    disabled={page === 1}
                    style={[s.pageButton, page === 1 && s.pageButtonInactive]}
                  >
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={22}
                      color={page === 1 ? theme.text3 : theme.text2}
                    />
                    <Text
                      style={[
                        s.pageButtonText,
                        page === 1 && s.pageButtonTextInactive,
                      ]}
                    >
                      Prev
                    </Text>
                  </Pressable>
                  <Text style={s.pageIndicator}>
                    {page} / {pagy.pages}
                  </Text>
                  <Pressable
                    onPress={() => goToPage(page + 1)}
                    disabled={!pagy.next}
                    style={[s.pageButton, !pagy.next && s.pageButtonInactive]}
                  >
                    <Text
                      style={[
                        s.pageButtonText,
                        !pagy.next && s.pageButtonTextInactive,
                      ]}
                    >
                      Next
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={22}
                      color={!pagy.next ? theme.text3 : theme.text2}
                    />
                  </Pressable>
                </View>
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
      paddingHorizontal: 70,
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
    xButton2: {
      color: theme.red2,
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
      fontSize: 15,
      fontFamily: "Nunito-Regular",
    },
    score: {
      fontFamily: "Nunito-SemiBold",
    },
    date: {
      paddingTop: 8,
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
      textDecorationLine: "underline",
    },
    machineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
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
    marginB8: {
      marginBottom: 8,
    },
    rankIcon: {
      width: 15,
      height: 15,
      marginLeft: 6,
      marginBottom: -3,
    },
    operatorIcon: {
      marginLeft: 7,
    },
    paginationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 12,
    },
    pageButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.pink2,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    pageButtonInactive: {
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base2,
      shadowOpacity: 0,
      elevation: 0,
    },
    pageButtonText: {
      color: theme.text2,
      fontFamily: "Nunito-SemiBold",
      fontSize: 14,
    },
    pageButtonTextInactive: {
      color: theme.text3,
    },
    pageIndicator: {
      color: theme.text3,
      fontFamily: "Nunito-Regular",
      fontSize: 14,
      minWidth: 40,
      textAlign: "center",
    },
  });

LocationActivity.propTypes = {
  query: PropTypes.object,
  locationId: PropTypes.number,
  style: PropTypes.object,
  clearLocationActivityFilter: PropTypes.func,
};

const mapStateToProps = ({ query, user }) => ({ query, user });
const mapDispatchToProps = (dispatch) => ({
  clearLocationActivityFilter: () => dispatch(clearLocationActivityFilter()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationActivity);
