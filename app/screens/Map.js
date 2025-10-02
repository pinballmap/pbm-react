import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { retrieveItem } from "../config/utils";
import { sleep } from "../utils";
import { getData } from "../config/request";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  AppAlert,
  CustomMapMarkers,
  Search,
  Text,
  NoLocationTrackingModal,
  LocationBottomSheet,
} from "../components";
import {
  fetchCurrentLocation,
  getFavoriteLocations,
  clearFilters,
  clearSearchBarText,
  login,
  updateBounds,
  getLocationsByRegion,
  getLocationsConsideringZoom,
  triggerUpdateBounds,
  setSelectedMapLocation,
} from "../actions";
import { getSelectedMapLocation } from "../selectors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { coordsToBounds } from "../utils/utilityFunctions";
import { useNavigation, useTheme } from "@react-navigation/native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC);

const Map = ({
  isFetchingLocations,
  query,
  selectedLocation,
  numLocations,
  isLocationServicesEnabled,
  locationTrackingServicesEnabled,
  regions,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const _map = useRef(null);
  const theme = useTheme();
  const s = getStyles(theme);

  const [showUpdateSearch, setShowUpdateSearch] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [toCurrentLocation, setToCurrentLocation] = useState(false);
  const insets = useSafeAreaInsets();
  const topMargin = insets.top;

  const {
    swLat,
    swLon,
    neLat,
    neLon,
    machineId = false,
    locationType = false,
    numMachines = false,
    selectedOperator = false,
    viewByFavoriteLocations,
    maxZoom,
    forceTriggerUpdateBounds,
    triggerUpdateBounds: shouldTriggerUpdateBounds,
  } = query;
  const latitude = (swLat + neLat) / 2;
  const longitude = (swLon + neLon) / 2;
  const filterApplied =
    machineId ||
    locationType ||
    numMachines ||
    selectedOperator ||
    viewByFavoriteLocations
      ? true
      : false;

  useEffect(() => {
    const run = async () => {
      await dispatch(fetchCurrentLocation(true));
      Linking.addEventListener("url", ({ url }) => navigateToScreen(url));
      Mapbox.setTelemetryEnabled(false);

      retrieveItem("auth").then(async (auth) => {
        if (auth) {
          const initialUrl = (await Linking.getInitialURL()) || "";
          if (auth.id) {
            dispatch(login(auth));
            dispatch(getFavoriteLocations(auth.id));
          }
          navigateToScreen(initialUrl);
        } else {
          navigation.navigate("SignupLogin");
        }
      });
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (
        !isFirstLoad &&
        (shouldTriggerUpdateBounds || forceTriggerUpdateBounds)
      ) {
        if (!toCurrentLocation) {
          await sleep(500);
        } else {
          setToCurrentLocation(false);
        }

        cameraRef?.current?.setCamera({
          animationDuration: 0,
          bounds: {
            ne: [neLon, neLat],
            sw: [swLon, swLat],
          },
        });

        await sleep(50);
        const bounds = await getBounds();
        dispatch(updateBounds(bounds));
        dispatch(getLocationsConsideringZoom(bounds));
      }
    };
    run();
  }, [
    query,
    cameraRef,
    shouldTriggerUpdateBounds,
    forceTriggerUpdateBounds,
    toCurrentLocation,
  ]);

  const navigateToScreen = async (url) => {
    const { regions: allRegions = [] } = regions ?? {};
    if (url.indexOf("location_id=") > 0) {
      const idSegment = url.split("location_id=")[1];
      const id = idSegment.split("&")[0];
      navigation.navigate("LocationDetails", { id, refreshMap: true });
    } else if (url.indexOf("address=") > 0) {
      const decoded = decodeURIComponent(url);
      const address = decoded.split("address=")[1];
      const { location } = await getData(
        `/locations/closest_by_address.json?address=${address}&no_details=1`,
      );
      if (location) {
        const bounds = coordsToBounds({
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
        });
        dispatch(triggerUpdateBounds(bounds));
      }
      navigation.navigate("MapTab", { pop: true });
    } else if (url.indexOf("region=") > 0) {
      const regionSegment = url.split("region=")[1];
      const regionName = regionSegment.split("&")[0];
      const region = allRegions.find(
        ({ name }) => name.toLowerCase() === regionName.toLowerCase(),
      );

      const citySegment =
        url.indexOf("by_city_id=") > 0 ? url.split("by_city_id=")[1] : "";
      const cityName = citySegment.split("&")[0];
      let locations = [];
      if (cityName) {
        const byCity = await getData(
          `/region/${regionName}/locations.json?by_city_id=${cityName}`,
        );
        locations = byCity.locations || [];
        if (locations.length > 0) {
          const { lat, lon } = locations[0];
          const bounds = coordsToBounds({
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          });
          dispatch(triggerUpdateBounds(bounds));
        }
      }
      // If something goes wrong trying to get the specific city (highly plausible as it requires exact case matching), still get locations for the region
      if (region && locations.length === 0) {
        dispatch(getLocationsByRegion(region));
      }
      navigation.navigate("MapTab", { pop: true });
    } else if (url.indexOf("about") > 0) {
      navigation.navigate("Contact");
    } else if (url.indexOf("events") > 0) {
      navigation.navigate("Events");
    } else if (url.indexOf("suggest") > 0) {
      navigation.navigate("SuggestLocation");
    } else if (url.indexOf("saved") > 0) {
      navigation.navigate("Saved");
    } else {
      const region = allRegions.find(({ name }) => url.includes(name));
      if (region) {
        dispatch(getLocationsByRegion(region));
      }
      navigation.navigate("MapTab", { pop: true });
    }
  };

  const getBounds = async () => {
    const currentBounds = await _map.current.getVisibleBounds();
    return {
      swLat: currentBounds[1][1],
      swLon: currentBounds[1][0],
      neLat: currentBounds[0][1],
      neLon: currentBounds[0][0],
    };
  };

  const onCameraChanged = async ({ gestures }) => {
    if (gestures?.isGestureActive) {
      setShowUpdateSearch(true);
      setIsFirstLoad(false);
    }
  };

  const onFinishedLoading = async () => {
    setIsFirstLoad(true);
    await sleep(50);
    const bounds = await getBounds();
    dispatch(updateBounds(bounds));
    dispatch(getLocationsConsideringZoom(bounds));
    setIsFirstLoad(false);
  };

  const setToCurrentBounds = async () => {
    setShowUpdateSearch(false);
    const bounds = await getBounds();
    dispatch(updateBounds(bounds));
    return bounds;
  };

  const onOpenSearch = () => {
    setShowUpdateSearch(false);
    dispatch(setSelectedMapLocation(null));
  };

  const onPressFilter = async () => {
    await setToCurrentBounds();
    navigation.navigate("FilterMap");
  };

  const refreshResults = async () => {
    dispatch(clearSearchBarText());
    const bounds = await setToCurrentBounds();
    dispatch(getLocationsConsideringZoom(bounds));
  };

  const updateCurrentLocation = () => {
    dispatch(fetchCurrentLocation(false));
    setShowUpdateSearch(false);
    setToCurrentLocation(true);
  };

  const mapPress = () => {
    dispatch(setSelectedMapLocation(null));
  };

  if (!latitude) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView edges={["right", "left"]} style={{ flex: 1 }}>
      <AppAlert />
      <NoLocationTrackingModal />
      <View style={[{ top: topMargin }, s.search]}>
        <Search
          navigate={navigation.navigate}
          onOpenSearch={onOpenSearch}
          onPressFilter={onPressFilter}
        />
      </View>
      {isFetchingLocations ? (
        <View style={[{ top: topMargin + 150 }, s.loading]}>
          <Text style={s.loadingText}>Loading...</Text>
        </View>
      ) : null}
      {numLocations === 0 && !isFetchingLocations && !isFirstLoad && (
        <View style={[{ top: topMargin + 150 }, s.loading]}>
          <Text style={s.loadingText}>No Results</Text>
        </View>
      )}
      {maxZoom ? (
        <View style={[{ top: topMargin + 150 }, s.loading]}>
          <Text style={s.loadingText}>Zoom in to update results</Text>
        </View>
      ) : null}
      <Mapbox.MapView
        ref={(c) => (_map.current = c)}
        onDidFinishLoadingMap={onFinishedLoading}
        style={s.map}
        projection="mercator"
        scaleBarEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        compassPosition={{ bottom: 35, left: 10 }}
        gestureSettings={{ rotateEnabled: false }}
        attributionPosition={{ bottom: 6, left: 90 }}
        onCameraChanged={onCameraChanged}
        styleURL={
          theme.theme === "dark"
            ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
            : Mapbox.StyleURL.Outdoors
        }
        onPress={mapPress}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: 11,
            centerCoordinate: [longitude, latitude],
          }}
          animationMode="none"
          animationDuration={0}
        />
        {isLocationServicesEnabled && (
          <Mapbox.LocationPuck
            visible
            renderMode={Platform.OS === "ios" ? "native" : "normal"}
          />
        )}
        <CustomMapMarkers navigation={navigation} />
      </Mapbox.MapView>
      <Pressable
        onPress={() => navigation.navigate("LocationList")}
        style={({ pressed }) => [
          s.buttonStyle,
          s.shadow,
          { top: topMargin + 60 },
          s.listButtonContainer,
          pressed ? s.filterListPressed : undefined,
        ]}
      >
        <MaterialCommunityIcons
          name="format-list-bulleted"
          style={s.buttonIcon}
        />
        <Text style={s.buttonTitle}>List</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          {},
          s.shadow,
          s.myLocationContainer,
          pressed ? s.pressedMyLocation : s.notPressed,
        ]}
        onPress={updateCurrentLocation}
      >
        {Platform.OS === "ios" && locationTrackingServicesEnabled && (
          <FontAwesome
            name={"location-arrow"}
            color={theme.theme == "dark" ? theme.purple2 : theme.purple}
            size={26}
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
        )}
        {Platform.OS === "ios" && !locationTrackingServicesEnabled && (
          <MaterialIcons
            name={"location-off"}
            color={theme.theme == "dark" ? theme.purple2 : theme.purple}
            size={26}
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
        )}
        {Platform.OS !== "ios" && locationTrackingServicesEnabled && (
          <MaterialIcons
            name={"gps-fixed"}
            color={theme.theme == "dark" ? theme.purple2 : theme.purple}
            size={26}
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
        )}
        {Platform.OS !== "ios" && !locationTrackingServicesEnabled && (
          <MaterialIcons
            name={"location-disabled"}
            color={theme.theme == "dark" ? theme.purple2 : theme.purple}
            size={26}
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
        )}
      </Pressable>
      {filterApplied ? (
        <Pressable
          onPress={() => dispatch(clearFilters(true))}
          style={({ pressed }) => [
            s.buttonStyle,
            s.shadow,
            { top: topMargin + 60 },
            s.filterContainer,
            pressed ? s.filterListPressed : undefined,
          ]}
        >
          <Ionicons name="close-circle" style={s.closeIcon} />
          <Text style={s.filterTitleStyle}>Filter</Text>
        </Pressable>
      ) : null}
      <View style={s.bottomContainer}>
        {showUpdateSearch ? (
          <Pressable
            style={({ pressed }) => [
              s.shadow,
              s.updateContainerStyle,
              pressed ? s.pressed : s.notPressed,
            ]}
            onPress={refreshResults}
          >
            {({ pressed }) => (
              <Text
                style={[pressed ? s.pressedTitleStyle : s.updateTitleStyle]}
              >
                Refresh this area
              </Text>
            )}
          </Pressable>
        ) : null}
        {!!selectedLocation && (
          <LocationBottomSheet
            navigation={navigation}
            location={selectedLocation}
            setToCurrentBounds={setToCurrentBounds}
            triggerUpdate={(bounds) => dispatch(updateBounds(bounds))}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    map: {
      flex: 1,
    },
    search: {
      position: "absolute",
      zIndex: 10,
      alignSelf: "center",
    },
    loading: {
      zIndex: 10,
      position: "absolute",
      alignSelf: "center",
      paddingVertical: 7,
      paddingHorizontal: 15,
      backgroundColor: theme.text3,
      borderRadius: 25,
    },
    loadingText: {
      color: theme.pink2,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "Nunito-Regular",
    },
    buttonIcon: {
      fontSize: 22,
      color: theme.text2,
      paddingRight: 5,
    },
    buttonStyle: {
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      backgroundColor: theme.pink2,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    buttonTitle: {
      color: theme.text2,
      fontSize: 18,
      fontFamily: "Nunito-SemiBold",
    },
    filterListPressed: {
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.pink3,
    },
    shadow: {
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
    listButtonContainer: {
      position: "absolute",
      left: 15,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      alignSelf: "center",
    },
    updateContainerStyle: {
      position: "relative",
      marginBottom: 20,
      alignSelf: "center",
      justifyContent: "center",
      borderRadius: 25,
      backgroundColor: "#e3fae5",
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    updateTitleStyle: {
      color: "#440152",
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
    },
    pressedTitleStyle: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
    },
    myLocationContainer: {
      position: "absolute",
      bottom: 10,
      right: 10,
      alignSelf: "center",
      justifyContent: "center",
      borderRadius: 27,
      height: 54,
      width: 54,
      backgroundColor: theme.theme == "dark" ? theme.pink2 : theme.base1,
    },
    filterContainer: {
      position: "absolute",
      alignSelf: "center",
      right: 15,
      borderRadius: 25,
    },
    filterTitleStyle: {
      color: theme.theme == "dark" ? "#ffa7dd" : theme.pink1,
      fontSize: 18,
      fontFamily: "Nunito-SemiBold",
    },
    closeIcon: {
      paddingRight: 5,
      fontSize: 20,
      color: theme.theme == "dark" ? "#ffa7dd" : theme.pink1,
    },
    pressed: {
      opacity: 0.7,
    },
    pressedMyLocation: {
      opacity: 0.9,
      backgroundColor: theme.pink2,
    },
    notPressed: {
      opacity: 1.0,
    },
  });

const mapStateToProps = (state) => {
  const { locations, query, regions, user } = state;
  const selectedLocation = getSelectedMapLocation(state);
  const numLocations = locations.mapLocations.length;
  const { locationTrackingServicesEnabled, isLocationServicesEnabled } = user;

  return {
    query,
    regions,
    isFetchingLocations: locations.isFetchingLocations,
    selectedLocation,
    numLocations,
    isLocationServicesEnabled,
    locationTrackingServicesEnabled,
  };
};

export default connect(mapStateToProps)(Map);
