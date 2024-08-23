import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import openMap from "react-native-open-maps";
import { ListItem, Icon } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  ConfirmationModal,
  FavoriteLocation,
  LocationActivity,
  PbmButton,
  Text,
  WarningButton,
} from "../components";
import {
  confirmLocationIsUpToDate,
  fetchLocation,
  setCurrentMachine,
  setSelectedMapLocation,
  updateMap,
} from "../actions";
import { TRIGGER_UPDATE_BOUNDS } from "../actions/types";
import {
  alphaSortNameObj,
  getDistanceWithUnit,
} from "../utils/utilityFunctions";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC);

let deviceWidth = Dimensions.get("window").width;

const moment = require("moment");

class LocationDetails extends Component {
  constructor(props) {
    super(props);

    this.scrollViewRef = React.createRef(null);
  }
  state = {
    id: this.props.route.params["id"],
    navigateToMap: false,
    detailsExpanded: false,
    showScrollToTop: false,
    confirmModalVisible: false,
  };

  setConfirmModalVisible(visible) {
    this.setState({ confirmModalVisible: visible });
  }

  scrollToTop = () => {
    this.scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    this.setState({ showScrollToTop: positionY > 150 });
  };

  getTitle = (machine, s) => (
    <Text>
      <Text style={s.machineName}>{machine.name}</Text>
      {machine.year ? (
        <Text style={[s.fontSize18, s.pink1, s.mediumFont]}>{` (${
          machine.manufacturer && machine.manufacturer + ", "
        }${machine.year})`}</Text>
      ) : null}
    </Text>
  );

  handleConfirmPress = (id, loggedIn) => {
    if (loggedIn) {
      const { email, username, authentication_token } = this.props.user;
      const body = {
        user_email: email,
        user_token: authentication_token,
      };
      this.props.confirmLocationIsUpToDate(body, id, username);
      this.setConfirmModalVisible(false);
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  onMapPress = () => {
    this.props.navigation.navigate("MapTab");
    this.setState({ navigateToMap: true });
  };

  componentWillUnmount() {
    if (!!this.props.route.params["refreshMap"]) {
      this.props.dispatch({ type: TRIGGER_UPDATE_BOUNDS });
    }

    if (this.state.navigateToMap) {
      const { lat, lon, id } = this.props.location.location;
      this.props.dispatch(updateMap(lat, lon));
      this.props.dispatch(setSelectedMapLocation(id));
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.route.params["id"] !== this.props.route.params["id"]) {
      this.setState({ id: props.route.params["id"] }, () => {
        this.props.fetchLocation(this.state.id);
      });
    }
  }

  async componentDidMount() {
    try {
      const { location } = await this.props.fetchLocation(this.state.id);
      if (location.errors) throw new Error("Unable to find location");
    } catch (e) {
      Alert.alert("Location is gone, friend.");
      this.props.navigation.goBack();
    }
    this.props.dispatch(setSelectedMapLocation(null));
    Mapbox.setTelemetryEnabled(false);
  }

  render() {
    if (
      this.props.location.isFetchingLocation ||
      !this.props.location.location.id ||
      this.props.location.addingMachineToLocation
    ) {
      return <ActivityIndicator />;
    }

    const location = this.props.location.location;
    const { operators } = this.props.operators;
    const { navigation } = this.props;
    const {
      loggedIn,
      lat: userLat,
      lon: userLon,
      locationTrackingServicesEnabled,
      unitPreference,
    } = this.props.user;
    const { website: opWebsite, name: opName } =
      operators.find((operator) => operator.id === location.operator_id) ?? {};

    const sortedMachines = alphaSortNameObj(
      location.location_machine_xrefs.map((machine) => {
        const machineDetails = this.props.machines.machines.find(
          (m) => m.id === machine.machine_id,
        );
        return { ...machineDetails, ...machine };
      }),
    );
    const {
      icon: locationIcon,
      library: iconLibrary,
      name: locationTypeName,
    } = this.props.locations.locationTypes.find(
      (type) => type.id === location.location_type_id,
    ) || {};
    const cityState = location.state
      ? `${location.city}, ${location.state}`
      : location.city;

    const dateDiff = moment().diff(moment(location.date_last_updated), "years");

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
          return (
            <View style={{ flex: 1, backgroundColor: theme.base1 }}>
              <ScrollView
                ref={this.scrollViewRef}
                onScroll={this.handleScroll}
                scrollIndicatorInsets={{ right: 1 }}
              >
                <ConfirmationModal visible={this.state.confirmModalVisible}>
                  <Text style={s.confirmText}>
                    Confirm the lineup at {location.name}?
                  </Text>
                  <PbmButton
                    title={"Confirm Lineup"}
                    onPress={() =>
                      this.handleConfirmPress(location.id, loggedIn)
                    }
                    containerStyle={s.buttonContainer}
                  />
                  <WarningButton
                    title={"Cancel"}
                    onPress={() => this.setConfirmModalVisible(false)}
                    containerStyle={s.buttonContainer}
                  />
                </ConfirmationModal>
                <View
                  style={{
                    flex: 1,
                    marginTop:
                      Platform.OS === "android"
                        ? Constants.statusBarHeight + 15
                        : Constants.statusBarHeight + 8,
                  }}
                >
                  <View style={s.mapViewContainer}>
                    <Pressable
                      style={({ pressed }) => [
                        s.directionsButton,
                        s.mapViewButton,
                        pressed
                          ? s.quickButtonPressed
                          : s.mapViewButtonNotPressed,
                      ]}
                      onPress={() => {
                        openMap({
                          end: `${location.name} ${location.city} ${
                            location.state || ""
                          } ${location.zip}`,
                        });
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"directions"}
                        color={theme.colors.text}
                        size={30}
                        style={{
                          height: 30,
                          width: 30,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        s.mapButton,
                        s.mapViewButton,
                        pressed
                          ? s.quickButtonPressed
                          : s.mapViewButtonNotPressed,
                      ]}
                      onPress={this.onMapPress}
                    >
                      <FontAwesome6
                        name={"map-location"}
                        color={theme.colors.text}
                        size={24}
                        style={{
                          height: 24,
                          width: 24,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        s.mapViewButton,
                        s.shareButton,
                        pressed
                          ? s.quickButtonPressed
                          : s.mapViewButtonNotPressed,
                      ]}
                      onPress={async () => {
                        await Share.share({
                          message: `${location.name} https://pinballmap.com/map/?by_location_id=${location.id}`,
                        });
                      }}
                    >
                      <MaterialIcons
                        name={"ios-share"}
                        color={theme.colors.text}
                        size={26}
                        style={{
                          height: 26,
                          width: 26,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>
                    <Mapbox.MapView
                      scaleBarEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                      logoEnabled={false}
                      attributionPosition={{ bottom: 4, right: 0 }}
                      styleURL={
                        theme.theme === "dark"
                          ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
                          : Mapbox.StyleURL.Outdoors
                      }
                      style={s.mapHeight}
                    >
                      <Mapbox.Camera
                        zoomLevel={11}
                        centerCoordinate={[
                          Number(location.lon),
                          Number(location.lat),
                        ]}
                        animationMode="none"
                        animationDuration={0}
                      />
                      <Mapbox.PointAnnotation
                        id="userLocation"
                        coordinate={[
                          Number(location.lon),
                          Number(location.lat),
                        ]}
                      >
                        <View style={s.markerDot}>
                          <Text
                            maxFontSizeMultiplier={1}
                            style={{
                              fontFamily: "Nunito-ExtraBold",
                              color: "#f5f5ff",
                              fontSize: 20,
                              marginTop: Platform.OS === "android" ? -2 : 1,
                            }}
                          >
                            {location.num_machines}
                          </Text>
                        </View>
                      </Mapbox.PointAnnotation>
                    </Mapbox.MapView>
                  </View>

                  <View style={s.locationOuterContainer}>
                    <View style={s.locationContainer}>
                      <View style={s.locationNameContainer}>
                        <View style={s.nameItem}>
                          <Text style={s.locationName}>{location.name}</Text>
                        </View>
                        <View style={s.heartItem}>
                          <FavoriteLocation
                            locationId={location.id}
                            navigation={navigation}
                            removeFavorite={(cb) => cb()}
                          />
                        </View>
                      </View>
                      <View style={s.locationMetaContainer}>
                        <Text style={[s.text2, s.fontSize15, s.marginRight]}>
                          {location.street}, {cityState} {location.zip}
                        </Text>

                        {location.location_type_id ||
                        locationTrackingServicesEnabled ? (
                          <View
                            style={[
                              {
                                justifyContent: "space-around",
                                marginTop: 10,
                                marginBottom: 10,
                              },
                              s.row,
                            ]}
                          >
                            {locationTrackingServicesEnabled && (
                              <View style={[s.row]}>
                                <MaterialCommunityIcons
                                  name="compass-outline"
                                  style={s.distanceIcon}
                                />
                                <Text
                                  style={[
                                    { fontSize: 15, color: theme.text3 },
                                    s.mediumFont,
                                  ]}
                                >
                                  {getDistanceWithUnit(
                                    userLat,
                                    userLon,
                                    location.lat,
                                    location.lon,
                                    unitPreference,
                                  )}
                                </Text>
                              </View>
                            )}

                            {location.location_type_id && (
                              <View style={[s.row]}>
                                <Icon
                                  name={locationIcon}
                                  type={iconLibrary}
                                  color={theme.purple}
                                  size={24}
                                />
                                <Text
                                  style={[
                                    {
                                      marginLeft: 5,
                                      fontSize: 15,
                                      color: theme.text3,
                                    },
                                    s.mediumFont,
                                  ]}
                                >
                                  {locationTypeName}
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : null}

                        {location.phone ||
                        location.website ||
                        opName ||
                        location.description ? (
                          <ListItem.Accordion
                            containerStyle={s.accordionContainer}
                            icon={
                              <Icon
                                name={"chevron-down"}
                                type="material-community"
                                color={theme.purple}
                              />
                            }
                            content={
                              <>
                                <ListItem.Content>
                                  <ListItem.Title
                                    style={[
                                      {
                                        color: theme.text2,
                                        fontFamily: "Nunito-SemiBold",
                                      },
                                      s.fontSize15,
                                    ]}
                                  >
                                    Location details
                                  </ListItem.Title>
                                </ListItem.Content>
                              </>
                            }
                            isExpanded={this.state.detailsExpanded}
                            onPress={() =>
                              this.setState({
                                detailsExpanded: !this.state.detailsExpanded,
                              })
                            }
                          >
                            {location.phone ? (
                              <View style={[s.row, s.marginB]}>
                                <MaterialIcons
                                  name="local-phone"
                                  style={s.metaIcon}
                                />
                                <Text
                                  style={[s.fontSize14, s.link]}
                                  onPress={() =>
                                    Linking.openURL(`tel://${location.phone}`)
                                  }
                                >
                                  {location.phone}
                                </Text>
                              </View>
                            ) : null}

                            {location.website ? (
                              <View style={[s.row, s.marginB]}>
                                <MaterialCommunityIcons
                                  name="web"
                                  style={s.metaIcon}
                                />
                                <Text
                                  style={[s.fontSize14, s.link]}
                                  onPress={() =>
                                    WebBrowser.openBrowserAsync(
                                      location.website,
                                    )
                                  }
                                >
                                  Website
                                </Text>
                              </View>
                            ) : null}

                            {!!opName && (
                              <View style={[s.row, s.marginB]}>
                                <MaterialCommunityIcons
                                  name="wrench-outline"
                                  style={s.metaIcon}
                                />
                                <Text
                                  style={[s.text, s.fontSize15, s.marginRight]}
                                >
                                  Operator:{" "}
                                  <Text
                                    style={opWebsite ? s.link : s.text3}
                                    onPress={
                                      opWebsite
                                        ? () =>
                                            WebBrowser.openBrowserAsync(
                                              opWebsite,
                                            )
                                        : null
                                    }
                                  >
                                    {opName}
                                  </Text>
                                </Text>
                              </View>
                            )}

                            {location.description ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "top",
                                  paddingRight: 5,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="notebook-outline"
                                  style={s.metaIcon}
                                />
                                <Text
                                  style={[
                                    s.text3,
                                    s.fontSize14,
                                    s.marginB,
                                    s.marginRight,
                                  ]}
                                >
                                  {location.description}
                                </Text>
                              </View>
                            ) : null}
                          </ListItem.Accordion>
                        ) : null}

                        {!!location.date_last_updated && (
                          <View style={[s.row, s.marginB]}>
                            <MaterialCommunityIcons
                              name="clock-time-four-outline"
                              style={s.metaIcon}
                            />
                            <Text style={[s.text3, s.fontSize15, s.italic]}>
                              Updated:{" "}
                              <Text style={s.text3}>
                                <Text style={s.italic}>
                                  {moment(
                                    location.date_last_updated,
                                    "YYYY-MM-DD",
                                  ).format("MMM DD, YYYY")}
                                </Text>
                                {location.last_updated_by_username && ` by`}
                                <Text
                                  style={{
                                    fontFamily: "Nunito-SemiBold",
                                    color: theme.pink1,
                                  }}
                                >{` ${location.last_updated_by_username}`}</Text>
                              </Text>
                            </Text>
                          </View>
                        )}

                        <View style={s.quickButtonContainer}>
                          <View style={s.quickButtonSubContainer}>
                            <Pressable
                              style={({ pressed }) => [
                                s.quickButton,
                                pressed
                                  ? s.quickButtonPressed
                                  : s.quickButtonNotPressed,
                              ]}
                              onPress={() =>
                                loggedIn
                                  ? navigation.navigate("FindMachine")
                                  : navigation.navigate("Login")
                              }
                            >
                              <MaterialCommunityIcons
                                name={"plus-outline"}
                                color={theme.text2}
                                size={30}
                                style={{
                                  height: 30,
                                  width: 30,
                                  justifyContent: "center",
                                  alignSelf: "center",
                                }}
                              />
                            </Pressable>
                            <Text style={s.quickButtonText}>Add machine</Text>
                          </View>
                          <LocationActivity locationId={location.id} />
                          <View style={s.quickButtonSubContainer}>
                            <Pressable
                              style={({ pressed }) => [
                                s.quickButton,
                                pressed
                                  ? s.quickButtonPressed
                                  : s.quickButtonNotPressed,
                              ]}
                              onPress={() => this.setConfirmModalVisible(true)}
                            >
                              <MaterialCommunityIcons
                                name={"check-outline"}
                                color={theme.text2}
                                size={26}
                                style={{
                                  height: 26,
                                  width: 26,
                                  justifyContent: "center",
                                  alignSelf: "center",
                                }}
                              />
                            </Pressable>
                            <Text style={s.quickButtonText}>
                              Confirm lineup
                            </Text>
                          </View>
                          <View style={s.quickButtonSubContainer}>
                            <Pressable
                              style={({ pressed }) => [
                                s.quickButton,
                                pressed
                                  ? s.quickButtonPressed
                                  : s.quickButtonNotPressed,
                              ]}
                              onPress={() => {
                                if (loggedIn) {
                                  navigation.navigate("EditLocationDetails");
                                } else {
                                  navigation.navigate("Login");
                                }
                              }}
                            >
                              <MaterialCommunityIcons
                                name={"pencil-outline"}
                                color={theme.text2}
                                size={30}
                                style={{
                                  height: 30,
                                  width: 30,
                                  justifyContent: "center",
                                  alignSelf: "center",
                                }}
                              />
                            </Pressable>
                            <Text style={s.quickButtonText}>Edit location</Text>
                          </View>
                        </View>
                      </View>

                      {dateDiff >= 2 && (
                        <View style={s.staleView}>
                          <Text
                            style={s.staleText}
                          >{`Last updated over ${dateDiff} years ago! The listing may be out of date. Please remove the machines if they're gone.`}</Text>
                        </View>
                      )}
                    </View>
                    <View style={s.backgroundColor}>
                      {sortedMachines.map((machine) => (
                        <Pressable
                          key={machine.id}
                          onPress={() => {
                            navigation.navigate("MachineDetails", {
                              machineName: machine.name,
                            });
                            this.props.setCurrentMachine(machine.id);
                          }}
                        >
                          {({ pressed }) => (
                            <View
                              style={[
                                s.machineListContainer,
                                pressed ? s.pressed : s.notPressed,
                              ]}
                            >
                              {this.getTitle(machine, s)}
                              {machine.created_at != machine.updated_at ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 6,
                                  }}
                                >
                                  <MaterialCommunityIcons
                                    name="clock-time-four-outline"
                                    style={s.metaIcon}
                                  />
                                  <Text style={s.updated}>
                                    {`Updated: ${moment(
                                      machine.updated_at,
                                    ).format("MMM DD, YYYY")}`}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 6,
                                  }}
                                >
                                  <MaterialCommunityIcons
                                    name="clock-time-three-outline"
                                    style={s.metaIcon}
                                  />
                                  <Text style={s.updated}>
                                    {`Added: ${moment(
                                      machine.created_at,
                                    ).format("MMM DD, YYYY")}`}
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>
              {this.state.showScrollToTop && (
                <Pressable onPress={this.scrollToTop} style={s.upButton}>
                  <FontAwesome6 name="arrow-up" size={32} color={theme.white} />
                </Pressable>
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
    mapViewContainer: {
      marginTop:
        Platform.OS === "android"
          ? -Constants.statusBarHeight - 15
          : -Constants.statusBarHeight - 8,
      height: 200,
      width: "100%",
    },
    mapHeight: {
      height: "115%",
    },
    backgroundColor: {
      backgroundColor: theme.base1,
    },
    locationOuterContainer: {
      flex: 3,
      backgroundColor: theme.base1,
      marginBottom: 10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    locationContainer: {
      marginHorizontal: 15,
      marginBottom: 10,
    },
    locationNameContainer: {
      marginTop: 15,
      marginBottom: 5,
      marginLeft: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    locationName: {
      fontFamily: "Nunito-Black",
      fontSize: deviceWidth < 325 ? 24 : 28,
      lineHeight: deviceWidth < 325 ? 30 : 34,
      color: theme.theme == "dark" ? theme.purpleLight : theme.pink1,
    },
    machineListContainer: {
      borderRadius: 25,
      marginBottom: 20,
      marginRight: 20,
      marginLeft: 20,
      backgroundColor: theme.white,
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: theme.theme == "dark" ? 0.6 : 0.4,
      shadowRadius: 6,
      paddingVertical: 10,
      paddingLeft: 15,
      paddingRight: 15,
    },
    pressed: {
      borderColor: theme.pink2,
      borderWidth: 2,
      shadowColor: "transparent",
      opacity: 0.8,
      elevation: 0,
    },
    notPressed: {
      borderColor: "transparent",
      borderWidth: 2,
      opacity: 1.0,
      elevation: 6,
    },
    machineName: {
      color: theme.theme == "dark" ? theme.text : theme.purple,
      fontFamily: "Nunito-ExtraBold",
      fontSize: 20,
    },
    locationMetaContainer: {
      paddingTop: 0,
      paddingBottom: 0,
      marginHorizontal: 5,
      flex: 1,
    },
    quickButtonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    quickButtonSubContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "25%",
    },
    fontSize14: {
      fontSize: 14,
    },
    fontSize15: {
      fontSize: 15,
    },
    fontSize18: {
      fontSize: 18,
    },
    bold: {
      fontFamily: "Nunito-Bold",
    },
    mediumFont: {
      fontFamily: "Nunito-Medium",
    },
    marginB: {
      marginTop: Platform.OS === "android" ? 2 : 0,
      marginBottom: 10,
    },
    marginRight: {
      marginRight: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
    text: {
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
    text2: {
      color: theme.text2,
      fontFamily: "Nunito-Regular",
    },
    text3: {
      color: theme.text3,
      fontFamily: "Nunito-Regular",
    },
    pink1: {
      color: theme.theme == "dark" ? theme.pink1 : theme.text3,
      fontFamily: "Nunito-Regular",
    },
    italic: {
      fontFamily: "Nunito-Italic",
    },
    staleView: {
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: theme.red3,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    staleText: {
      color: theme.red2,
      fontFamily: "Nunito-Regular",
    },
    logo: {
      resizeMode: "contain",
      borderColor: "#fdd4d7",
      borderWidth: 10,
      borderRadius: 15,
    },
    logoWrapper: {
      paddingTop: 20,
      justifyContent: "center",
      alignItems: "center",
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
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      backgroundColor: theme.white,
    },
    quickButtonText: {
      color: theme.text2,
      fontSize: 12,
      lineHeight: 14,
      marginTop: 8,
      textAlign: "center",
    },
    mapViewButton: {
      padding: 10,
      zIndex: 10,
      borderRadius: 20,
      height: 40,
      width: 40,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    directionsButton: {
      position: "absolute",
      right: 10,
      top:
        Platform.OS == "ios"
          ? Constants.statusBarHeight
          : Constants.statusBarHeight + 7,
    },
    mapButton: {
      position: "absolute",
      right: 60,
      top:
        Platform.OS == "ios"
          ? Constants.statusBarHeight
          : Constants.statusBarHeight + 7,
    },
    shareButton: {
      position: "absolute",
      right: 110,
      top:
        Platform.OS == "ios"
          ? Constants.statusBarHeight
          : Constants.statusBarHeight + 7,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
    },
    distanceIcon: {
      fontSize: 22,
      color: theme.colors.inactiveTab,
      marginRight: 3,
      opacity: 0.6,
    },
    nameItem: {
      flex: 1,
      justifyContent: "center",
    },
    heartItem: {
      justifyContent: "center",
      height: 34,
      width: 34,
      marginRight: 10,
    },
    markerDot: {
      width: 52,
      height: 30,
      borderRadius: 15,
      borderWidth: 0,
      backgroundColor: "#ae57cf",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -20,
      color: theme.red2,
    },
    quickButtonPressed: {
      backgroundColor: theme.indigo4,
    },
    quickButtonNotPressed: {
      backgroundColor: theme.white,
    },
    mapViewButtonNotPressed: {
      backgroundColor:
        theme.theme == "dark"
          ? "rgba(29, 28, 28, 0.5)"
          : "rgba(255,255,255,.5)",
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purpleLight,
      fontFamily: "Nunito-Bold",
    },
    updated: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
    },
    accordionContainer: {
      paddingVertical: 3,
      paddingright: 8,
      paddingLeft: 15,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 5,
      marginBottom: 15,
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      justifyContent: "center",
      borderRadius: 15,
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
    },
    upButton: {
      justifyContent: "center",
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      position: "absolute",
      right: 25,
      bottom: 25,
      backgroundColor: theme.purple,
      padding: 10,
      borderRadius: 15,
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
  });

LocationDetails.propTypes = {
  confirmLocationIsUpToDate: PropTypes.func,
  fetchLocation: PropTypes.func,
  location: PropTypes.object,
  locations: PropTypes.object,
  operators: PropTypes.object,
  machines: PropTypes.object,
  user: PropTypes.object,
  setCurrentMachine: PropTypes.func,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({
  application,
  location,
  locations,
  operators,
  machines,
  user,
}) => ({ application, location, locations, operators, machines, user });
const mapDispatchToProps = (dispatch) => ({
  fetchLocation: (url) => dispatch(fetchLocation(url)),
  confirmLocationIsUpToDate: (body, id, username) =>
    dispatch(confirmLocationIsUpToDate(body, id, username)),
  setCurrentMachine: (id) => dispatch(setCurrentMachine(id)),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails);
