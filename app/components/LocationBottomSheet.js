import React, { useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ThemeContext } from "../theme-context";
import Text from "./PbmText";
import FavoriteLocation from "./FavoriteLocation";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from "@rneui/base";
import { getDistanceWithUnit } from "../utils/utilityFunctions";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const NUM_MACHINES_TO_SHOW = 5;

const LocationBottomSheet = React.memo(
  ({ navigation, location, locations, user, setToCurrentBounds }) => {
    const { theme } = useContext(ThemeContext);
    const s = getStyles(theme);

    const {
      city,
      id,
      name,
      state,
      zip,
      machine_names_first,
      num_machines,
      street,
      location_type_id,
      lat,
      lon,
    } = location;
    const cityState = state ? `${city}, ${state}` : city;

    const locationType = locations.locationTypes.find(
      (location) => location.id === location_type_id,
    );

    const onPress = async () => {
      await setToCurrentBounds();
      navigation.navigate("LocationDetails", { id });
    };

    return (
      <View style={s.container}>
        <Pressable
          style={({ pressed }) => (pressed ? s.pressed : s.notPressed)}
          onPress={onPress}
        >
          <View style={s.flexi}>
            <View style={{ zIndex: 10, flex: 1 }}>
              <View style={s.locationNameContainer}>
                <View style={s.nameItem}>
                  <Text style={s.locationName}>{name}</Text>
                </View>
                <View style={s.heartItem}>
                  <FavoriteLocation
                    locationId={id}
                    navigation={navigation}
                    removeFavorite={(cb) => cb()}
                  />
                </View>
              </View>
              <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                <View style={{ flexDirection: "row" }}>
                  <MaterialIcons name="location-on" style={s.metaIcon} />
                  <Text
                    style={[s.address]}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                  >{`${street}, ${cityState} ${zip}`}</Text>
                </View>
                <View style={s.margin}>
                  <Text>
                    {machine_names_first.map((m, index) => {
                      const idx =
                        typeof m === "string" ? m.lastIndexOf("(") : -1;
                      const title =
                        typeof m === "string" ? m.slice(0, idx) : m.name;
                      const key = typeof m === "string" ? m : m.name;
                      return (
                        <Text key={key}>
                          <Text style={s.machineName}>
                            {`${title.trim()}${
                              index !== machine_names_first.length - 1
                                ? " \u2022 "
                                : ""
                            }`}
                          </Text>
                        </Text>
                      );
                    })}
                    {num_machines > NUM_MACHINES_TO_SHOW ? (
                      <Text style={[s.plus, s.italic]}>{`  ...plus ${
                        num_machines - NUM_MACHINES_TO_SHOW
                      } more!`}</Text>
                    ) : null}
                  </Text>
                </View>
              </View>
              {locationType || user.locationTrackingServicesEnabled ? (
                <View style={s.locationTypeContainer}>
                  {locationType ? (
                    <View style={s.vertAlign}>
                      <Icon
                        name={locationType.icon}
                        type={locationType.library}
                        color={theme.colors.inactiveTab}
                        size={30}
                        style={s.icon}
                      />
                      <Text
                        style={{
                          marginRight: 15,
                          color: theme.text3,
                          fontFamily: "semiBoldFont",
                        }}
                      >
                        {" "}
                        {locationType.name}
                      </Text>
                    </View>
                  ) : null}
                  {user.locationTrackingServicesEnabled ? (
                    <View style={s.vertAlign}>
                      <MaterialCommunityIcons
                        name="compass-outline"
                        style={s.icon}
                      />
                      <Text
                        style={{
                          color: theme.text3,
                          fontFamily: "semiBoldFont",
                        }}
                      >
                        {" "}
                        {getDistanceWithUnit(
                          user.lat,
                          user.lon,
                          lat,
                          lon,
                          user.unitPreference,
                        )}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      </View>
    );
  },
);

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      width: "100%",
      minHeight: 130,
      height: "auto",
      zIndex: 11,
    },
    flexi: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "space-around",
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    plus: {
      color: theme.text3,
    },
    locationNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    nameItem: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 6,
      justifyContent: "center",
    },
    heartItem: {
      justifyContent: "center",
      height: 34,
      width: 34,
      marginRight: 10,
    },
    locationName: {
      fontFamily: "blackFont",
      fontSize: 20,
      lineHeight: 24,
      textAlign: "left",
      color: theme.theme == "dark" ? theme.purpleLight : theme.pink1,
    },
    locationTypeContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      paddingVertical: 6,
      backgroundColor: theme.base3,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
      width: 16,
    },
    margin: {
      marginTop: 2,
      marginLeft: 5,
    },
    vertAlign: {
      flexDirection: "row",
      alignItems: "center",
    },
    address: {
      color: theme.text3,
      fontFamily: "regularFont",
      fontSize: 14,
      flex: 1,
      marginBottom: 5,
    },
    machineName: {
      fontFamily: "boldFont",
      fontSize: 15,
      color: theme.theme == "dark" ? theme.text : theme.purple,
    },
    italic: {
      fontFamily: "regularItalicFont",
    },
    pressed: {
      shadowColor: "transparent",
      opacity: 0.8,
      elevation: 0,
    },
    notPressed: {
      shadowColor: theme.darkShadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
    },
    icon: {
      fontSize: 30,
      opacity: 0.6,
      marginRight: 3,
      color: theme.colors.inactiveTab,
    },
  });

LocationBottomSheet.propTypes = {
  sheetRef: PropTypes.object,
  index: PropTypes.number,
  user: PropTypes.object,
  navigation: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = ({ locations, user }) => ({ locations, user });
export default connect(mapStateToProps)(LocationBottomSheet);
