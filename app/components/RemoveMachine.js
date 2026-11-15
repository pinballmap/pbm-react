import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { View } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import RemoveMachineModal from "./RemoveMachineModal";
import LoginRequiredModal from "./LoginRequiredModal";

const RemoveMachine = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  return (
    <View>
      {showModal && (
        <RemoveMachineModal closeModal={() => setShowModal(false)} />
      )}
      <LoginRequiredModal
        visible={loginModalVisible}
        closeModal={() => setLoginModalVisible(false)}
      />
      <FontAwesome6
        name="trash-can"
        size={30}
        color={"#e4606a"}
        onPress={() =>
          user.loggedIn ? setShowModal(true) : setLoginModalVisible(true)
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
