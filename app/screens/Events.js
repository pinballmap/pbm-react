import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import {
  FlatList,
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
  ScrollToTop,
} from "../components";
import { getIfpaData, getIfpaTournament } from "../config/request";
import * as WebBrowser from "expo-web-browser";
import { boundsToCoords } from "../utils/utilityFunctions";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";

import { formatDateStr } from "../utils/dateUtils";

export const Events = ({ query, user }) => {
  const [gettingEvents, setGettingEvents] = useState(true);
  const [gettingTournament, setGettingTournament] = useState(true);
  const [events, setEvents] = useState([]);
  const [tournament, setTournament] = useState([]);
  const [error, setError] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [radius, setRadius] = useState(50);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef(null);

  const theme = useTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const { neLat, neLon, swLat, swLon } = query;
  const distanceUnit = user.unitPreference ? "kilometers" : "miles";
  const distanceUnitAbbrev = user.unitPreference ? "km" : "mi";
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
                    style={[
                      s.bold,
                      {
                        textAlign: "center",
                        marginTop: 15,
                        color: theme.text2,
                      },
                    ]}
                  >
                    {`Something went wrong. In the meantime, you can check the `}
                    <Text
                      style={[s.textLink, s.regular]}
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
                  <Text style={[s.locationName, s.extraBold, { width: "90%" }]}>
                    {tournament.tournament_name.trim()}
                  </Text>
                  <Text style={[s.address, s.margin, s.semiBold]}>
                    {tournament.raw_address}
                  </Text>
                  <Text style={[s.margin, s.cardTextStyle, s.regular]}>
                    {formatDateStr(tournament.event_start_date) ===
                    formatDateStr(tournament.event_end_date) ? (
                      <Text style={s.bold}>
                        {formatDateStr(tournament.event_start_date)}
                      </Text>
                    ) : (
                      <Text style={s.bold}>
                        {formatDateStr(tournament.event_start_date)}
                        {" - "}
                        {formatDateStr(tournament.event_end_date)}
                      </Text>
                    )}
                  </Text>
                  <Text
                    style={[s.margin, s.link, s.regular]}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(
                        `https://www.ifpapinball.com/tournaments/view.php?t=${tournament.tournament_id}`,
                      )
                    }
                  >
                    IFPA Calendar Website
                  </Text>
                  <Text
                    style={[s.margin, s.link, s.regular]}
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
      {gettingEvents ? (
        <ScrollView style={{ paddingTop: 10 }}>
          <ButtonGroup
            onPress={updateIdx}
            selectedIndex={selectedIdx}
            buttons={buttons}
          />
          <View style={s.background}>
            <ActivityIndicator />
          </View>
        </ScrollView>
      ) : error ? (
        <ScrollView style={{ paddingTop: 10 }}>
          <ButtonGroup
            onPress={updateIdx}
            selectedIndex={selectedIdx}
            buttons={buttons}
          />
          <Text
            style={[
              s.bold,
              {
                textAlign: "center",
                marginTop: 15,
                color: theme.text2,
              },
            ]}
          >
            {`Something went wrong. In the meantime, you can check the `}
            <Text
              style={[s.textLink, s.regular]}
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
        </ScrollView>
      ) : (
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <FlatList
            ref={flatListRef}
            data={events}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: insets.bottom,
            }}
            ListHeaderComponent={
              <>
                <ButtonGroup
                  onPress={updateIdx}
                  selectedIndex={selectedIdx}
                  buttons={buttons}
                />
                <Text style={[s.sourceText, s.regular]}>
                  These events are brought to you by the{" "}
                  <Text
                    style={[s.smallLink, s.regular]}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(
                        "https://www.ifpapinball.com/calendar/",
                      )
                    }
                  >
                    International Flipper Pinball Association (IFPA)
                  </Text>
                </Text>
              </>
            }
            ListEmptyComponent={
              <Text
                style={[s.problem, s.bold]}
              >{`No IFPA-sanctioned events found within ${radius} ${distanceUnit} of current map location.`}</Text>
            }
            renderItem={({ item }) => {
              const tournament_id = item.tournament_id;
              const start_date = formatDateStr(item.event_start_date);
              const end_date = formatDateStr(item.event_end_date);
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
                  <Text style={[s.center, s.cardTextStyle, s.regular]}>
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
          <ScrollToTop visible={showScrollToTop} onPress={scrollToTop} />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    italic: {
      fontFamily: "Nunito",
      fontWeight: "400",
      fontStyle: "italic",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
    background: {
      padding: 30,
      backgroundColor: theme.base1,
    },
    locationName: {
      fontSize: 18,
      lineHeight: 22,
      textAlign: "left",
      color: theme.purpleLight,
    },
    margin: {
      marginTop: 10,
    },
    padding: {
      paddingBottom: 10,
    },
    problem: {
      textAlign: "center",
      color: theme.text,
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
    },
    smallLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
      fontSize: 12,
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
    },
    address: {
      fontSize: 14,
      color: theme.text3,
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
    },
  });

const mapStateToProps = ({ query, user }) => ({
  query,
  user,
});
export default connect(mapStateToProps)(Events);
