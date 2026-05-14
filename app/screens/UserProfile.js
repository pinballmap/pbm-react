import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "../theme-context";
import {
  ActivityIndicator,
  ConfirmationModal,
  NotLoggedIn,
  PbmButton,
  Screen,
  Text,
  WarningButton,
} from "../components";
import { getData, postData, deleteData } from "../config/request";
import {
  logout,
  removeMachineFromLifeList,
  clearSelectedState,
} from "../actions";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import flagImages, { getFlagWidth } from "../utils/flagImages";
const moment = require("moment");
const screenHeight = Dimensions.get("window").height;

class UserProfile extends Component {
  state = {
    modalVisible: false,
    accountModalVisible: false,
    newEmail: "",
    emailError: null,
    emailSuccess: false,
    updatingEmail: false,
    currentPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
    passwordError: null,
    passwordSuccess: false,
    updatingPassword: false,
    showDeleteConfirm: false,
    deletingAccount: false,
    deleteError: null,
    machineToRemove: null,
    lifeListQuery: "",
    fetchingUserInfo: this.props.route?.params?.userId
      ? true
      : this.props.user.loggedIn
        ? true
        : false,
    profile_info: {},
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  closeAccountModal = () => {
    this.setState({
      accountModalVisible: false,
      newEmail: "",
      emailError: null,
      emailSuccess: false,
      currentPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
      passwordError: null,
      passwordSuccess: false,
      showDeleteConfirm: false,
      deleteError: null,
    });
  };

  handleUpdateEmail = () => {
    const { user } = this.props;
    this.setState({
      updatingEmail: true,
      emailError: null,
      emailSuccess: false,
    });
    postData(`/users/${user.id}/update_email.json`, {
      user_token: user.authentication_token,
      email: this.state.newEmail,
    })
      .then(() => {
        this.setState({
          updatingEmail: false,
          emailSuccess: true,
          newEmail: "",
        });
      })
      .catch((err) => {
        this.setState({ updatingEmail: false, emailError: err });
      });
  };

  handleUpdatePassword = () => {
    const { user } = this.props;
    this.setState({
      updatingPassword: true,
      passwordError: null,
      passwordSuccess: false,
    });
    postData(`/users/${user.id}/update_password.json`, {
      user_token: user.authentication_token,
      current_password: this.state.currentPassword,
      password: this.state.newPassword,
      password_confirmation: this.state.newPasswordConfirmation,
    })
      .then(() => {
        this.setState({
          updatingPassword: false,
          passwordSuccess: true,
          currentPassword: "",
          newPassword: "",
          newPasswordConfirmation: "",
        });
      })
      .catch((err) => {
        this.setState({ updatingPassword: false, passwordError: err });
      });
  };

  handleDeleteAccount = () => {
    const { user } = this.props;
    this.setState({ deletingAccount: true, deleteError: null });
    deleteData(`/users/${user.id}.json`, {
      user_token: user.authentication_token,
      user_email: user.email,
    })
      .then(() => {
        this.props.logout();
        this.props.navigation.navigate("Login");
      })
      .catch((err) => {
        this.setState({ deletingAccount: false, deleteError: err });
      });
  };

  handleRemoveMachine = () => {
    const { machineToRemove } = this.state;
    this.props
      .removeMachineFromLifeList(machineToRemove.machine_id)
      .then(() => {
        this.setState((prevState) => ({
          machineToRemove: null,
          profile_info: {
            ...prevState.profile_info,
            profile_life_list_stats:
              prevState.profile_info.profile_life_list_stats.filter(
                (e) => e.machine_id !== machineToRemove.machine_id,
              ),
            num_life_list_machines:
              (prevState.profile_info.num_life_list_machines || 1) - 1,
          },
        }));
      })
      .catch((err) => {
        console.log(err);
        this.setState({ machineToRemove: null });
      });
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", () => {
      const id = this.props.route?.params?.userId ?? this.props.user.id;
      if (id) {
        getData(`/users/${id}/profile_info.json?life_list=`)
          .then((data) => {
            this.setState({
              fetchingUserInfo: false,
              profile_info: data.profile_info,
            });
          })
          .catch(() => this.setState({ fetchingUserInfo: false }));
      } else {
        this.setState({ fetchingUserInfo: false });
      }
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  getStatNum(stat) {
    return stat ? ` ${formatNumWithCommas(stat)} ` : " 0 ";
  }

  render() {
    if (this.state.fetchingUserInfo) return <ActivityIndicator />;
    const { user } = this.props;
    const isOwnProfile = !this.props.route?.params?.userId;
    const displayUsername = isOwnProfile
      ? user.username
      : this.props.route.params.username;
    const profileInfo = this.state.profile_info ?? {};
    const {
      profile_list_of_edited_locations = [],
      profile_life_list_stats = [],
      created_at,
      num_machines_added,
      num_machines_removed,
      num_lmx_comments_left,
      num_msx_scores_added,
      num_locations_suggested,
      num_locations_edited,
      num_total_submissions,
      num_life_list_machines,
      admin_title,
      contributor_rank,
      operator_name,
      flag,
    } = profileInfo;

    const lifeListQuery = this.state.lifeListQuery.toLowerCase().trim();
    const filteredLifeList = lifeListQuery
      ? profile_life_list_stats.filter((e) =>
          e.machine_name.toLowerCase().includes(lifeListQuery),
        )
      : profile_life_list_stats;

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
          const s = getStyles(theme);
          return (
            <Screen>
              {isOwnProfile && !user.loggedIn ? (
                <NotLoggedIn
                  text={`You're not logged in, so you don't have a profile!`}
                  onPress={() => this.props.navigation.navigate("Login")}
                />
              ) : (
                <View>
                  {isOwnProfile && (
                    <>
                      <ConfirmationModal
                        visible={this.state.modalVisible}
                        closeModal={() => this.setModalVisible(false)}
                      >
                        <PbmButton
                          title={"Log Me Out"}
                          onPress={() => {
                            this.setModalVisible(false);
                            this.props.logout();
                            this.props.navigation.navigate("Login");
                          }}
                        />
                        <WarningButton
                          title={"Stay Logged In"}
                          onPress={() => this.setModalVisible(false)}
                        />
                      </ConfirmationModal>
                      <ConfirmationModal
                        visible={!!this.state.machineToRemove}
                        closeModal={() =>
                          this.setState({ machineToRemove: null })
                        }
                      >
                        <Text
                          style={[
                            s.bold,
                            {
                              textAlign: "center",
                              marginBottom: 10,
                              marginHorizontal: 20,
                            },
                          ]}
                        >
                          {`Remove ${this.state.machineToRemove?.machine_name} from your life list?`}
                        </Text>
                        <PbmButton
                          title={"Yes, Remove"}
                          onPress={this.handleRemoveMachine}
                        />
                        <WarningButton
                          title={"Cancel"}
                          onPress={() =>
                            this.setState({ machineToRemove: null })
                          }
                        />
                      </ConfirmationModal>
                      <ConfirmationModal
                        visible={this.state.accountModalVisible}
                        closeModal={this.closeAccountModal}
                        wide
                        loading={this.state.deletingAccount}
                      >
                        <View style={s.header}>
                          <Text style={s.modalTitle}>Account Settings</Text>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={35}
                            onPress={this.closeAccountModal}
                            style={s.xButton}
                          />
                        </View>
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          showsVerticalScrollIndicator={false}
                          style={{ maxHeight: screenHeight * 0.75 }}
                        >
                          <View style={s.modalSection}>
                            <Text style={[s.sectionLabel, { marginTop: 10 }]}>
                              Update Email
                            </Text>
                            <TextInput
                              style={s.textInput}
                              placeholder="New email address"
                              placeholderTextColor={s.placeholderColor}
                              value={this.state.newEmail}
                              onChangeText={(newEmail) =>
                                this.setState({
                                  newEmail,
                                  emailError: null,
                                  emailSuccess: false,
                                })
                              }
                              autoCapitalize="none"
                              autoCorrect={false}
                              keyboardType="email-address"
                            />
                            {!!this.state.emailError && (
                              <Text style={s.formError}>
                                {this.state.emailError}
                              </Text>
                            )}
                            {this.state.emailSuccess && (
                              <Text style={s.formSuccess}>Email updated!</Text>
                            )}
                            <PbmButton
                              title={"Update Email"}
                              onPress={this.handleUpdateEmail}
                              disabled={
                                this.state.updatingEmail || !this.state.newEmail
                              }
                            />
                          </View>
                          <View style={s.divider} />
                          <View style={s.modalSection}>
                            <Text style={s.sectionLabel}>Update Password</Text>
                            <TextInput
                              style={s.textInput}
                              placeholder="Current password"
                              placeholderTextColor={s.placeholderColor}
                              value={this.state.currentPassword}
                              onChangeText={(currentPassword) =>
                                this.setState({
                                  currentPassword,
                                  passwordError: null,
                                  passwordSuccess: false,
                                })
                              }
                              secureTextEntry
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                            <TextInput
                              style={s.textInput}
                              placeholder="New password"
                              placeholderTextColor={s.placeholderColor}
                              value={this.state.newPassword}
                              onChangeText={(newPassword) =>
                                this.setState({
                                  newPassword,
                                  passwordError: null,
                                  passwordSuccess: false,
                                })
                              }
                              secureTextEntry
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                            <TextInput
                              style={s.textInput}
                              placeholder="Confirm new password"
                              placeholderTextColor={s.placeholderColor}
                              value={this.state.newPasswordConfirmation}
                              onChangeText={(newPasswordConfirmation) =>
                                this.setState({
                                  newPasswordConfirmation,
                                  passwordError: null,
                                  passwordSuccess: false,
                                })
                              }
                              secureTextEntry
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                            {!!this.state.passwordError && (
                              <Text style={s.formError}>
                                {this.state.passwordError}
                              </Text>
                            )}
                            {this.state.passwordSuccess && (
                              <Text style={s.formSuccess}>
                                Password updated!
                              </Text>
                            )}
                            <PbmButton
                              title={"Update Password"}
                              onPress={this.handleUpdatePassword}
                              disabled={
                                this.state.updatingPassword ||
                                !this.state.currentPassword ||
                                !this.state.newPassword ||
                                !this.state.newPasswordConfirmation
                              }
                            />
                          </View>
                          <View style={s.divider} />
                          <View style={s.modalSection}>
                            {!this.state.showDeleteConfirm ? (
                              <WarningButton
                                title={"Delete Account"}
                                onPress={() =>
                                  this.setState({ showDeleteConfirm: true })
                                }
                              />
                            ) : (
                              <>
                                <Text style={s.deleteWarning}>
                                  This will permanently delete your account.
                                  This cannot be undone.
                                </Text>
                                {!!this.state.deleteError && (
                                  <Text style={s.formError}>
                                    {this.state.deleteError}
                                  </Text>
                                )}
                                <PbmButton
                                  title={"Yes, Delete My Account"}
                                  onPress={this.handleDeleteAccount}
                                />
                                <WarningButton
                                  title={"Cancel"}
                                  onPress={() =>
                                    this.setState({
                                      showDeleteConfirm: false,
                                      deleteError: null,
                                    })
                                  }
                                />
                              </>
                            )}
                          </View>
                        </ScrollView>
                      </ConfirmationModal>
                    </>
                  )}
                  <View style={s.usernameContainer}>
                    <Text style={s.username}>{displayUsername}</Text>
                    {!!flag && flagImages[flag] && (
                      <View style={s.flagContainer}>
                        <Image
                          source={flagImages[flag]}
                          style={[
                            s.profileFlag,
                            { width: getFlagWidth(flag, 40) },
                          ]}
                        />
                      </View>
                    )}
                    {isOwnProfile && (
                      <Pressable
                        onPress={() =>
                          this.props.navigation.navigate("FindFlag", {
                            userId: user.id,
                          })
                        }
                      >
                        <Text style={s.flagButton}>
                          {flag ? "Change flag" : "Set flag"}
                        </Text>
                      </Pressable>
                    )}
                    {!!admin_title && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{admin_title}</Text>
                        <MaterialCommunityIcons
                          name="shield-account"
                          size={20}
                          style={s.rankIcon}
                          color={theme.shield}
                        />
                      </View>
                    )}
                    {!!contributor_rank && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{contributor_rank}</Text>
                        <Image
                          contentFit="fill"
                          source={contributor_icon}
                          style={s.rankIcon}
                        />
                      </View>
                    )}
                    {!!operator_name && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{operator_name}</Text>
                        <MaterialCommunityIcons
                          name="wrench"
                          style={s.rankIcon}
                          size={20}
                          color={theme.wrench}
                        />
                      </View>
                    )}
                    <Text style={s.joined}>
                      {`Joined: ${moment(created_at).format("MMM DD, YYYY")}`}
                    </Text>
                    {isOwnProfile && (
                      <>
                        <Text
                          style={s.accountSettingsLink}
                          onPress={() =>
                            this.setState({ accountModalVisible: true })
                          }
                        >
                          Account Settings
                        </Text>
                        <Text
                          style={s.logoutLink}
                          onPress={() => this.setModalVisible(true)}
                        >
                          Logout
                        </Text>
                      </>
                    )}
                  </View>
                  <View style={s.statContainer}>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Total contributions:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_total_submissions)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Machines added:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_machines_added)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Machines removed:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_machines_removed)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Machine comments:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_lmx_comments_left)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>High scores added:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_msx_scores_added)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Machines in Life List:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_life_list_machines)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Locations submitted:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_locations_suggested)}
                      </Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.stat}>Locations edited:</Text>
                      <Text style={s.statNum}>
                        {this.getStatNum(num_locations_edited)}
                      </Text>
                    </View>
                  </View>
                  <Text style={s.section}>Some recently edited locations</Text>
                  <View style={{ paddingTop: 8, paddingBottom: 15 }}>
                    {profile_list_of_edited_locations.length === 0 ? (
                      <Text style={s.none}>No edits yet</Text>
                    ) : (
                      profile_list_of_edited_locations
                        .slice(0, 50)
                        .map((location) => (
                          <Pressable
                            key={location[0]}
                            onPress={() =>
                              this.props.navigation.navigate(
                                "LocationDetails",
                                {
                                  id: location[0],
                                },
                              )
                            }
                          >
                            {({ pressed }) => (
                              <View
                                style={[
                                  s.list,
                                  pressed ? s.pressed : s.notPressed,
                                ]}
                              >
                                <Text
                                  style={[
                                    s.locationName,
                                    pressed ? s.textPressed : s.textNotPressed,
                                  ]}
                                >
                                  {location[1]}
                                </Text>
                              </View>
                            )}
                          </Pressable>
                        ))
                    )}
                  </View>
                  <Text style={s.section}>
                    {isOwnProfile
                      ? "Your Machine List and High Scores"
                      : "Machine List and High Scores"}
                  </Text>
                  {isOwnProfile && (
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingTop: 10,
                        paddingBottom: 6,
                      }}
                    >
                      <Text style={s.lifeListDescription}>
                        {`You can manage a "life list" of all the pinball machines you've ever played. Any time you add a score, that machine will be added to your list. And you can manually add machines below or when viewing a machine at a location.`}
                      </Text>
                      <PbmButton
                        title={"Add Machines to Your List"}
                        onPress={() => {
                          this.props.clearSelectedState();
                          this.props.navigation.navigate("FindMachine", {
                            multiSelect: true,
                            lifeListUserId: user.id,
                          });
                        }}
                        leftIcon={
                          <MaterialCommunityIcons
                            name="clipboard-list-outline"
                            size={20}
                            color={
                              theme.theme === "dark" ? "#ffffff" : theme.text
                            }
                            style={{ marginRight: 8 }}
                          />
                        }
                      />
                    </View>
                  )}
                  {profile_life_list_stats.length > 0 && (
                    <View style={s.lifeListSearchContainer}>
                      <MaterialCommunityIcons
                        name="magnify"
                        size={22}
                        color={theme.indigo4}
                        style={{ marginLeft: 10, marginRight: 4 }}
                      />
                      <TextInput
                        placeholder="Filter your list..."
                        placeholderTextColor={theme.indigo4}
                        value={this.state.lifeListQuery}
                        onChangeText={(q) =>
                          this.setState({ lifeListQuery: q })
                        }
                        style={s.lifeListSearchInput}
                        autoCorrect={false}
                      />
                      {this.state.lifeListQuery.length > 0 && (
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={20}
                          color={theme.purple}
                          style={{ marginRight: 10 }}
                          onPress={() => this.setState({ lifeListQuery: "" })}
                        />
                      )}
                    </View>
                  )}
                  <View style={{ paddingtop: 8 }}>
                    {profile_life_list_stats.length === 0 ? (
                      <Text style={s.none}>
                        No machines or scores to list yet
                      </Text>
                    ) : filteredLifeList.length === 0 ? (
                      <Text style={s.none}>No matches</Text>
                    ) : (
                      filteredLifeList.map((entry, idx) => {
                        const hasScores = !!entry.list;
                        return (
                          <View
                            key={entry.umx_id ?? idx}
                            style={{
                              marginHorizontal: 25,
                              marginBottom: 10,
                              borderBottomWidth:
                                idx < filteredLifeList.length - 1
                                  ? StyleSheet.hairlineWidth
                                  : 0,
                              borderBottomColor: theme.indigo4,
                              paddingBottom: 10,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text style={[s.lifeListMachine, { flex: 1 }]}>
                                {entry.machine_name}
                                <Text style={s.machineYearMan}>
                                  {` ${entry.machine_year_man}`}
                                </Text>
                              </Text>
                              {!hasScores && isOwnProfile && (
                                <Pressable
                                  onPress={() =>
                                    this.setState({ machineToRemove: entry })
                                  }
                                  style={{ paddingLeft: 10 }}
                                >
                                  <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    size={24}
                                    color={theme.red2}
                                  />
                                </Pressable>
                              )}
                            </View>
                            {hasScores && (
                              <>
                                <Text style={[s.score, { marginTop: 8 }]}>
                                  <Text style={s.bold}>Highest score: </Text>
                                  {formatNumWithCommas(entry.list[0])}
                                </Text>
                                {entry.list.length > 1 ? (
                                  <>
                                    <Text
                                      style={[
                                        { paddingLeft: 10, marginBottom: 6 },
                                        s.bold,
                                        s.marginT10,
                                      ]}
                                    >
                                      All scores:
                                    </Text>
                                    {entry.list.map((ll, i) => (
                                      <Text
                                        key={i}
                                        style={[s.score, { paddingLeft: 16 }]}
                                      >
                                        {formatNumWithCommas(ll)}
                                      </Text>
                                    ))}
                                    <Text
                                      style={[
                                        s.score,
                                        s.marginB10,
                                        s.marginT10,
                                      ]}
                                    >
                                      <Text style={s.bold}>Average: </Text>
                                      {formatNumWithCommas(entry.average)}
                                    </Text>
                                    <Text style={[s.score]}>
                                      <Text style={s.bold}>Count: </Text>
                                      {entry.count}
                                    </Text>
                                  </>
                                ) : null}
                              </>
                            )}
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
              )}
            </Screen>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

const getStyles = (theme) =>
  StyleSheet.create({
    list: {
      borderRadius: 25,
      paddingVertical: 2,
      paddingHorizontal: 10,
      borderWidth: 0,
      backgroundColor: theme.theme == "dark" ? "#312433" : theme.base4,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
      marginHorizontal: 20,
      marginVertical: 6,
    },
    section: {
      fontFamily: "Nunito-Medium",
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 10,
      paddingTop: 2,
      paddingBottom: 0,
      color: theme.text3,
      textTransform: "uppercase",
    },
    accountSettingsLink: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      color: theme.purple2,
      textAlign: "center",
      textDecorationLine: "underline",
      marginTop: 8,
    },
    logoutLink: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      color: theme.red2,
      textAlign: "center",
      textDecorationLine: "underline",
      marginTop: 6,
      marginBottom: 4,
    },
    locationName: {
      marginHorizontal: 10,
      fontSize: 18,
      paddingVertical: 10,
      fontFamily: "Nunito-Bold",
    },
    usernameContainer: {
      paddingVertical: 10,
      backgroundColor: theme.theme == "dark" ? theme.white : "#efe9f0",
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 20,
    },
    username: {
      fontSize: 22,
      textAlign: "center",
      fontFamily: "Nunito-ExtraBold",
      lineHeight: 32,
      color: theme.pink1,
    },
    flagContainer: {
      alignItems: "center",
      marginTop: 10,
    },
    profileFlag: {
      height: 40,
      borderRadius: 5,
    },
    flagButton: {
      color: theme.purple2,
      fontSize: 14,
      fontFamily: "Nunito-SemiBold",
      textAlign: "center",
      textDecorationLine: "underline",
      marginTop: 6,
      marginBottom: 2,
    },
    statContainer: {
      alignItems: "center",
      backgroundColor: theme.theme == "dark" ? theme.white : "#efe9f0",
      margin: 20,
      paddingTop: 10,
      paddingBottom: 14,
      borderRadius: 20,
      paddingHorizontal: 30,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
    stat: {
      marginTop: 5,
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      opacity: 0.9,
      color: theme.theme == "dark" ? "#fee7f5" : theme.text,
    },
    statNum: {
      fontFamily: "Nunito-Bold",
      color: "#17001c",
      backgroundColor: theme.theme == "dark" ? "#fee7f5" : "#FFFFFF",
      fontSize: 16,
      marginTop: 5,
      marginLeft: 10,
    },
    joined: {
      textAlign: "center",
      marginTop: 8,
      marginBottom: 6,
      fontSize: 16,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    none: {
      textAlign: "center",
      marginVertical: 8,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    pressed: {
      shadowOpacity: 0,
      elevation: 0,
      opacity: 0.8,
    },
    notPressed: {
      opacity: 1.0,
    },
    textPressed: {
      color: theme.purple2,
    },
    textNotPressed: {
      color: theme.purpleLight,
    },
    rankView: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    rankText: {
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    rankIcon: {
      width: 20,
      height: 20,
      marginLeft: 8,
    },
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
    },
    xButton: {
      position: "absolute",
      right: 5,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
    },
    modalTitle: {
      textAlign: "center",
      fontSize: 20,
      fontFamily: "Nunito-Bold",
      color: theme.text,
      paddingHorizontal: 44,
    },
    modalSection: {
      paddingHorizontal: 5,
    },
    sectionLabel: {
      fontSize: 14,
      fontFamily: "Nunito-SemiBold",
      color: theme.text3,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 10,
    },
    divider: {
      height: 1,
      backgroundColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      marginVertical: 16,
      marginHorizontal: 20,
      opacity: 0.4,
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      marginHorizontal: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    placeholderColor: theme.indigo4,
    formError: {
      color: "#c0392b",
      fontSize: 14,
      fontFamily: "Nunito-SemiBold",
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 8,
    },
    formSuccess: {
      color: "#27ae60",
      fontSize: 14,
      fontFamily: "Nunito-SemiBold",
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 8,
    },
    deleteWarning: {
      fontSize: 14,
      fontFamily: "Nunito-Medium",
      color: theme.text3,
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 10,
    },
    lifeListMachine: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.purple,
      fontSize: 20,
      fontFamily: "Nunito-ExtraBold",
    },
    machineYearMan: {
      color: theme.text3,
      fontSize: 20,
      fontFamily: "Nunito-Medium",
    },
    lifeListSearchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 25,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      backgroundColor: theme.white,
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 12,
      height: 40,
    },
    lifeListSearchInput: {
      flex: 1,
      paddingLeft: 4,
      paddingRight: 12,
      height: 40,
      color: theme.text,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    lifeListDescription: {
      color: theme.text3,
      fontSize: 15,
      fontFamily: "Nunito-Regular",
      textAlign: "center",
      lineHeight: 22,
    },
    bold: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    score: {
      paddingLeft: 10,
      color: theme.text,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
    marginB10: {
      marginBottom: 10,
    },
    marginT10: {
      marginTop: 10,
    },
  });

UserProfile.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  removeMachineFromLifeList: PropTypes.func,
  clearSelectedState: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  removeMachineFromLifeList: (machineId) =>
    dispatch(removeMachineFromLifeList(machineId)),
  clearSelectedState: () => dispatch(clearSelectedState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
