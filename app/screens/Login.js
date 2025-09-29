import React, { Component } from "react";
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
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import {
  getFavoriteLocations,
  login,
  loginLater,
} from "../actions/user_actions";
import { getData } from "../config/request";
import { PbmButton } from "../components";

let deviceHeight = Dimensions.get("window").height;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: false,
      login: null,
      loginError: null,
      password: null,
      passwordError: null,
      apiErrorMsg: null,
    };
  }

  submit = () => {
    this.setState({
      errors: false,
      loginError: null,
      passwordError: null,
    });
    getData(
      `/users/auth_details.json?login=${encodeURIComponent(
        this.state.login,
      )}&password=${encodeURIComponent(this.state.password)}`,
    )
      .then((data) => {
        if (data.errors) {
          this.setState({ errors: true });

          if (data.errors === "Unknown user")
            this.setState({ loginError: "Unknown user" });

          if (data.errors === "Incorrect password")
            this.setState({ passwordError: "Incorrect password" });

          if (
            data.errors ===
            "Your account is disabled. Please contact us if you think this is a mistake."
          )
            this.setState({
              apiErrorMsg:
                "Your account is disabled. Please contact us if you think this is a mistake.",
            });

          if (
            data.errors ===
            "User is not yet confirmed. Please follow emailed confirmation instructions."
          )
            this.setState({
              apiErrorMsg:
                "User is not yet confirmed. Please follow emailed confirmation instructions.",
            });
        }
        if (data.user) {
          this.props.login(data.user);
          this.props.getFavoriteLocations(data.user.id);
          this.props.navigation.navigate("MapTab", { pop: true });
        }
      })
      .catch((err) => this.setState({ errors: true, apiErrorMsg: err }));
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
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
                  {this.state.errors && (
                    <Text style={s.errorText}>
                      {this.state.apiErrorMsg
                        ? this.state.apiErrorMsg
                        : "There were errors trying to process your submission"}
                    </Text>
                  )}
                  <Text style={s.bold}>Log In</Text>
                  <View style={s.inputContainer}>
                    <FontAwesome6 name="face-grin-beam" style={s.iconStyle} />
                    <TextInput
                      placeholder="Username or Email"
                      placeholderTextColor={"#9b9ebb"}
                      onChangeText={(login) => this.setState({ login })}
                      value={this.state.login}
                      errorStyle={{ color: "red" }}
                      errorMessage={this.state.loginError}
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
                      onChangeText={(password) => this.setState({ password })}
                      value={this.state.password}
                      errorStyle={{ color: "red" }}
                      errorMessage={this.state.passwordError}
                      style={s.inputText}
                      secureTextEntry={true}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <PbmButton
                    onPress={() => this.submit()}
                    title="Log In"
                    disabled={!this.state.login || !this.state.password}
                    margin={{ marginHorizontal: 25, marginVertical: 15 }}
                  />
                  <Pressable
                    onPress={() => this.props.navigation.navigate("Signup")}
                    style={[{ marginTop: 15 }, s.buttonMask, s.marginBottom]}
                  >
                    <Text style={s.textLink}>Not a user? SIGN UP!</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      this.props.navigation.navigate("PasswordReset")
                    }
                    style={[s.buttonMask, s.marginBottom]}
                  >
                    <Text style={s.textLink}>I forgot my password</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      this.props.navigation.navigate("ResendConfirmation")
                    }
                    style={[s.buttonMask, s.marginBottom]}
                  >
                    <Text style={s.textLink}>Resend my confirmation email</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      this.props.loginLater();
                      this.props.navigation.navigate("MapTab", { pop: true });
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
        }}
      </ThemeContext.Consumer>
    );
  }
}

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
    },
    buttonTitle: {
      color: theme.text3,
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    justify: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
    },
    disabledStyle: {
      backgroundColor: theme.white,
    },
    disabledTitleStyle: {
      color: theme.pink3,
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
