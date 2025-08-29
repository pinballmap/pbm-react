import React, { useContext } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pressable, Text, StyleSheet } from "react-native";
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
    <ConfirmationModal closeModal={() => closeModal()}>
      <Pressable>
        {machineName && (
          <Text style={s.confirmText}>
            Remove <Text style={s.machineName}>{machineName}</Text> from{" "}
            <Text style={s.locationName}>{location.name}</Text>?
          </Text>
        )}
        <PbmButton
          title={"Yes, Remove It"}
          onPress={() => removeLmx(curLmx, location.id)}
        />
        <WarningButton title={"Cancel"} onPress={() => closeModal()} />
        <Text style={s.modalSubText}>
          Do not remove and re-add this machine because you want to clear out
          comments.
        </Text>
      </Pressable>
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
      fontFamily: "Nunito-Regular",
    },
    locationName: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-SemiBold",
    },
    machineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
      fontFamily: "Nunito-Bold",
    },
    modalSubText: {
      marginHorizontal: 18,
      fontSize: 14,
      fontFamily: "Nunito-Medium",
      color: theme.text3,
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
