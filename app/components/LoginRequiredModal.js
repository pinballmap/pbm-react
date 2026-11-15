import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../theme-context";
import ConfirmationModal from "./ConfirmationModal";
import PbmButton from "./PbmButton";

const LoginRequiredModal = ({ visible, closeModal }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const navigation = useNavigation();

  return (
    <ConfirmationModal
      visible={visible}
      closeModal={closeModal}
      title="Log In Required"
    >
      <Text style={[s.text, s.regular]}>You must be logged in to do that.</Text>
      <PbmButton
        title={"Log In"}
        onPress={() => {
          closeModal();
          navigation.navigate("Login");
        }}
      />
    </ConfirmationModal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    text: {
      textAlign: "center",
      fontSize: 18,
      marginHorizontal: 15,
      color: theme.text,
    },
  });

LoginRequiredModal.propTypes = {
  visible: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default LoginRequiredModal;
