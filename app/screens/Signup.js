import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Input } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { login, loginLater } from "../actions/user_actions";
import { postData } from "../config/request";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ConfirmationModal, PbmButton } from "../components";

let deviceHeight = Dimensions.get("window").height;

const Signup = ({ login, loginLater, navigation }) => {
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
            login(data.user);
          }
        })
        .catch((err) => {
          setErrors(true);
          setApiErrorMsg(err);
        });
    }
  };
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  return (
    <KeyboardAwareScrollView
      {...keyboardDismissProp}
      enableResetScrollToCoords={false}
      keyboardShouldPersistTaps="handled"
    >
      <ImageBackground
        source={require("../assets/images/t-shirt-logo.png")}
        style={s.backgroundImage}
      >
        <ConfirmationModal visible={modalVisible}>
          <Text style={s.confirmText}>
            Please check your email and confirm your account.
          </Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={45}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("MapStack");
            }}
            style={s.xButton}
          />
        </ConfirmationModal>
        <View style={s.mask}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
            }}
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
              <Input
                placeholder="Username"
                placeholderTextColor={"#9b9ebb"}
                leftIcon={<MaterialIcons name="face" style={s.iconStyle} />}
                onChangeText={(username) => setUsername(username)}
                value={username}
                errorStyle={{ color: "red" }}
                errorMessage={usernameError}
                inputContainerStyle={s.inputBox}
                inputStyle={s.inputText}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input
                placeholder="Email Address"
                placeholderTextColor={"#9b9ebb"}
                leftIcon={
                  <MaterialCommunityIcons
                    name="email-outline"
                    style={s.iconStyle}
                  />
                }
                onChangeText={(email) => setEmail(email)}
                value={email}
                errorStyle={{ color: "red" }}
                errorMessage={emailError}
                inputContainerStyle={s.inputBox}
                inputStyle={s.inputText}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <Input
                placeholder="Password"
                placeholderTextColor={"#9b9ebb"}
                leftIcon={
                  <MaterialIcons name="lock-outline" style={s.iconStyle} />
                }
                onChangeText={(password) => setPassword(password)}
                value={password}
                errorStyle={{ color: "red" }}
                errorMessage={passwordError}
                inputContainerStyle={s.inputBox}
                inputStyle={s.inputText}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input
                placeholder="Confirm Password"
                placeholderTextColor={"#9b9ebb"}
                leftIcon={
                  <MaterialIcons name="lock-outline" style={s.iconStyle} />
                }
                onChangeText={(confirm_password) =>
                  setConfirmPassword(confirm_password)
                }
                value={confirm_password}
                errorStyle={{ color: "red" }}
                errorMessage={confirm_passwordError}
                inputContainerStyle={s.inputBox}
                inputStyle={s.inputText}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <PbmButton
                onPress={submit}
                containerStyle={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 25,
                }}
                title="Sign Up"
                accessibilityLabel="Sign Up"
                disabled={!username || !email || !password || !confirm_password}
                disabledStyle={s.disabledStyle}
                disabledTitleStyle={s.disabledTitleStyle}
              />
              <Button
                onPress={() => navigation.navigate("Login")}
                titleStyle={s.textLink}
                containerStyle={{ marginBottom: 15 }}
                buttonStyle={s.buttonMask}
                title="Already a user? LOG IN!"
              />
              <Button
                onPress={() => {
                  loginLater();
                  navigation.navigate("MapStack");
                }}
                titleStyle={s.textLink}
                buttonStyle={s.buttonMask}
                title="skip signing up for now"
              />
            </View>
          </Pressable>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
};

Signup.navigationOptions = {
  headerShown: false,
  gestureEnabled: true,
};

const getStyles = (theme) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: null,
      height: null,
    },
    mask: {
      flex: 1,
      backgroundColor: theme.mask,
    },
    buttonMask: {
      backgroundColor: theme.buttonMask,
      elevation: 0,
    },
    errorText: {
      color: "red",
      fontFamily: "boldFont",
      textAlign: "center",
    },
    bold: {
      fontFamily: "boldFont",
      textAlign: "center",
      fontSize: 18,
    },
    inputBox: {
      width: "100%",
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      marginTop: 5,
      marginBottom: 5,
      paddingLeft: 10,
    },
    inputText: {
      color: theme.text,
      fontFamily: "regularFont",
    },
    textLink: {
      fontSize: 14,
      textAlign: "center",
      fontFamily: "boldFont",
      color: theme.text2,
    },
    iconStyle: {
      fontSize: 24,
      color: "#9b9ebb",
      marginRight: 5,
      marginLeft: 5,
    },
    buttonStyle: {
      backgroundColor: theme.blue2,
      width: "100%",
      elevation: 0,
      borderRadius: 25,
    },
    buttonTitle: {
      color: theme.text3,
      fontSize: 16,
      fontFamily: "boldFont",
    },
    justify: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
      marginLeft: 15,
      marginRight: 15,
    },
    disabledStyle: {
      backgroundColor: theme.white,
    },
    disabledTitleStyle: {
      color: theme.pink3,
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purple,
      fontFamily: "boldFont",
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -20,
      color: theme.red2,
    },
  });

Signup.propTypes = {
  login: PropTypes.func,
  loginLater: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  login: (credentials) => dispatch(login(credentials)),
  loginLater: () => dispatch(loginLater()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
