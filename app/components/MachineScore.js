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
import {
  formatInputNumWithCommas,
  formatNumWithCommas,
  removeCommasFromNum,
} from "../utils/utilityFunctions";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { ThemeContext } from "../theme-context";
import { ConfirmationModal, WarningButton, PbmButton } from ".";
import { deleteScore, editScore } from "../actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

const moment = require("moment");

const MachineScore = ({ scoreObj, user }) => {
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [loading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {
    score: initialScore,
    created_at,
    updated_at,
    username,
    user_id: scoreUserId,
    id: scoreId,
    admin_title,
    contributor_rank,
  } = scoreObj;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [score, setScore] = useState(initialScore);

  const handleScoreEdit = (inputScore) => {
    const formattedScore = formatInputNumWithCommas(inputScore);
    setScore(formattedScore);
  };

  const onEditPress = async () => {
    try {
      setIsLoading(true);
      score.length &&
        (await dispatch(editScore(scoreId, removeCommasFromNum(score), user)));
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
      await dispatch(deleteScore(scoreId, user));
    } finally {
      setIsLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const cancelEditScore = () => {
    setEditModalVisible(false);
    setScore(initialScore);
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
                <Text style={s.modalTitle}>Delete your score?</Text>
                <PbmButton title={"Delete Score"} onPress={onDeletePress} />
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
                  <Text style={s.modalTitle}>Edit your score</Text>
                  <TextInput
                    style={[
                      { height: 40, textAlign: "center" },
                      s.textInput,
                      s.radius10,
                    ]}
                    keyboardType="numeric"
                    underlineColorAndroid="transparent"
                    onChangeText={handleScoreEdit}
                    value={score}
                    defaultValue={formatNumWithCommas(initialScore)}
                    returnKeyType="done"
                    placeholder={"123..."}
                    placeholderTextColor={theme.indigo4}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <PbmButton title={"Save"} onPress={onEditPress} />
                  <WarningButton title={"Cancel"} onPress={cancelEditScore} />
                </KeyboardAwareScrollView>
              </View>
            </Modal>
            <View style={s.listContainerStyle}>
              <Text style={s.scoreText}>
                {formatNumWithCommas(initialScore)}
              </Text>
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
                {user?.id && user.id === scoreUserId && (
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
    scoreText: {
      color: theme.text2,
      fontSize: 18,
      marginTop: 5,
      marginHorizontal: 5,
      fontFamily: "Nunito-SemiBold",
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
    date: {
      marginLeft: 8,
    },
    editDelete: {
      textDecorationLine: "underline",
      color: theme.text3,
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

const mapStateToProps = ({ user }) => {
  return { user };
};
export default connect(mapStateToProps)(MachineScore);
