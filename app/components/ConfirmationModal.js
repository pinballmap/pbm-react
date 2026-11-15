import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Modal, StyleSheet, Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { ThemeContext } from "../theme-context";
import { ActivityIndicator } from ".";

const ConfirmationModal = ({
  children,
  visible,
  wide,
  noPad,
  loading,
  closeModal,
  title,
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
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        <View
          style={[
            s.modalView,
            wide && { width: "90%", maxWidth: 600 },
            !!title && { paddingTop: 0 },
            noPad && { paddingVertical: 0 },
          ]}
        >
          {!!title && (
            <View style={s.header}>
              <Text style={[s.headerTitle, s.extraBold]}>{title}</Text>
              <MaterialCommunityIcons
                name="close-circle"
                size={35}
                onPress={closeModal}
                style={s.xButton}
              />
            </View>
          )}
          {loading ? <ActivityIndicator /> : children}
        </View>
      </View>
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
      width: "85%",
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
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginBottom: 15,
      paddingVertical: 8,
      justifyContent: "center",
      paddingHorizontal: 45,
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
    headerTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
    },
    xButton: {
      position: "absolute",
      right: 3,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      textShadowColor:
        theme.theme == "dark"
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(126, 126, 145, 0.5)",
      textShadowOffset: {
        width: 0,
        height: 2,
      },
      textShadowRadius: 3.84,
    },
  });

ConfirmationModal.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  wide: PropTypes.bool,
  noPad: PropTypes.bool,
  loading: PropTypes.bool,
  closeModal: PropTypes.func,
  title: PropTypes.string,
};

export default ConfirmationModal;
