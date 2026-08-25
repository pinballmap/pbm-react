import React, { useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Animated, StyleSheet, Text, Pressable, View } from "react-native";
import { ThemeContext } from "../theme-context";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import FavoriteLocation from "./FavoriteLocation";
import { CustomIcon } from "../components";
import { PAYMENT_TYPE_FREE_PLAY } from "../utils/constants";
import { formatAddress } from "../utils/utilityFunctions";

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
  notInListCount,
  userId,
  allAges,
  paymentType,
}) => {
  const { theme } = useContext(ThemeContext);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const s = getStyles(theme);
  const { name: type, icon, library } = locationType;
  const cityState = state ? `${city}, ${state}` : city;
  const allAgesLabel =
    allAges === "Yes"
      ? "All Ages"
      : allAges === "At Times"
        ? "All Ages At Times"
        : null;
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
                <Text style={[s.locationName, s.extraBold]}>
                  {locationName}
                </Text>
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
                  style={[s.address, s.medium]}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {formatAddress(street, cityState, zip)}
                </Text>
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
                      <Text style={[s.extraBold, { fontSize: 17 }]}>
                        {title}
                      </Text>
                      <Text
                        style={[s.manufacturer, s.medium]}
                      >{`${info}`}</Text>
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
            {type ||
            distance ||
            notInListCount ||
            allAgesLabel ||
            paymentType === PAYMENT_TYPE_FREE_PLAY ? (
              <View style={s.locationTypeContainer}>
                {distance ? (
                  <View style={s.vertAlign}>
                    <MaterialCommunityIcons name="compass" style={s.icon} />
                    <Text style={[s.semiBold, s.text2]}> {distance}</Text>
                  </View>
                ) : null}
                {type ? (
                  <View style={s.vertAlign}>
                    <CustomIcon
                      name={icon}
                      size={30}
                      color={theme.theme == "dark" ? theme.pink1 : theme.pink3}
                      type={library}
                      style={s.icon}
                    />
                    <Text style={[s.semiBold, s.text2]}> {type}</Text>
                  </View>
                ) : null}
                {allAgesLabel ? (
                  <View style={s.vertAlign}>
                    <MaterialCommunityIcons
                      name="human-male-child"
                      style={s.icon}
                    />
                    <Text style={[s.semiBold, s.text2]}> {allAgesLabel}</Text>
                  </View>
                ) : null}
                {paymentType === PAYMENT_TYPE_FREE_PLAY ? (
                  <View style={s.vertAlign}>
                    <FontAwesome6
                      name="coins"
                      iconStyle="solid"
                      style={s.icon}
                    />
                    <Text style={[s.semiBold, s.text2]}> {paymentType}</Text>
                  </View>
                ) : null}
                {notInListCount ? (
                  <View style={s.vertAlign}>
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      style={s.icon}
                    />
                    <Text style={[s.semiBold, s.text2]}>
                      {" "}
                      {notInListCount} not in{" "}
                    </Text>
                    <Text
                      style={[s.lifeListLink, s.semiBold]}
                      onPress={() =>
                        navigation.navigate("UserProfilePublic", {
                          userId,
                          scrollToMachineList: true,
                        })
                      }
                    >
                      list
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
    italic: {
      fontFamily: "Nunito",
      fontWeight: "400",
      fontStyle: "italic",
    },
    medium: {
      fontFamily: "Nunito",
      fontWeight: "500",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
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
      marginBottom: 10,
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
      alignSelf: "flex-start",
      height: 34,
      width: 34,
      marginRight: 10,
      marginTop: 4,
    },
    locationName: {
      fontSize: 22,
      lineHeight: 26,
      textAlign: "left",
      color: theme.theme === "dark" ? theme.pink3 : theme.pink1,
    },
    locationTypeContainer: {
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 6,
      columnGap: 15,
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
    text2: {
      color: theme.text2,
    },
    address: {
      color: theme.text3,
      fontSize: 15,
      flex: 1,
    },
    manufacturer: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.text3,
      fontSize: 17,
    },
    pressed: {
      opacity: 0.8,
    },
    notPressed: {
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
    icon: {
      fontSize: 28,
      color: theme.theme == "dark" ? theme.pink1 : theme.pink3,
      marginRight: 1,
    },
    lifeListLink: {
      textDecorationLine: "underline",
      color: theme.text2,
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
  notInListCount: PropTypes.number,
  userId: PropTypes.number,
  allAges: PropTypes.string,
  paymentType: PropTypes.string,
};

export default LocationCard;
