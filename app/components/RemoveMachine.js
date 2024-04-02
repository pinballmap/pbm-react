import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import RemoveMachineModal from "./RemoveMachineModal";
import { useNavigation } from "@react-navigation/native";

const RemoveMachine = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  return (
    <View>
      {showModal && (
        <RemoveMachineModal closeModal={() => setShowModal(false)} />
      )}
      <FontAwesome6
        name="trash-can"
        size={30}
        color={"#e4606a"}
        style={{ marginRight: 10 }}
        onPress={
          user.loggedIn
            ? () => setShowModal(true)
            : () => navigation.navigate("Login")
        }
      />
    </View>
  );
};

RemoveMachine.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(RemoveMachine);
