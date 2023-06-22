import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import IosHeartMarker from "./IosHeartMarker";
import IosMarker from "./IosMarker";
import Text from "./PbmText";
let deviceWidth = Dimensions.get("window").width;

Mapbox.setAccessToken(process.env.MAPBOX_PUBLIC);

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

  // const CustomMarker = () => (
  //   <Mapbox.Image source={require('../assets/images/markerdot-heart.png')} />
  // );
  const [selectedLocation, setSelectedLocation] = useState(false);

  return (
    <>
      <Mapbox.PointAnnotation
        id={JSON.stringify(id)}
        key={id}
        coordinate={[Number(lon), Number(lat)]}
        anchor={{ x: 0.5, y: 0.5 }}
        onSelected={() => setSelectedLocation(marker)}
      >
        <MarkerDot numMachines={num_machines} icon={icon} />

        {/* <Mapbox.Callout
        style={s.calloutStyle}
        onPress={() => navigation.navigate("LocationDetails", { id })} // ONPRESS DOES NOT SEEM TO WORK IN A CALLOUT
      >
        <View>
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
          <Ionicons
            style={s.iconStyle}
            name="ios-arrow-forward-circle-outline"
          />
        </View>
      </Mapbox.Callout> */}
      </Mapbox.PointAnnotation>
      {/* AN ATTEMPT AT A CUSTOM CALLOUT. BASICALLY IT WAS AN ATTEMPT TO GET TOUCHABLEOPACITY TO WORK
    BUT IT DOES NOT. I ALSO TRIED PRESSABLE. I CAN'T GET THE CALLOUTS TO BE CLICKABLE! */}
      {selectedLocation && (
        <Mapbox.MarkerView
          id="locationView"
          coordinate={[Number(lon), Number(lat)]}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 13,
            }}
          >
            <Pressable
              onPress={() => {
                console.log("Marker View Button pressed!");
                navigation.navigate("LocationDetails", { id });
              }}
            >
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
              </View>
            </Pressable>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: 15,
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopColor: "#FFF",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
              }}
            />
          </View>
        </Mapbox.MarkerView>
      )}
    </>
  );
});

CustomMapMarker.propTypes = {
  marker: PropTypes.object,
  navigation: PropTypes.object,
};

const s = StyleSheet.create({
  calloutStyle: {
    width: "100%",
    maxWidth: deviceWidth < 325 ? deviceWidth - 50 : 275,
    height: Platform.OS === "ios" ? 70 : 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-around",
    zIndex: 5,
    marginRight: 7,
    minWidth: 200,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 8,
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
