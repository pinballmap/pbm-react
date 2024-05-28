import React, { useContext, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, WarningButton, PbmButton } from ".";
import { deleteCondition, editCondition } from "../actions";

const moment = require("moment");

const MachineComment = ({ commentObj, user }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [loading, setIsLoading] = useState(false);
  const {
    comment: initialComment,
    created_at,
    updated_at,
    username,
    user_id: commentUserId,
    id: commentId,
  } = commentObj;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [comment, setComment] = useState(initialComment);
  const onEditPress = async () => {
    try {
      setIsLoading(true);
      comment.length &&
        (await dispatch(editCondition(commentId, comment, user)));
    } finally {
      setIsLoading(false);
      setEditModalVisible(false);
    }
  };

  const onDeletePress = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteCondition(commentId, user));
    } finally {
      setIsLoading(false);
      setDeleteModalVisible(false);
    }
  };

  return (
    <>
      <ConfirmationModal loading={loading} visible={deleteModalVisible}>
        <Text style={s.modalTitle}>Delete your comment</Text>
        <PbmButton
          title={"Delete Comment"}
          onPress={onDeletePress}
          accessibilityLabel="Delete Comment"
          containerStyle={s.buttonContainer}
        />
        <WarningButton
          title={"Cancel"}
          onPress={() => setDeleteModalVisible(false)}
          accessibilityLabel="Cancel"
          containerStyle={s.buttonContainer}
        />
      </ConfirmationModal>
      <Modal
        animationType="slide"
        transparent={false}
        loading={loading}
        visible={editModalVisible}
        onRequestClose={() => {}}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text style={s.modalTitle}>Edit your comment</Text>
            <TextInput
              defaultValue={initialComment}
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={(conditionText) => setComment(conditionText)}
              style={[{ padding: 5, height: 100 }, s.textInput, s.radius10]}
              textAlignVertical="top"
            />
            <PbmButton
              title={"Save"}
              onPress={onEditPress}
              accessibilityLabel="Edit Comment"
            />
            <WarningButton
              title={"Cancel"}
              onPress={() => setEditModalVisible(false)}
              accessibilityLabel="Cancel"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <View style={s.listContainerStyle}>
        <Text style={s.conditionText}>{`"${initialComment}"`}</Text>
        <Text style={[s.subtitleStyle]}>
          {!!username && (
            <Text style={s.username}>
              {username}
              {"  "}
            </Text>
          )}
          <Text style={s.italic}>
            {moment(updated_at).format("MMM DD, YYYY")}
          </Text>
          {created_at !== updated_at && "*"}
          {"  "}
          {user?.id && user.id === commentUserId && (
            <>
              <Text
                style={s.editDelete}
                onPress={() => setEditModalVisible(true)}
              >
                edit
              </Text>
              {"  "}
              <Text
                style={s.editDelete}
                onPress={() => setDeleteModalVisible(true)}
              >
                delete
              </Text>
            </>
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
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: theme.indigo4,
    },
    conditionText: {
      color: theme.text2,
      fontSize: 16,
      marginTop: 5,
      marginRight: 5,
      fontFamily: "Nunito-Regular",
    },
    subtitleStyle: {
      paddingTop: 5,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    username: {
      color: theme.pink1,
      marginLeft: 6,
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
    italic: {
      fontFamily: "Nunito-Italic",
    },
    editDelete: {
      textDecorationLine: "underline",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      marginBottom: 10,
      marginHorizontal: 30,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    radius10: {
      borderRadius: 10,
    },
    modalTitle: {
      textAlign: "center",
      marginBottom: 10,
      marginHorizontal: 40,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
  });

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps)(MachineComment);
