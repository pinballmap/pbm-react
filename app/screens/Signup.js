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
import { loginLater } from "../actions/user_actions";
import { postData } from "../config/request";
import {
  EvilIcons,
  FontAwesome6,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ConfirmationModal, PbmButton } from "../components";
import * as WebBrowser from "expo-web-browser";

let deviceHeight = Dimensions.get("window").height;

const Signup = ({ loginLater, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirm_password, setConfirmPassword] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirm_passwordError, setConfirmPasswordError] = useState(null);
  const [errors, setErrors] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState(null);

  const validateFields = () => {
    if (!username) {
      setUsernameError("EMPTY USERNAME");
      setErrors(true);
    } else if (username.length > 15) {
      setUsernameError("Username is too long (maximum is 15 characters");
      setErrors(true);
    } else if (!/^[a-zA-Z0-9_.]*$/.test(username)) {
      setErrors(true);
      setUsernameError("Username must be alphanumeric");
    }

    if (!email) {
      setEmailError("EMPTY EMAIL");
      setErrors(true);
    } else if (!email.includes("@")) {
      setEmailError("Email is invalid");
      setErrors(true);
    }

    if (!password) {
      setPasswordError("EMPTY PASSWORD");
      setErrors(true);
    } else if (password.length < 6) {
      setPasswordError("Password is too short (minimum is 6 characters)");
      setErrors(true);
    }

    if (password !== confirm_password) {
      setConfirmPasswordError("DOESN'T MATCH PASSWORD");
      setErrors(true);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const submit = () => {
    // Reset error states upon a submission / resubmission
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setApiErrorMsg(null);
    setErrors(false);

    validateFields();

    if (!errors) {
      const body = {
        username,
        email,
        password,
        confirm_password,
      };

      postData("/users/signup.json", body)
        .then((data) => {
          // Something goes wrong with the API request
          if (data.message) {
            setApiErrorMsg(data.message);
            setErrors(true);
          }

          if (data.errors) {
            setErrors(true);
            const errors = data.errors.split(",");

            if (errors.indexOf("Username is invalid") > -1) {
              setUsernameError("Username is invalid");
            }

            if (errors.indexOf("Username has already been taken") > -1) {
              setUsernameError("Username has already been taken");
            }

            if (errors.indexOf("Email is invalid") > -1) {
              setEmailError("Email is invalid");
            }
          }

          if (data.user) {
            setModalVisible(true);
          }
        })
        .catch((err) => {
          setErrors(true);
          setApiErrorMsg(err);
        });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <ConfirmationModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
      >
        <Text style={s.confirmText}>
          {`Please check your email and confirm your account. If you don't see it, check your SPAM folder!`}
        </Text>
        <MaterialCommunityIcons
          name="close-circle"
          size={45}
          onPress={() => {
            setModalVisible(false);
            navigation.navigate("Login");
          }}
          style={s.xButton}
        />
      </ConfirmationModal>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.justify}>
          {errors && (
            <Text style={s.errorText}>
              {apiErrorMsg
                ? apiErrorMsg
                : "There were errors trying to process your submission"}
            </Text>
          )}
          <Text style={s.bold}>Sign Up</Text>
          <View style={s.inputContainer}>
            <FontAwesome6 name="face-grin-beam" style={s.iconStyle} />
            <TextInput
              placeholder="Username"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={(username) => setUsername(username)}
              value={username}
              errorStyle={{ color: "red" }}
              errorMessage={usernameError}
              style={s.inputText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={s.inputContainer}>
            <MaterialCommunityIcons name="email-outline" style={s.iconStyle} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={(email) => setEmail(email)}
              value={email}
              errorStyle={{ color: "red" }}
              errorMessage={emailError}
              style={s.inputText}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
          <View style={s.inputContainer}>
            <MaterialIcons name="lock-outline" style={s.iconStyle} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={(password) => setPassword(password)}
              value={password}
              errorStyle={{ color: "red" }}
              errorMessage={passwordError}
              style={s.inputText}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={s.inputContainer}>
            <MaterialIcons name="lock-outline" style={s.iconStyle} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={"#9b9ebb"}
              onChangeText={(confirm_password) =>
                setConfirmPassword(confirm_password)
              }
              value={confirm_password}
              errorStyle={{ color: "red" }}
              errorMessage={confirm_passwordError}
              style={s.inputText}
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <PbmButton
            onPress={submit}
            title="Sign Up"
            disabled={!username || !email || !password || !confirm_password}
            margin={{ marginHorizontal: 25, marginVertical: 15 }}
          />
          <View style={[s.externalLinkContainer, s.marginB25]}>
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com/privacy")
              }
            >
              <Text style={s.externalLink}> View our privacy policy</Text>
            </Pressable>
            <EvilIcons name="external-link" style={s.externalIcon} />
          </View>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={[s.buttonMask, s.marginB25]}
          >
            <Text style={s.textLink}>Already a user? LOG IN!</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              loginLater();
              navigation.navigate("MapTab");
            }}
            style={s.buttonMask}
          >
            <Text style={s.textLink}>skip signing up for now</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
      <ImageBackground
        source={require("../assets/images/t-shirt-logo.png")}
        style={s.backgroundImage}
        imageStyle={{ opacity: 0.2 }}
      />
    </View>
  );
};

Signup.navigationOptions = {
  headerShown: false,
  gestureEnabled: true,
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
    errorText: {
      color: "red",
      fontFamily: "Nunito-Bold",
      textAlign: "center",
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
    },
    iconStyle: {
      fontSize: 24,
      color: "#9b9ebb",
      marginRight: 5,
      marginLeft: 5,
    },
    justify: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purple,
      fontFamily: "Nunito-Bold",
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -20,
      color: theme.red2,
    },
    externalLink: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      color: theme.purple2,
      textAlign: "center",
    },
    externalLinkContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 20,
    },
    externalIcon: {
      fontSize: 24,
      color: theme.text2,
    },
    marginB25: {
      marginBottom: 25,
    },
  });

Signup.propTypes = {
  loginLater: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  loginLater: () => dispatch(loginLater()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
