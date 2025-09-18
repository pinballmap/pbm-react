import React, { useContext } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { hideNoLocationTrackingModal } from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import Text from "./PbmText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const NoLocationTrackingModal = ({
  showNoLocationTrackingModal,
  hideNoLocationTrackingModal,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <ConfirmationModal
      visible={showNoLocationTrackingModal}
      closeModal={hideNoLocationTrackingModal}
    >
      <Pressable>
        <View>
          <Text style={s.confirmText}>
            Location tracking must be enabled to use this feature!
          </Text>
          <Text
            style={[s.confirmText, s.link, s.margin10]}
            onPress={() => Linking.openSettings()}
          >
            Go to phone settings to enable.
          </Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={35}
            onPress={hideNoLocationTrackingModal}
            style={s.xButton}
          />
        </View>
      </Pressable>
    </ConfirmationModal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "Nunito-Regular",
      paddingHorizontal: 35,
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
    margin10: {
      marginTop: 10,
      marginBottom: 5,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
  });

NoLocationTrackingModal.propTypes = {
  showNoLocationTrackingModal: PropTypes.bool,
  hideNoLocationTrackingModal: PropTypes.func,
};

const mapStateToProps = ({ user }) => {
  return {
    showNoLocationTrackingModal: user.showNoLocationTrackingModal,
  };
};

const mapDispatchToProps = (dispatch) => ({
  hideNoLocationTrackingModal: () => dispatch(hideNoLocationTrackingModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NoLocationTrackingModal);
