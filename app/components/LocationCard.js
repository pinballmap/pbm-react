import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { Icon } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import FavoriteLocation from "./FavoriteLocation";

const NUM_MACHINES_TO_SHOW = 5;

const LocationCard = ({
  distance,
  id,
  machines = [],
  numMachines,
  name: locationName,
  navigation,
  state,
  street,
  city,
  locationType,
  zip,
  saved = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const s = getStyles(theme);
  const { name: type, icon, library } = locationType;
  const cityState = state ? `${city}, ${state}` : city;
  const removeFavorite = (cb) => {
    saved
      ? Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          cb();
        })
      : cb();
  };
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Pressable
        style={({ pressed }) => [
          s.containerStyle,
          pressed ? s.pressed : s.notPressed,
        ]}
        onPress={() =>
          navigation.navigate("LocationDetails", {
            id,
          })
        }
      >
        <View style={s.flexi}>
          <View style={{ zIndex: 10, flex: 1 }}>
            <View style={s.locationNameContainer}>
              <View style={s.nameItem}>
                <Text style={s.locationName}>{locationName}</Text>
              </View>
              <View style={s.heartItem}>
                <FavoriteLocation
                  locationId={id}
                  navigation={navigation}
                  removeFavorite={removeFavorite}
                />
              </View>
            </View>
            <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="location-on" style={s.metaIcon} />
                <Text
                  style={[s.address]}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >{`${street}, ${cityState} ${zip}`}</Text>
              </View>
              <View style={s.margin}>
                {machines.slice(0, NUM_MACHINES_TO_SHOW).map((m) => {
                  const idx = typeof m === "string" ? m.lastIndexOf("(") : -1;
                  const title =
                    typeof m === "string" ? m.slice(0, idx) : m.name;
                  const info =
                    typeof m === "string"
                      ? m.slice(idx)
                      : ` (${m.manufacturer}, ${m.year})`;
                  const key =
                    typeof m === "string"
                      ? m
                      : `${m.name}-${m.manufacturer}-${m.year}`;
                  return (
                    <Text key={key} style={s.machineName}>
                      <Text
                        style={{ fontFamily: "Nunito-ExtraBold", fontSize: 18 }}
                      >
                        {title}
                      </Text>
                      <Text
                        style={[s.manufacturer, s.mediumFont]}
                      >{`${info}\n`}</Text>
                    </Text>
                  );
                })}
                {numMachines > NUM_MACHINES_TO_SHOW ? (
                  <Text style={[s.plus, s.italic]}>{`Plus ${
                    numMachines - NUM_MACHINES_TO_SHOW
                  } more!`}</Text>
                ) : null}
              </View>
            </View>
            {type || distance ? (
              <View style={s.locationTypeContainer}>
                {distance ? (
                  <View style={s.vertAlign}>
                    <MaterialCommunityIcons name="compass" style={s.icon} />
                    <Text
                      style={{
                        marginRight: 15,
                        color: theme.text2,
                        fontFamily: "Nunito-Bold",
                      }}
                    >
                      {" "}
                      {distance}
                    </Text>
                  </View>
                ) : null}
                {type ? (
                  <View style={s.vertAlign}>
                    <Icon
                      name={icon}
                      type={library}
                      color={theme.theme == "dark" ? theme.pink1 : theme.pink3}
                      size={30}
                      style={s.icon}
                    />
                    <Text
                      style={{
                        color: theme.text2,
                        fontFamily: "Nunito-Bold",
                      }}
                    >
                      {" "}
                      {type}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    containerStyle: {
      borderRadius: 15,
      marginVertical: 12,
      marginHorizontal: 20,
      backgroundColor: theme.white,
      borderColor: "transparent",
      borderWidth: 2,
    },
    flexi: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "space-around",
    },
    machineName: {
      marginBottom: Platform.OS === "android" ? 0 : -12,
      color: theme.theme == "dark" ? theme.text : theme.purple,
    },
    plus: {
      marginBottom: 10,
      color: theme.text2,
    },
    locationNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    nameItem: {
      flex: 1,
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: "center",
    },
    heartItem: {
      justifyContent: "center",
      height: 34,
      width: 34,
      marginRight: 10,
    },
    locationName: {
      fontFamily: "Nunito-ExtraBold",
      fontSize: 24,
      lineHeight: 28,
      textAlign: "left",
      color: theme.pink1,
    },
    locationTypeContainer: {
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
      marginBottom: -2,
      marginHorizontal: -2,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      backgroundColor: theme.base2,
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
      marginTop: 10,
      marginLeft: 5,
    },
    vertAlign: {
      flexDirection: "row",
      alignItems: "center",
    },
    address: {
      color: theme.text3,
      fontFamily: "Nunito-Medium",
      fontSize: 15,
      flex: 1,
    },
    text: {
      color: theme.text,
    },
    text3: {
      color: theme.text3,
    },
    manufacturer: {
      color: theme.theme == "dark" ? theme.pink1 : theme.text3,
      fontFamily: "Nunito-Medium",
      fontSize: 18,
    },
    mediumFont: {
      fontFamily: "Nunito-Medium",
    },
    italic: {
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    pressed: {
      opacity: 0.8,
    },
    notPressed: {
      boxShadow:
        theme.theme == "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3)",
    },
    icon: {
      fontSize: 28,
      color: theme.theme == "dark" ? theme.pink1 : theme.pink3,
      marginRight: 1,
    },
  });

LocationCard.propTypes = {
  machines: PropTypes.array,
  locationType: PropTypes.object,
  type: PropTypes.string,
  zip: PropTypes.string,
  state: PropTypes.string,
  distance: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.number,
  street: PropTypes.string,
  city: PropTypes.string,
  navigation: PropTypes.object,
  saved: PropTypes.bool,
  removeFavoriteLocation: PropTypes.func,
};

export default LocationCard;
