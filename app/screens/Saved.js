import React, { useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import FontAwesome5 from "@react-native-vector-icons/fontawesome5/static";
import { ThemeContext } from "../theme-context";
import { ButtonGroup, LocationCard, NotLoggedIn, Text } from "../components";
import { getDistance, getDistanceWithUnit } from "../utils/utilityFunctions";
import {
  selectFavoriteLocationFilterBy,
  fetchLifeListMachineIds,
} from "../actions/user_actions";

let deviceWidth = Dimensions.get("window").width;

const sortLocations = (locations, idx, lat, lon) => {
  const locs = [...locations];
  switch (idx) {
    case 0:
      return locs.sort(
        (a, b) =>
          getDistance(lat, lon, a.location.lat, a.location.lon) -
          getDistance(lat, lon, b.location.lat, b.location.lon),
      );
    case 1:
      return locs.sort((a, b) => {
        const locA = a.location.name.toUpperCase();
        const locB = b.location.name.toUpperCase();
        return locA < locB ? -1 : locA === locB ? 0 : 1;
      });
    case 2:
      return locs.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );
    default:
      return locs;
  }
};

export const Saved = ({
  locations,
  user,
  navigation,
  selectFavoriteLocationFilterBy,
  fetchLifeListMachineIds,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const {
    id: userId,
    loggedIn,
    unitPreference,
    faveLocations,
    selectedFavoriteLocationFilter,
    lat,
    lon,
    lifeListMachineIds,
  } = user;

  const sortedLocations = useMemo(
    () =>
      sortLocations(faveLocations, selectedFavoriteLocationFilter, lat, lon),
    [faveLocations, selectedFavoriteLocationFilter],
  );
  const lifeListMachineIdSet = useMemo(
    () => new Set(lifeListMachineIds),
    [lifeListMachineIds],
  );

  // Keep the "not in list" counts fresh every time this screen is viewed,
  // since machines can be added/removed from the life list elsewhere (e.g.
  // MachineDetails) without this screen knowing.
  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (loggedIn) fetchLifeListMachineIds();
    });
  }, [navigation, loggedIn]); // eslint-disable-line

  return (
    <View style={s.background}>
      {!loggedIn ? (
        <NotLoggedIn
          text={`Please log in to start saving your favorite locations.`}
          onPress={() => navigation.navigate("Login")}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {sortedLocations.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ButtonGroup
                onPress={selectFavoriteLocationFilterBy}
                selectedIndex={selectedFavoriteLocationFilter}
                buttons={["Near", "A-Z", "Added"]}
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
                <FlatList
                  data={sortedLocations}
                  keyExtractor={(item) => `saved-${item.location.id}`}
                  renderItem={({ item }) => (
                    <LocationCard
                      locationType={
                        item.location.location_type_id
                          ? (locations.locationTypes.find(
                              (l) => l.id === item.location.location_type_id,
                            ) ?? {})
                          : {}
                      }
                      name={item.location.name}
                      distance={getDistanceWithUnit(
                        lat,
                        lon,
                        item.location.lat,
                        item.location.lon,
                        unitPreference,
                      )}
                      numMachines={item.location.machines.length}
                      street={item.location.street}
                      city={item.location.city}
                      state={item.location.state}
                      zip={item.location.zip}
                      machines={item.location.machines}
                      navigation={navigation}
                      id={item.location.id}
                      saved
                      notInListCount={
                        loggedIn && lifeListMachineIds.length > 0
                          ? item.location.machines.filter(
                              (machine) =>
                                !lifeListMachineIdSet.has(machine.id),
                            ).length
                          : undefined
                      }
                      userId={userId}
                    />
                  )}
                />
              </View>
            </View>
          ) : (
            <View style={{ margin: 15 }}>
              <Text style={s.noSaved}>{`You have no saved locations.`}</Text>
              <FontAwesome5 name="heart" style={s.savedIcon} />
              <Text
                style={{ fontSize: 18, textAlign: "center" }}
              >{`To save your favorite locations, lookup a location then click the heart icon.`}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
    },
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
      fontSize: deviceWidth < 321 ? 12 : 14,
      fontFamily: "Nunito-SemiBold",
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
  fetchLifeListMachineIds: PropTypes.func,
};

const mapStateToProps = ({ locations, user }) => ({ locations, user });
const mapDispatchToProps = (dispatch) => ({
  selectFavoriteLocationFilterBy: (idx) =>
    dispatch(selectFavoriteLocationFilterBy(idx)),
  fetchLifeListMachineIds: () => dispatch(fetchLifeListMachineIds()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Saved);
