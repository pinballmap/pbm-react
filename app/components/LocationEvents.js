import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import { ThemeContext } from "../theme-context";
import ActivityIndicator from "./ActivityIndicator";
import ConfirmationModal from "./ConfirmationModal";
import HyperlinkText from "./HyperlinkText";
import Text from "./PbmText";
import { getData } from "../config/request";
import { formatDateStr, todayStr } from "../utils/dateUtils";

const LocationEvents = ({ locationId }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  // Fetched only when the modal opens, since the location response just has a count
  useEffect(() => {
    if (!modalOpen) return;

    let cancelled = false;
    setLoading(true);
    setError(false);
    setExpandedIds([]);
    getData(`/events.json?location_id=${locationId}&start_date=${todayStr()}`)
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setEvents([]);
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [modalOpen, locationId]);

  const toggleDetails = (id) =>
    setExpandedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );

  const renderEvent = (event) => {
    const start_date = formatDateStr(event.start_date);
    const end_date = event.end_date
      ? formatDateStr(event.end_date)
      : start_date;
    const expanded = expandedIds.includes(event.id);

    return (
      <View key={event.id} style={s.card}>
        <Text style={[s.eventName, s.extraBold]}>{event.name}</Text>
        {!!event.start_date && (
          <Text style={[s.margin, s.cardText, s.bold]}>
            {start_date === end_date
              ? start_date
              : `${start_date} - ${end_date}`}
          </Text>
        )}
        {!!event.ifpa_tournament_id && (
          <Text
            style={[s.margin, s.link, s.regular]}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://www.ifpapinball.com/tournaments/view.php?t=${event.ifpa_tournament_id}`,
              )
            }
          >
            IFPA Calendar Website
          </Text>
        )}
        {!!event.external_link && (
          <Text
            style={[s.margin, s.link, s.regular]}
            onPress={() => WebBrowser.openBrowserAsync(event.external_link)}
          >
            Event Website
          </Text>
        )}
        {!!event.event_type && (
          <Text style={[s.margin, s.cardText]}>
            <Text style={s.bold}>Tournament or league?</Text>{" "}
            <Text style={s.italic}>{event.event_type}</Text>
          </Text>
        )}
        {!!event.long_desc && (
          <>
            <Pressable
              style={({ pressed }) => [
                s.detailsButton,
                pressed && s.detailsButtonPressed,
              ]}
              onPress={() => toggleDetails(event.id)}
            >
              <Text style={[s.detailsButtonText, s.bold]}>Details</Text>
              <MaterialCommunityIcons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.theme == "dark" ? theme.purpleLight : theme.purple}
              />
            </Pressable>
            {expanded && (
              <View style={s.margin}>
                <HyperlinkText text={event.long_desc} />
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <>
      <ConfirmationModal
        closeModal={() => setModalOpen(false)}
        visible={modalOpen}
        wide
        noPad
      >
        <>
          <View style={s.header}>
            <Text style={[s.title, s.extraBold]}>Upcoming Events</Text>
            <View style={s.headerButtons}>
              <MaterialCommunityIcons
                name="close-circle"
                size={35}
                onPress={() => setModalOpen(false)}
                style={s.xButton}
              />
            </View>
          </View>
          <ScrollView
            style={{ height: "80%" }}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            <Pressable>
              <Text style={[s.sourceText, s.regular]}>
                {`Events mostly come from the `}
                <Text
                  style={[s.smallLink, s.regular]}
                  onPress={() =>
                    WebBrowser.openBrowserAsync(
                      "https://www.ifpapinball.com/calendar/",
                    )
                  }
                >
                  IFPA calendar
                </Text>
              </Text>
              {loading ? (
                <ActivityIndicator />
              ) : error ? (
                <Text style={[s.problem, s.bold]}>
                  {`Something went wrong. In the meantime, you can check the `}
                  <Text
                    style={[s.smallLink, s.regular]}
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
              ) : events.length === 0 ? (
                <View>
                  <Text style={[s.problem, s.bold]}>
                    No upcoming events at this location
                  </Text>
                  <Text
                    style={[s.sourceText, s.regular, { marginVertical: 10 }]}
                  >
                    An event may have recently ended, though.
                  </Text>
                </View>
              ) : (
                events.map(renderEvent)
              )}
            </Pressable>
            {events.length > 0 && (
              <View>
                <Text
                  style={[
                    s.sourceText,
                    s.regular,
                    { marginTop: 10, marginBottom: 20 },
                  ]}
                >
                  Showing six months of events. Some IFPA events may be missing.
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      </ConfirmationModal>
      <Pressable
        style={({ pressed }) => [
          s.pillButton,
          pressed ? s.pillButtonPressed : s.pillButtonNotPressed,
        ]}
        onPress={() => setModalOpen(true)}
      >
        <MaterialIcons
          name="event-note"
          size={24}
          color={theme.theme == "dark" ? theme.purpleLight : theme.purple}
        />
        <Text style={[s.pillButtonText, s.bold]}>Upcoming events</Text>
      </Pressable>
    </>
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
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingVertical: 8,
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
    headerButtons: {
      position: "absolute",
      right: 5,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
      paddingHorizontal: 50,
    },
    xButton: {
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      textShadowColor:
        theme.theme == "dark"
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(126, 126, 145, 0.5)",
      textShadowOffset: {
        width: 0,
        height: 2,
      },
      textShadowRadius: 3.84,
    },
    pillButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      gap: 8,
      borderWidth: 1,
      borderColor: theme.pink2,
      borderRadius: 25,
      height: 44,
      paddingHorizontal: 18,
      marginVertical: 8,
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
    pillButtonPressed: {
      backgroundColor: theme.indigo4,
    },
    pillButtonNotPressed: {
      backgroundColor: theme.white,
    },
    pillButtonText: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.text,
      fontSize: 15,
    },
    sourceText: {
      textAlign: "center",
      color: theme.text3,
      fontSize: 13,
      marginBottom: 5,
      paddingHorizontal: 20,
    },
    smallLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
      fontSize: 13,
    },
    card: {
      padding: 10,
      borderRadius: 15,
      marginVertical: 8,
      marginHorizontal: 20,
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
    eventName: {
      fontSize: 18,
      lineHeight: 22,
      color: theme.purpleLight,
    },
    cardText: {
      fontSize: 15,
      color: theme.text,
    },
    margin: {
      marginTop: 10,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
    },
    detailsButton: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginTop: 10,
      paddingVertical: 4,
      paddingLeft: 12,
      paddingRight: 6,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.pink2,
    },
    detailsButtonPressed: {
      backgroundColor: theme.indigo4,
    },
    detailsButtonText: {
      fontSize: 14,
      color: theme.theme == "dark" ? theme.purpleLight : theme.purple,
    },
    problem: {
      textAlign: "center",
      color: theme.text,
      marginTop: 10,
      marginBottom: 5,
      paddingHorizontal: 20,
    },
  });

LocationEvents.propTypes = {
  locationId: PropTypes.number,
};

export default LocationEvents;
