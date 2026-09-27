import React, { useContext, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Modal,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, WarningButton, PbmButton } from ".";
import UserBadges, { useBadgeIconSize } from "./UserBadges";
import { deleteCondition, editCondition } from "../actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { formatDate } from "../utils/dateUtils";

const MachineComment = ({
  commentObj,
  user,
  location: loc,
  operators,
  isLast = false,
}) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [loading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    comment: initialComment,
    created_at,
    updated_at,
    username,
    operator_id: commentOperatorId,
    user_id: commentUserId,
    user_deleted,
    id: commentId,
    admin_title,
    contributor_rank,
    flag,
  } = commentObj;
  const { location } = loc;
  const operator =
    location.operator_id &&
    operators.operators.find(
      (operator) => operator.id === location.operator_id,
    );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [comment, setComment] = useState(initialComment);
  const iconSize = useBadgeIconSize();
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
  const machineNameMargin =
    Platform.OS === "android"
      ? insets.top - (PixelRatio.getFontScale() - 1) * 10 + 6
      : insets.top - (PixelRatio.getFontScale() - 1) * 10 + 1;

  const onDeletePress = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteCondition(commentId, user));
    } finally {
      setIsLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const cancelEditComment = () => {
    setEditModalVisible(false);
    setComment(initialComment);
  };

  return (
    <>
      <ConfirmationModal
        loading={loading}
        visible={deleteModalVisible}
        closeModal={() => setDeleteModalVisible(false)}
      >
        <Text style={[s.modalTitle, s.bold]}>Delete your comment?</Text>
        <PbmButton title={"Delete Comment"} onPress={onDeletePress} />
        <WarningButton
          title={"Cancel"}
          onPress={() => setDeleteModalVisible(false)}
        />
      </ConfirmationModal>
      <Modal
        animationType="slide"
        transparent={false}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        loading={loading}
        visible={editModalVisible}
        onRequestClose={() => {}}
      >
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              backgroundColor: theme.base1,
              paddingBottom: 30,
              paddingTop: machineNameMargin + 50,
            }}
          >
            <Text style={[s.modalTitle, s.bold]}>Edit your comment</Text>
            <TextInput
              defaultValue={initialComment}
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={(conditionText) => setComment(conditionText)}
              style={[
                { padding: 5, height: 100 },
                s.textInput,
                s.regular,
                s.radius10,
              ]}
              textAlignVertical="top"
            />
            <PbmButton title={"Save"} onPress={onEditPress} />
            <WarningButton title={"Cancel"} onPress={cancelEditComment} />
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <View style={[s.listContainerStyle, isLast && { borderBottomWidth: 0 }]}>
        <Text
          style={[s.conditionText, s.regular]}
        >{`"${initialComment}"`}</Text>
        <View
          style={[
            s.subtitleStyle,
            s.semiBold,
            s.subtitleMargin,
            {
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            },
          ]}
        >
          <UserBadges
            username={username}
            userId={commentUserId}
            userDeleted={user_deleted}
            adminTitle={admin_title}
            contributorRank={contributor_rank}
            flag={flag}
          />
          <Text style={[s.timestamp, s.italic, s.date]}>
            {formatDate(updated_at)}
          </Text>
          {created_at !== updated_at && <Text style={s.timestamp}>{`*`}</Text>}
          {user?.id && user.id === commentUserId && (
            <>
              <Text
                style={[s.editDelete, { marginHorizontal: 8 }]}
                onPress={() => setEditModalVisible(true)}
              >
                edit
              </Text>
              <Text
                style={s.editDelete}
                onPress={() => setDeleteModalVisible(true)}
              >
                delete
              </Text>
            </>
          )}
        </View>
        {!!username &&
          !!commentOperatorId &&
          commentOperatorId === location.operator_id && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <MaterialCommunityIcons
                name="wrench"
                size={iconSize}
                color={theme.wrench}
                style={{
                  width: iconSize,
                  height: iconSize,
                  marginRight: 5,
                  marginTop: 5,
                }}
              />
              <Text style={[s.subtitleStyle, s.text3, s.italic]}>
                Operator: {operator.name}
              </Text>
            </View>
          )}
      </View>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    italic: {
      fontFamily: "Nunito",
      fontWeight: "400",
      fontStyle: "italic",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    listContainerStyle: {
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base3,
      marginHorizontal: 15,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.indigo4,
    },
    conditionText: {
      color: theme.text2,
      fontSize: 15,
      marginHorizontal: 5,
    },
    subtitleStyle: {
      paddingTop: 5,
      fontSize: 14,
      color: theme.text3,
    },
    subtitleMargin: {
      marginTop: 4,
      marginLeft: 8,
      marginRight: 0,
    },
    text3: {
      color: theme.text3,
      fontSize: 14,
    },
    timestamp: {
      color: theme.timestamp,
      fontSize: 14,
    },
    editDelete: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontSize: 13,
    },
    date: {
      marginLeft: 8,
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      marginBottom: 10,
      marginHorizontal: 30,
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
      color: theme.text,
    },
  });

const mapStateToProps = ({ location, user, operators }) => {
  return { location, user, operators };
};
export default connect(mapStateToProps)(MachineComment);
