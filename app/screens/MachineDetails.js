import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemeContext } from "../theme-context";
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
  removeMachineFromLocation,
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
import Constants from "expo-constants";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const moment = require("moment");

let deviceWidth = Dimensions.get("window").width;

class MachineDetails extends Component {
  state = {
    showAddConditionModal: false,
    conditionText: "",
    showAddScoreModal: false,
    score: "",
    showRemoveMachineModal: false,
  };

  cancelAddCondition = () =>
    this.setState({ showAddConditionModal: false, conditionText: "" });

  cancelAddScore = () => this.setState({ showAddScoreModal: false, score: "" });

  addCondition = (lmx) => {
    this.props.addMachineCondition(this.state.conditionText, lmx);
    this.setState({
      showAddConditionModal: false,
      conditionText: "",
    });
  };

  addScore = (lmx) => {
    this.props.addMachineScore(removeCommasFromNum(this.state.score), lmx);
    this.setState({ showAddScoreModal: false, score: "" });
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: ({ navigation }) => (
        <RemoveMachine navigation={navigation} />
      ),
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.curLmx && !this.props.location.curLmx)
      this.props.navigation.goBack();
  }

  render() {
    const { curLmx, location } = this.props.location;

    if (!curLmx) {
      return <ActivityIndicator />;
    }

    const { ic_enabled } = curLmx;
    const { id: userId, loggedIn } = this.props.user;
    const {
      opdb_id,
      opdb_img,
      opdb_img_height,
      opdb_img_width,
      kineticist_url,
      name: machineName,
      ic_eligible,
    } = this.props.machineDetails;
    const pintipsUrl = opdb_id && `http://pintips.net/opdb/${opdb_id}`;
    const opdb_resized = opdb_img_width - (deviceWidth - 48);
    const opdb_img_height_calc =
      (deviceWidth - 48) * (opdb_img_height / opdb_img_width);
    const opdbImgHeight =
      opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
    const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;

    const operator =
      location.operator_id &&
      this.props.operators.operators.find(
        (operator) => operator.id === location.operator_id,
      );
    const operatorHasEmail =
      operator && operator.operator_has_email
        ? operator.operator_has_email
        : false;

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
    const keyboardDismissProp =
      Platform.OS === "ios"
        ? { keyboardDismissMode: "on-drag" }
        : { onScrollBeginDrag: Keyboard.dismiss };

    return (
      <ThemeContext.Consumer>
        {({ theme }) => {
          const s = getStyles(theme);
          return (
            <KeyboardAwareScrollView
              {...keyboardDismissProp}
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps="handled"
              style={s.backgroundColor}
            >
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.showAddConditionModal}
                onRequestClose={() => {}}
              >
                <SafeAreaProvider>
                  <SafeAreaView style={[{ flex: 1 }, s.backgroundColor]}>
                    <ScrollView
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={s.modalTitle}>
                        Comment on{" "}
                        <Text style={s.modalMachineName}>{machineName}</Text> at{" "}
                        <Text style={s.modalLocationName}>{location.name}</Text>
                      </Text>
                      <TextInput
                        multiline={true}
                        underlineColorAndroid="transparent"
                        onChangeText={(conditionText) =>
                          this.setState({ conditionText })
                        }
                        style={[
                          { padding: 5, height: 100 },
                          s.textInput,
                          s.radius10,
                        ]}
                        placeholder={
                          "(note: if this machine is gone, please just remove it. no need to leave a comment saying it's gone)"
                        }
                        placeholderTextColor={theme.indigo4}
                        textAlignVertical="top"
                      />
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
                        title={"Add Condition"}
                        disabled={this.state.conditionText.length === 0}
                        onPress={() => this.addCondition(curLmx.id)}
                      />
                      <WarningButton
                        title={"Cancel"}
                        onPress={this.cancelAddCondition}
                      />
                    </ScrollView>
                  </SafeAreaView>
                </SafeAreaProvider>
              </Modal>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.showAddScoreModal}
                onRequestClose={() => {}}
              >
                <SafeAreaProvider>
                  <SafeAreaView style={[{ flex: 1 }, s.backgroundColor]}>
                    <ScrollView
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <View style={s.verticalAlign}>
                        <Text style={s.modalTitle}>
                          Add your high score to{" "}
                          <Text style={s.modalMachineName}>{machineName}</Text>{" "}
                          at{" "}
                          <Text style={s.modalLocationName}>
                            {location.name}
                          </Text>
                        </Text>
                        <TextInput
                          style={[
                            { height: 40, textAlign: "center" },
                            s.textInput,
                            s.radius10,
                          ]}
                          keyboardType="numeric"
                          underlineColorAndroid="transparent"
                          onChangeText={(score) => this.setState({ score })}
                          defaultValue={formatInputNumWithCommas(
                            this.state.score,
                          )}
                          returnKeyType="done"
                          placeholder={"123..."}
                          placeholderTextColor={theme.indigo4}
                          autoCapitalize="none"
                          autoCorrect={false}
                        />
                        <PbmButton
                          title={"Add Score"}
                          disabled={this.state.score.length === 0}
                          onPress={() => this.addScore(curLmx.id)}
                        />
                        <WarningButton
                          title={"Cancel"}
                          onPress={this.cancelAddScore}
                        />
                      </View>
                    </ScrollView>
                  </SafeAreaView>
                </SafeAreaProvider>
              </Modal>
              {this.state.showRemoveMachineModal && (
                <RemoveMachineModal
                  closeModal={() =>
                    this.setState({ showRemoveMachineModal: false })
                  }
                />
              )}
              <ScrollView style={{ marginBottom: 20 }}>
                <View style={s.machineNameContainer}>
                  <Text style={s.machineName}>{machineName}</Text>
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
                  <>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: theme.text3,
                        marginBottom: -8,
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
                          ? () => this.props.updateIcEnabled(curLmx.id)
                          : () => this.props.navigation.navigate("Login")
                      }
                      titleStyle={s.titleStyle}
                      buttonStyle={
                        ic_enabled === null
                          ? s.nullIC
                          : ic_enabled
                            ? s.yesIC
                            : s.noIC
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
                  </>
                )}
                <View style={s.containerStyle}>
                  <View style={s.locationNameContainer}>
                    <Text style={s.sectionTitle}>Machine Comments</Text>
                  </View>
                  {mostRecentComments ? (
                    mostRecentComments.map((commentObj) => (
                      <MachineComment
                        commentObj={commentObj}
                        key={commentObj.id}
                      />
                    ))
                  ) : (
                    <Text style={s.noneYet}>No machine comments yet</Text>
                  )}
                  <PbmButton
                    title={"Add a New Comment"}
                    onPress={
                      loggedIn
                        ? () => this.setState({ showAddConditionModal: true })
                        : () => this.props.navigation.navigate("Login")
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
                        ? () => this.setState({ showAddScoreModal: true })
                        : () => this.props.navigation.navigate("Login")
                    }
                  />
                </View>
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
                {!!kineticist_url && (
                  <View style={[s.externalLinkContainer, s.marginB10]}>
                    <Text
                      style={s.externalLink}
                      onPress={() =>
                        WebBrowser.openBrowserAsync(kineticist_url)
                      }
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
                <WarningButton
                  title={"Remove Machine"}
                  onPress={
                    loggedIn
                      ? () => this.setState({ showRemoveMachineModal: true })
                      : () => this.props.navigation.navigate("Login")
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
            </KeyboardAwareScrollView>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const getStyles = (theme) =>
  StyleSheet.create({
    backgroundColor: {
      backgroundColor: theme.base1,
    },
    machineName: {
      textAlign: "center",
      fontFamily: "Nunito-Black",
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
      marginTop:
        Platform.OS === "android"
          ? Constants.statusBarHeight + 6
          : Constants.statusBarHeight + 1,
    },
    addedContainer: {
      marginTop: 5,
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
      color: theme.purpleLight,
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
    verticalAlign: {
      flex: 1,
      justifyContent: "center",
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
      marginVertical: 10,
      marginHorizontal: 20,
      borderWidth: 0,
      backgroundColor: theme.theme == "dark" ? theme.base2 : theme.base3,
    },
    locationNameContainer: {
      paddingVertical: 0,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Nunito-Black",
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
      fontFamily: "Nunito-Regular",
    },
    titleStyle: {
      color: "#392f3a",
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    nullIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#e4dddd",
    },
    yesIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#ecbcf5",
    },
    noIC: {
      width: "100%",
      borderRadius: 25,
      backgroundColor: "#e7c8c8",
    },
    italic: {
      fontFamily: "Nunito-Italic",
    },
    removeButton: {
      marginRight: 10,
    },
  });

MachineDetails.propTypes = {
  location: PropTypes.object,
  addMachineCondition: PropTypes.func,
  addMachineScore: PropTypes.func,
  operators: PropTypes.object,
  navigation: PropTypes.object,
  user: PropTypes.object,
  machineDetails: PropTypes.object,
  removeMachineFromLocation: PropTypes.func,
};

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
  removeMachineFromLocation: (lmx) => dispatch(removeMachineFromLocation(lmx)),
  updateIcEnabled: (id) => dispatch(updateIcEnabled(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MachineDetails);
