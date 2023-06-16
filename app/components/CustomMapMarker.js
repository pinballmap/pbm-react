import React from "react";
import PropTypes from "prop-types";
import * as MapView from "react-native-maps";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IosHeartMarker from "./IosHeartMarker";
import IosMarker from "./IosMarker";
import Text from "./PbmText";
let deviceWidth = Dimensions.get("window").width;

const MarkerDot = React.memo(({ numMachines, icon }) =>
  icon === "dot" ? (
    <IosMarker numMachines={numMachines} />
  ) : (
    <IosHeartMarker numMachines={numMachines} />
  ),
);

MarkerDot.propTypes = {
  numMachines: PropTypes.number,
};

const CustomMapMarker = React.memo(({ marker, navigation }) => {
  const { city, state, street, zip, name, num_machines, lat, lon, id, icon } =
    marker;
  const cityState = state ? `${city}, ${state}` : city;

  return (
    <MapView.Marker
      key={id}
      coordinate={{
        latitude: Number(lat),
        longitude: Number(lon),
      }}
    >
      <MarkerDot numMachines={num_machines} icon={icon} />
      <MapView.Callout
        onPress={() => navigation.navigate("LocationDetails", { id })}
      >
        <View>
          <View style={s.calloutStyle}>
            <Text
              style={{
                marginRight: 20,
                color: "#000e18",
                fontFamily: "boldFont",
              }}
            >
              {name}
            </Text>
            <Text
              style={{ marginRight: 20, color: "#000e18", marginTop: 5 }}
            >{`${street}, ${cityState} ${zip}`}</Text>
            {Platform.OS === "android" ? (
              <Text
                style={{ color: "#000e18", marginTop: 5 }}
              >{`${num_machines} machine${num_machines > 1 ? "s" : ""}`}</Text>
            ) : null}
          </View>
          <Ionicons
            style={s.iconStyle}
            name="ios-arrow-forward-circle-outline"
          />
        </View>
      </MapView.Callout>
    </MapView.Marker>
  );
});

CustomMapMarker.propTypes = {
  marker: PropTypes.object,
  navigation: PropTypes.object,
};

const s = StyleSheet.create({
  calloutStyle: {
    minWidth: 50,
    width: "100%",
    maxWidth: deviceWidth < 325 ? deviceWidth - 50 : 275,
    height: Platform.OS === "ios" ? 70 : 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-around",
    zIndex: 5,
    marginRight: 7,
  },
  iconStyle: {
    fontSize: 26,
    color: "#c1c9cf",
    position: "absolute",
    top: Platform.OS === "ios" ? 20 : 30,
    right: Platform.OS === "ios" ? -5 : 2,
    zIndex: 0,
  },
});

export default CustomMapMarker;
