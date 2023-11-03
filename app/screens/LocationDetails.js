import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import openMap from "react-native-open-maps";
import { Avatar, ListItem, Icon } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  ConfirmationModal,
  FavoriteLocation,
  LocationActivity,
  Screen,
  Text,
} from "../components";
import {
  closeConfirmModal,
  confirmLocationIsUpToDate,
  fetchLocation,
  setCurrentMachine,
  setSelectedMapLocation,
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
  state = {
    id: this.props.route.params["id"],
    showLocationToolsModal: false,
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
    this.setShowLocationToolsModal(false);
    if (loggedIn) {
      const { email, username, authentication_token } = this.props.user;
      const body = {
        user_email: email,
        user_token: authentication_token,
      };
      this.props.confirmLocationIsUpToDate(body, id, username);
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  componentWillUnmount() {
    this.props.dispatch({ type: TRIGGER_UPDATE_BOUNDS });
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.route.params["id"] !== this.props.route.params["id"]) {
      this.setState({ id: props.route.params["id"] }, () => {
        this.props.fetchLocation(this.state.id);
      });
    }
  }

  setShowLocationToolsModal(visible) {
    this.setState({ showLocationToolsModal: visible });
  }

  componentDidMount() {
    this.props.fetchLocation(this.state.id);
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
            <View style={{ flex: 1 }}>
              <Screen>
                <ConfirmationModal visible={this.state.showLocationToolsModal}>
                  <View style={s.header}>
                    <Text style={s.filterTitle}>Location Tools</Text>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={45}
                      onPress={() => this.setShowLocationToolsModal(false)}
                      style={s.xButton}
                    />
                  </View>
                  <View>
                    <ListItem
                      containerStyle={s.backgroundColor}
                      onPress={() => {
                        if (loggedIn) {
                          navigation.navigate("FindMachine");
                          this.setShowLocationToolsModal(false);
                        } else {
                          navigation.navigate("Login");
                          this.setShowLocationToolsModal(false);
                        }
                      }}
                    >
                      <Avatar>
                        {
                          <MaterialCommunityIcons
                            name="plus-outline"
                            style={s.buttonIcon}
                          />
                        }
                      </Avatar>
                      <ListItem.Content>
                        <ListItem.Title style={[s.text3, s.bold]}>
                          Add Machine
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    <ListItem
                      containerStyle={s.backgroundColor}
                      onPress={() =>
                        this.handleConfirmPress(location.id, loggedIn)
                      }
                    >
                      <Avatar>
                        {
                          <MaterialCommunityIcons
                            name="check-outline"
                            style={s.buttonIcon}
                          />
                        }
                      </Avatar>
                      <ListItem.Content>
                        <ListItem.Title style={[s.text3, s.bold]}>
                          Confirm Line-Up
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    <ListItem
                      containerStyle={s.backgroundColor}
                      onPress={() => {
                        if (loggedIn) {
                          navigation.navigate("EditLocationDetails");
                          this.setShowLocationToolsModal(false);
                        } else {
                          navigation.navigate("Login");
                          this.setShowLocationToolsModal(false);
                        }
                      }}
                    >
                      <Avatar>
                        {
                          <MaterialCommunityIcons
                            name="pencil-outline"
                            style={s.buttonIcon}
                          />
                        }
                      </Avatar>
                      <ListItem.Content>
                        <ListItem.Title style={[s.text3, s.bold]}>
                          Edit Location Details
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    <ListItem
                      containerStyle={s.backgroundColor}
                      onPress={async () => {
                        (await Share.share({
                          message: `${location.name} https://pinballmap.com/map/?by_location_id=${location.id}`,
                        })) && this.setShowLocationToolsModal(false);
                      }}
                    >
                      <Avatar>
                        {
                          <MaterialIcons
                            name="ios-share"
                            style={s.buttonIcon}
                          />
                        }
                      </Avatar>
                      <ListItem.Content>
                        <ListItem.Title style={[s.text3, s.bold]}>
                          Share Location
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                    <ListItem
                      containerStyle={s.backgroundColor}
                      onPress={() => {
                        openMap({
                          end: `${location.name} ${location.city} ${
                            location.state || ""
                          } ${location.zip}`,
                        });
                        this.setShowLocationToolsModal(false);
                      }}
                    >
                      <Avatar>
                        {
                          <MaterialCommunityIcons
                            name="directions"
                            style={s.buttonIcon}
                          />
                        }
                      </Avatar>
                      <ListItem.Content>
                        <ListItem.Title style={[s.text3, s.bold]}>
                          Directions
                        </ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                  </View>
                </ConfirmationModal>
                <ConfirmationModal
                  visible={this.props.location.confirmModalVisible}
                >
                  <Text style={s.confirmText}>
                    {this.props.location.confirmationMessage}
                  </Text>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={45}
                    onPress={this.props.closeConfirmModal}
                    style={s.xButton}
                  />
                  <View style={s.logoWrapper}>
                    <Image
                      source={require("../assets/images/PPM-Splash-200.png")}
                      style={s.logo}
                    />
                  </View>
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
                  <View style={s.locationNameContainer}>
                    <Text style={s.locationName}>{location.name}</Text>
                  </View>
                  <View style={s.mapTypeContainer}>
                    <View
                      style={[
                        s.mapViewContainer,
                        location.location_type_id
                          ? s.mapViewContainerDuo
                          : s.mapViewContainerSolo,
                      ]}
                    >
                      <Pressable
                        style={({ pressed }) => [
                          s.directionsButton,
                          s.quickButton,
                          pressed
                            ? s.quickButtonPressed
                            : s.quickButtonNotPressed,
                        ]}
                        onPress={() => {
                          openMap({
                            end: `${location.name} ${location.city} ${
                              location.state || ""
                            } ${location.zip}`,
                          });
                          this.setShowLocationToolsModal(false);
                        }}
                      >
                        <MaterialCommunityIcons
                          name={"directions"}
                          color={theme.text2}
                          size={28}
                          style={{
                            height: 28,
                            width: 28,
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
                            : Mapbox.StyleURL.Street
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
                          <View style={s.markerDot}></View>
                        </Mapbox.PointAnnotation>
                      </Mapbox.MapView>
                    </View>
                    {location.location_type_id ? (
                      <View style={s.locationTypeContainer}>
                        {locationTrackingServicesEnabled && (
                          <View style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons
                              name="compass-outline"
                              style={s.distanceIcon}
                            />
                            <Text
                              style={[
                                s.fontSize15,
                                s.text2,
                                s.mediumFont,
                                s.opacity09,
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
                        <View
                          style={[
                            locationTrackingServicesEnabled
                              ? null
                              : s.noTrackingMargin,
                          ]}
                        >
                          <Icon
                            name={locationIcon}
                            type={iconLibrary}
                            color={theme.purple}
                            size={46}
                          />
                          <Text
                            style={[
                              { textAlign: "center" },
                              s.mediumFont,
                              s.fontSize15,
                              s.text2,
                              s.opacity09,
                            ]}
                          >
                            {locationTypeName}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View style={s.locationContainer}>
                    <View style={s.locationMetaContainer}>
                      <View style={s.locationMetaInner}>
                        <View style={s.addressContainer}>
                          <View>
                            <Text
                              style={[
                                s.text2,
                                s.bold,
                                s.fontSize15,
                                s.marginRight,
                                s.opacity09,
                              ]}
                            >
                              {location.street}
                            </Text>
                            <Text
                              style={[
                                s.text2,
                                s.bold,
                                s.fontSize15,
                                s.marginB,
                                s.marginRight,
                                s.opacity09,
                              ]}
                            >
                              {cityState} {location.zip}
                            </Text>
                          </View>
                        </View>
                        <View style={s.quickButtonContainer}>
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
                              name={"plus"}
                              color={theme.text2}
                              size={28}
                              style={{
                                height: 28,
                                width: 28,
                                justifyContent: "center",
                                alignSelf: "center",
                              }}
                            />
                          </Pressable>
                          <FavoriteLocation
                            locationId={location.id}
                            style={{ ...s.quickButton, ...s.saveButton }}
                            pressedStyle={s.quickButtonPressed}
                            notPressedStyle={s.quickButtonNotPressed}
                            navigation={navigation}
                            removeFavorite={(cb) => cb()}
                          />
                          <LocationActivity locationId={location.id} />
                        </View>
                      </View>

                      {locationTrackingServicesEnabled &&
                      !location.location_type_id ? (
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="compass-outline"
                            style={s.metaIcon}
                          />
                          <Text style={[s.fontSize14, s.text3, s.marginB]}>
                            {getDistanceWithUnit(
                              userLat,
                              userLon,
                              location.lat,
                              location.lon,
                              unitPreference,
                            )}
                          </Text>
                        </View>
                      ) : null}

                      {location.phone ? (
                        <View style={{ flexDirection: "row" }}>
                          <MaterialIcons
                            name="local-phone"
                            style={s.metaIcon}
                          />
                          <Text
                            style={[s.fontSize14, s.link, s.marginB]}
                            onPress={() =>
                              Linking.openURL(`tel://${location.phone}`)
                            }
                          >
                            {location.phone}
                          </Text>
                        </View>
                      ) : null}

                      {location.website ? (
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="web"
                            style={s.metaIcon}
                          />
                          <Text
                            style={[s.fontSize14, s.link, s.marginB]}
                            onPress={() =>
                              WebBrowser.openBrowserAsync(location.website)
                            }
                          >
                            Website
                          </Text>
                        </View>
                      ) : null}

                      {!!opName && (
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="wrench-outline"
                            style={s.metaIcon}
                          />
                          <Text
                            style={[
                              s.text,
                              s.fontSize15,
                              s.marginB,
                              s.marginRight,
                            ]}
                          >
                            Operator:{" "}
                            <Text
                              style={opWebsite ? s.link : s.text3}
                              onPress={
                                opWebsite
                                  ? () => WebBrowser.openBrowserAsync(opWebsite)
                                  : null
                              }
                            >
                              {opName}
                            </Text>
                          </Text>
                        </View>
                      )}

                      {!!location.date_last_updated && (
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="clock-time-four-outline"
                            style={s.metaIcon}
                          />
                          <Text
                            style={[
                              s.text,
                              s.fontSize15,
                              s.marginB,
                              s.marginRight,
                              s.italic,
                            ]}
                          >
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
                                  fontFamily: "semiBoldFont",
                                  color: theme.pink1,
                                }}
                              >{` ${location.last_updated_by_username}`}</Text>
                            </Text>
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        width: "100%",
                        paddingRight: 10,
                        paddingBottom: 5,
                      }}
                    >
                      {location.description ? (
                        <View style={{ flexDirection: "row", paddingRight: 5 }}>
                          <MaterialCommunityIcons
                            name="notebook-outline"
                            style={s.metaIcon}
                          />
                          <Text style={[s.text3, s.fontSize14]}>
                            {location.description}
                          </Text>
                        </View>
                      ) : null}
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
                                style={{ flexDirection: "row", marginTop: 6 }}
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
                              ""
                            )}
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                </View>
              </Screen>
              <Pressable
                style={({ pressed }) => [
                  s.toolsIconButton,
                  pressed ? s.toolsIconPressed : s.toolsIconNotPressed,
                ]}
                onPress={() => {
                  this.setShowLocationToolsModal(true);
                }}
              >
                <MaterialCommunityIcons
                  name={"menu"}
                  color={theme.white}
                  size={28}
                  style={{ justifyContent: "center", alignSelf: "center" }}
                />
              </Pressable>
            </View>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const getStyles = (theme) =>
  StyleSheet.create({
    mapTypeContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      marginHorizontal: 20,
      height: 100,
    },
    mapViewContainer: {
      borderWidth: 2,
      borderColor: theme.base4,
      borderRadius: 10,
      height: 100,
      overflow: "hidden",
    },
    mapViewContainerDuo: {
      width: "48%",
    },
    mapViewContainerSolo: {
      width: "100%",
    },
    mapHeight: {
      height: "100%",
    },
    locationTypeContainer: {
      backgroundColor: theme.white,
      borderWidth: 2,
      borderColor: theme.base4,
      borderRadius: 10,
      padding: 5,
      width: "48%",
      alignItems: "center",
      justifyContent: "center",
    },
    backgroundColor: {
      backgroundColor: theme.base1,
    },
    locationContainer: {
      flex: 3,
      marginBottom: 10,
      marginHorizontal: deviceWidth < 325 ? 20 : 25,
    },
    locationNameContainer: {
      marginLeft: Platform.OS === "android" ? 45 : 35,
      marginBottom: 0,
    },
    locationName: {
      fontFamily: "blackFont",
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
      fontFamily: "extraBoldFont",
      fontSize: 20,
    },
    locationMetaContainer: {
      paddingTop: 0,
      paddingBottom: 0,
      flex: 1,
    },
    locationMetaInner: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    addressContainer: {
      flex: 1,
    },
    quickButtonContainer: {
      width: 130,
      flexDirection: "row",
    },
    fontSize12: {
      fontSize: 12,
    },
    fontSize14: {
      fontSize: 14,
    },
    fontSize13: {
      fontSize: 13,
    },
    fontSize15: {
      fontSize: 15,
    },
    fontSize18: {
      fontSize: 18,
    },
    bold: {
      fontFamily: "boldFont",
    },
    mediumFont: {
      fontFamily: "mediumFont",
    },
    marginB: {
      marginTop: Platform.OS === "android" ? 2 : 0,
      marginBottom: 8,
    },
    marginRight: {
      marginRight: 10,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "regularFont",
    },
    text: {
      color: theme.text,
      fontFamily: "regularFont",
    },
    text2: {
      color: theme.text2,
      fontFamily: "regularFont",
    },
    text3: {
      color: theme.text3,
      fontFamily: "regularFont",
    },
    pink1: {
      color: theme.theme == "dark" ? theme.pink1 : theme.text3,
      fontFamily: "regularFont",
    },
    italic: {
      fontFamily: "regularItalicFont",
    },
    opacity09: {
      opacity: 0.9,
    },
    opacity06: {
      opacity: 0.6,
    },
    iconStyle: {
      fontSize: 32,
      color: "#97a5af",
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
      fontFamily: "regularFont",
    },
    buttonIcon: {
      color: theme.indigo4,
      opacity: 0.8,
      fontSize: 32,
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
    directionsButton: {
      position: "absolute",
      bottom: 3,
      left: 0,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
    },
    distanceIcon: {
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 3,
      opacity: 0.6,
    },
    markerDot: {
      width: 24,
      height: 24,
      borderRadius: 24 / 2,
      borderWidth: 3,
      borderColor: "#ecd0f2",
      backgroundColor: "#5f4d61",
      elevation: 1,
    },
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      height: 40,
      justifyContent: "center",
    },
    filterTitle: {
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
    toolsIconButton: {
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
      position: "absolute",
      bottom: deviceWidth < 325 ? 20 : 30,
      right: 20,
      zIndex: 100,
      alignSelf: "center",
      justifyContent: "center",
      borderRadius: 29,
      height: 58,
      width: 58,
    },
    toolsIconPressed: {
      backgroundColor: theme.base2,
    },
    toolsIconNotPressed: {
      backgroundColor: theme.pink1,
    },
    quickButtonPressed: {
      backgroundColor: theme.blue2,
    },
    quickButtonNotPressed: {
      backgroundColor: theme.white,
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purple,
      fontFamily: "boldFont",
    },
    updated: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "regularItalicFont",
    },
    noTrackingMargin: {
      marginTop: 12,
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
  closeConfirmModal: PropTypes.func,
  setCurrentMachine: PropTypes.func,
  navigation: PropTypes.object,
  updateCoordinatesAndGetLocations: PropTypes.func,
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
  closeConfirmModal: () => dispatch(closeConfirmModal()),
  setCurrentMachine: (id) => dispatch(setCurrentMachine(id)),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationDetails);
