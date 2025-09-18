import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, PbmButton, Screen, Text } from "../components";
import { postData } from "../config/request";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const PasswordReset = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [identification, setIdentification] = useState("");
  const [identificationError, setIdentificationError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const submit = () => {
    setIdentificationError("");
    postData("/users/forgot_password.json", { identification })
      .then(
        () => setModalVisible(true),
        (err) => {
          throw err;
        },
      )
      .catch((identificationError) =>
        setIdentificationError(identificationError),
      );
  };

  return (
    <Screen>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <ConfirmationModal
          visible={modalVisible}
          closeModal={() => setModalVisible(false)}
        >
          <Pressable>
            <Text style={[s.confirmText, s.bold]}>
              Password reset was successful.
            </Text>
            <Text style={[s.confirmText, s.notBold, { marginTop: 5 }]}>
              Check your email (and SPAM folder)
            </Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={35}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Login");
              }}
              style={s.xButton}
            />
          </Pressable>
        </ConfirmationModal>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <View style={s.inputContainer}>
            <TextInput
              placeholder="Username or email..."
              placeholderTextColor={theme.indigo4}
              onChangeText={(identification) =>
                setIdentification(identification)
              }
              value={identification}
              errorStyle={{ color: "red" }}
              errorMessage={identificationError}
              style={s.inputText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <PbmButton
            title={"Submit"}
            onPress={submit}
            disabled={identification.length === 0}
            margin={s.margin}
          />
        </View>
      </Pressable>
    </Screen>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    margin: {
      marginHorizontal: 25,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      margin: 25,
      paddingHorizontal: 10,
    },
    inputText: {
      paddingLeft: 5,
      color: theme.text,
      fontSize: 18,
      flex: 1,
      fontFamily: "Nunito-Regular",
    },
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      paddingHorizontal: 30,
    },
    bold: {
      fontSize: 18,
      color: theme.purple,
      fontFamily: "Nunito-Bold",
    },
    notBold: {
      fontSize: 16,
      color: theme.text3,
      fontFamily: "Nunito-Regular",
    },
    xButton: {
      position: "absolute",
      right: 3,
      top: -10,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
  });

PasswordReset.propTypes = {
  navigation: PropTypes.object,
};

export default PasswordReset;
