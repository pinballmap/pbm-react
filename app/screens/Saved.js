import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeContext } from "../theme-context";
import { LocationCard, NotLoggedIn, Text } from "../components";
import { getDistance, getDistanceWithUnit } from "../utils/utilityFunctions";
import { selectFavoriteLocationFilterBy } from "../actions/user_actions";
import { FlashList } from "@shopify/flash-list";

const moment = require("moment");

export class Saved extends Component {
  state = {
    locations: this.props.user.faveLocations,
  };

  updateIndex = (buttonIndex) =>
    this.props.selectFavoriteLocationFilterBy(buttonIndex);

  sortLocations(locations, idx) {
    switch (idx) {
      case 0:
        return this.setState({
          locations: locations.sort(
            (a, b) =>
              getDistance(
                this.props.user.lat,
                this.props.user.lon,
                a.location.lat,
                a.location.lon,
              ) -
              getDistance(
                this.props.user.lat,
                this.props.user.lon,
                b.location.lat,
                b.location.lon,
              ),
          ),
        });
      case 1:
        return this.setState({
          locations: locations.sort((a, b) => {
            const locA = a.location.name.toUpperCase();
            const locB = b.location.name.toUpperCase();
            return locA < locB ? -1 : locA === locB ? 0 : 1;
          }),
        });
      case 2:
        return this.setState({
          locations: locations.sort(
            (a, b) =>
              moment(b.updated_at, "YYYY-MM-DDTh:mm:ss").unix() -
              moment(a.updated_at, "YYYY-MM-DDTh:mm:ss").unix(),
          ),
        });
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.props.user.faveLocations !== props.user.faveLocations) {
      this.sortLocations(
        props.user.faveLocations,
        this.props.user.selectedFavoriteLocationFilter,
      );
    }

    if (
      this.props.user.selectedFavoriteLocationFilter !==
      props.user.selectedFavoriteLocationFilter
    ) {
      this.sortLocations(
        props.user.faveLocations,
        props.user.selectedFavoriteLocationFilter,
      );
    }
  }

  componentDidMount() {
    this.sortLocations(
      this.state.locations,
      this.props.user.selectedFavoriteLocationFilter,
    );
  }

  render() {
    const { loggedIn, unitPreference } = this.props.user;

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
          return (
            <View style={s.background}>
              {!loggedIn ? (
                <NotLoggedIn
                  text={`Please log in to start saving your favorite locations.`}
                  onPress={() => this.props.navigation.navigate("Login")}
                />
              ) : (
                <View style={{ flex: 1 }}>
                  {this.state.locations.length > 0 ? (
                    <View style={{ flex: 1 }}>
                      <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={
                          this.props.user.selectedFavoriteLocationFilter
                        }
                        buttons={["Distance", "Alphabetically", "Last Added"]}
                        containerStyle={s.buttonGroupContainer}
                        textStyle={s.buttonGroupInactive}
                        selectedButtonStyle={s.selButtonStyle}
                        selectedTextStyle={s.selTextStyle}
                        innerBorderStyle={s.innerBorderStyle}
                      />
                      <View
                        style={{
                          flex: 1,
                          position: "absolute",
                          left: 0,
                          top: 55,
                          bottom: 0,
                          right: 0,
                        }}
                      >
                        <FlashList
                          estimatedItemSize={400}
                          data={this.state.locations}
                          extraData={this.state}
                          renderItem={({ item }) => (
                            <LocationCard
                              locationType={
                                item.location.location_type_id
                                  ? this.props.locations.locationTypes.find(
                                      (location) =>
                                        location.id ===
                                        item.location.location_type_id,
                                    )
                                  : {}
                              }
                              name={item.location.name}
                              distance={getDistanceWithUnit(
                                this.props.user.lat,
                                this.props.user.lon,
                                item.location.lat,
                                item.location.lon,
                                unitPreference,
                              )}
                              street={item.location.street}
                              city={item.location.city}
                              state={item.location.state}
                              zip={item.location.zip}
                              machines={item.location.machines}
                              navigation={this.props.navigation}
                              id={item.location.id}
                              saved
                            />
                          )}
                          keyExtractor={(item) => `list-item-${item.id}`}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={{ margin: 15 }}>
                      <Text
                        style={s.noSaved}
                      >{`You have no saved locations.`}</Text>
                      <FontAwesome name="heart-o" style={s.savedIcon} />
                      <Text
                        style={{ fontSize: 18, textAlign: "center" }}
                      >{`To save your favorite locations, lookup a location then click the heart icon.`}</Text>
                    </View>
                  )}
                </View>
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
      flex: 1,
      backgroundColor: theme.base1,
    },
    buttonStyle: {
      backgroundColor: theme.blue2,
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
      fontFamily: "mediumFont",
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
      fontFamily: "boldFont",
    },
    savedIcon: {
      fontSize: 50,
      marginTop: 15,
      marginBottom: 15,
      textAlign: "center",
      color: theme.red2,
    },
    noSaved: {
      fontSize: 18,
      textAlign: "center",
      color: theme.text2,
    },
  });

Saved.propTypes = {
  locations: PropTypes.object,
  user: PropTypes.object,
  navigation: PropTypes.object,
  selectFavoriteLocationFilterBy: PropTypes.func,
};

const mapStateToProps = ({ locations, user }) => ({ locations, user });
const mapDispatchToProps = (dispatch) => ({
  selectFavoriteLocationFilterBy: (idx) =>
    dispatch(selectFavoriteLocationFilterBy(idx)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Saved);
