import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { ThemeContext } from "../theme-context";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import {
  getFavoriteLocations,
  login,
  loginLater,
} from "../actions/user_actions";
import { getData } from "../config/request";
import { PbmButton } from "../components";

let deviceHeight = Dimensions.get("window").height;

const Login = ({ login, loginLater, navigation, getFavoriteLocations }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [errors, setErrors] = useState(false);
  const [loginInput, setLoginInput] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [apiErrorMsg, setApiErrorMsg] = useState(null);

  const submit = () => {
    setErrors(false);
    setLoginError(null);
    setPasswordError(null);
    getData(
      `/users/auth_details.json?login=${encodeURIComponent(loginInput)}&password=${encodeURIComponent(password)}`,
    )
      .then((data) => {
        if (data.errors) {
          setErrors(true);
          if (data.errors === "Unknown user") setLoginError("Unknown user");
          if (data.errors === "Incorrect password")
            setPasswordError("Incorrect password");
          if (
            data.errors ===
            "User is not yet confirmed. Please follow emailed confirmation instructions."
          )
            setApiErrorMsg(
              "User is not yet confirmed. Please follow emailed confirmation instructions.",
            );
        }
        if (data.user) {
          login(data.user);
          getFavoriteLocations(data.user.id);
          navigation.navigate("MapTab");
        }
      })
      .catch((err) => {
        setErrors(true);
        setApiErrorMsg(err);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.justify}>
          {errors && (
            <Text style={s.errorText}>
              {apiErrorMsg ||
                loginError ||
                passwordError ||
                "There were errors trying to process your submission"}
            </Text>
          )}
          <Text style={s.bold}>Log In</Text>
          <View style={s.inputContainer}>
            <FontAwesome6 name="face-grin-beam" style={s.iconStyle} />
            <TextInput
              placeholder="Username or Email"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={setLoginInput}
              value={loginInput}
              errorStyle={{ color: "red" }}
              errorMessage={loginError}
              style={s.inputText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={s.inputContainer}>
            <MaterialIcons name="lock-outline" style={s.iconStyle} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={setPassword}
              value={password}
              errorStyle={{ color: "red" }}
              errorMessage={passwordError}
              style={s.inputText}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <PbmButton
            onPress={submit}
            title="Log In"
            disabled={!loginInput || !password}
            margin={{ marginHorizontal: 25, marginVertical: 15 }}
          />
          <Pressable
            onPress={() => navigation.navigate("Signup")}
            style={[{ marginTop: 15 }, s.buttonMask, s.marginBottom]}
          >
            <Text style={s.textLink}>Not a user? SIGN UP!</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("PasswordReset")}
            style={[s.buttonMask, s.marginBottom]}
          >
            <Text style={s.textLink}>I forgot my password</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("ResendConfirmation")}
            style={[s.buttonMask, s.marginBottom]}
          >
            <Text style={s.textLink}>Resend my confirmation email</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              loginLater();
              navigation.navigate("MapTab");
            }}
            style={s.buttonMask}
          >
            <Text style={s.textLink}>Skip logging in for now</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
      <ImageBackground
        source={require("../assets/images/pbm-fade-tall.png")}
        style={s.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
    buttonMask: {
      backgroundColor: theme.buttonMask,
    },
    marginBottom: {
      marginBottom: 20,
    },
    errorText: {
      color: "red",
      fontFamily: "Nunito-Bold",
      textAlign: "center",
      fontSize: 16,
      paddingHorizontal: 10,
    },
    bold: {
      fontFamily: "Nunito-Bold",
      textAlign: "center",
      fontSize: 22,
      color: theme.text,
      textShadowColor: theme.white,
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 2,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      marginVertical: 15,
      marginHorizontal: 25,
      paddingHorizontal: 10,
    },
    inputText: {
      paddingLeft: 5,
      color: theme.text,
      fontSize: 18,
      flex: 1,
      fontFamily: "Nunito-Regular",
    },
    textLink: {
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Nunito-Bold",
      color: theme.text2,
      textShadowColor: theme.white,
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 2,
      textDecorationLine: "underline",
    },
    justify: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
    },
    iconStyle: {
      fontSize: 24,
      color: "#9b9ebb",
      marginRight: 5,
      marginLeft: 5,
    },
  });

Login.propTypes = {
  login: PropTypes.func,
  loginLater: PropTypes.func,
  navigation: PropTypes.object,
  getFavoriteLocations: PropTypes.func,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(login(credentials)),
  loginLater: () => dispatch(loginLater()),
  getFavoriteLocations: (id) => dispatch(getFavoriteLocations(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
