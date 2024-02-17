import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { ActivityIndicator } from "../components";
import { getIfpaData } from "../config/request";
import * as WebBrowser from "expo-web-browser";
import { FlashList } from "@shopify/flash-list";
import { boundsToCoords } from "../utils/utilityFunctions";

const moment = require("moment");

Geocode.setApiKey(process.env.GOOGLE_MAPS_KEY);

class Events extends Component {
  state = {
    gettingEvents: true,
    refetchingEvents: false,
    events: [],
    error: false,
    address: "",
    selectedIdx: 0,
    radius: 50,
  };

  updateIdx = (selectedIdx) => {
    const radiusArray = [50, 100, 150, 200, 250];
    const radius = radiusArray[selectedIdx];
    this.setState({ selectedIdx, radius, refetchingEvents: true });
    this.fetchEvents(radius);
  };

  fetchEvents = async (radius) => {
    const distanceUnit = this.props.user.unitPreference ? "k" : "m";
    try {
      const data = await getIfpaData(this.state.address, radius, distanceUnit);
      this.setState({
        error: false,
        events: data.calendar ? data.calendar : [],
        gettingEvents: false,
        refetchingEvents: false,
      });
    } catch (e) {
      this.setState({
        error: true,
        gettingEvents: false,
        refetchingEvents: false,
      });
    }
  };

  componentDidMount() {
    const { lat, lon } = this.props.user;
    const { neLat, neLon, swLat, swLon } = this.props.query;
    const { lat: mapLat, lon: mapLon } = boundsToCoords({
      neLat,
      neLon,
      swLat,
      swLon,
    });
    const { mapLocations = [] } = this.props.locations;

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
        this.setState({ address });
        this.fetchEvents(50);
      })
      .catch(() => this.setState({ error: true, gettingEvents: false }));
  }

  render() {
    const {
      events,
      gettingEvents,
      error,
      selectedIdx,
      radius,
      refetchingEvents,
    } = this.state;
    const distanceUnit = this.props.user.unitPreference ? "km" : "mi";
    const buttons = [
      `50 ${distanceUnit}`,
      `100 ${distanceUnit}`,
      `150 ${distanceUnit}`,
      `200 ${distanceUnit}`,
      `250 ${distanceUnit}`,
    ];

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
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
                      onPress={this.updateIdx}
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
                        extraData={this.state}
                        renderItem={({ item }) => {
                          const start_date = moment(
                            item.start_date,
                            "YYYY-MM-DD",
                          ).format("MMM DD, YYYY");
                          const end_date = moment(
                            item.end_date,
                            "YYYY-MM-DD",
                          ).format("MMM DD, YYYY");
                          return (
                            <Pressable
                              style={({ pressed }) => [
                                {},
                                s.cardContainer,
                                pressed ? s.pressed : s.notPressed,
                              ]}
                              onPress={() =>
                                WebBrowser.openBrowserAsync(item.website)
                              }
                            >
                              <Text
                                style={[s.margin, s.padding, s.locationName]}
                              >
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
                              <Text
                                style={[s.cardTextStyle, s.margin, s.padding]}
                              >
                                {item.details.substring(0, 100)}
                                {item.details.length > 99 ? "..." : ""}
                              </Text>
                              <Text style={[s.address, s.margin, s.padding]}>
                                {item.address1}
                                {(item.city.length > 0) &
                                (item.address1.length > 0) ? (
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
        }}
      </ThemeContext.Consumer>
    );
  }
}

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
      height: 40,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.base3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
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
      borderWidth: 4,
      borderColor: theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    locationName: {
      fontFamily: "Nunito-Black",
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
      color: theme.pink1,
      fontSize: 12,
      marginTop: 0,
      marginBottom: 5,
      paddingHorizontal: 20,
      fontFamily: "Nunito-Regular",
    },
    smallLink: {
      textDecorationLine: "underline",
      color: theme.purple,
      fontSize: 12,
      fontFamily: "Nunito-Regular",
    },
    cardContainer: {
      padding: 0,
      borderRadius: 15,
      marginVertical: 12,
      marginHorizontal: 20,
      backgroundColor: theme.white,
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: theme.theme == "dark" ? 0.6 : 0.4,
      shadowRadius: 6,
      elevation: 6,
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
      shadowColor: "transparent",
      opacity: 0.8,
      elevation: 0,
    },
    notPressed: {
      opacity: 1.0,
      elevation: 6,
    },
    textLink: {
      textDecorationLine: "underline",
      color: "#7cc5ff",
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
  });

Events.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  locations: PropTypes.object,
  query: PropTypes.object,
};

const mapStateToProps = ({ locations, query, user }) => ({
  locations,
  query,
  user,
});
export default connect(mapStateToProps, null)(Events);
