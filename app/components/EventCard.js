import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { showLocation } from "react-native-map-link";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { ThemeContext } from "../theme-context";
import HyperlinkText from "./HyperlinkText";
import Text from "./PbmText";
import { formatEventDateRange } from "../utils/dateUtils";

// showVenue adds the venue name and address, which are redundant when the
// list is already scoped to one location
const EventCard = ({ event, expanded, onToggleDetails, showVenue }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const navigation = useNavigation();
  const isLinkedLocation = !!event.location_id && !!event.location_name;

  return (
    <View style={s.card}>
      <Text style={[s.eventName, s.extraBold]}>{event.name}</Text>
      {!!event.start_date && (
        <Text style={[s.margin, s.cardText, s.bold]}>
          {formatEventDateRange(event.start_date, event.end_date)}
        </Text>
      )}
      {showVenue &&
        (isLinkedLocation ? (
          <Text
            style={[s.margin, s.venueName, s.venueLink, s.semiBold]}
            onPress={() =>
              navigation.navigate("LocationDetails", {
                id: event.location_id,
              })
            }
          >
            {event.location_name}
          </Text>
        ) : (
          !!event.external_location_name && (
            <Text style={[s.margin, s.venueName, s.semiBold]}>
              {event.external_location_name}
            </Text>
          )
        ))}
      {showVenue && !!event.address && !isLinkedLocation && (
        <Pressable
          style={({ pressed }) => [
            s.addressRow,
            s.margin,
            pressed && s.pressed,
          ]}
          onPress={() =>
            showLocation({
              address: event.address,
              directionsMode: "car",
            })
          }
        >
          <MaterialCommunityIcons
            name="directions"
            size={22}
            color={theme.purpleLight}
            style={s.directionsIcon}
          />
          <Text style={[s.address, s.addressLink, s.semiBold]}>
            {event.address}
          </Text>
        </Pressable>
      )}
      {(!!event.ifpa_tournament_id || !!event.external_link) && (
        <View style={[s.margin, s.linkRow]}>
          {!!event.ifpa_tournament_id && (
            <Text
              style={[s.link, s.regular]}
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
              style={[s.link, s.regular]}
              onPress={() => WebBrowser.openBrowserAsync(event.external_link)}
            >
              Event Website
            </Text>
          )}
        </View>
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
            onPress={() => onToggleDetails(event.id)}
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
    card: {
      padding: 10,
      borderRadius: 15,
      marginVertical: 8,
      marginHorizontal: 20,
      backgroundColor: theme.white,
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
    venueName: {
      fontSize: 16,
      color: theme.text,
    },
    venueLink: {
      textDecorationLine: "underline",
    },
    address: {
      fontSize: 15,
      color: theme.text3,
    },
    addressRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    addressLink: {
      flexShrink: 1,
      textDecorationLine: "underline",
    },
    directionsIcon: {
      marginRight: 6,
    },
    pressed: {
      opacity: 0.8,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
    },
    linkRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: 8,
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
  });

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
  onToggleDetails: PropTypes.func.isRequired,
  showVenue: PropTypes.bool,
};

export default EventCard;
