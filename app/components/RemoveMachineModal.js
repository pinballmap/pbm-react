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
  manufacturer,
  year,
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
      {machineName && (
        <Text style={[s.confirmText, s.regular]}>
          Remove <Text style={[s.machineName, s.bold]}>{machineName}</Text>{" "}
          {year && manufacturer && (
            <Text
              style={[s.machineManYear, s.medium]}
            >{`(${manufacturer}, ${year})`}</Text>
          )}{" "}
          from <Text style={[s.locationName, s.semiBold]}>{location.name}</Text>
          ?
        </Text>
      )}
      <PbmButton
        title={"Yes, Remove It"}
        onPress={() => removeLmx(curLmx, location.id)}
      />
      <WarningButton title={"Cancel"} onPress={() => closeModal()} />
      <Text style={[s.modalSubText, s.medium]}>
        Do not remove and re-add this machine because you want to clear out
        comments.
      </Text>
    </ConfirmationModal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Nunito",
      fontWeight: "500",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    confirmText: {
      textAlign: "center",
      marginHorizontal: 15,
      fontSize: 18,
      color: theme.text,
    },
    locationName: {
      color: theme.text,
      fontSize: 18,
    },
    machineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
    },
    machineManYear: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
    },
    modalSubText: {
      marginHorizontal: 18,
      fontSize: 14,
      color: theme.pink1,
    },
  });

RemoveMachineModal.propTypes = {
  removeMachineFromLocation: PropTypes.func,
  closeModal: PropTypes.func,
  location: PropTypes.object,
  machineName: PropTypes.string,
  manufacturer: PropTypes.string,
  year: PropTypes.number,
};

const mapStateToProps = ({ location, machines }) => {
  const curMachine = location.curLmx
    ? machines.machines.find((m) => m.id === location.curLmx.machine_id)
    : null;
  return {
    location,
    machineName: curMachine?.name ?? "",
    manufacturer: curMachine?.manufacturer,
    year: curMachine?.year,
  };
};
const mapDispatchToProps = (dispatch) => ({
  removeMachineFromLocation: (curLmx, location_id) =>
    dispatch(removeMachineFromLocation(curLmx, location_id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(RemoveMachineModal);
