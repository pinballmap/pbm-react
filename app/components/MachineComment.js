import React, { useContext, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Modal,
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, WarningButton, PbmButton } from ".";
import { deleteCondition, editCondition } from "../actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

const moment = require("moment");

const MachineComment = ({ commentObj, user, location: loc, operators }) => {
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
    id: commentId,
    admin_title,
    contributor_rank,
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

  let contributor_icon;
  if (contributor_rank == "Super Mapper") {
    contributor_icon = require("../assets/images/SuperMapper.png");
  } else if (contributor_rank == "Legendary Mapper") {
    contributor_icon = require("../assets/images/LegendaryMapper.png");
  } else if (contributor_rank == "Grand Champ Mapper") {
    contributor_icon = require("../assets/images/GrandChampMapper.png");
  }

  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        return (
          <>
            <ConfirmationModal
              loading={loading}
              visible={deleteModalVisible}
              closeModal={() => setDeleteModalVisible(false)}
            >
              <Pressable>
                <Text style={s.modalTitle}>Delete your comment?</Text>
                <PbmButton title={"Delete Comment"} onPress={onDeletePress} />
                <WarningButton
                  title={"Cancel"}
                  onPress={() => setDeleteModalVisible(false)}
                />
              </Pressable>
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
                  <Text style={s.modalTitle}>Edit your comment</Text>
                  <TextInput
                    defaultValue={initialComment}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    onChangeText={(conditionText) => setComment(conditionText)}
                    style={[
                      { padding: 5, height: 100 },
                      s.textInput,
                      s.radius10,
                    ]}
                    textAlignVertical="top"
                  />
                  <PbmButton title={"Save"} onPress={onEditPress} />
                  <WarningButton title={"Cancel"} onPress={cancelEditComment} />
                </KeyboardAwareScrollView>
              </View>
            </Modal>
            <View style={s.listContainerStyle}>
              <Text style={s.conditionText}>{`"${initialComment}"`}</Text>
              <View
                style={[
                  s.subtitleStyle,
                  s.subtitleMargin,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                {!!username && (
                  <Text style={[s.username]}>
                    {username}
                    {"  "}
                  </Text>
                )}
                {!!admin_title && (
                  <MaterialCommunityIcons
                    name="shield-account"
                    size={15}
                    color={theme.shield}
                    style={{ marginRight: 3 }}
                  />
                )}
                {!!contributor_rank && (
                  <Image
                    contentFit="fill"
                    source={contributor_icon}
                    style={s.rankIcon}
                  />
                )}
                <Text style={[s.italic, s.date]}>
                  {moment(updated_at).format("MMM DD, YYYY")}
                </Text>
                <Text style={{ color: theme.text3 }}>
                  {created_at !== updated_at && "*"}
                  {"  "}
                </Text>
                {user?.id && user.id === commentUserId && (
                  <>
                    <Text
                      style={s.editDelete}
                      onPress={() => setEditModalVisible(true)}
                    >
                      edit{`  `}
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
                      marginLeft: 6,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="wrench"
                      size={15}
                      color={theme.wrench}
                      style={{ marginRight: 5, marginTop: 5 }}
                    />
                    <Text style={[s.subtitleStyle, s.italic]}>
                      Operator: {operator.name}
                    </Text>
                  </View>
                )}
            </View>
          </>
        );
      }}
    </ThemeContext.Consumer>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.base1,
    },
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
      fontSize: 15,
      marginTop: 5,
      marginHorizontal: 5,
      fontFamily: "Nunito-Regular",
    },
    subtitleStyle: {
      paddingTop: 5,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    subtitleMargin: {
      marginTop: 4,
      marginHorizontal: 0,
      fontSize: 14,
    },
    username: {
      color: theme.pink1,
      marginLeft: 6,
    },
    italic: {
      fontFamily: "Nunito-Italic",
      color: theme.text3,
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    editDelete: {
      textDecorationLine: "underline",
      color: theme.text3,
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
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    rankIcon: {
      width: 15,
      height: 15,
      marginLeft: 3,
    },
  });

const mapStateToProps = ({ location, user, operators }) => {
  return { location, user, operators };
};
export default connect(mapStateToProps)(MachineComment);
