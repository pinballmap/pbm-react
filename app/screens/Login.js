import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Input } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
          this.props.navigation.navigateDeprecated("MapStack", {
            screen: "MapTab",
          });
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
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <ScrollView
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
                    <Input
                      placeholder="Username or Email"
                      placeholderTextColor={"#9b9ebb"}
                      leftIcon={
                        <MaterialIcons name="face" style={s.iconStyle} />
                      }
                      onChangeText={(login) => this.setState({ login })}
                      value={this.state.login}
                      errorStyle={{ color: "red" }}
                      errorMessage={this.state.loginError}
                      inputContainerStyle={s.inputBox}
                      inputStyle={s.inputText}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Input
                      placeholder="Password"
                      placeholderTextColor={"#9b9ebb"}
                      leftIcon={
                        <MaterialIcons
                          name="lock-outline"
                          style={s.iconStyle}
                        />
                      }
                      onChangeText={(password) => this.setState({ password })}
                      value={this.state.password}
                      errorStyle={{ color: "red" }}
                      errorMessage={this.state.passwordError}
                      inputContainerStyle={s.inputBox}
                      inputStyle={s.inputText}
                      secureTextEntry={true}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <PbmButton
                      onPress={() => this.submit()}
                      title="Log In"
                      accessibilityLabel="Log In"
                      disabled={!this.state.login || !this.state.password}
                      disabledStyle={s.disabledStyle}
                      disabledTitleStyle={s.disabledTitleStyle}
                      containerStyle={{
                        marginHorizontal: 10,
                        marginTop: 10,
                        marginBottom: 25,
                      }}
                    />
                    <Button
                      onPress={() => this.props.navigation.navigate("Signup")}
                      titleStyle={s.textLink}
                      containerStyle={{ marginBottom: 10 }}
                      buttonStyle={s.buttonMask}
                      title="Not a user? SIGN UP!"
                    />
                    <Button
                      onPress={() =>
                        this.props.navigation.navigate("PasswordReset")
                      }
                      title="I forgot my password"
                      titleStyle={s.textLink}
                      containerStyle={{ marginBottom: 10 }}
                      buttonStyle={s.buttonMask}
                    />
                    <Button
                      onPress={() =>
                        this.props.navigation.navigate("ResendConfirmation")
                      }
                      title="Resend my confirmation email"
                      titleStyle={s.textLink}
                      containerStyle={{ marginBottom: 10 }}
                      buttonStyle={s.buttonMask}
                    />
                    <Button
                      onPress={() => {
                        this.props.loginLater();
                        this.props.navigation.navigateDeprecated("MapStack", {
                          screen: "MapTab",
                        });
                      }}
                      titleStyle={s.textLink}
                      buttonStyle={s.buttonMask}
                      title="Skip logging in for now"
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
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
      elevation: 0,
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
      marginLeft: 15,
      marginRight: 15,
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
