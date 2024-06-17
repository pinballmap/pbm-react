import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Keyboard, StyleSheet, Pressable, View } from "react-native";
import { Input } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, PbmButton, Screen, Text } from "../components";
import { postData } from "../config/request";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ResendConfirmation = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [identification, setIdentification] = useState("");
  const [identificationError, setIdentificationError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const submit = () => {
    setIdentificationError("");
    postData("/users/resend_confirmation.json", { identification })
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
        <ConfirmationModal visible={modalVisible}>
          <Text style={s.confirmText}>
            Confirmation info resent (check your SPAM folder).
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
        <View style={{ marginTop: 10, paddingBottom: 30 }}>
          <Input
            placeholder="Username or email..."
            placeholderTextColor={theme.indigo4}
            onChangeText={(identification) => setIdentification(identification)}
            value={identification}
            errorStyle={{ color: "red" }}
            errorMessage={identificationError}
            inputContainerStyle={s.inputBox}
            inputStyle={s.inputText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <PbmButton
            title={"Submit"}
            onPress={submit}
            disabled={identification.length === 0}
            containerStyle={s.container}
          />
        </View>
      </Pressable>
    </Screen>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginLeft: 25,
      marginRight: 25,
    },
    inputBox: {
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      margin: 15,
      paddingLeft: 10,
    },
    inputText: {
      color: theme.text,
      fontFamily: "Nunito-Regular",
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
  });

ResendConfirmation.propTypes = {
  navigation: PropTypes.object,
};

export default ResendConfirmation;
