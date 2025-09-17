import React, { useEffect, useState, useRef, createRef } from "react";
import { connect, useDispatch } from "react-redux";
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
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  ConfirmationModal,
  CustomIcon,
  FavoriteLocation,
  LocationActivity,
  PbmButton,
  ReadMore,
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
import {
  alphaSortNameObj,
  getDistanceWithUnit,
} from "../utils/utilityFunctions";
import * as WebBrowser from "expo-web-browser";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MachineCard from "../components/MachineCard";
import { formatNumWithCommas } from "../utils/utilityFunctions";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC);

let deviceWidth = Dimensions.get("window").width;

const moment = require("moment");

const LocationDetails = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const s = getStyles(theme);
  const scrollViewRef = createRef(null);
  const [locationId, setLocationId] = useState(props.route.params["id"]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const topMargin = insets.top;

  const location = props.location.location;
  const { operators } = props.operators;
  const {
    loggedIn,
    lat: userLat,
    lon: userLon,
    locationTrackingServicesEnabled,
    unitPreference,
    displayInsiderConnectedBadgePreference,
  } = props.user;
  const { website: opWebsite, name: opName } =
    operators.find((operator) => operator.id === location.operator_id) ?? {};

  const locationRef = useRef(props.location.location);
  useEffect(() => {
    locationRef.current = props.location.location;
  }, [props.location.location]);

  useEffect(() => {
    const onMount = async () => {
      try {
        const { location: l } = await dispatch(fetchLocation(locationId));
        if (l.errors) throw new Error("Unable to find location");
      } catch (e) {
        Alert.alert("Location is gone, friend.");
        navigation.goBack();
      }
      dispatch(setSelectedMapLocation(null));
      Mapbox.setTelemetryEnabled(false);
    };
    onMount();

    // component unmount
    return () => {
      if (!!route.params["refreshMap"]) {
        dispatch(updateMap(locationRef.current.lat, locationRef.current.lon));
      }
    };
  }, []);

  useEffect(() => {
    if (locationId !== route.params["id"]) {
      setLocationId(route.params["id"]);
      dispatch(fetchLocation(route.params["id"]));
    }
  }, [route.params["id"]]);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const handleConfirmPress = (id, loggedIn) => {
    if (loggedIn) {
      const { email, username, authentication_token } = props.user;
      const body = {
        user_email: email,
        user_token: authentication_token,
      };
      dispatch(confirmLocationIsUpToDate(body, id, username));
      setConfirmModalVisible(false);
    } else {
      setConfirmModalVisible(false);
      navigation.navigate("Login");
    }
  };

  const onMapPress = () => {
    dispatch(updateMap(location.lat, location.lon));
    dispatch(setSelectedMapLocation(location.id));
    navigation.navigate("MapTab");
  };

  if (
    props.location.isFetchingLocation ||
    !props.location.location.id ||
    props.location.addingMachineToLocation
  ) {
    return <ActivityIndicator />;
  }

  const sortedMachines = alphaSortNameObj(
    location.location_machine_xrefs.map((machine) => {
      const machineDetails = props.machines.machines.find(
        (m) => m.id === machine.machine_id,
      );
      return { ...machineDetails, ...machine };
    }),
  );
  const {
    icon: locationIcon,
    library: iconLibrary,
    name: locationTypeName,
  } = props.locations.locationTypes.find(
    (type) => type.id === location.location_type_id,
  ) || {};
  const cityState = location.state
    ? `${location.city}, ${location.state}`
    : location.city;

  const dateDiff = moment().diff(moment(location.date_last_updated), "years");

  const iconStyles = {
    iconImage: ["get", "icon"],
    iconSize: 0.5,
    textSize: 20,
    textField: ["get", "machine_count"],
    textColor: "#fdebfc",
    textOffset: [0, 0.05],
    textFont: ["Nunito Sans ExtraBold"],
  };
  const featureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: location.id,
        properties: {
          icon: "moreOne",
          machine_count: location.machine_count,
        },
        geometry: {
          type: "Point",
          coordinates: [Number(location.lon), Number(location.lat)],
        },
      },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <ConfirmationModal
          visible={confirmModalVisible}
          closeModal={() => setConfirmModalVisible(false)}
        >
          <Text style={s.confirmText}>
            Confirm the lineup at {location.name}?
          </Text>
          <PbmButton
            title={"Confirm Lineup"}
            onPress={() => handleConfirmPress(location.id, loggedIn)}
          />
          <WarningButton
            title={"Cancel"}
            onPress={() => setConfirmModalVisible(false)}
          />
        </ConfirmationModal>
        <View
          style={{
            flex: 1,
            marginTop: topMargin,
          }}
        >
          <View style={[{ marginTop: -topMargin }, s.mapViewContainer]}>
            <Pressable
              style={({ pressed }) => [
                [
                  { top: topMargin },
                  s.directionsButton,
                  s.mapViewButton,
                  pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
                ],
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
                color={theme.purpleLight}
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
                [
                  { top: topMargin },
                  s.mapButton,
                  s.mapViewButton,
                  pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
                ],
              ]}
              onPress={onMapPress}
            >
              <FontAwesome6
                name={"map-location"}
                color={theme.purpleLight}
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
                [
                  { top: topMargin },
                  s.shareButton,
                  s.mapViewButton,
                  pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
                ],
              ]}
              onPress={async () => {
                await Share.share({
                  message: `${location.name} https://pinballmap.com/map/?by_location_id=${location.id}`,
                });
              }}
            >
              <MaterialIcons
                name={"ios-share"}
                color={theme.purpleLight}
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
              projection="mercator"
              attributionPosition={{ bottom: 35, left: 90 }}
              logoPosition={{ bottom: 35, left: 5 }}
              styleURL={
                theme.theme === "dark"
                  ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
                  : Mapbox.StyleURL.Outdoors
              }
              style={s.mapHeight}
            >
              <Mapbox.Camera
                zoomLevel={11}
                centerCoordinate={[Number(location.lon), Number(location.lat)]}
                animationMode="none"
                animationDuration={0}
              />
              <Mapbox.ShapeSource
                id={"shape-source-id-1"}
                shape={featureCollection}
              >
                <Mapbox.SymbolLayer id={"symbol-id3"} style={iconStyles} />
                <Mapbox.Images
                  images={{
                    moreOne: require("../assets/marker-more-selected.png"),
                  }}
                />
              </Mapbox.ShapeSource>
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
                          name="compass"
                          style={s.distanceIcon}
                        />
                        <Text
                          style={[
                            {
                              marginLeft: 5,
                              fontSize: 15,
                              color: theme.text2,
                            },
                            s.bold,
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
                        <CustomIcon
                          name={locationIcon}
                          size={24}
                          color={
                            theme.theme == "dark"
                              ? theme.purpleLight
                              : theme.pink3
                          }
                          type={iconLibrary}
                        />
                        <Text
                          style={[
                            {
                              marginLeft: 5,
                              fontSize: 15,
                              color: theme.text2,
                            },
                            s.bold,
                          ]}
                        >
                          {locationTypeName}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : null}

                {location.phone ? (
                  <View style={[s.row, s.marginB]}>
                    <MaterialIcons name="local-phone" style={s.metaIcon} />
                    <Text
                      style={[s.fontSize14, s.link]}
                      onPress={() => Linking.openURL(`tel://${location.phone}`)}
                    >
                      {location.phone}
                    </Text>
                  </View>
                ) : null}

                {location.website ? (
                  <View style={[s.row, s.marginB]}>
                    <MaterialCommunityIcons name="web" style={s.metaIcon} />
                    <Text
                      style={[s.fontSize14, s.link]}
                      onPress={() =>
                        WebBrowser.openBrowserAsync(location.website)
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
                    <Text style={[s.text, s.fontSize15, s.marginRight]}>
                      <Text style={s.opacity}>Operator: </Text>
                      <Text
                        style={[s.opacity1, opWebsite ? s.link : s.text3]}
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

                {!!location.description && (
                  <View
                    style={[
                      s.marginB,
                      s.marginRight,
                      {
                        flexDirection: "row",
                        alignItems: "top",
                        paddingRight: 5,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="notebook-outline"
                      style={s.metaIcon}
                    />
                    <ReadMore
                      text={location.description}
                      style={[s.text2, s.italic, s.fontSize14, s.opacity]}
                    />
                  </View>
                )}

                {!!location.date_last_updated && (
                  <View
                    style={[
                      s.marginB,
                      s.marginRight,
                      {
                        flexDirection: "row",
                        alignItems: "top",
                        paddingRight: 5,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      style={s.metaIcon}
                    />
                    <Text style={[s.text3, s.fontSize14]}>
                      Location edited{" "}
                      {formatNumWithCommas(location.user_submissions_count)}{" "}
                      times by {formatNumWithCommas(location.users_count)}{" "}
                      users. Last updated:{" "}
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
                        s.boxShadow,
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
                        color={
                          theme.theme == "dark"
                            ? theme.purpleLight
                            : theme.purple
                        }
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
                        s.boxShadow,
                        pressed
                          ? s.quickButtonPressed
                          : s.quickButtonNotPressed,
                      ]}
                      onPress={() => setConfirmModalVisible(true)}
                    >
                      <MaterialCommunityIcons
                        name={"check-outline"}
                        color={
                          theme.theme == "dark"
                            ? theme.purpleLight
                            : theme.purple
                        }
                        size={26}
                        style={{
                          height: 26,
                          width: 26,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>
                    <Text style={s.quickButtonText}>Confirm lineup</Text>
                  </View>
                  <View style={s.quickButtonSubContainer}>
                    <Pressable
                      style={({ pressed }) => [
                        s.quickButton,
                        s.boxShadow,
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
                        color={
                          theme.theme == "dark"
                            ? theme.purpleLight
                            : theme.purple
                        }
                        size={30}
                        style={{
                          height: 30,
                          width: 30,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>
                    <Text style={s.quickButtonText}>Edit details</Text>
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
                    dispatch(setCurrentMachine(machine.id));
                  }}
                >
                  {({ pressed }) => (
                    <MachineCard
                      pressed={pressed}
                      machine={machine}
                      displayInsiderConnectedBadge={
                        displayInsiderConnectedBadgePreference
                      }
                    />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      {showScrollToTop && (
        <Pressable onPress={scrollToTop} style={[s.upButton, s.boxShadow]}>
          <FontAwesome6 name="arrow-up" size={32} color={theme.white} />
        </Pressable>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    mapViewContainer: {
      height: 200,
      width: "100%",
    },
    mapHeight: {
      height: 230,
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
    },
    boxShadow: {
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
      fontFamily: "Nunito-ExtraBold",
      fontSize: deviceWidth < 325 ? 24 : 26,
      lineHeight: deviceWidth < 325 ? 30 : 32,
      color: theme.pink1,
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
    bold: {
      fontFamily: "Nunito-Bold",
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
    italic: {
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    opacity: {
      opacity: 0.8,
    },
    opacity1: {
      opacity: 1,
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
      backgroundColor: theme.white,
    },
    quickButtonText: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.text,
      fontSize: 12,
      lineHeight: 14,
      marginTop: 8,
      textAlign: "center",
    },
    mapViewButton: {
      padding: 10,
      zIndex: 10,
      borderRadius: 20,
      height: 42,
      width: 42,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.theme == "dark" ? theme.border : theme.white,
    },
    directionsButton: {
      position: "absolute",
      right: 10,
    },
    mapButton: {
      position: "absolute",
      right: 60,
    },
    shareButton: {
      position: "absolute",
      right: 110,
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
      color: theme.theme == "dark" ? theme.purpleLight : theme.pink3,
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
          ? "rgba(29, 28, 28, 0.7)"
          : "rgba(255,255,255,.7)",
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purpleLight,
      fontFamily: "Nunito-Bold",
    },
    upButton: {
      justifyContent: "center",
      position: "absolute",
      right: 25,
      bottom: 25,
      backgroundColor: theme.purple,
      padding: 10,
      borderRadius: 15,
    },
  });

const mapStateToProps = ({
  application,
  location,
  locations,
  operators,
  machines,
  user,
}) => ({ application, location, locations, operators, machines, user });
export default connect(mapStateToProps)(LocationDetails);
