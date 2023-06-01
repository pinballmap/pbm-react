import React, { useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Text, StyleSheet } from "react-native";
import { removeMachineFromLocation } from "../actions/location_actions";
import ConfirmationModal from "./ConfirmationModal";
import PbmButton from "./PbmButton";
import WarningButton from "./WarningButton";
import { ThemeContext } from "../theme-context";

const RemoveMachineModal = ({
  removeMachineFromLocation,
  closeModal,
  location: loc,
  machineName,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const removeLmx = (curLmx, location_id) => {
    removeMachineFromLocation(curLmx, location_id);
    closeModal();
  };

  const { curLmx, location } = loc;

  return (
    <ConfirmationModal>
      {machineName && (
        <Text style={s.confirmText}>
          Remove <Text style={s.purple2}>{machineName}</Text> from{" "}
          <Text style={s.purple}>{location.name}</Text>?
        </Text>
      )}
      <PbmButton
        title={"Yes, Remove It"}
        onPress={() => removeLmx(curLmx, location.id)}
        containerStyle={s.buttonContainer}
      />
      <WarningButton
        title={"Cancel"}
        onPress={() => closeModal()}
        containerStyle={s.buttonContainer}
      />
    </ConfirmationModal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    confirmText: {
      textAlign: "center",
      marginLeft: 15,
      marginRight: 15,
      fontSize: 18,
      color: theme.text,
      fontFamily: "semiBoldFont",
    },
    purple: {
      color: theme.theme == "dark" ? theme.purple : theme.purple2,
      fontSize: 18,
      fontFamily: "boldFont",
    },
    purple2: {
      color: theme.theme == "dark" ? theme.purple2 : theme.purple,
      fontSize: 18,
      fontFamily: "boldFont",
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
  });

RemoveMachineModal.propTypes = {
  removeMachineFromLocation: PropTypes.func,
  closeModal: PropTypes.func,
  location: PropTypes.object,
  machineName: PropTypes.string,
};

const mapStateToProps = ({ location, machines }) => {
  const machineName = location.curLmx
    ? machines.machines.find((m) => m.id === location.curLmx.machine_id).name
    : "";
  return { location, machineName };
};
const mapDispatchToProps = (dispatch) => ({
  removeMachineFromLocation: (curLmx, location_id) =>
    dispatch(removeMachineFromLocation(curLmx, location_id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RemoveMachineModal);
