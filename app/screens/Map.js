import React, { useEffect, useState, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { retrieveItem } from "../config/utils";
import { sleep } from "../utils";
import { getData } from "../config/request";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import Mapbox from "@rnmapbox/maps";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import {
  ActivityIndicator,
  AppAlert,
  ConfirmationModal,
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
  getMapMarkers,
  triggerUpdateBounds,
  setSelectedMapLocation,
  reloadMapMarkers,
  setMachineFilter,
  setMachineFilterMulti,
  setOpdbIdFilter,
  selectedLocationTypeFilterMulti,
  selectedOperatorFilter,
  selectedManufacturerFilter,
  setMachineTypeFilter,
  setMachineYearFilter,
  setLocationIcFilter,
  updateNumMachinesSelected,
  setAllAgesFilter,
  setPaymentTypeFilter,
} from "../actions";
import { getSelectedMapLocation, getFilterSummaryText } from "../selectors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { coordsToBounds } from "../utils/utilityFunctions";
import { registerGetBounds } from "../utils/mapCenterBridge";
import { parseFilterParamsFromUrl } from "../utils/deepLinkFilters";
import { useNavigation, useTheme } from "@react-navigation/native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC);

const Map = ({
  isFetchingMarkers,
  query,
  selectedLocation,
  numLocations,
  totalMachines,
  isLocationServicesEnabled,
  locationTrackingServicesEnabled,
  regions,
  machines,
  locationTypes,
  operators,
  filterSummary,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const _map = useRef(null);
  const theme = useTheme();
  const s = getStyles(theme);

  const [showUpdateSearch, setShowUpdateSearch] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadedTheme, setLoadedTheme] = useState(null);
  const [filterInfoVisible, setFilterInfoVisible] = useState(false);
  const toCurrentLocationRef = useRef(false);
  const themeRef = useRef(theme.theme);
  const mapInitializedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const topMargin = insets.top;

  const {
    swLat,
    swLon,
    neLat,
    neLon,
    triggerUpdateBounds: shouldTriggerUpdateBounds,
  } = query;
  const latitude = (swLat + neLat) / 2;
  const longitude = (swLon + neLon) / 2;
  // Derived from the same fragment logic that builds the human-readable
  // summary, so a filter that can't be described (e.g. a deep-linked
  // opdb_id that doesn't resolve to any known machine) isn't treated as
  // "applied" either - there's nothing valid being filtered on.
  const filterApplied = filterSummary !== null;

  useEffect(() => {
    themeRef.current = theme.theme;
  }, [theme.theme]);

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
      if (!isFirstLoad && shouldTriggerUpdateBounds) {
        if (!toCurrentLocationRef.current) {
          await sleep(500);
        } else {
          toCurrentLocationRef.current = false;
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
        if (!bounds) return;
        dispatch(updateBounds(bounds));
        dispatch(getMapMarkers(bounds));
      }
    };
    run();
  }, [query]);

  useEffect(() => {
    registerGetBounds(getBounds);
  }, []);

  // URL filter params replace whatever filter state happens to already be
  // active - a link tap is a fresh intent, not a merge with prior browsing.
  const applyFiltersFromUrl = (parsedFilters) => {
    dispatch(clearFilters(false));

    const resolvedMachines = parsedFilters.machineIds
      .map((id) => machines.find((m) => m.id === Number(id)))
      .filter(Boolean);

    const opdbIds = parsedFilters.opdbIds;
    const resolvedOpdbMachines = opdbIds
      .map((id) => machines.find((m) => m.opdb_id === id))
      .filter(Boolean);
    const allOpdbIdsResolved =
      opdbIds.length > 0 && resolvedOpdbMachines.length === opdbIds.length;

    if (resolvedMachines.length === 1) {
      dispatch(setMachineFilter(resolvedMachines[0]));
    } else if (resolvedMachines.length > 1) {
      dispatch(setMachineFilterMulti(resolvedMachines));
    } else if (allOpdbIdsResolved) {
      if (resolvedOpdbMachines.length === 1) {
        dispatch(setMachineFilter(resolvedOpdbMachines[0]));
      } else {
        dispatch(setMachineFilterMulti(resolvedOpdbMachines));
      }
    } else if (opdbIds.length > 0) {
      dispatch(setOpdbIdFilter(opdbIds));
    }

    const validLocationTypeIds = parsedFilters.locationTypeIds
      .map(Number)
      .filter((id) => locationTypes.some((t) => t.id === id));
    if (validLocationTypeIds.length > 0) {
      dispatch(selectedLocationTypeFilterMulti(validLocationTypeIds));
    }

    const operatorId = Number(parsedFilters.operatorId);
    if (
      parsedFilters.operatorId &&
      operators.some((o) => o.id === operatorId)
    ) {
      dispatch(selectedOperatorFilter(operatorId));
    }

    const knownManufacturers = new Set(
      machines.map((m) => m.manufacturer).filter(Boolean),
    );
    const validManufacturers = parsedFilters.manufacturers.filter((m) =>
      knownManufacturers.has(m),
    );
    if (validManufacturers.length > 0) {
      dispatch(selectedManufacturerFilter(validManufacturers));
    }
    if (parsedFilters.machineTypeEm) {
      dispatch(setMachineTypeFilter("em"));
    }
    if (
      parsedFilters.machineYearGte !== null ||
      parsedFilters.machineYearLte !== null
    ) {
      dispatch(
        setMachineYearFilter(
          parsedFilters.machineYearGte,
          parsedFilters.machineYearLte,
        ),
      );
    }
    if (parsedFilters.locationIcActive) {
      dispatch(setLocationIcFilter(true));
    }
    if (parsedFilters.numMachines !== null) {
      dispatch(updateNumMachinesSelected(parsedFilters.numMachines));
    }
    if (parsedFilters.allAgesActive) {
      dispatch(setAllAgesFilter(true));
    }
    if (parsedFilters.paymentTypeActive) {
      dispatch(setPaymentTypeFilter(true));
    }

    dispatch(reloadMapMarkers());
  };

  const navigateToScreen = async (url) => {
    const { regions: allRegions = [] } = regions ?? {};
    const parsedFilters = parseFilterParamsFromUrl(url);
    if (parsedFilters) {
      applyFiltersFromUrl(parsedFilters);
    }
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
      navigation.navigate("MapTab");
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
      navigation.navigate("MapTab");
    } else if (url.indexOf("about") > 0) {
      navigation.navigate("Contact");
    } else if (url.indexOf("events") > 0) {
      navigation.navigate("Events");
    } else if (url.indexOf("suggest") > 0) {
      navigation.navigate("SuggestLocation");
    } else if (url.indexOf("contact") > 0) {
      navigation.navigate("Contact");
    } else if (url.indexOf("addscore") > 0) {
      navigation.navigate("AddHighScore");
    } else if (url.indexOf("saved") > 0) {
      navigation.navigate("Saved");
    } else {
      const region = allRegions.find(({ name }) => url.includes(name));
      if (region) {
        dispatch(getLocationsByRegion(region));
      }
      navigation.navigate("MapTab");
    }
  };

  const getBounds = async () => {
    if (!_map.current) return null;
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
    if (mapInitializedRef.current) return;
    mapInitializedRef.current = true;
    await sleep(50);
    const bounds = await getBounds();
    if (!bounds) {
      mapInitializedRef.current = false;
      setShowUpdateSearch(true);
      return;
    }
    dispatch(updateBounds(bounds));
    dispatch(getMapMarkers(bounds));
    setIsFirstLoad(false);
  };

  const setToCurrentBounds = async () => {
    setShowUpdateSearch(false);
    const bounds = await getBounds();
    if (!bounds) return null;
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
    if (bounds) dispatch(getMapMarkers(bounds));
  };

  const updateCurrentLocation = () => {
    dispatch(fetchCurrentLocation(false));
    setShowUpdateSearch(false);
    toCurrentLocationRef.current = true;
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
      {isFetchingMarkers ? (
        <View style={[{ top: topMargin + 150 }, s.loading]}>
          <Text style={[s.loadingText, s.regular]}>Loading...</Text>
        </View>
      ) : null}
      {numLocations === 0 && !isFetchingMarkers && !isFirstLoad && (
        <View style={[{ top: topMargin + 150 }, s.loading]}>
          <Text style={[s.loadingText, s.regular]}>No Results</Text>
        </View>
      )}
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
        attributionPosition={{ bottom: 35, left: -4 }}
        onCameraChanged={onCameraChanged}
        styleURL={
          theme.theme === "dark"
            ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
            : Mapbox.StyleURL.Outdoors
        }
        onDidFinishLoadingStyle={() => setLoadedTheme(themeRef.current)}
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
        {loadedTheme === theme.theme && (
          <CustomMapMarkers navigation={navigation} />
        )}
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
        <Text style={[s.buttonTitle, s.semiBold]}>List</Text>
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
          <FontAwesome6
            name={"location-arrow"}
            iconStyle="solid"
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
        <View style={[{ top: topMargin + 60 }, s.filterRow]}>
          <Pressable
            onPress={() => setFilterInfoVisible(true)}
            hitSlop={8}
            style={({ pressed }) => [
              s.infoButton,
              pressed ? s.pressed : s.notPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="information-slab-circle"
              style={s.infoIcon}
            />
          </Pressable>
          <Pressable
            onPress={() => dispatch(clearFilters(true))}
            style={({ pressed }) => [
              s.buttonStyle,
              s.shadow,
              pressed ? s.filterListPressed : undefined,
            ]}
          >
            <Ionicons name="close-circle" style={s.closeIcon} />
            <Text style={[s.filterTitleStyle, s.semiBold]}>Filter</Text>
          </Pressable>
        </View>
      ) : null}
      <ConfirmationModal
        visible={filterInfoVisible}
        closeModal={() => setFilterInfoVisible(false)}
      >
        <View style={s.filterSummaryModalHeader}>
          <Text style={[s.filterSummaryModalTitle, s.extraBold]}>
            Map Filter Summary
          </Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={35}
            onPress={() => setFilterInfoVisible(false)}
            style={s.xButton}
          />
        </View>
        <View style={s.filterSummaryModalContent}>
          <Text style={[s.filterSummaryText, s.regular]}>
            Showing locations with {filterSummary}.
          </Text>
        </View>
      </ConfirmationModal>
      {!isFetchingMarkers && !isFirstLoad && numLocations > 0 && (
        <View style={s.statsContainer}>
          <Text style={[s.statsText, s.regular]} maxFontSizeMultiplier={1.5}>
            {numLocations.toLocaleString()}{" "}
            {numLocations === 1 ? "location" : "locations"} ·{" "}
            {totalMachines.toLocaleString()}{" "}
            {totalMachines === 1 ? "machine" : "machines"}
          </Text>
        </View>
      )}
      <View style={s.bottomContainer}>
        {showUpdateSearch ? (
          <Pressable
            style={({ pressed }) => [
              s.shadow,
              s.updateContainerStyle,
              { marginBottom: selectedLocation ? 8 : 40 },
              pressed ? s.pressed : s.notPressed,
            ]}
            onPress={refreshResults}
          >
            {({ pressed }) => (
              <Text
                style={
                  (s.semiBold,
                  [pressed ? s.pressedTitleStyle : s.updateTitleStyle])
                }
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
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
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
    },
    buttonIcon: {
      fontSize: 22,
      color: theme.theme === "dark" ? theme.purpleLight : theme.text2,
      paddingRight: 5,
    },
    buttonStyle: {
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.theme === "dark" ? theme.base2 : theme.pink2,
      paddingVertical: 5,
      paddingHorizontal: 15,
    },
    buttonTitle: {
      color: theme.theme === "dark" ? theme.purpleLight : theme.text2,
      fontSize: 18,
      lineHeight: 24,
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
      alignSelf: "center",
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      alignSelf: "center",
    },
    updateContainerStyle: {
      position: "relative",
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
    },
    pressedTitleStyle: {
      fontSize: 16,
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
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base1,
    },
    filterRow: {
      position: "absolute",
      alignSelf: "center",
      right: 15,
      flexDirection: "row",
      alignItems: "center",
    },
    infoButton: {
      height: 40,
      width: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    infoIcon: {
      fontSize: 24,
      color: theme.theme == "dark" ? "#ffa7dd" : theme.pink1,
    },
    filterTitleStyle: {
      color: theme.theme == "dark" ? "#ffa7dd" : theme.pink1,
      fontSize: 18,
      lineHeight: 24,
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
    statsContainer: {
      position: "absolute",
      bottom: 10,
      alignSelf: "center",
      paddingVertical: 3,
      paddingHorizontal: 10,
      backgroundColor:
        theme.theme === "dark" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.7)",
      borderRadius: 12,
    },
    statsText: {
      fontSize: 11,
      color: theme.text,
    },
    filterSummaryModalHeader: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
      paddingHorizontal: 45,
    },
    filterSummaryModalTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
    },
    filterSummaryModalContent: {
      marginTop: 10,
    },
    filterSummaryText: {
      textAlign: "center",
      fontSize: 16,
      paddingHorizontal: 16,
    },
    xButton: {
      position: "absolute",
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
  });

const mapStateToProps = (state) => {
  const { locations, query, regions, user, machines, operators } = state;
  const selectedLocation = getSelectedMapLocation(state);
  const filterSummary = getFilterSummaryText(state);
  const numLocations = locations.mapMarkers.length;
  const numMachines = locations.mapMarkers.reduce(
    (sum, f) => sum + (f.properties?.machine_count ?? 0),
    0,
  );
  const { locationTrackingServicesEnabled, isLocationServicesEnabled } = user;

  return {
    query,
    regions,
    isFetchingMarkers: locations.isFetchingMarkers,
    selectedLocation,
    filterSummary,
    numLocations,
    totalMachines: numMachines,
    isLocationServicesEnabled,
    locationTrackingServicesEnabled,
    machines: machines.machines,
    locationTypes: locations.locationTypes,
    operators: operators.operators,
  };
};

export default connect(mapStateToProps)(Map);
