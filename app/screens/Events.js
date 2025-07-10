import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, ButtonGroup } from "../components";
import { getIfpaData } from "../config/request";
import * as WebBrowser from "expo-web-browser";
import { FlashList } from "@shopify/flash-list";
import { boundsToCoords } from "../utils/utilityFunctions";
import { useTheme } from "@react-navigation/native";

const moment = require("moment");

Geocode.setApiKey(process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY);

export const Events = ({ locations, query, user }) => {
  const [gettingEvents, setGettingEvents] = useState(true);
  const [refetchingEvents, setRefetchingEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(false);
  const addressRef = useRef("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [radius, setRadius] = useState(50);

  const theme = useTheme();
  const s = getStyles(theme);

  const { lat, lon } = user;
  const { neLat, neLon, swLat, swLon } = query;
  const distanceUnit = user.unitPreference ? "kilometers" : "miles";
  const buttons = [
    `50 ${distanceUnit}`,
    `150 ${distanceUnit}`,
    `250 ${distanceUnit}`,
  ];

  const updateIdx = (selectedIdx) => {
    const radiusArray = [50, 150, 250];
    const radius = radiusArray[selectedIdx];
    setSelectedIdx(selectedIdx);
    setRadius(radius);
    setRefetchingEvents(true);
    fetchEvents(radius);
  };

  const fetchEvents = async (radius) => {
    try {
      const data = await getIfpaData(
        addressRef.current,
        radius,
        user.unitPreference ? "k" : "m",
      );
      setError(false);
      setEvents(data.calendar ? data.calendar : []);
      setGettingEvents(false);
      setRefetchingEvents(false);
    } catch (e) {
      setError(true);
      setGettingEvents(false);
      setRefetchingEvents(false);
    }
  };

  useEffect(() => {
    const { lat: mapLat, lon: mapLon } = boundsToCoords({
      neLat,
      neLon,
      swLat,
      swLon,
    });
    const { mapLocations = [] } = locations;

    let promise;
    if (
      mapLocations.length > 0 &&
      mapLocations[0].city &&
      mapLocations[0].state
    ) {
      let address = `${mapLocations[0].city}, ${mapLocations[0].state}`;
      promise = () => Promise.resolve(address);
    } else {
      promise = () =>
        Geocode.fromLatLng(
          mapLat !== null ? mapLat : lat,
          mapLon !== null ? mapLon : lon,
        ).then(
          (response) => response.results[0].formatted_address,
          (error) => {
            throw error;
          },
        );
    }

    promise()
      .then((address) => {
        addressRef.current = address;
        fetchEvents(50);
      })
      .catch(() => {
        setError(true);
        setGettingEvents(false);
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
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
        <>
          <View style={s.header}>
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
          {refetchingEvents ? (
            <ActivityIndicator />
          ) : events.length > 0 ? (
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
                  International Flipper Pinball Association
                </Text>
              </Text>
              <FlashList
                data={events}
                estimatedItemSize={214}
                renderItem={({ item }) => {
                  const start_date = moment(
                    item.start_date,
                    "YYYY-MM-DD",
                  ).format("MMM DD, YYYY");
                  const end_date = moment(item.end_date, "YYYY-MM-DD").format(
                    "MMM DD, YYYY",
                  );
                  return (
                    <Pressable
                      style={({ pressed }) => [
                        {},
                        s.cardContainer,
                        pressed ? s.pressed : s.notPressed,
                      ]}
                      onPress={() => WebBrowser.openBrowserAsync(item.website)}
                    >
                      <Text style={[s.margin, s.padding, s.locationName]}>
                        {item.tournament_name}
                      </Text>
                      <Text style={[s.center, s.cardTextStyle]}>
                        {item.start_date === item.end_date ? (
                          <Text style={s.bold}>{start_date}</Text>
                        ) : (
                          <Text style={s.bold}>
                            {start_date} - {end_date}
                          </Text>
                        )}
                      </Text>
                      <Text style={[s.cardTextStyle, s.margin, s.padding]}>
                        {item.details.substring(0, 100)}
                        {item.details.length > 99 ? "..." : ""}
                      </Text>
                      <Text style={[s.address, s.margin, s.padding]}>
                        {item.address1}
                        {(item.city.length > 0) & (item.address1.length > 0) ? (
                          <Text>, </Text>
                        ) : (
                          ""
                        )}
                        {item.city}
                        {item.state.length > 0 ? (
                          <Text>, {item.state}</Text>
                        ) : (
                          ""
                        )}
                      </Text>
                    </Pressable>
                  );
                }}
                keyExtractor={(event) => `${event.calendar_id}`}
              />
            </View>
          ) : (
            <Text
              style={s.problem}
            >{`No IFPA-sanctioned events found within ${radius} ${distanceUnit} of current map location.`}</Text>
          )}
        </>
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
    header: {
      paddingVertical: 10,
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
      paddingHorizontal: 10,
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
  });

const mapStateToProps = ({ locations, query, user }) => ({
  locations,
  query,
  user,
});
export default connect(mapStateToProps)(Events);
