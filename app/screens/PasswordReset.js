import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, PbmButton, Screen, Text } from "../components";
import { postData } from "../config/request";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";

const PasswordReset = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [identification, setIdentification] = useState("");
  const [identificationError, setIdentificationError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const closeModalAndNavigate = () => {
    setModalVisible(false);
    const state = navigation.getState();
    const previousRoute = state.routes[state.index - 1];
    if (previousRoute?.name === "Login") {
      navigation.goBack();
    } else {
      navigation.replace("Login");
    }
  };

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
          closeModal={closeModalAndNavigate}
        >
          <View style={s.modalHeader}>
            <Text style={[s.modalHeaderTitle, s.extraBold]}>
              Reset Initiated
            </Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={35}
              onPress={closeModalAndNavigate}
              style={s.xButton}
            />
          </View>
          <View style={s.modalContent}>
            <Text style={[s.confirmText, s.regular]}>
              {`Check your email (and SPAM folder) and follow the instructions to complete your password reset.`}
            </Text>
          </View>
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
              style={[s.inputText, s.regular]}
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
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
    margin: {
      marginHorizontal: 25,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      margin: 25,
      paddingHorizontal: 10,
      paddingVertical: 12,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    inputText: {
      paddingLeft: 5,
      color: theme.text,
      fontSize: 18,
      flex: 1,
    },
    confirmText: {
      fontSize: 16,
    },
    modalHeader: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
      paddingHorizontal: 45,
    },
    modalHeaderTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
    },
    xButton: {
      position: "absolute",
      right: 3,
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
    modalContent: {
      padding: 10,
      paddingBottom: 0,
    },
  });

PasswordReset.propTypes = {
  navigation: PropTypes.object,
};

export default PasswordReset;
