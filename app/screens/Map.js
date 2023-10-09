import React, { Component } from "react";
import { connect } from "react-redux";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { Button } from "@rneui/base";
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
  setUnitPreference,
  updateBounds,
  getLocationsByRegion,
  fetchLocationAndUpdateMap,
  getLocationsConsideringZoom,
  triggerUpdateBounds,
  setSelectedMapLocation,
} from "../actions";
import { getSelectedMapLocation } from "../selectors";
import { ThemeContext } from "../theme-context";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { coordsToBounds } from "../utils/utilityFunctions";

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC);

class Map extends Component {
  mapRef = null;

  constructor(props) {
    super(props);
    this.onMapIdle = this.onMapIdle.bind(this);
    this.cameraRef = React.createRef(null);
    this.state = {
      showUpdateSearch: false,
      hasMovedMap: false,
      isFirstLoad: true,
      willMoveMapToLocation: false,
      moveMapToLocation: null,
    };
  }

  static contextType = ThemeContext;

  navigateToScreen = async (url) => {
    const { navigate } = this.props.navigation;
    const { regions: allRegions = [] } = this.props.regions ?? {};
    if (url.indexOf("location_id=") > 0) {
      const idSegment = url.split("location_id=")[1];
      const id = idSegment.split("&")[0];
      navigate("LocationDetails", { id });
      this.setState({ moveMapToLocation: id, willMoveMapToLocation: true });
    } else if (url.indexOf("address=") > 0) {
      const decoded = decodeURIComponent(url);
      const address = decoded.split("address=")[1];
      const { location } = await getData(
        `/locations/closest_by_address.json?address=${address};no_details=1`,
      );
      if (location) {
        const bounds = coordsToBounds({
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
        });
        this.props.triggerUpdate(bounds);
      }
      navigate("MapTab");
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
          this.props.triggerUpdate(bounds);
        }
      }
      // If something goes wrong trying to get the specific city (highly plausible as it requires exact case matching), still get locations for the region
      if (region && locations.length === 0) {
        this.props.getLocationsByRegion(region);
      }
      navigate("MapTab");
    } else if (url.indexOf("about") > 0) {
      navigate("Contact");
    } else if (url.indexOf("events") > 0) {
      navigate("Events");
    } else if (url.indexOf("suggest") > 0) {
      navigate("SuggestLocation");
    } else if (url.indexOf("saved") > 0) {
      navigate("Saved");
    } else {
      const region = allRegions.find(({ name }) => url.includes(name));
      if (region) {
        this.props.getLocationsByRegion(region);
      }
      navigate("MapTab");
    }
  };

  getBounds = async () => {
    const currentBounds = await this._map.getVisibleBounds();
    return {
      swLat: currentBounds[1][1],
      swLon: currentBounds[1][0],
      neLat: currentBounds[0][1],
      neLon: currentBounds[0][0],
    };
  };

  onCameraChanged = async ({ gestures }) => {
    if (gestures?.isGestureActive) {
      this.setState({ hasMovedMap: true, isFirstLoad: false });
    }
  };

  onMapIdle = async () => {
    if (this.state.hasMovedMap) {
      this.setState({ showUpdateSearch: true });
    }
  };

  setToCurrentBounds = async () => {
    this.setState({ showUpdateSearch: false, hasMovedMap: false });
    const bounds = await this.getBounds();
    this.props.updateBounds(bounds);
    return bounds;
  };

  onOpenSearch = () => {
    this.setState({ showUpdateSearch: false, hasMovedMap: false });
    this.props.dispatch(setSelectedMapLocation(null));
  };

  onPressFilter = async () => {
    await this.setToCurrentBounds();
    this.props.navigation.navigate("FilterMap");
  };

  refreshResults = async () => {
    this.props.clearSearchBarText();
    const bounds = await this.setToCurrentBounds();
    this.props.getLocationsConsideringZoom(bounds);
  };

  updateCurrentLocation = () => {
    this.props.getCurrentLocation(false);
    this.setState({
      showUpdateSearch: false,
      hasMovedMap: false,
      toCurrentLocation: true,
    });
  };

  mapPress = () => {
    this.props.dispatch(setSelectedMapLocation(null));
  };

  async componentDidMount() {
    await this.props.getCurrentLocation(true);
    Linking.addEventListener("url", ({ url }) => this.navigateToScreen(url));
    Mapbox.setTelemetryEnabled(false);

    retrieveItem("auth").then(async (auth) => {
      if (auth) {
        const initialUrl = (await Linking.getInitialURL()) || "";
        if (auth.id) {
          this.props.login(auth);
          this.props.getFavoriteLocations(auth.id);
        }
        this.navigateToScreen(initialUrl);
      } else {
        this.props.navigation.navigate("SignupLogin");
      }
    });

    retrieveItem("unitPreference").then((unitPreference) => {
      if (unitPreference) {
        this.props.setUnitPreference(true);
      }
    });
  }

  async componentDidUpdate(prevProps) {
    const {
      triggerUpdateBounds,
      swLat,
      swLon,
      neLat,
      neLon,
      forceTriggerUpdateBounds,
    } = this.props.query;
    const { loadAgain, toCurrentLocation } = this.state;

    if (
      (swLat !== prevProps.query.swLat && triggerUpdateBounds) ||
      loadAgain ||
      forceTriggerUpdateBounds
    ) {
      if (!this.cameraRef?.current) {
        await sleep(500);
        return this.setState({ loadAgain: true });
      }

      if (!toCurrentLocation) {
        await sleep(500);
      } else {
        this.setState({ toCurrentLocation: false });
      }

      this.cameraRef?.current?.setCamera({
        animationDuration: 0,
        bounds: {
          ne: [neLon, neLat],
          sw: [swLon, swLat],
        },
      });
      if (this.state.loadAgain) {
        await sleep(500);
        this.setState({ loadAgain: false });
      } else {
        await sleep(50);
      }
      const bounds = await this.getBounds();
      this.props.updateBounds(bounds);
      this.props.getLocationsConsideringZoom(bounds);
    }
  }

  render() {
    const {
      isFetchingLocations,
      navigation,
      query,
      selectedLocation,
      numLocations,
    } = this.props;

    const { showUpdateSearch, isFirstLoad } = this.state;
    const { theme } = this.context;
    const s = getStyles(theme);
    const { swLat, swLon, neLat, neLon } = query;
    const latitude = (swLat + neLat) / 2;
    const longitude = (swLon + neLon) / 2;
    const {
      machineId = false,
      locationType = false,
      numMachines = false,
      selectedOperator = false,
      viewByFavoriteLocations,
      maxZoom,
    } = this.props.query;
    const filterApplied =
      machineId ||
      locationType ||
      numMachines ||
      selectedOperator ||
      viewByFavoriteLocations
        ? true
        : false;

    if (!latitude) {
      return <ActivityIndicator />;
    }

    return (
      <SafeAreaView
        edges={["right", "left", "top"]}
        style={{ flex: 1, marginTop: -Constants.statusBarHeight }}
      >
        <AppAlert />
        <NoLocationTrackingModal />
        <View style={s.search}>
          <Search
            navigate={navigation.navigate}
            onOpenSearch={this.onOpenSearch}
            onPressFilter={this.onPressFilter}
          />
        </View>
        {isFetchingLocations ? (
          <View style={s.loading}>
            <Text style={s.loadingText}>Loading...</Text>
          </View>
        ) : null}
        {numLocations === 0 && !isFetchingLocations && !isFirstLoad && (
          <View style={s.loading}>
            <Text style={s.loadingText}>No Results</Text>
          </View>
        )}
        {maxZoom ? (
          <View style={s.loading}>
            <Text style={s.loadingText}>Zoom in to update results</Text>
          </View>
        ) : null}
        <Mapbox.MapView
          ref={(c) => (this._map = c)}
          style={s.map}
          scaleBarEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          attributionPosition={{ bottom: 6, left: 90 }}
          onCameraChanged={this.onCameraChanged}
          onMapIdle={this.onMapIdle}
          styleURL={
            theme.theme === "dark"
              ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
              : Mapbox.StyleURL.Street
          }
          onPress={this.mapPress}
        >
          <Mapbox.Camera
            ref={this.cameraRef}
            defaultSettings={{
              zoomLevel: 11,
              centerCoordinate: [longitude, latitude],
            }}
            animationMode="none"
            animationDuration={0}
          />
          <Mapbox.UserLocation visible renderMode="normal" />
          <CustomMapMarkers navigation={navigation} />
        </Mapbox.MapView>
        <Button
          onPress={() => navigation.navigate("LocationList")}
          icon={
            <MaterialCommunityIcons
              name="format-list-bulleted"
              style={s.buttonIcon}
            />
          }
          containerStyle={[s.listButtonContainer, s.containerStyle]}
          buttonStyle={s.buttonStyle}
          titleStyle={s.buttonTitle}
          title="List"
          underlayColor="transparent"
        />
        <Pressable
          style={({ pressed }) => [
            {},
            s.containerStyle,
            s.myLocationContainer,
            pressed ? s.pressed : s.notPressed,
          ]}
          onPress={this.updateCurrentLocation}
        >
          {Platform.OS === "ios" ? (
            <FontAwesome
              name={"location-arrow"}
              color={theme.theme == "dark" ? theme.purple2 : theme.purple}
              size={26}
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
          ) : (
            <MaterialIcons
              name={"gps-fixed"}
              color={theme.theme == "dark" ? theme.purple2 : theme.purple}
              size={26}
              style={{ justifyContent: "center", alignSelf: "center" }}
            />
          )}
        </Pressable>
        {filterApplied ? (
          <Button
            title={"Clear Filter"}
            onPress={() => this.props.clearFilters()}
            containerStyle={[s.filterContainer, s.containerStyle]}
            buttonStyle={s.buttonStyle}
            titleStyle={s.filterTitleStyle}
            iconLeft
            icon={<Ionicons name="ios-close-circle" style={s.closeIcon} />}
          />
        ) : null}
        {showUpdateSearch ? (
          <Pressable
            style={({ pressed }) => [
              s.containerStyle,
              s.updateContainerStyle,
              pressed ? s.pressed : s.notPressed,
            ]}
            onPress={this.refreshResults}
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
            setToCurrentBounds={this.setToCurrentBounds}
          />
        )}
      </SafeAreaView>
    );
  }
}

const getStyles = (theme) =>
  StyleSheet.create({
    map: {
      flex: 1,
    },
    search: {
      position: "absolute",
      top:
        Constants.statusBarHeight > 40
          ? Constants.statusBarHeight + 50
          : Constants.statusBarHeight + 30,
      zIndex: 10,
      alignSelf: "center",
    },
    loading: {
      zIndex: 10,
      position: "absolute",
      alignSelf: "center",
      bottom: 70,
      paddingVertical: 5,
      paddingHorizontal: 15,
      backgroundColor: theme.text3,
      borderRadius: 25,
    },
    loadingText: {
      color: theme.pink2,
      fontSize: 16,
      fontFamily: "regularFont",
    },
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "regularFont",
    },
    buttonIcon: {
      fontSize: 18,
      color: theme.theme == "dark" ? theme.indigo4 : theme.purple2,
      paddingRight: 5,
    },
    buttonStyle: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 25,
      backgroundColor: theme.pink2,
    },
    buttonTitle: {
      color: theme.theme == "dark" ? theme.text2 : theme.purple,
      fontSize: 18,
      fontFamily: "regularFont",
    },
    containerStyle: {
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
    },
    listButtonContainer: {
      position: "absolute",
      top:
        Constants.statusBarHeight > 40
          ? Constants.statusBarHeight + 110
          : Constants.statusBarHeight + 90,
      left: 15,
      borderRadius: 25,
    },
    updateContainerStyle: {
      position: "absolute",
      bottom: 15,
      alignSelf: "center",
      borderRadius: 25,
      backgroundColor: theme.purple,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    updateTitleStyle: {
      color: theme.white,
      fontSize: 18,
    },
    pressedTitleStyle: {
      color: theme.pink3,
      fontSize: 16,
      fontFamily: "regularFont",
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
      top:
        Constants.statusBarHeight > 40
          ? Constants.statusBarHeight + 110
          : Constants.statusBarHeight + 90,
      right: 15,
      borderRadius: 25,
    },
    filterTitleStyle: {
      color: theme.theme == "dark" ? theme.colors.activeTab : theme.pink1,
      fontSize: 18,
      fontFamily: "regularFont",
    },
    closeIcon: {
      paddingRight: 5,
      fontSize: 20,
      color: theme.theme == "dark" ? theme.colors.activeTab : theme.pink1,
    },
    pressed: {
      opacity: 0.8,
      backgroundColor: theme.pink2,
    },
    notPressed: {
      opacity: 1.0,
    },
  });

Map.propTypes = {
  isFetchingLocations: PropTypes.bool,
  query: PropTypes.object,
  getCurrentLocation: PropTypes.func,
  navigation: PropTypes.object,
  getFavoriteLocations: PropTypes.func,
  clearFilters: PropTypes.func,
  getLocationsConsideringZoom: PropTypes.func,
  clearSearchBarText: PropTypes.func,
  setUnitPreference: PropTypes.func,
  updateCoordinates: PropTypes.func,
  updateCoordinatesAndGetLocations: PropTypes.func,
  regions: PropTypes.object,
  login: PropTypes.func,
  getLocationAndMachineCounts: PropTypes.func,
  getLocationsByRegion: PropTypes.func,
  fetchLocationAndUpdateMap: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { locations, query, regions } = state;
  const selectedLocation = getSelectedMapLocation(state);
  const numLocations = locations.mapLocations.length;

  return {
    query,
    regions,
    isFetchingLocations: locations.isFetchingLocations,
    selectedLocation,
    numLocations,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getCurrentLocation: (isInitialLoad) =>
    dispatch(fetchCurrentLocation(isInitialLoad)),
  getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
  clearFilters: () => dispatch(clearFilters(true)),
  clearSearchBarText: () => dispatch(clearSearchBarText()),
  login: (auth) => dispatch(login(auth)),
  setUnitPreference: (preference) => dispatch(setUnitPreference(preference)),
  updateBounds: (bounds) => dispatch(updateBounds(bounds)),
  getLocationsConsideringZoom: (bounds) =>
    dispatch(getLocationsConsideringZoom(bounds)),
  getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
  fetchLocationAndUpdateMap: (locationId) =>
    dispatch(fetchLocationAndUpdateMap(locationId)),
  triggerUpdate: (bounds) => dispatch(triggerUpdateBounds(bounds)),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
