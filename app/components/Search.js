import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
import { debounce } from "throttle-debounce";
import Geocode from "react-geocode";
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input, ListItem } from "@rneui/base";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { getData } from "../config/request";
import {
  getLocationsByRegion,
  updateCoordinatesAndGetLocations,
  updateCoordinates,
  getLocationsConsideringZoom,
  getLocationsFailure,
  setSearchBarText,
  clearSearchBarText,
  fetchLocation,
} from "../actions";
import withThemeHOC from "./withThemeHOC";
import { retrieveItem } from "../config/utils";
import { ThemeContext } from "../theme-context";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import ActivityIndicator from "./ActivityIndicator";

let deviceWidth = Dimensions.get("window").width;

Geocode.setApiKey(process.env.GOOGLE_MAPS_KEY);

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: "",
      foundLocations: [],
      foundCities: [],
      foundRegions: [],
      searchModalVisible: false,
      showSubmitButton: false,
      searching: false,
      recentSearchHistory: [],
    };

    this.autocompleteSearchDebounced = debounce(500, this.autocompleteSearch);
    this.waitingFor = "";
  }

  changeQuery = (q) => {
    this.setState({ q, showSubmitButton: false }, () => {
      this.autocompleteSearchDebounced(this.state.q);
    });
  };

  autocompleteSearch = (q) => {
    this._fetch(q);
  };

  _fetch = async (query) => {
    this.waitingFor = query;
    this.setState({ searching: true });
    const { regions = [] } = this.props.regions ?? {};
    if (query === "") {
      await this.setState({
        foundLocations: [],
        foundCities: [],
        foundRegions: [],
        searching: false,
      });
    } else {
      const foundRegions =
        query.toLowerCase() === "region"
          ? regions
          : regions.filter((r) =>
              r.full_name.toLowerCase().includes(query.toLowerCase()),
            );
      const foundLocations = await getData(
        `/locations/autocomplete?name=${encodeURIComponent(query)}`,
      );
      let foundCities = await getData(
        `/locations/autocomplete_city.json?name=${encodeURIComponent(query)}`,
      );
      if (query === this.waitingFor) {
        this.setState({
          foundLocations,
          foundCities,
          foundRegions,
          showSubmitButton: true,
          searching: false,
        });
      }
    }
  };

  geocodeSearch = (query) => {
    this.props.setSearchBarText(query);
    this.setState({ searching: true });
    Geocode.fromAddress(query)
      .then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          this.props.updateCoordinatesAndGetLocations(lat, lng);
        },
        (error) => {
          Alert.alert("An error occurred geocoding.");
        },
      )
      .then(() => {
        this.changeQuery("");
        this.setState({ searchModalVisible: false });
      });
  };

  getLocationsByCity = async ({ value }) => {
    try {
      const [city, state] = value.split(", ");
      const stateParam = state ? `by_state_id=${state}` : "";
      const { locations } = await getData(
        `/locations?by_city_id=${city};${stateParam};no_details=1`,
      );
      // In order to show all locations for a given city, we must determine the min/max lat/lon
      // such that we can come up with an appropriate map zoom. As the zoom may expose locations outside
      // the defined city, we make a fresh request for locations to get any locations we be missing.
      const { maxLat, minLat, maxLon, minLon } = locations.reduce(
        (prev, cur) => {
          let { minLat, maxLat, minLon, maxLon } = prev;
          if (!maxLat || cur.lat > maxLat) {
            maxLat = parseFloat(cur.lat);
          }
          if (!minLat || cur.lat < minLat) {
            minLat = parseFloat(cur.lat);
          }
          if (!maxLon || cur.lon > maxLon) {
            maxLon = parseFloat(cur.lon);
          }
          if (!minLon || cur.lon < minLon) {
            minLon = parseFloat(cur.lon);
          }
          return {
            maxLat,
            minLat,
            maxLon,
            minLon,
          };
        },
        {},
      );

      // Determine the delta
      let latDelta = Math.abs(maxLat - minLat);
      let lonDelta = Math.abs(maxLon - minLon);

      // Account for min/max zoom
      if (latDelta < 0.07) {
        latDelta = 0.07;
      } else if (latDelta > 3) {
        latDelta = 3;
      }
      if (lonDelta < 0.07) {
        lonDelta = 0.07;
      } else if (lonDelta > 3) {
        lonDelta = 3;
      }

      // Place the center of the map and request for the avg of the coordinates
      const latAvg = (maxLat + minLat) / 2;
      const lonAvg = (maxLon + minLon) / 2;

      this.props.updateCoordinates(latAvg, lonAvg, latDelta, lonDelta);
      this.props.getLocationsConsideringZoom(
        latAvg,
        lonAvg,
        latDelta,
        lonDelta,
      );
      this.clearSearchState({ value });
    } catch (e) {
      this.props.getLocationsFailure();
      this.clearSearchState("");
    }
  };

  goToLocation = async (location) => {
    try {
      const data = await this.props.dispatch(fetchLocation(location.id));
      const { lat, lon } = data.location;
      if (!lat) throw new Error();
      this.props.dispatch(updateCoordinatesAndGetLocations(lat, lon));
      this.props.navigate("LocationDetails", { id: location.id });
      this.clearSearchState(location);
    } catch (e) {
      Alert.alert("Location not found");
    }
  };

  getLocationsByRegion = (region) => {
    this.props.getLocationsByRegion(region);
    this.clearSearchState(region);
  };

  clearSearchState = (search) => {
    this.changeQuery("");
    this.props.setSearchBarText(search.value ? search.value : search.full_name);
    this.setState({ searchModalVisible: false });
    if (search) {
      const duplicateIndex = this.isDuplicate(search);
      let currentSearchHistory = this.state.recentSearchHistory;
      if (duplicateIndex > -1) {
        currentSearchHistory.splice(duplicateIndex, 1);
      }
      const updatedSearchHistory = [search, ...currentSearchHistory].slice(
        0,
        10,
      );
      AsyncStorage.setItem(
        "searchHistory",
        JSON.stringify(updatedSearchHistory),
      );
    }
  };

  isDuplicate = (search) => {
    const isDuplicate = this.state.recentSearchHistory.findIndex((entry) => {
      if (entry.full_name) {
        if (search.full_name === entry.full_name) return true;
      }

      if (entry.value) {
        if (search.value === entry.value) return true;
      }

      return false;
    });

    return isDuplicate;
  };

  renderRegionRow = (region, s) => (
    <Pressable
      style={({ pressed }) => [{}, pressed ? s.pressed : s.notPressed]}
      key={region.id}
      onPress={() => this.getLocationsByRegion(region)}
    >
      <ListItem containerStyle={s.listContainerStyle}>
        <ListItem.Content>
          <ListItem.Title style={s.listItemTitle}>
            {region.full_name}
          </ListItem.Title>
          <ListItem.Title right style={s.cityRegionRow}>
            {"Region"}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Pressable>
  );

  renderCityRow = (location, s) => (
    <Pressable
      style={({ pressed }) => [{}, pressed ? s.pressed : s.notPressed]}
      key={location.value}
      onPress={() => this.getLocationsByCity(location)}
    >
      <ListItem containerStyle={s.listContainerStyle}>
        <ListItem.Content>
          <ListItem.Title style={s.listItemTitle}>
            {location.value}
          </ListItem.Title>
          <ListItem.Title right style={s.cityRegionRow}>
            {"City"}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Pressable>
  );

  renderLocationRow = (location, s) => (
    <Pressable
      style={({ pressed }) => [{}, pressed ? s.pressed : s.notPressed]}
      key={location.id}
      onPress={() => this.goToLocation(location)}
    >
      <ListItem containerStyle={s.listContainerStyle}>
        <ListItem.Content>
          <ListItem.Title style={s.listItemTitle}>
            {location.label}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Pressable>
  );

  renderRecentSearchHistory = (s) => (
    <View>
      <ListItem
        containerStyle={[{ alignItems: "center" }, s.listContainerStyle]}
      >
        <ListItem.Content>
          <ListItem.Title style={s.searchHistoryTitle}>
            {"Recent Search History"}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      {this.state.recentSearchHistory.map((search) => {
        // Determine which rows to render based on search payload
        if (search.motd) {
          return this.renderRegionRow(search, s);
        }

        if (search.id) {
          return this.renderLocationRow(search, s);
        }

        if (search.value) {
          return this.renderCityRow(search, s);
        }
      })}
    </View>
  );

  renderGoToFilter = (s) => {
    const onPress = () => {
      this.setState({ searchModalVisible: false });
      this.props.navigate("FilterMap");
    };
    return (
      <Text style={s.goToFilterText}>
        Looking for a particular machine? Use the{" "}
        <Text onPress={onPress} style={s.link}>
          Filter
        </Text>
      </Text>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchModalVisible && !prevState.searchModalVisible) {
      retrieveItem("searchHistory")
        .then((recentSearchHistory) =>
          recentSearchHistory
            ? this.setState({ recentSearchHistory })
            : this.setState({ recentSearchHistory: [] }),
        )
        .catch(() => this.setState({ recentSearchHistory: [] }));
    }
  }

  render() {
    const {
      q,
      foundLocations = [],
      foundCities = [],
      foundRegions = [],
      recentSearchHistory = [],
      searchModalVisible,
      showSubmitButton,
      searching,
    } = this.state;
    const { query, clearSearchBarText } = this.props;
    const { searchBarText } = query;
    const submitButton =
      foundLocations.length === 0 &&
      foundCities.length === 0 &&
      q !== "" &&
      showSubmitButton;
    const keyboardDismissProp =
      Platform.OS === "ios"
        ? { keyboardDismissMode: "on-drag" }
        : { onScrollBeginDrag: Keyboard.dismiss };

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
          return (
            <View>
              <Modal
                transparent={false}
                visible={searchModalVisible}
                onShow={() => {
                  this.textInput.focus();
                }}
                onRequestClose={() => {}}
              >
                <SafeAreaProvider>
                  <SafeAreaView
                    style={{ flex: 1, backgroundColor: theme.base1 }}
                  >
                    <View style={s.modalContainer}>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <MaterialIcons
                          onPress={() => {
                            this.setState({ searchModalVisible: false });
                            q === "" && clearSearchBarText();
                            this.changeQuery("");
                          }}
                          name="clear"
                          size={30}
                          style={s.clear}
                        />
                        <Input
                          placeholder="City, Address, Location..."
                          placeholderTextColor={theme.indigo4}
                          leftIcon={
                            <MaterialIcons
                              name="search"
                              size={25}
                              color={theme.purple}
                              style={{ marginLeft: 10, marginRight: 0 }}
                            />
                          }
                          rightIcon={
                            q ? (
                              <MaterialCommunityIcons
                                name="close-circle"
                                size={20}
                                color={theme.indigo4}
                                style={{ marginRight: 2 }}
                                onPress={() => this.changeQuery("")}
                              />
                            ) : null
                          }
                          onChangeText={(query) => this.changeQuery(query)}
                          value={q}
                          containerStyle={{ paddingTop: 4 }}
                          key={"search"}
                          returnKeyType={"search"}
                          onSubmitEditing={
                            submitButton
                              ? ({ nativeEvent }) =>
                                  this.geocodeSearch(nativeEvent.text)
                              : () => {}
                          }
                          inputContainerStyle={s.inputContainerStyle}
                          inputStyle={s.inputStyle}
                          ref={(input) => {
                            this.textInput = input;
                          }}
                          autoCorrect={false}
                        />
                      </View>
                      <ScrollView
                        style={{ paddingTop: 3 }}
                        keyboardShouldPersistTaps="handled"
                        {...keyboardDismissProp}
                      >
                        {searching && <ActivityIndicator />}
                        {q === "" && this.renderGoToFilter(s)}
                        {q === "" &&
                          recentSearchHistory.length > 0 &&
                          this.renderRecentSearchHistory(s)}
                        {!!foundRegions &&
                          foundRegions.map((region) =>
                            this.renderRegionRow(region, s),
                          )}
                        {!!foundCities &&
                          foundCities.map((location) =>
                            this.renderCityRow(location, s),
                          )}
                        {!!foundLocations &&
                          foundLocations.map((location) =>
                            this.renderLocationRow(location, s),
                          )}
                      </ScrollView>
                    </View>
                  </SafeAreaView>
                </SafeAreaProvider>
              </Modal>
              <View style={s.searchMapContainer}>
                <Pressable
                  style={({ pressed }) => [
                    {},
                    s.searchMap,
                    s.searchMapChild,
                    pressed ? s.pressed : s.notPressed,
                  ]}
                  onPress={() => this.setState({ searchModalVisible: true })}
                >
                  <MaterialIcons name="search" size={25} style={s.searchIcon} />
                  <Text numberOfLines={1} style={s.inputPlaceholder}>
                    {searchBarText
                      ? searchBarText
                      : "City, Address, Location..."}
                  </Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    {},
                    s.buttonContainerStyle,
                    s.searchMapChild,
                    pressed ? s.filterPressed : s.filterNotPressed,
                  ]}
                  onPress={() => this.props.navigate("FilterMap")}
                >
                  <Entypo name="sound-mix" size={20} style={s.filterIcon} />
                  <Text style={s.filterTitleStyle}>Filter</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

Search.propTypes = {
  theme: PropTypes.string,
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.base1,
    },
    modalContainer: {
      flex: 1,
      marginTop: Platform.OS === "ios" ? 0 : 10,
    },
    searchMapContainer: {
      marginTop: 0,
      flex: 1,
      alignItems: "center",
      width: deviceWidth - 30,
      flexDirection: "row",
      height: 40,
    },
    searchMapChild: {
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      margin: "auto",
      height: 40,
    },
    searchMap: {
      backgroundColor: theme.white,
      width: deviceWidth - 120,
      borderBottomLeftRadius: 25,
      borderTopLeftRadius: 25,
      paddingLeft: 10,
    },
    buttonContainerStyle: {
      paddingRight: 10,
      paddingLeft: 10,
      width: 90,
      borderBottomRightRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: theme.pink2,
    },
    searchIcon: {
      paddingLeft: 5,
      color: theme.purple,
    },
    inputPlaceholder: {
      fontSize: deviceWidth < 321 ? 14 : 16,
      color: theme.indigo4,
      paddingLeft: 5,
      flex: 1,
      fontFamily: "regularFont",
    },
    inputStyle: {
      color: theme.text,
      fontFamily: "regularFont",
    },
    inputContainerStyle: {
      borderWidth: 1,
      backgroundColor: theme.white,
      borderRadius: 25,
      width: deviceWidth - 60,
      borderColor: theme.indigo4,
      height: 40,
      display: "flex",
      flexDirection: "row",
      paddingLeft: 0,
    },
    filterTitleStyle: {
      color: theme.theme == "dark" ? theme.purple2 : theme.purple,
      fontSize: 18,
      fontFamily: "regularFont",
    },
    filterIcon: {
      paddingRight: 6,
      fontSize: 20,
      color: theme.purple2,
    },
    listContainerStyle: {
      borderBottomColor: theme.indigo4,
      borderBottomWidth: 1,
      backgroundColor: "transparent",
    },
    listItemTitle: {
      color: theme.text2,
      marginBottom: -2,
      marginTop: -2,
      fontSize: 16,
      fontFamily: "regularFont",
    },
    searchHistoryTitle: {
      color: theme.pink1,
      fontFamily: "boldFont",
    },
    clear: {
      color: theme.text2,
      marginLeft: 5,
      marginRight: -5,
      marginTop: 8,
    },
    cityRegionRow: {
      position: "absolute",
      right: 0,
      fontFamily: "regularItalicFont",
      color: theme.pink1,
    },
    pressed: {
      backgroundColor: theme.base3,
    },
    notPressed: {
      backgroundColor: theme.base1,
    },
    filterPressed: {
      backgroundColor: theme.white,
    },
    filterNotPressed: {
      backgroundColor: theme.pink2,
    },
    goToFilterText: {
      marginHorizontal: 40,
      padding: 5,
      fontFamily: "regularItalicFont",
      lineHeight: 18,
      color: theme.text3,
      backgroundColor: theme.base2,
      textAlign: "center",
    },
    link: {
      textDecorationLine: "underline",
      color: theme.purple,
    },
  });

Search.propTypes = {
  navigate: PropTypes.func,
  regions: PropTypes.object,
  query: PropTypes.object,
  updateCoordinates: PropTypes.func,
  getLocationsConsideringZoom: PropTypes.func,
  getLocationsByRegion: PropTypes.func,
  getLocationsFailure: PropTypes.func,
  setSearchBarText: PropTypes.func,
  clearSearchBarText: PropTypes.func,
  updateCoordinatesAndGetLocations: PropTypes.func,
};

const mapStateToProps = ({ regions, query, user }) => ({
  regions,
  query,
  user,
});
const mapDispatchToProps = (dispatch) => ({
  updateCoordinatesAndGetLocations: (lat, lon) =>
    dispatch(updateCoordinatesAndGetLocations(lat, lon)),
  updateCoordinates: (lat, lon, latDelta, lonDelta) =>
    dispatch(updateCoordinates(lat, lon, latDelta, lonDelta)),
  getLocationsConsideringZoom: (lat, lon, latDelta, lonDelta) =>
    dispatch(getLocationsConsideringZoom(lat, lon, latDelta, lonDelta)),
  getLocationsByRegion: (region) => dispatch(getLocationsByRegion(region)),
  getLocationsFailure: () => dispatch(getLocationsFailure()),
  setSearchBarText: (searchBarText) =>
    dispatch(setSearchBarText(searchBarText)),
  clearSearchBarText: () => dispatch(clearSearchBarText()),
  dispatch,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withThemeHOC(Search));
