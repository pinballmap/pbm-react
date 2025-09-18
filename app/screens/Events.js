import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Text from "../components/PbmText";
import {
  ActivityIndicator,
  ButtonGroup,
  ConfirmationModal,
  HyperlinkText,
} from "../components";
import { getIfpaData, getIfpaTournament } from "../config/request";
import * as WebBrowser from "expo-web-browser";
import { FlashList } from "@shopify/flash-list";
import { boundsToCoords } from "../utils/utilityFunctions";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const moment = require("moment");

export const Events = ({ query, user }) => {
  const [gettingEvents, setGettingEvents] = useState(true);
  const [gettingTournament, setGettingTournament] = useState(true);
  const [events, setEvents] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [error, setError] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [radius, setRadius] = useState(50);

  const theme = useTheme();
  const s = getStyles(theme);

  const { neLat, neLon, swLat, swLon } = query;
  const distanceUnit = user.unitPreference ? "kilometers" : "miles";
  const distanceUnitAbbrev = user.unitPreference ? "ki" : "mi";
  const buttons = [
    `50 ${distanceUnitAbbrev}`,
    `150 ${distanceUnitAbbrev}`,
    `250 ${distanceUnitAbbrev}`,
  ];

  const { lat: mapLat, lon: mapLon } = boundsToCoords({
    neLat,
    neLon,
    swLat,
    swLon,
  });
  const [tournamentModalOpen, setTournamentModalOpen] = useState(false);

  const updateIdx = (selectedIdx) => {
    const radiusArray = [50, 150, 250];
    const radius = radiusArray[selectedIdx];
    setSelectedIdx(selectedIdx);
    setRadius(radius);
    fetchEvents(radius);
  };

  const fetchEvents = async () => {
    try {
      const data = await getIfpaData(
        radius,
        user.unitPreference ? "k" : "m",
        mapLat,
        mapLon,
      );
      setError(false);
      setEvents(data.tournaments ? data.tournaments : []);
    } catch (e) {
      setError(true);
    } finally {
      setGettingEvents(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Clear or reset data BEFORE the screen is rendered
      setEvents([]);
      setGettingEvents(true);
      fetchEvents();
    }, [radius, mapLat, mapLon, user.unitPreference]),
  );

  const fetchTournament = async (tournament_id) => {
    try {
      setGettingTournament(true);
      const data = await getIfpaTournament(tournament_id);
      setModalError(false);
      setTournament(data ? data : []);
    } catch (e) {
      setModalError(true);
    } finally {
      setGettingTournament(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      <ConfirmationModal
        visible={tournamentModalOpen}
        wide
        closeModal={() => setTournamentModalOpen(false)}
      >
        {gettingTournament ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
            }}
            style={{ height: "80%", paddingHorizontal: 10 }}
          >
            <Pressable>
              <ActivityIndicator />
            </Pressable>
          </ScrollView>
        ) : (
          <>
            <View style={{ width: "100%" }}>
              <MaterialCommunityIcons
                name="close-circle"
                size={35}
                onPress={() => setTournamentModalOpen(false)}
                style={s.xButton}
              />
            </View>
            {modalError ? (
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: "center",
                }}
                style={{ height: "80%", paddingHorizontal: 10 }}
              >
                <Pressable>
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Nunito-Bold",
                      marginTop: 15,
                      color: theme.text2,
                    }}
                  >
                    {`Something went wrong. In the meantime, you can check the `}
                    <Text
                      style={s.textLink}
                      onPress={() =>
                        WebBrowser.openBrowserAsync(
                          "https://www.ifpapinball.com/calendar/",
                        )
                      }
                    >
                      IFPA calendar
                    </Text>
                    {` on their site.`}
                  </Text>
                </Pressable>
              </ScrollView>
            ) : (
              <ScrollView style={{ height: "80%", paddingHorizontal: 10 }}>
                <Pressable>
                  <Text style={[s.locationName, { width: "90%" }]}>
                    {tournament.tournament_name.trim()}
                  </Text>
                  <Text style={[s.address, s.margin]}>
                    {tournament.raw_address}
                  </Text>
                  <Text style={[s.margin, s.cardTextStyle]}>
                    {moment(tournament.event_start_date, "YYYY-MM-DD").format(
                      "MMM DD, YYYY",
                    ) ===
                    moment(tournament.event_end_date, "YYYY-MM-DD").format(
                      "MMM DD, YYYY",
                    ) ? (
                      <Text style={s.bold}>
                        {moment(
                          tournament.event_start_date,
                          "YYYY-MM-DD",
                        ).format("MMM DD, YYYY")}
                      </Text>
                    ) : (
                      <Text style={s.bold}>
                        {moment(
                          tournament.event_start_date,
                          "YYYY-MM-DD",
                        ).format("MMM DD, YYYY")}{" "}
                        -{" "}
                        {moment(tournament.event_end_date, "YYYY-MM-DD").format(
                          "MMM DD, YYYY",
                        )}
                      </Text>
                    )}
                  </Text>
                  <Text
                    style={[s.margin, s.link]}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(
                        `https://www.ifpapinball.com/tournaments/view.php?t=${tournament.tournament_id}`,
                      )
                    }
                  >
                    IFPA Calendar Website
                  </Text>
                  <Text
                    style={[s.margin, s.link]}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(`${tournament.website}`)
                    }
                  >
                    Event Website
                  </Text>
                  <Text style={[s.margin, { marginBottom: 10 }]}>
                    <Text style={s.bold}>Tournament or league?</Text>{" "}
                    <Text style={s.italic}>{tournament.tournament_type}</Text>
                  </Text>
                  <Text style={[s.bold, { marginBottom: 10 }]}>
                    Event details:
                  </Text>
                  <HyperlinkText text={tournament.details.trim()} />
                </Pressable>
              </ScrollView>
            )}
          </>
        )}
      </ConfirmationModal>
      <View>
        <ButtonGroup
          onPress={updateIdx}
          selectedIndex={selectedIdx}
          buttons={buttons}
          containerStyle={s.buttonGroupContainer}
          textStyle={s.buttonGroupInactive}
          selectedButtonStyle={s.selButtonStyle}
          selectedTextStyle={s.selTextStyle}
          innerBorderStyle={s.innerBorderStyle}
        />
      </View>
      {gettingEvents ? (
        <View style={s.background}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Nunito-Bold",
            marginTop: 15,
            color: theme.text2,
          }}
        >
          {`Something went wrong. In the meantime, you can check the `}
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://www.ifpapinball.com/calendar/",
              )
            }
          >
            IFPA calendar
          </Text>
          {` on their site.`}
        </Text>
      ) : (
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <Text style={s.sourceText}>
            These events are brought to you by the{" "}
            <Text
              style={s.smallLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://www.ifpapinball.com/calendar/",
                )
              }
            >
              International Flipper Pinball Association (IFPA)
            </Text>
          </Text>
          <FlashList
            data={events}
            ListEmptyComponent={
              <Text
                style={s.problem}
              >{`No IFPA-sanctioned events found within ${radius} ${distanceUnit} of current map location.`}</Text>
            }
            renderItem={({ item }) => {
              const tournament_id = item.tournament_id;
              const start_date = moment(
                item.event_start_date,
                "YYYY-MM-DD",
              ).format("MMM DD, YYYY");
              const end_date = moment(item.event_end_date, "YYYY-MM-DD").format(
                "MMM DD, YYYY",
              );
              return (
                <Pressable
                  style={({ pressed }) => [
                    {},
                    s.cardContainer,
                    pressed ? s.pressed : s.notPressed,
                  ]}
                  onPress={() => {
                    fetchTournament(tournament_id);
                    setTournamentModalOpen(true);
                  }}
                >
                  <Text style={[s.padding, s.locationName]}>
                    {item.tournament_name.trim()}
                  </Text>
                  <Text style={[s.center, s.cardTextStyle]}>
                    {start_date === end_date ? (
                      <Text style={s.bold}>{start_date}</Text>
                    ) : (
                      <Text style={s.bold}>
                        {start_date} - {end_date}
                      </Text>
                    )}
                  </Text>
                  {item.raw_address.length > 0 ? (
                    <Text style={[s.address, s.margin]}>
                      {item.raw_address}
                    </Text>
                  ) : null}
                </Pressable>
              );
            }}
            keyExtractor={(event) => `${event.tournament_id}`}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      padding: 30,
      backgroundColor: theme.base1,
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
    locationName: {
      fontFamily: "Nunito-ExtraBold",
      fontSize: 22,
      lineHeight: 28,
      textAlign: "left",
      color: theme.purpleLight,
    },
    margin: {
      marginTop: 10,
    },
    padding: {
      paddingBottom: 10,
    },
    bold: {
      fontFamily: "Nunito-Bold",
    },
    problem: {
      textAlign: "center",
      color: theme.text,
      fontFamily: "Nunito-Bold",
      marginTop: 20,
      paddingHorizontal: 10,
      fontSize: 14,
    },
    sourceText: {
      textAlign: "center",
      color: theme.text3,
      fontSize: 12,
      marginTop: 0,
      marginBottom: 5,
      paddingHorizontal: 20,
      fontFamily: "Nunito-Regular",
    },
    smallLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
      fontSize: 12,
      fontFamily: "Nunito-Regular",
    },
    cardContainer: {
      borderRadius: 15,
      marginVertical: 12,
      marginHorizontal: 20,
      backgroundColor: theme.white,
      borderColor: "transparent",
      borderWidth: 2,
      padding: 10,
    },
    center: {
      textAlign: "center",
    },
    cardTextStyle: {
      fontSize: 14,
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
    address: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    pressed: {
      opacity: 0.8,
    },
    notPressed: {
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
    textLink: {
      textDecorationLine: "underline",
      color: "#7cc5ff",
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    xButton: {
      zIndex: 20,
      position: "absolute",
      top: -5,
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
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
    italic: {
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
  });

const mapStateToProps = ({ query, user }) => ({
  query,
  user,
});
export default connect(mapStateToProps)(Events);
