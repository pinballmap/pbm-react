import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import PropTypes from "prop-types";
import { useDispatch, useSelector, connect } from "react-redux";
import { getSelectedMapLocation, selectingMapMarker } from "../selectors";
import { setSelectedMapMarker } from "../actions";
import { sleep } from "../utils";
import { ThemeContext } from "../theme-context";
import ActivityIndicator from "./ActivityIndicator";
import Text from "./PbmText";
import FavoriteLocation from "./FavoriteLocation";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from "@rneui/base";

const NUM_MACHINES_TO_SHOW = 5;

const LocationBottomSheet = React.memo(({ navigation, locations }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const dispatch = useDispatch();
  const location = useSelector(getSelectedMapLocation);
  const isBlocking = useSelector(selectingMapMarker);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (isBlocking) {
        setLoading(true);
        await sleep(250);
        dispatch(setSelectedMapMarker());
        setLoading(false);
      }
    })();
  }, [isBlocking]);

  if (!location) return null;

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
  } = location;
  const cityState = state ? `${city}, ${state}` : city;

  const locationType = locations.locationTypes.find(
    (location) => location.id === location_type_id,
  );

  return (
    <View style={s.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Pressable
          style={({ pressed }) => [
            s.containerStyle,
            pressed ? s.pressed : s.notPressed,
          ]}
          onPress={() => navigation.navigate("LocationDetails", { id })}
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
              <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
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
                    {machine_names_first.map((m) => {
                      const idx =
                        typeof m === "string" ? m.lastIndexOf("(") : -1;
                      const title =
                        typeof m === "string" ? m.slice(0, idx) : m.name;
                      const key = typeof m === "string" ? m : m.name;
                      return (
                        <Text key={key} style={s.machineName}>
                          <Text
                            style={{ fontFamily: "semiBoldFont", fontSize: 14 }}
                          >
                            {title}
                          </Text>
                        </Text>
                      );
                    })}
                  </Text>
                  {num_machines > NUM_MACHINES_TO_SHOW ? (
                    <Text style={[s.plus, s.italic]}>{`Plus ${
                      num_machines - NUM_MACHINES_TO_SHOW
                    } more!`}</Text>
                  ) : null}
                </View>
              </View>
              <View style={s.locationTypeContainer}>
                <View style={s.vertAlign}>
                  <Icon
                    name={locationType.icon}
                    type={locationType.library}
                    color={theme.indigo4}
                    size={30}
                    style={s.icon}
                  />
                  <Text
                    style={{
                      marginRight: 12,
                      color: theme.text3,
                      fontFamily: "boldFont",
                    }}
                  >
                    {" "}
                    {locationType.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
});

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: theme.base1,
      width: "100%",
      height: 210,
    },
    containerStyle: {
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
      marginBottom: -7,
      color: theme.theme == "dark" ? theme.text : theme.pink1,
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
      fontFamily: "blackFont",
      fontSize: 20,
      textAlign: "left",
      color: theme.purpleLight,
    },
    locationTypeContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      paddingVertical: 8,
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
      marginTop: 10,
      marginLeft: 5,
    },
    vertAlign: {
      flexDirection: "row",
      alignItems: "center",
    },
    address: {
      color: theme.text3,
      fontFamily: "mediumFont",
      fontSize: 15,
      flex: 1,
      marginBottom: 3,
    },
    text: {
      color: theme.text,
    },
    text3: {
      color: theme.text3,
    },
    manufacturer: {
      color: theme.theme == "dark" ? theme.pink1 : theme.text3,
      fontFamily: "mediumFont",
      fontSize: 15,
    },
    mediumFont: {
      fontFamily: "mediumFont",
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
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      shadowColor: theme.shadow,
    },
    icon: {
      fontSize: 30,
      color: theme.indigo4,
      opacity: 0.8,
      marginRight: 1,
    },
  });

LocationBottomSheet.propTypes = {
  sheetRef: PropTypes.object,
  index: PropTypes.number,
  navigation: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = ({ locations }) => ({ locations });
export default connect(mapStateToProps)(LocationBottomSheet);
