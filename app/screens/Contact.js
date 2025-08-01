import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  ActivityIndicator,
  ConfirmationModal,
  PbmButton,
  Text,
} from "../components";
import { submitMessage, clearMessage } from "../actions";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Contact = ({ submitMessage, clearMessage, navigation, user, route }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    submitMessage({
      name,
      email,
      message,
      locationName: route.params?.locationName,
    });
  };

  const acknowledgeConfirmation = () => {
    clearMessage();
    navigation.goBack();
  };

  const _disabled = () => {
    if (user.loggedIn) {
      if (message) return false;
    } else {
      if (name && email && message) return false;
    }

    return true;
  };

  const { loggedIn, submittingMessage, confirmationMessage } = user;

  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <ConfirmationModal
        visible={confirmationMessage.length > 0}
        closeModal={acknowledgeConfirmation}
      >
        <Pressable>
          <Text style={s.confirmText}>{confirmationMessage}</Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={45}
            onPress={acknowledgeConfirmation}
            style={s.xButton}
          />
        </Pressable>
      </ConfirmationModal>
      {submittingMessage ? (
        <ActivityIndicator />
      ) : (
        <KeyboardAwareScrollView
          style={{ paddingHorizontal: 20 }}
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps="handled"
          overScrollMode="always"
        >
          <Text
            onPress={() => navigation.navigate("FAQ")}
            style={s.textLink}
          >{`Check the FAQ first for common questions.`}</Text>
          <Text style={[s.text, s.boldFont]}>
            {`No need to tell us that a `}
            <Text
              style={[
                s.text,
                s.boldFont,
                s.pinkText,
                { textTransform: "uppercase" },
              ]}
            >{`location closed`}</Text>
            {` or `}
            <Text
              style={[
                s.text,
                s.boldFont,
                s.pinkText,
                { textTransform: "uppercase" },
              ]}
            >{`all the machines are gone`}</Text>
            {`!`}
          </Text>
          <Text style={[s.text]}>
            {`Just `}
            <Text
              style={[s.boldFont]}
            >{`remove the machines from the location`}</Text>
            {`. We'll auto-delete it within a week.`}
          </Text>
          <View style={s.bombContainer}>
            <View style={s.bombInner}>
              <MaterialCommunityIcons
                name="bomb"
                size={25}
                color={"#66017b"}
                style={{ marginRight: 10, width: 25, height: 25 }}
              />
              <MaterialCommunityIcons
                name="bomb"
                size={25}
                color={"#66017b"}
                style={{ marginRight: 10, width: 25, height: 25 }}
              />
              <MaterialCommunityIcons
                name="bomb"
                size={25}
                color={"#66017b"}
                style={{ width: 25, height: 25 }}
              />
            </View>
            <View style={{ flex: 1, width: "100%" }}>
              <Text
                style={{
                  color: "#392f3a",
                  fontSize: 17,
                  fontFamily: "Nunito-Medium",
                }}
              >
                {`Tell us the`}{" "}
                <Text
                  style={{ fontFamily: "Nunito-ExtraBold", color: "#1543a3" }}
                >{`NAME of the location`}</Text>{" "}
                {`you're writing about!`}
                <Text
                  style={{
                    fontFamily: "Nunito-Italic",
                    fontStyle: Platform.OS === "android" ? undefined : "italic",
                    color: "#514953",
                  }}
                >
                  {" "}
                  {`This is a general contact form.`}
                </Text>
              </Text>
            </View>
          </View>
          {!loggedIn ? (
            <View>
              <TextInput
                style={[{ height: 40 }, s.textInput]}
                underlineColorAndroid="transparent"
                onChangeText={(name) => setName(name)}
                returnKeyType="done"
                placeholder={"Your name..."}
                placeholderTextColor={theme.indigo4}
                autoCorrect={false}
              />
              <TextInput
                style={[{ height: 40 }, s.textInput]}
                underlineColorAndroid="transparent"
                onChangeText={(email) => setEmail(email)}
                returnKeyType="done"
                placeholder={"Your email..."}
                placeholderTextColor={theme.indigo4}
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          ) : null}
          <TextInput
            multiline={true}
            placeholder={"Make sure to read all the above!!"}
            placeholderTextColor={theme.indigo4}
            style={[{ padding: 5, height: 200 }, s.textInput]}
            onChangeText={(message) => setMessage(message)}
            textAlignVertical="top"
            underlineColorAndroid="transparent"
          />
          <PbmButton title={"Submit"} disabled={_disabled()} onPress={submit} />
        </KeyboardAwareScrollView>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
    },
    text: {
      fontSize: 16,
      marginVertical: 5,
      marginHorizontal: 5,
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      marginTop: 20,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      textAlign: "left",
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    boldFont: {
      fontFamily: "Nunito-Bold",
    },
    blackText: {
      color: theme.text,
    },
    pinkText: {
      color: theme.pink1,
    },
    textLink: {
      textDecorationLine: "underline",
      fontSize: 16,
      lineHeight: 22,
      marginTop: 15,
      marginBottom: 10,
      textAlign: "center",
      fontFamily: "Nunito-Regular",
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.purpleLight,
      fontFamily: "Nunito-Bold",
    },
    xButton: {
      position: "absolute",
      right: -20,
      top: -20,
      color: theme.red2,
    },
    bombContainer: {
      backgroundColor: "#adc7fd",
      borderRadius: 15,
      marginTop: 10,
      padding: 10,
      flexDirection: "column",
      flex: 1,
    },
    bombInner: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      marginBottom: 5,
    },
  });

Contact.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  submitMessage: PropTypes.func,
  clearMessage: PropTypes.func,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  submitMessage: (state) => dispatch(submitMessage(state)),
  clearMessage: () => dispatch(clearMessage()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Contact);
