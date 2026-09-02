import React, { useContext } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Linking, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { hideNoLocationTrackingModal } from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import Text from "./PbmText";

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
      <View>
        <Text style={[s.confirmText, s.regular]}>
          Location tracking must be enabled to use this feature.
        </Text>
        <Text
          style={[s.confirmText, s.regular, s.link, s.margin10]}
          onPress={() => Linking.openSettings()}
        >
          Go to phone settings to enable
        </Text>
      </View>
    </ConfirmationModal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginHorizontal: 10,
      paddingHorizontal: 30,
    },
    margin10: {
      marginTop: 10,
      marginBottom: 5,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
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
