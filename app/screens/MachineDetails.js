import React from "react";
import { connect } from "react-redux";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  EvilIcons,
  FontAwesome6,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  addMachineCondition,
  addMachineScore,
  updateIcEnabled,
} from "../actions/location_actions";
import {
  formatInputNumWithCommas,
  formatNumWithCommas,
  removeCommasFromNum,
} from "../utils/utilityFunctions";
import {
  ActivityIndicator,
  BackglassImage,
  MachineComment,
  PbmButton,
  RemoveMachineModal,
  RemoveMachine,
  Text,
  WarningButton,
} from "../components";
import * as WebBrowser from "expo-web-browser";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const moment = require("moment");

let deviceWidth = Dimensions.get("window").width;

const MachineDetails = ({
  location: locationProp,
  operators,
  user,
  machineDetails,
  addMachineCondition,
  addMachineScore,
  updateIcEnabled,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const s = getStyles(theme);
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [conditionText, setConditionText] = useState("");
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);
  const [score, setScore] = useState("");
  const [showRemoveMachineModal, setShowRemoveMachineModal] = useState(false);
  const insets = useSafeAreaInsets();

  const { curLmx, location } = locationProp;
  const { id: userId, loggedIn } = user;
  const {
    opdb_id,
    opdb_img,
    opdb_img_height,
    opdb_img_width,
    kineticist_url,
    name: machineName,
    ic_eligible,
  } = machineDetails;
  const pintipsUrl = opdb_id && `https://pintips.net/opdb/${opdb_id}`;
  const opdb_resized = opdb_img_width - (deviceWidth - 48);
  const opdb_img_height_calc =
    (deviceWidth - 48) * (opdb_img_height / opdb_img_width);
  const opdbImgHeight =
    opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
  const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;
  const machineNameMargin =
    Platform.OS === "android"
      ? insets.top - (PixelRatio.getFontScale() - 1) * 10 + 6
      : insets.top - (PixelRatio.getFontScale() - 1) * 10 + 1;

  const operator =
    location.operator_id &&
    operators.operators.find(
      (operator) => operator.id === location.operator_id,
    );
  const operatorHasEmail =
    operator && operator.operator_has_email
      ? operator.operator_has_email
      : false;

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ navigation }) => (
        <RemoveMachine navigation={navigation} />
      ),
    });
  }, []);

  useEffect(() => {
    if (!locationProp.curLmx) {
      navigation.goBack();
    }
  }, [locationProp]);

  const cancelAddCondition = () => {
    setShowAddConditionModal(false);
    setConditionText("");
  };

  const cancelAddScore = () => {
    setShowAddScoreModal(false);
    setScore("");
  };

  const addCondition = (lmx) => {
    addMachineCondition(conditionText, lmx);
    setShowAddConditionModal(false);
    setConditionText("");
  };

  const addScore = (lmx) => {
    addMachineScore(removeCommasFromNum(score), lmx);
    setShowAddScoreModal(false);
    setScore("");
  };

  if (!curLmx) {
    return <ActivityIndicator />;
  }

  const { ic_enabled } = curLmx;
  const mostRecentComments =
    curLmx.machine_conditions.length > 0
      ? curLmx.machine_conditions.slice(0, 5)
      : undefined;
  const scores = curLmx.machine_score_xrefs
    .sort((a, b) => (a.score > b.score ? -1 : b.score > a.score ? 1 : 0))
    .slice(0, 10);
  const { score: userHighScore } = curLmx.machine_score_xrefs
    .filter((score) => score.user_id === userId)
    .reduce(
      (prev, current) => (prev.score > current.score ? prev : current),
      -1,
    );

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: theme.base1,
        }}
      >
        <Modal
          animationType="slide"
          transparent={false}
          visible={showAddConditionModal}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: theme.base1 }}>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: theme.base1,
              }}
            >
              <Text style={s.modalTitle}>
                Comment on <Text style={s.modalMachineName}>{machineName}</Text>{" "}
                at <Text style={s.modalLocationName}>{location.name}</Text>
              </Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <TextInput
                  multiline={true}
                  underlineColorAndroid="transparent"
                  onChangeText={(conditionText) =>
                    setConditionText(conditionText)
                  }
                  style={[{ padding: 5, height: 100 }, s.textInput, s.radius10]}
                  placeholder={
                    "(note: if this machine is gone, please just remove it. no need to leave a comment saying it's gone)"
                  }
                  placeholderTextColor={theme.indigo4}
                  textAlignVertical="top"
                />
              </KeyboardAvoidingView>
              <Text style={[s.modalSubText, s.margin4]}>
                <Text style={[s.bold, s.purple]}>Everyone:</Text>{" "}
                {`Sometimes it's better to tell technicians about small and very temporary issues on-site (note or call) rather than leaving them "on the record" here.`}
              </Text>
              <Text style={[s.modalSubText, s.margin4]}>
                {`That said, please be descriptive about machine issues and also considerate of the time and effort needed to maintain machines.`}
              </Text>
              {!!location.operator_id && operatorHasEmail && (
                <Text style={[s.modalSubText, s.margin4, s.bold]}>
                  {`This operator is signed up to be notified about machine comments.`}
                </Text>
              )}
              <Text style={[s.modalSubText, s.margin4]}>
                <Text style={[s.bold, s.purple]}>Operators:</Text>{" "}
                {`if you've fixed an issue, please leave a comment saying so.`}
              </Text>
              <PbmButton
                title={"Add Comment"}
                disabled={conditionText.length === 0}
                onPress={() => addCondition(curLmx.id)}
              />
              <WarningButton title={"Cancel"} onPress={cancelAddCondition} />
            </ScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showAddScoreModal}
          onRequestClose={() => {}}
        >
          <View style={{ flex: 1, backgroundColor: theme.base1 }}>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: theme.base1,
              }}
            >
              <Text style={s.modalTitle}>
                Add your high score to{" "}
                <Text style={s.modalMachineName}>{machineName}</Text> at{" "}
                <Text style={s.modalLocationName}>{location.name}</Text>
              </Text>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <TextInput
                  style={[
                    { height: 40, textAlign: "center" },
                    s.textInput,
                    s.radius10,
                  ]}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  onChangeText={(score) => setScore(score)}
                  defaultValue={formatInputNumWithCommas(score)}
                  returnKeyType="done"
                  placeholder={"123..."}
                  placeholderTextColor={theme.indigo4}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </KeyboardAvoidingView>
              <PbmButton
                title={"Add Score"}
                disabled={score.length === 0}
                onPress={() => addScore(curLmx.id)}
              />
              <WarningButton title={"Cancel"} onPress={cancelAddScore} />
            </ScrollView>
          </View>
        </Modal>
        {showRemoveMachineModal && (
          <RemoveMachineModal
            closeModal={() => setShowRemoveMachineModal(false)}
          />
        )}
        <ScrollView>
          <View
            style={[{ marginTop: machineNameMargin }, s.machineNameContainer]}
          >
            <Text maxFontSizeMultiplier={1.3} style={s.machineName}>
              {machineName}
            </Text>
            <Text style={s.locationName}>{location.name}</Text>
          </View>
          <View style={s.addedContainer}>
            <Text style={s.addedText}>{`Added: ${moment(
              curLmx.created_at,
            ).format("MMM DD, YYYY")}`}</Text>
            {curLmx.created_at != curLmx.updated_at ? (
              <Text style={s.addedText}>{`Last updated: ${moment(
                curLmx.updated_at,
              ).format("MMM DD, YYYY")}`}</Text>
            ) : (
              ""
            )}
          </View>
          {!!opdb_img && (
            <BackglassImage
              width={opdbImgWidth}
              height={opdbImgHeight}
              source={opdb_img}
            />
          )}
          {!!ic_eligible && (
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: theme.text3,
                  marginBottom: -10,
                }}
              >
                Click to toggle Stern Insider Connected status
              </Text>
              <PbmButton
                title={`${
                  ic_enabled === null ? "" : ic_enabled ? "Has" : "Not"
                } Insider Connected`}
                onPress={
                  loggedIn
                    ? () => updateIcEnabled(curLmx.id)
                    : () => navigation.navigate("Login")
                }
                titleStyle={[
                  s.titleStyle,
                  ic_enabled === null
                    ? s.nullICTitle
                    : ic_enabled
                      ? s.yesICTitle
                      : s.noICTitle,
                ]}
                buttonStyle={
                  ic_enabled === null ? s.nullIC : ic_enabled ? s.yesIC : s.noIC
                }
                icon={
                  ic_enabled === null ? (
                    <FontAwesome5
                      name="question-circle"
                      size={24}
                      color="#665b50"
                      style={{ marginRight: 8 }}
                    />
                  ) : ic_enabled ? (
                    <Ionicons
                      name="qr-code"
                      size={22}
                      color="#66017b"
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={24}
                      color="#533a3a"
                      style={{ marginRight: 8 }}
                    />
                  )
                }
              />
            </View>
          )}
          <View style={s.containerStyle}>
            <View style={s.locationNameContainer}>
              <Text style={s.sectionTitle}>Machine Comments</Text>
            </View>
            {mostRecentComments ? (
              mostRecentComments.map((commentObj) => (
                <MachineComment commentObj={commentObj} key={commentObj.id} />
              ))
            ) : (
              <Text style={s.noneYet}>No machine comments yet</Text>
            )}
            <PbmButton
              title={"Add a New Comment"}
              onPress={
                loggedIn
                  ? () => setShowAddConditionModal(true)
                  : () => navigation.navigate("Login")
              }
            />
            {!!location.operator_id && operatorHasEmail && (
              <View style={[s.operatorEmail, s.operatorHasEmail]}>
                <Text style={s.operatorComments}>
                  This operator receives machine comments!
                </Text>
              </View>
            )}
            {!!location.operator_id && !operatorHasEmail && (
              <View style={[s.operatorEmail, s.operatorNotEmail]}>
                <Text style={s.operatorComments}>
                  This operator does not receive machine comments
                </Text>
              </View>
            )}
          </View>
          <View style={s.containerStyle}>
            <View style={s.locationNameContainer}>
              <Text style={s.sectionTitle}>High Scores</Text>
            </View>
            {!!userHighScore && (
              <View>
                <Text
                  style={s.userScoreTitle}
                >{`Your personal best on this machine is`}</Text>
                <Text style={s.userHighScore}>
                  {formatNumWithCommas(userHighScore)}
                </Text>
              </View>
            )}
            {scores.length > 0 ? (
              scores.map((scoreObj) => {
                const { id, score, created_at, username } = scoreObj;

                return (
                  <View style={s.listContainerStyle} key={id}>
                    <Text style={s.scoreText}>
                      {formatNumWithCommas(score)}
                    </Text>
                    <Text style={[s.subtitleStyle, s.subtitleMargin]}>
                      <Text
                        style={[s.subtitleStyle, s.username]}
                      >{`${username}`}</Text>
                      {"  "}
                      <Text style={s.italic}>
                        {moment(created_at).format("MMM DD, YYYY")}
                      </Text>
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={s.noneYet}>No scores yet</Text>
            )}
            <PbmButton
              title={"Add Your Score"}
              onPress={
                loggedIn
                  ? () => setShowAddScoreModal(true)
                  : () => navigation.navigate("Login")
              }
            />
          </View>
          {!!kineticist_url && (
            <View style={[{ marginBottom: 15 }, s.externalLinkContainer]}>
              <Text
                style={s.externalLink}
                onPress={() => WebBrowser.openBrowserAsync(kineticist_url)}
              >
                View machine info on Kineticist
              </Text>
              <Image
                source={require("../assets/images/kineticist.png")}
                style={{
                  width: 24,
                  height: 24,
                  marginLeft: 5,
                }}
              />
            </View>
          )}
          {!!pintipsUrl && (
            <View style={[s.externalLinkContainer, s.marginB10]}>
              <Text
                style={s.externalLink}
                onPress={() => WebBrowser.openBrowserAsync(pintipsUrl)}
              >
                View playing tips on PinTips
              </Text>
              <EvilIcons name="external-link" style={s.externalIcon} />
            </View>
          )}
          <WarningButton
            containerStyle={s.removeButtonMargins}
            title={"Remove Machine"}
            onPress={
              loggedIn
                ? () => setShowRemoveMachineModal(true)
                : () => navigation.navigate("Login")
            }
            icon={
              <FontAwesome6
                size={24}
                color="#ffffff"
                name="trash-can"
                style={s.removeButton}
              />
            }
            iconPosition="left"
          />
        </ScrollView>
      </ScrollView>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    machineName: {
      textAlign: "center",
      fontFamily: "Nunito-ExtraBold",
      fontSize: 24,
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
    },
    locationName: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 20,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    machineNameContainer: {
      marginBottom: 5,
      marginHorizontal: 38,
      borderWidth: 0,
      paddingVertical: 5,
      textAlign: "center",
    },
    addedContainer: {
      marginTop: 5,
      marginBottom: 15,
    },
    addedText: {
      textAlign: "center",
      fontSize: 16,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
    },
    externalLink: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      color: theme.purple2,
      textAlign: "center",
    },
    externalLinkContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    externalIcon: {
      fontSize: 24,
      color: theme.text2,
    },
    marginB10: {
      marginBottom: 10,
    },
    margin40: {
      marginHorizontal: 40,
      marginVertical: 15,
    },
    scoreText: {
      color: theme.text2,
      fontSize: 18,
      marginTop: 5,
      fontFamily: "Nunito-SemiBold",
    },
    noneYet: {
      textAlign: "center",
      paddingHorizontal: 15,
      color: theme.text3,
      paddingVertical: 5,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
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
    userScoreTitle: {
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5,
      color: theme.text2,
      fontFamily: "Nunito-SemiBold",
      fontSize: 13,
      textTransform: "uppercase",
    },
    userHighScore: {
      textAlign: "center",
      fontSize: 24,
      paddingBottom: 15,
      color: theme.purple,
      fontFamily: "Nunito-ExtraBold",
    },
    modalTitle: {
      textAlign: "center",
      marginBottom: 10,
      marginHorizontal: 40,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
    modalLocationName: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-SemiBold",
    },
    modalMachineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
      fontFamily: "Nunito-Bold",
    },
    modalSubText: {
      marginHorizontal: 40,
      fontSize: 14,
      fontFamily: "Nunito-Medium",
    },
    bold: {
      fontFamily: "Nunito-Bold",
    },
    purple: {
      color: theme.purple,
    },
    margin4: {
      marginVertical: 4,
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
    listContainerStyle: {
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base3,
      marginHorizontal: 15,
      paddingTop: 5,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.indigo4,
    },
    containerStyle: {
      borderRadius: 15,
      marginBottom: 20,
      marginHorizontal: 20,
      borderWidth: 0,
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base3,
    },
    locationNameContainer: {
      paddingVertical: 0,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Nunito-ExtraBold",
      textAlign: "center",
      marginVertical: 10,
      color: theme.purpleLight,
      opacity: 0.9,
    },
    operatorEmail: {
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      paddingVertical: 10,
    },
    operatorHasEmail: {
      backgroundColor: theme.base4,
    },
    operatorNotEmail: {
      backgroundColor: theme.base3,
    },
    operatorComments: {
      textAlign: "center",
      color: theme.text2,
      fontFamily: "Nunito-SemiBold",
    },
    titleStyle: {
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    nullICTitle: {
      color: "#665b50",
    },
    yesICTitle: {
      color: "#440152",
    },
    noICTitle: {
      color: "#533a3a",
    },
    nullIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#e4dddd",
    },
    yesIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#e3fae5",
    },
    noIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#f0d8d8",
    },
    italic: {
      fontFamily: "Nunito-Italic",
    },
    removeButton: {
      marginRight: 10,
    },
    removeButtonMargins: {
      marginLeft: 40,
      marginRight: 40,
      marginTop: 15,
      marginBottom: 40,
    },
  });

const mapStateToProps = ({ location, operators, user, machines }) => {
  const machineDetails = location.curLmx
    ? machines.machines.find((m) => m.id === location.curLmx.machine_id)
    : {};
  return { location, operators, user, machineDetails };
};
const mapDispatchToProps = (dispatch) => ({
  addMachineCondition: (condition, lmx) =>
    dispatch(addMachineCondition(condition, lmx)),
  addMachineScore: (score, lmx) => dispatch(addMachineScore(score, lmx)),
  updateIcEnabled: (id) => dispatch(updateIcEnabled(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails);
