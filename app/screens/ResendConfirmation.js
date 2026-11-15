import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Keyboard, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, PbmButton, Screen, Text } from "../components";
import { postData } from "../config/request";

const ResendConfirmation = ({ navigation }) => {
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
    postData("/users/resend_confirmation.json", { identification })
      .then(() => setModalVisible(true))
      .catch((err) =>
        setIdentificationError(
          typeof err === "string" ? err : "Something went wrong.",
        ),
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
          title="Confirmation Resent"
        >
          <View style={s.modalContent}>
            <Text style={[s.confirmText, s.regular]}>
              {`Check your email (and SPAM folder) and follow the instructions to confirm your account.`}
            </Text>
          </View>
        </ConfirmationModal>
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Text style={[s.instructionText, s.regular]}>
            Enter your username or email and we&apos;ll resend your confirmation
            email.
          </Text>
          <View style={s.inputContainer}>
            <TextInput
              placeholder="Username or email..."
              placeholderTextColor={theme.indigo4}
              onChangeText={(identification) =>
                setIdentification(identification)
              }
              value={identification}
              style={[s.inputText, s.regular]}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {!!identificationError && (
            <Text style={[s.errorText, s.bold]}>{identificationError}</Text>
          )}
          <PbmButton
            title={"Submit"}
            onPress={submit}
            disabled={identification.length === 0}
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
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    instructionText: {
      color: theme.text,
      fontSize: 16,
      marginHorizontal: 25,
      marginTop: 15,
    },
    errorText: {
      color: "red",
      textAlign: "center",
      fontSize: 16,
      marginHorizontal: 25,
      marginTop: -10,
      marginBottom: 15,
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
    modalContent: {
      paddingHorizontal: 10,
    },
  });

ResendConfirmation.propTypes = {
  navigation: PropTypes.object,
};

export default ResendConfirmation;
