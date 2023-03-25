import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Modal, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";

const ConfirmationModal = ({ children, visible, wide, noPad }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
      visible={visible}
    >
      <View style={s.modalBg}>
        <View
          style={[
            s.modal,
            wide && { width: "90%" },
            noPad && { paddingBottom: 0 },
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    modalBg: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modal: {
      backgroundColor: theme.base1,
      borderRadius: 15,
      width: "80%",
      paddingVertical: 15,
    },
  });

ConfirmationModal.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  wide: PropTypes.bool,
  noPad: PropTypes.bool,
};

export default ConfirmationModal;
