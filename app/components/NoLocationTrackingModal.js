import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { hideNoLocationTrackingModal } from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import PbmButton from "./PbmButton";
import Text from "./PbmText";

const NoLocationTrackingModal = ({
  showNoLocationTrackingModal,
  hideNoLocationTrackingModal,
}) => (
  <ConfirmationModal visible={showNoLocationTrackingModal}>
    <View>
      <Text style={s.confirmText}>
        Location tracking must be enabled to use this feature!
      </Text>
      <PbmButton
        title={"OK"}
        onPress={hideNoLocationTrackingModal}
        accessibilityLabel="Great!"
        containerStyle={s.buttonContainer}
      />
    </View>
  </ConfirmationModal>
);

NoLocationTrackingModal.propTypes = {
  showNoLocationTrackingModal: PropTypes.bool,
  hideNoLocationTrackingModal: PropTypes.func,
};

const s = StyleSheet.create({
  confirmText: {
    textAlign: "center",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: "regularFont",
  },
  buttonContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});

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
