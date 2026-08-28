import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { loginLater } from "../actions";
import { getData } from "../config/request";
import { formatNumWithCommas } from "../utils/utilityFunctions";

const SignupLogin = ({ navigation, loginLater }) => {
  const s = getStyles();
  const [allLocationsCount, setAllLocationsCount] = useState(null);
  const [allMachinesCount, setAllMachinesCount] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    getData("/regions/location_and_machine_counts.json").then((data) => {
      if (!isCancelled && data && data.num_lmxes && data.num_locations) {
        setAllLocationsCount(data.num_locations);
        setAllMachinesCount(data.num_lmxes);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <View style={[s.mask]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={s.justify}>
          <View style={s.logoWrapper}>
            <Image
              contentFit="contain"
              source={require("../assets/images/pinballmapcom_nocom.png")}
              style={s.logo}
            />
          </View>
          <View style={s.outerBorder}>
            <View style={s.textBg}>
              <Text
                style={[
                  s.regular,
                  {
                    fontSize: 18,
                    textAlign: "center",
                  },
                ]}
              >
                <Text>Pinball Map is a user-updated map listing</Text>
                <Text style={s.bold}>
                  {" "}
                  {formatNumWithCommas(allLocationsCount)}{" "}
                </Text>
                <Text>locations and</Text>
                <Text style={s.bold}>
                  {" "}
                  {formatNumWithCommas(allMachinesCount)}{" "}
                </Text>
                <Text>machines.</Text>
                {"\n"}
                {"\n"}
                <Text
                  style={{ marginTop: 15, fontSize: 18, textAlign: "center" }}
                >
                  On the next screen, enable location services to see pinball
                  machines near you.
                </Text>
                {"\n"}
                {"\n"}
                <Text>
                  You can create an account (optional) and help keep the map up
                  to date.
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginLeft: 15,
              marginRight: 15,
            }}
          >
            <Pressable
              onPress={() => navigation.navigate("Login")}
              style={({ pressed }) => [
                s.buttonStyle,
                s.buttonBlue,
                pressed ? s.bluePressed : undefined,
              ]}
            >
              <Text style={[s.titleStyle, s.bold]}>Current user? Log in</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Signup")}
              style={({ pressed }) => [
                { marginVertical: 20 },
                s.buttonStyle,
                s.buttonPink,
                pressed ? s.pinkPressed : undefined,
              ]}
            >
              <Text style={[s.titleStyle, s.bold]}>New user? Sign up</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                loginLater();
                navigation.navigate("MapTab");
              }}
              style={({ pressed }) => [
                s.buttonStyle,
                s.buttonWhite,
                pressed ? s.whitePressed : undefined,
              ]}
            >
              <Text style={[s.titleStyle, s.bold]}>Or skip signing in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <ImageBackground
        source={require("../assets/images/app_logo.jpg")}
        style={s.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      />
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    mask: {
      flex: 1,
      backgroundColor: "transparent",
    },
    backgroundImage: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    outerBorder: {
      marginTop: 10,
      marginBottom: 10,
      marginRight: 20,
      marginLeft: 20,
      borderRadius: 10,
      borderWidth: 4,
      borderColor: "rgba(0,0,0,.4)",
    },
    textBg: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: "rgba(255,255,255,.6)",
    },
    logoWrapper: {
      paddingHorizontal: 15,
      paddingVertical: 5,
    },
    logo: {
      width: "100%",
    },
    buttonPink: {
      backgroundColor: "#8e83ce",
    },
    pinkPressed: {
      backgroundColor: "#796fb3",
    },
    buttonBlue: {
      backgroundColor: "#cf8dde",
    },
    bluePressed: {
      backgroundColor: "#b97bc7",
    },
    buttonWhite: {
      backgroundColor: "#514953",
    },
    whitePressed: {
      backgroundColor: "#3e3540",
    },
    titleStyle: {
      color: "#fafaff",
      fontSize: 16,
    },
    justify: {
      flexDirection: "column",
      paddingVertical: 40,
    },
    buttonStyle: {
      borderRadius: 25,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
      padding: 10,
      shadowColor: "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

SignupLogin.propTypes = {
  loginLater: PropTypes.func,
  navigation: PropTypes.object,
};

SignupLogin.navigationOptions = () => ({
  headerShown: false,
});

const mapDispatchToProps = (dispatch) => ({
  loginLater: () => dispatch(loginLater()),
});

export default connect(null, mapDispatchToProps)(SignupLogin);
