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
    isLoadingImage: false,
    imageLoaded: false,
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
      ipdb_id,
      name: machineName,
      ic_eligible,
    } = this.props.machineDetails;
    const pintipsUrl = opdb_id && `http://pintips.net/opdb/${opdb_id}`;
    const ipdbUrl = ipdb_id
      ? `http://www.ipdb.org/machine.cgi?id=${ipdb_id}`
      : `http://ipdb.org/search.pl?name=${encodeURIComponent(
          machineName,
        )};qh=checked;searchtype=advanced`;
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
    const { isLoadingImage, imageLoaded } = this.state;

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
                  <SafeAreaView style={[{ flex: 1 }, s.background]}>
                    <ScrollView
                      style={s.background}
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={s.modalTitle}>
                        Comment on{" "}
                        <Text style={s.modalPurple2}>{machineName}</Text> at{" "}
                        <Text style={s.modalPurple}>{location.name}</Text>
                      </Text>
                      <TextInput
                        multiline={true}
                        numberOfLines={4}
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
                          "(note: if this machine is gone, please just remove it. no need to leave a comment saying it is gone)"
                        }
                        placeholderTextColor={theme.indigo4}
                        textAlignVertical="top"
                      />
                      <Text style={s.modalSubText}>
                        <Text style={[s.bold, s.purple]}>Everyone:</Text>{" "}
                        {`Sometimes it's better to tell technicians about small and very temporary issues on-site (note or call) rather than leaving them "on the record" here.`}
                        {"\n\n"}
                        That said, please be descriptive about machine issues
                        and also considerate of the time and effort needed to
                        maintain machines.{" "}
                        {!!location.operator_id && operatorHasEmail && (
                          <Text style={s.bold}>
                            This operator is signed up to be notified about
                            machine comments.
                          </Text>
                        )}
                      </Text>
                      <Text style={[s.modalSubText, s.margin8]}>
                        <Text style={[s.bold, s.purple]}>Operators:</Text>
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
                  <SafeAreaView style={[{ flex: 1 }, s.background]}>
                    <ScrollView
                      style={s.background}
                      contentContainerStyle={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <View style={s.verticalAlign}>
                        <Text style={s.modalTitle}>
                          Add your high score to{" "}
                          <Text style={s.modalPurple2}>{machineName}</Text> at{" "}
                          <Text style={s.modalPurple}>{location.name}</Text>
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
                  <View style={{ alignItems: "center" }}>
                    <View
                      style={[s.imageContainer, { width: opdbImgWidth + 8 }]}
                    >
                      <Image
                        style={[
                          {
                            width: opdbImgWidth,
                            height: opdbImgHeight,
                            resizeMode: "cover",
                            borderRadius: 10,
                          },
                          isLoadingImage && { display: "none" },
                        ]}
                        source={{ uri: opdb_img }}
                        onLoadStart={() =>
                          !imageLoaded &&
                          this.setState({ isLoadingImage: true })
                        }
                        onLoadEnd={() =>
                          this.setState({
                            imageLoaded: true,
                            isLoadingImage: false,
                          })
                        }
                      />
                      {isLoadingImage && <ActivityIndicator />}
                    </View>
                  </View>
                )}
                {!!ic_eligible && (
                  <>
                    <Text style={{ textAlign: "center" }}>
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
                    mostRecentComments.map((commentObj) => {
                      const { comment, created_at, username } = commentObj;
                      return (
                        <View
                          style={[s.listContainerStyle, s.hr]}
                          key={commentObj.id}
                        >
                          <Text style={[{ marginRight: 5 }, s.conditionText]}>
                            {`"${comment}"`}
                          </Text>
                          <Text style={[s.subtitleStyle, s.subtitleMargin]}>
                            <Text style={s.italic}>
                              {moment(created_at).format("MMM DD, YYYY")}
                            </Text>
                            {username ? ` by ` : ""}
                            {!!username && (
                              <Text style={[s.subtitleStyle, s.username]}>
                                {username}
                              </Text>
                            )}
                          </Text>
                        </View>
                      );
                    })
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
                        <View style={[s.listContainerStyle, s.hr]} key={id}>
                          <Text style={s.scoreText}>
                            {formatNumWithCommas(score)}
                          </Text>
                          <Text style={[s.subtitleStyle, s.subtitleMargin]}>
                            <Text style={s.italic}>
                              {moment(created_at).format("MMM DD, YYYY")}
                            </Text>{" "}
                            {`by `}
                            <Text
                              style={[s.subtitleStyle, s.username]}
                            >{`${username}`}</Text>
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
                  <View style={[s.externalLinkContainer, s.marginB15]}>
                    <Text
                      style={s.externalLink}
                      onPress={() => WebBrowser.openBrowserAsync(pintipsUrl)}
                    >
                      View playing tips on PinTips
                    </Text>
                    <EvilIcons name="external-link" style={s.externalIcon} />
                  </View>
                )}
                <View style={s.externalLinkContainer}>
                  <Text
                    style={s.externalLink}
                    onPress={() => WebBrowser.openBrowserAsync(ipdbUrl)}
                  >
                    View on IPDB
                  </Text>
                  <EvilIcons name="external-link" style={s.externalIcon} />
                </View>
                <WarningButton
                  title={"Remove Machine"}
                  onPress={
                    loggedIn
                      ? () => this.setState({ showRemoveMachineModal: true })
                      : () => this.props.navigation.navigate("Login")
                  }
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
      fontFamily: "blackFont",
      fontSize: 24,
      color: theme.pink1,
    },
    locationName: {
      marginTop: 5,
      textAlign: "center",
      fontSize: 20,
      color: theme.text3,
      fontFamily: "semiBoldFont",
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
      marginBottom: 10,
    },
    addedText: {
      textAlign: "center",
      fontSize: 16,
      color: theme.text3,
      fontFamily: "regularItalicFont",
    },
    externalLink: {
      fontSize: 16,
      fontFamily: "semiBoldFont",
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
    marginB15: {
      marginBottom: 15,
    },
    margin40: {
      marginHorizontal: 40,
      marginVertical: 15,
    },
    conditionText: {
      color: theme.text2,
      fontSize: 16,
      marginTop: 5,
    },
    scoreText: {
      color: theme.text2,
      fontSize: 18,
      marginTop: 5,
      fontFamily: "semiBoldFont",
    },
    noneYet: {
      textAlign: "center",
      paddingHorizontal: 15,
      color: theme.text3,
      paddingVertical: 5,
      fontFamily: "regularFont",
      fontSize: 16,
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      marginBottom: 10,
      marginHorizontal: 30,
      fontFamily: "regularFont",
      fontSize: 16,
    },
    radius10: {
      borderRadius: 10,
    },
    userScoreTitle: {
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5,
      color: theme.pink1,
      fontFamily: "semiBoldFont",
      fontSize: 16,
    },
    userHighScore: {
      textAlign: "center",
      fontSize: 20,
      paddingBottom: 15,
      color: theme.purple,
      fontFamily: "semiBoldFont",
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
      fontFamily: "semiBoldFont",
    },
    modalPurple: {
      color: theme.theme == "dark" ? theme.purple : theme.purple2,
      fontSize: 18,
      fontFamily: "boldFont",
    },
    modalPurple2: {
      color: theme.theme == "dark" ? theme.purple2 : theme.purple,
      fontSize: 18,
      fontFamily: "boldFont",
    },
    modalSubText: {
      marginHorizontal: 40,
      fontSize: 14,
      fontFamily: "mediumFont",
    },
    bold: {
      fontFamily: "boldFont",
    },
    purple: {
      color: theme.purple,
    },
    margin8: {
      marginVertical: 8,
    },
    subtitleStyle: {
      paddingTop: 3,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "semiBoldFont",
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
      backgroundColor: theme.white,
      marginHorizontal: 15,
      paddingTop: 5,
      paddingBottom: 10,
    },
    hr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.indigo4,
    },
    containerStyle: {
      borderRadius: 15,
      marginBottom: 20,
      marginTop: 0,
      marginHorizontal: 20,
      borderWidth: 0,
      backgroundColor: theme.white,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
    },
    locationNameContainer: {
      paddingVertical: 0,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "blackFont",
      textAlign: "center",
      marginVertical: 10,
      color: theme.purpleLight,
      opacity: 0.9,
    },
    imageContainer: {
      marginBottom: 20,
      marginHorizontal: 20,
      borderWidth: 4,
      borderColor: "#e7b9f1",
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
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
      fontFamily: "regularFont",
    },
    titleStyle: {
      color: "#392f3a",
      fontSize: 16,
      fontFamily: "boldFont",
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
      fontFamily: "regularItalicFont",
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
