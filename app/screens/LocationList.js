import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Linking, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import {
  ButtonGroup,
  ConfirmationModal,
  LocationCard,
  Text,
} from "../components";
import { getDistance, getDistanceWithUnit } from "../utils/utilityFunctions";
import { selectLocationListFilterBy } from "../actions/locations_actions";
import { FlashList } from "@shopify/flash-list";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const moment = require("moment");

export class LocationList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: this.props.locations.mapLocations,
      showNoLocationTrackingModal: false,
    };
  }

  updateIndex = (buttonIndex) => {
    if (buttonIndex === 0 && !this.props.user.locationTrackingServicesEnabled) {
      this.setState({ showNoLocationTrackingModal: true });
    }
    this.props.selectLocationListFilterBy(buttonIndex);
    this.sortLocations(this.state.locations, buttonIndex);
  };

  sortLocations(locations, idx) {
    switch (idx) {
      case 0:
        return this.setState({
          locations: locations.sort(
            (a, b) =>
              getDistance(
                this.props.user.lat,
                this.props.user.lon,
                a.lat,
                a.lon,
              ) -
              getDistance(
                this.props.user.lat,
                this.props.user.lon,
                b.lat,
                b.lon,
              ),
          ),
        });
      case 1:
        return this.setState({
          locations: locations.sort((a, b) => {
            const locA = a.name.toUpperCase();
            const locB = b.name.toUpperCase();
            return locA < locB ? -1 : locA === locB ? 0 : 1;
          }),
        });
      case 2:
        return this.setState({
          locations: locations.sort(
            (a, b) => b.machine_count - a.machine_count,
          ),
        });
      case 3:
        return this.setState({
          locations: locations.sort(
            (a, b) =>
              moment(b.updated_at, "YYYY-MM-DDTh:mm:ss").unix() -
              moment(a.updated_at, "YYYY-MM-DDTh:mm:ss").unix(),
          ),
        });
    }
  }

  componentDidMount() {
    this.sortLocations(
      this.state.locations,
      this.props.locations.selectedLocationListFilter,
    );
  }

  render() {
    const { lat, lon, locationTrackingServicesEnabled, unitPreference } =
      this.props.user;
    const { locations = [], showNoLocationTrackingModal } = this.state;

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
          return (
            <>
              <ConfirmationModal visible={showNoLocationTrackingModal}>
                <View>
                  <Text style={s.confirmText}>
                    Location tracking must be enabled to use this feature!
                  </Text>
                  <Text
                    style={[s.confirmText, s.link, s.margin10]}
                    onPress={() => Linking.openSettings()}
                  >
                    Go to phone settings to enable.
                  </Text>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={45}
                    onPress={() =>
                      this.setState({ showNoLocationTrackingModal: false })
                    }
                    style={s.xButton}
                  />
                </View>
              </ConfirmationModal>
              <View style={{ flex: 1, backgroundColor: theme.base1 }}>
                <ButtonGroup
                  onPress={this.updateIndex}
                  selectedIndex={
                    this.props.locations.selectedLocationListFilter
                  }
                  buttons={["Near", "A-Z", "# Pins", "Date"]}
                  containerStyle={s.buttonGroupContainer}
                  textStyle={s.buttonGroupInactive}
                  selectedButtonStyle={s.selButtonStyle}
                  selectedTextStyle={s.selTextStyle}
                  innerBorderStyle={s.innerBorderStyle}
                />
                <FlashList
                  estimatedItemSize={400}
                  data={locations}
                  extraData={this.state}
                  renderItem={({ item }) => (
                    <LocationCard
                      locationType={
                        item.location_type_id
                          ? this.props.locations.locationTypes.find(
                              (location) =>
                                location.id === item.location_type_id,
                            )
                          : {}
                      }
                      name={item.name}
                      distance={
                        locationTrackingServicesEnabled
                          ? getDistanceWithUnit(
                              lat,
                              lon,
                              item.lat,
                              item.lon,
                              unitPreference,
                            )
                          : undefined
                      }
                      street={item.street}
                      city={item.city}
                      state={item.state}
                      zip={item.zip}
                      machines={item.machine_names_first}
                      navigation={this.props.navigation}
                      id={item.id}
                      numMachines={item.machine_count}
                    />
                  )}
                  keyExtractor={(item, index) => `list-item-${index}`}
                />
              </View>
            </>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const getStyles = (theme) =>
  StyleSheet.create({
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
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "Nunito-Regular",
      color: theme.purple,
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -40,
      color: theme.red2,
    },
    margin10: {
      marginTop: 10,
      marginBottom: 5,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
  });

LocationList.propTypes = {
  locations: PropTypes.object,
  user: PropTypes.object,
  navigation: PropTypes.object,
  selectLocationListFilterBy: PropTypes.func,
};

const mapStateToProps = ({ locations, user }) => ({ locations, user });
const mapDispatchToProps = (dispatch) => ({
  selectLocationListFilterBy: (idx) =>
    dispatch(selectLocationListFilterBy(idx)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
