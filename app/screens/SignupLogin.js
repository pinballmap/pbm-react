import React from "react";
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
import { formatNumWithCommas } from "../utils/utilityFunctions";

let deviceHeight = Dimensions.get("window").height;

const SignupLogin = ({
  navigation,
  allMachinesCount,
  allLocationsCount,
  loginLater,
}) => {
  const s = getStyles();

  return (
    <View style={[s.mask, s.justify]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
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
              style={{
                fontFamily: "Nunito-Regular",
                fontSize: 18,
                textAlign: "center",
              }}
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
                machines near you!
              </Text>
              {"\n"}
              {"\n"}
              <Text>
                You can create an account (optional) and help keep the map up to
                date!
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
            <Text style={s.titleStyle}>Current user? Log in</Text>
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
            <Text style={s.titleStyle}>New user? Sign up</Text>
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
            <Text style={s.titleStyle}>Or skip signing in</Text>
          </Pressable>
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
    bold: {
      fontFamily: "Nunito-Bold",
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
      fontFamily: "Nunito-Bold",
    },
    justify: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
    },
    buttonStyle: {
      borderRadius: 25,
      paddingHorizontal: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      overflow: "visible",
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
  regions: PropTypes.object,
  allMachinesCount: PropTypes.number,
  allLocationsCount: PropTypes.number,
};

SignupLogin.navigationOptions = () => ({
  headerShown: false,
});

const mapStateToProps = ({ regions }) => ({
  allMachinesCount: regions.allMachinesCount,
  allLocationsCount: regions.allLocationsCount,
});

const mapDispatchToProps = (dispatch) => ({
  loginLater: () => dispatch(loginLater()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupLogin);
