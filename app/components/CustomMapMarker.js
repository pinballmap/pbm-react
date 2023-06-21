import React from "react";
import PropTypes from "prop-types";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

  // SHAPESOURCE / SYMBOLLAYER SEEMS TO BE THE BEST MARKER SOLUTION, BUT IS MORE COMPLEX. DATA NEEDS TO BE GEOJSON

  // let featuresObject = []

  //     featuresObject[marker] = { // CONSTRUCTING GEOJSON FROM API DATA
  //         type: "Feature",
  //         geometry: {
  //             type: "Point",
  //             coordinates: [lon, lat]
  //         }
  //     }

  return (
    // <>
    //   <Mapbox.ShapeSource
    //     key='icon'
    //     id='customMarkerSource'
    //     existing
    //     onPress={this._onMarkerPress}
    //     shape={{type: "FeatureCollection", features: featuresObject }}
    //     type='geojson'
    //     //images={CustomMarker}
    // >
    //     <Mapbox.SymbolLayer
    //         id='customMarkerLayer'
    //         style={{ iconImage: 'badge', iconSize: 0.5 }}
    //     />
    //     <Mapbox.Images>
    //       <Mapbox.Image name="badge">
    //         <View style={{ justifyContent: 'center', alignItems: 'center', width: 12, height: 12 }}>
    //           <View style={{ width: 6, height: 6, borderColor: 'black', borderWidth: 1, borderRadius: 6, backgroundColor: 'white' }} />
    //         </View>
    //       </Mapbox.Image>
    //     </Mapbox.Images>
    // </Mapbox.ShapeSource>
    // </>

    <Mapbox.PointAnnotation
      id={JSON.stringify(id)}
      key={id}
      coordinate={[Number(lon), Number(lat)]}
    >
      <MarkerDot numMachines={num_machines} icon={icon} />
      <Mapbox.Callout
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
      </Mapbox.Callout>
    </Mapbox.PointAnnotation>
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
