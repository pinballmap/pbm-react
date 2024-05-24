import React, { useContext, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, WarningButton, PbmButton } from ".";
import { deleteCondition } from "../actions";

const moment = require("moment");

const MachineComment = ({ commentObj, machineId, user }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const {
    comment,
    created_at,
    username,
    user_id: commentUserId,
    id: commentId,
  } = commentObj;
  const [modalVisible, setModalVisible] = useState(false);
  const onEditPress = () => {
    console.log("HEYYYY");
  };

  const onDeletePress = () => {
    dispatch(deleteCondition(commentId, machineId, user));
    setModalVisible(false);
  };

  return (
    <>
      <ConfirmationModal visible={modalVisible}>
        <WarningButton
          title={"Delete Comment"}
          onPress={onDeletePress}
          accessibilityLabel="Delete Comment"
          containerStyle={s.buttonContainer}
        />
        <PbmButton
          title={"Nevermind"}
          onPress={() => setModalVisible(false)}
          accessibilityLabel="Nevermind"
          containerStyle={s.buttonContainer}
        />
      </ConfirmationModal>
      <View style={s.listContainerStyle}>
        <Text style={s.conditionText}>{`"${comment}"`}</Text>
        <Text style={[s.subtitleStyle, s.subtitleMargin]}>
          <Text style={s.italic}>
            {moment(created_at).format("MMM DD, YYYY")}
          </Text>
          {user?.id && user.id === commentUserId && (
            <>
              <Text onPress={onEditPress}> Edit </Text>
              <Text onPress={() => setModalVisible(true)}> Delete </Text>
            </>
          )}
          {username ? ` by ` : ""}
          {!!username && (
            <Text style={[s.subtitleStyle, s.username]}>{username}</Text>
          )}
        </Text>
      </View>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    listContainerStyle: {
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base3,
      marginHorizontal: 15,
      paddingTop: 5,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.indigo4,
    },
    conditionText: {
      color: theme.text2,
      fontSize: 16,
      marginTop: 5,
      marginRight: 5,
    },
    subtitleStyle: {
      paddingTop: 3,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    subtitleMargin: {
      marginTop: 5,
      marginHorizontal: 0,
      fontSize: 14,
    },
    username: {
      color: theme.pink1,
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
  });

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps)(MachineComment);
