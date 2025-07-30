import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={s.modalBg}>
          <TouchableWithoutFeedback>
            <View
              style={[
                s.modal,
                wide && { width: "90%" },
                noPad && { paddingBottom: 0 },
              ]}
            >
              {loading ? <ActivityIndicator /> : children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
      backgroundColor:
        theme.theme == "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)",
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
  closeModal: PropTypes.func,
};

export default ConfirmationModal;
