import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Modal, StyleSheet, Pressable, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ActivityIndicator } from ".";

const ConfirmationModal = ({
  children,
  visible,
  wide,
  noPad,
  loading,
  closeModal,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={() => {}}
      visible={visible}
    >
      <Pressable style={s.overlay} onPress={closeModal}>
        <View
          style={[
            s.modalView,
            wide && { width: "90%" },
            noPad && { paddingBottom: 0 },
          ]}
        >
          {loading ? <ActivityIndicator /> : children}
        </View>
      </Pressable>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:
        theme.theme == "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)",
    },
    modalView: {
      width: "80%",
      paddingVertical: 15,
      backgroundColor: theme.base1,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

ConfirmationModal.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  wide: PropTypes.bool,
  noPad: PropTypes.bool,
  closeModal: PropTypes.func,
};

export default ConfirmationModal;
