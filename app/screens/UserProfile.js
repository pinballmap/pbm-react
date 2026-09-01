import React, { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { ThemeContext } from "../theme-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  ActivityIndicator,
  ConfirmationModal,
  NotLoggedIn,
  PbmButton,
  ScrollToTop,
  Text,
  WarningButton,
} from "../components";
import { getData, postData, deleteData } from "../config/request";
import {
  logout,
  removeMachineFromLifeList,
  clearSelectedState,
  updateEmail,
} from "../actions";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import flagImages, { getFlagWidth } from "../utils/flagImages";
import { formatDate } from "../utils/dateUtils";
const screenHeight = Dimensions.get("window").height;

const getStatNum = (stat) => (stat ? ` ${formatNumWithCommas(stat)} ` : " 0 ");

const UserProfile = ({
  user,
  logout,
  removeMachineFromLifeList,
  clearSelectedState,
  updateEmail,
  navigation,
  route,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [modalVisible, setModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [machineToRemove, setMachineToRemove] = useState(null);
  const [lifeListQuery, setLifeListQuery] = useState("");
  const [fetchingUserInfo, setFetchingUserInfo] = useState(
    !!(route?.params?.userId || user.loggedIn),
  );
  const [profileInfo, setProfileInfo] = useState({});
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef(null);
  const hasScrolledToMachineListRef = useRef(false);

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    return navigation.addListener("focus", () => {
      const id = route?.params?.userId ?? user.id;
      if (id) {
        getData(`/users/${id}/profile_info.json?life_list=`)
          .then((data) => {
            setFetchingUserInfo(false);
            setProfileInfo(data.profile_info);
            setLifeListQuery("");
          })
          .catch(() => setFetchingUserInfo(false));
      } else {
        setFetchingUserInfo(false);
      }
    });
  }, [navigation]);

  const closeAccountModal = () => {
    setAccountModalVisible(false);
    setNewEmail("");
    setEmailError(null);
    setEmailSuccess(false);
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleUpdateEmail = () => {
    setUpdatingEmail(true);
    setEmailError(null);
    setEmailSuccess(false);
    updateEmail(newEmail)
      .then(() => {
        setUpdatingEmail(false);
        setEmailSuccess(true);
        setNewEmail("");
      })
      .catch((err) => {
        setUpdatingEmail(false);
        setEmailError(err);
      });
  };

  const handleUpdatePassword = () => {
    setUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    postData(`/users/${user.id}/update_password.json`, {
      user_token: user.authentication_token,
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    })
      .then(() => {
        setUpdatingPassword(false);
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
      })
      .catch((err) => {
        setUpdatingPassword(false);
        setPasswordError(err);
      });
  };

  const handleDeleteAccount = () => {
    setDeletingAccount(true);
    setDeleteError(null);
    deleteData(`/users/${user.id}.json`, {
      user_token: user.authentication_token,
      user_email: user.email,
    })
      .then(() => {
        logout();
        navigation.navigate("Login");
      })
      .catch((err) => {
        setDeletingAccount(false);
        setDeleteError(err);
      });
  };

  const handleRemoveMachine = () => {
    const removing = machineToRemove;
    removeMachineFromLifeList(removing.machine_id)
      .then(() => {
        setMachineToRemove(null);
        setProfileInfo((prev) => ({
          ...prev,
          profile_life_list_stats: prev.profile_life_list_stats.filter(
            (e) => e.machine_id !== removing.machine_id,
          ),
          num_life_list_machines: (prev.num_life_list_machines || 1) - 1,
        }));
      })
      .catch((err) => {
        console.log(err);
        setMachineToRemove(null);
      });
  };

  if (fetchingUserInfo) return <ActivityIndicator />;

  const isOwnProfile =
    !route?.params?.userId || route.params.userId === user.id;
  const displayUsername = isOwnProfile ? user.username : route.params.username;
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
  } = profileInfo ?? {};

  const lifeListQueryTrimmed = lifeListQuery.toLowerCase().trim();
  const filteredLifeList = lifeListQueryTrimmed
    ? profile_life_list_stats.filter((e) =>
        e.machine_name.toLowerCase().includes(lifeListQueryTrimmed),
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
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        scrollIndicatorInsets={{ right: 1 }}
        style={{ flex: 1, backgroundColor: theme.base1 }}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isOwnProfile && !user.loggedIn ? (
          <>
            <NotLoggedIn
              text={`You're not logged in, so you don't have a profile.`}
              onPress={() => navigation.navigate("Login")}
            />
            <View style={s.usernameContainer}>
              <Text style={[s.username, s.extraBold]}>Your Great Username</Text>
              <View style={s.flagContainer}>
                <Image
                  source={flagImages["pirate"]}
                  style={[s.profileFlag, { width: getFlagWidth("pirate", 40) }]}
                />
              </View>
              <View style={s.rankView}>
                <Text style={[s.rankText, s.bold]}>Super Mapper</Text>
                <Image
                  contentFit="fill"
                  source={require("../assets/images/SuperMapper.png")}
                  style={s.rankIcon}
                />
              </View>
              <Text
                style={[s.joined, s.italic]}
              >{`Joined: ${formatDate(new Date().toISOString())}`}</Text>
            </View>
            <View style={s.statContainer}>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Total contributions:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines added:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines removed:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machine comments:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>High scores added:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines in Life List:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Locations submitted:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Locations edited:</Text>
                <Text style={[s.statNum, s.bold]}>{getStatNum(0)}</Text>
              </View>
            </View>
            <Text style={[s.section, s.bold]}>
              Some recently edited locations
            </Text>
            <View style={{ paddingTop: 8, paddingBottom: 15 }}>
              <Text style={[s.none, s.italic]}>No edits yet</Text>
            </View>
            <Text style={[s.section, s.bold]}>
              Your Machine List and High Scores
            </Text>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 10,
                paddingBottom: 6,
              }}
            >
              <Text style={[s.sectionDescription, s.regular]}>
                {`You can manage a "life list" of all the pinball machines you've ever played. Any time you add a score, that machine will be added to your list. And you can manually add machines here or when viewing a machine at a location.`}
              </Text>
            </View>
            <View style={{ paddingTop: 8, marginBottom: 30 }}>
              <Text style={[s.none, s.italic]}>
                No machines or scores to list yet
              </Text>
            </View>
          </>
        ) : (
          <View>
            {isOwnProfile && (
              <>
                <ConfirmationModal
                  visible={modalVisible}
                  closeModal={() => setModalVisible(false)}
                >
                  <PbmButton
                    title={"Log Me Out"}
                    onPress={() => {
                      setModalVisible(false);
                      logout();
                      navigation.navigate("Login");
                    }}
                  />
                  <WarningButton
                    title={"Stay Logged In"}
                    onPress={() => setModalVisible(false)}
                  />
                </ConfirmationModal>
                <ConfirmationModal
                  visible={!!machineToRemove}
                  closeModal={() => setMachineToRemove(null)}
                >
                  <Text style={[s.modalConfirmText, s.regular]}>
                    {`Remove `}
                    <Text style={[s.bold, s.font16, s.modalMachineName]}>
                      {machineToRemove?.machine_name}
                    </Text>
                    {` from your life list?`}
                  </Text>
                  <PbmButton
                    title={"Yes, Remove"}
                    onPress={handleRemoveMachine}
                  />
                  <WarningButton
                    title={"Cancel"}
                    onPress={() => setMachineToRemove(null)}
                  />
                </ConfirmationModal>
                <ConfirmationModal
                  visible={accountModalVisible}
                  closeModal={closeAccountModal}
                  wide
                  loading={deletingAccount}
                >
                  <View style={s.header}>
                    <Text style={[s.modalTitle, s.bold]}>Account Settings</Text>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={35}
                      onPress={closeAccountModal}
                      style={s.xButton}
                    />
                  </View>
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight: screenHeight * 0.75 }}
                  >
                    <View style={s.modalSection}>
                      <Text
                        style={[s.sectionLabel, s.semiBold, { marginTop: 10 }]}
                      >
                        Update Email
                      </Text>
                      <TextInput
                        style={[s.textInput, s.regular]}
                        placeholder="New email address"
                        placeholderTextColor={s.placeholderColor}
                        value={newEmail}
                        onChangeText={(value) => {
                          setNewEmail(value);
                          setEmailError(null);
                          setEmailSuccess(false);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                      />
                      {!!emailError && (
                        <Text style={[s.formError, s.semiBold]}>
                          {emailError}
                        </Text>
                      )}
                      {emailSuccess && (
                        <Text style={[s.formSuccess, s.semiBold]}>
                          Email updated!
                        </Text>
                      )}
                      <PbmButton
                        title={"Update Email"}
                        onPress={handleUpdateEmail}
                        disabled={updatingEmail || !newEmail}
                      />
                    </View>
                    <View style={s.divider} />
                    <View style={s.modalSection}>
                      <Text style={[s.sectionLabel, s.semiBold]}>
                        Update Password
                      </Text>
                      <TextInput
                        style={[s.textInput, s.regular]}
                        placeholder="Current password"
                        placeholderTextColor={s.placeholderColor}
                        value={currentPassword}
                        onChangeText={(value) => {
                          setCurrentPassword(value);
                          setPasswordError(null);
                          setPasswordSuccess(false);
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TextInput
                        style={[s.textInput, s.regular]}
                        placeholder="New password"
                        placeholderTextColor={s.placeholderColor}
                        value={newPassword}
                        onChangeText={(value) => {
                          setNewPassword(value);
                          setPasswordError(null);
                          setPasswordSuccess(false);
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TextInput
                        style={[s.textInput, s.regular]}
                        placeholder="Confirm new password"
                        placeholderTextColor={s.placeholderColor}
                        value={newPasswordConfirmation}
                        onChangeText={(value) => {
                          setNewPasswordConfirmation(value);
                          setPasswordError(null);
                          setPasswordSuccess(false);
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {!!passwordError && (
                        <Text style={[s.formError, s.semiBold]}>
                          {passwordError}
                        </Text>
                      )}
                      {passwordSuccess && (
                        <Text style={[s.formSuccess, s.semiBold]}>
                          Password updated!
                        </Text>
                      )}
                      <PbmButton
                        title={"Update Password"}
                        onPress={handleUpdatePassword}
                        disabled={
                          updatingPassword ||
                          !currentPassword ||
                          !newPassword ||
                          !newPasswordConfirmation
                        }
                      />
                    </View>
                    <View style={s.divider} />
                    <View style={s.modalSection}>
                      {!showDeleteConfirm ? (
                        <WarningButton
                          title={"Delete Account"}
                          onPress={() => setShowDeleteConfirm(true)}
                        />
                      ) : (
                        <>
                          <Text style={[s.deleteWarning, s.medium]}>
                            This will permanently delete your account. This
                            cannot be undone.
                          </Text>
                          {!!deleteError && (
                            <Text style={[s.formError, s.semiBold]}>
                              {deleteError}
                            </Text>
                          )}
                          <PbmButton
                            title={"Yes, Delete My Account"}
                            onPress={handleDeleteAccount}
                          />
                          <WarningButton
                            title={"Cancel"}
                            onPress={() => {
                              setShowDeleteConfirm(false);
                              setDeleteError(null);
                            }}
                          />
                        </>
                      )}
                    </View>
                  </ScrollView>
                </ConfirmationModal>
              </>
            )}
            <View style={s.usernameContainer}>
              <Text style={[s.username, s.extraBold]}>{displayUsername}</Text>
              {!!flag && flagImages[flag] && (
                <View style={s.flagContainer}>
                  <Image
                    source={flagImages[flag]}
                    style={[s.profileFlag, { width: getFlagWidth(flag, 40) }]}
                  />
                </View>
              )}
              {!!admin_title && (
                <View style={s.rankView}>
                  <Text style={[s.rankText, s.bold]}>{admin_title}</Text>
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
                  <Text style={[s.rankText, s.bold]}>{contributor_rank}</Text>
                  <Image
                    contentFit="fill"
                    source={contributor_icon}
                    style={s.rankIcon}
                  />
                </View>
              )}
              {!!operator_name && (
                <View style={s.rankView}>
                  <Text style={[s.rankText, s.bold]}>{operator_name}</Text>
                  <MaterialCommunityIcons
                    name="wrench"
                    style={s.rankIcon}
                    size={20}
                    color={theme.wrench}
                  />
                </View>
              )}
              <Text
                style={[s.joined, s.italic]}
              >{`Joined: ${formatDate(created_at)}`}</Text>
              {isOwnProfile && (
                <View style={s.accountSettingsContainer}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("FindFlag", { userId: user.id })
                    }
                  >
                    <Text style={[s.accountSettingsLink, s.semiBold]}>
                      {flag ? "Change user flag" : "Set user flag"}
                    </Text>
                  </Pressable>
                  <Text
                    style={[s.accountSettingsLink, s.semiBold]}
                    onPress={() => setAccountModalVisible(true)}
                  >
                    Account Settings
                  </Text>
                  <Text
                    style={[s.logoutLink, s.semiBold]}
                    onPress={() => setModalVisible(true)}
                  >
                    Logout
                  </Text>
                </View>
              )}
            </View>
            <View style={s.statContainer}>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Total contributions:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_total_submissions)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines added:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_machines_added)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines removed:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_machines_removed)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machine comments:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_lmx_comments_left)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>High scores added:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_msx_scores_added)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Machines in Life List:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_life_list_machines)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Locations submitted:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_locations_suggested)}
                </Text>
              </View>
              <View style={s.statItem}>
                <Text style={[s.stat, s.semiBold]}>Locations edited:</Text>
                <Text style={[s.statNum, s.bold]}>
                  {getStatNum(num_locations_edited)}
                </Text>
              </View>
            </View>
            <Text style={[s.section, s.bold]}>
              Some recently edited locations
            </Text>
            {isOwnProfile && (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 10,
                  paddingBottom: 6,
                }}
              >
                <Text style={[s.sectionDescription, s.regular]}>
                  {`You can see all of your edits in the `}
                  <Text
                    style={[s.textLink, s.semiBold]}
                    onPress={() =>
                      navigation.navigate("RecentActivity", {
                        screen: "RecentActivityStack",
                        params: { initialGlobal: true, yourActivity: true },
                      })
                    }
                  >
                    filtered Activity Feed
                  </Text>
                  {`.`}
                </Text>
              </View>
            )}
            <View style={{ paddingTop: 8, paddingBottom: 15 }}>
              {profile_list_of_edited_locations.length === 0 ? (
                <Text style={[s.none, s.italic]}>No edits yet</Text>
              ) : (
                profile_list_of_edited_locations
                  .slice(0, 50)
                  .map((location) => (
                    <Pressable
                      key={location[0]}
                      onPress={() =>
                        navigation.navigate("LocationDetails", {
                          id: location[0],
                        })
                      }
                    >
                      {({ pressed }) => (
                        <View
                          style={[s.list, pressed ? s.pressed : s.notPressed]}
                        >
                          <Text
                            style={[
                              s.locationName,
                              s.bold,
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
            <Text
              style={[s.section, s.bold]}
              onLayout={(e) => {
                if (
                  route?.params?.scrollToMachineList &&
                  !hasScrolledToMachineListRef.current
                ) {
                  hasScrolledToMachineListRef.current = true;
                  const y = e.nativeEvent.layout.y;
                  InteractionManager.runAfterInteractions(() => {
                    scrollViewRef.current?.scrollTo({ y, animated: true });
                  });
                }
              }}
            >
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
                <Text style={[s.sectionDescription, s.regular]}>
                  {`You can manage a "life list" of all the pinball machines you've ever played. Any time you `}
                  <Text
                    style={[s.textLink, s.semiBold]}
                    onPress={() => navigation.navigate("AddHighScore")}
                  >
                    add a high score
                  </Text>
                  {`, that machine is added to your list. You can manually add machines below or when viewing a machine at a location.`}
                </Text>
                <PbmButton
                  title={"Add to Your List"}
                  onPress={() => {
                    clearSelectedState();
                    navigation.navigate("FindMachine", {
                      multiSelect: true,
                      lifeListUserId: user.id,
                    });
                  }}
                  leftIcon={
                    <MaterialCommunityIcons
                      name="clipboard-list-outline"
                      size={20}
                      color={theme.theme === "dark" ? "#ffffff" : theme.text}
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
                  value={lifeListQuery}
                  onChangeText={setLifeListQuery}
                  style={[s.lifeListSearchInput, s.regular]}
                  autoCorrect={false}
                />
                {lifeListQuery.length > 0 && (
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color={theme.purple}
                    style={{ marginRight: 10 }}
                    onPress={() => setLifeListQuery("")}
                  />
                )}
              </View>
            )}
            <View
              style={[{ paddingTop: 8 }, !isOwnProfile && { marginBottom: 30 }]}
            >
              {profile_life_list_stats.length === 0 ? (
                <Text style={[s.none, s.italic]}>
                  No machines or scores to list yet
                </Text>
              ) : filteredLifeList.length === 0 ? (
                <Text style={[s.none, s.italic]}>No matches</Text>
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
                        <Text
                          selectable
                          style={[s.lifeListMachine, s.extraBold, { flex: 1 }]}
                        >
                          {entry.machine_name}
                          <Text style={[s.machineYearMan, s.semiBold]}>
                            {` ${entry.machine_year_man}`}
                          </Text>
                        </Text>
                        {!hasScores && isOwnProfile && (
                          <Pressable
                            onPress={() => setMachineToRemove(entry)}
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
                          <Text
                            selectable
                            style={[s.score, s.regular, { marginTop: 8 }]}
                          >
                            <Text style={[s.bold, s.font16]}>
                              Highest score:{" "}
                            </Text>
                            {formatNumWithCommas(entry.list[0])}
                          </Text>
                          {entry.list.length > 1 ? (
                            <>
                              <Text
                                style={[
                                  { paddingLeft: 10, marginBottom: 6 },
                                  s.bold,
                                  s.font16,
                                  s.marginT10,
                                ]}
                              >
                                All scores:
                              </Text>
                              {entry.list.map((ll, i) => (
                                <Text
                                  key={i}
                                  style={[
                                    s.score,
                                    s.regular,
                                    { paddingLeft: 16 },
                                  ]}
                                >
                                  {formatNumWithCommas(ll)}
                                </Text>
                              ))}
                              <Text
                                style={[
                                  s.score,
                                  s.regular,
                                  s.marginB10,
                                  s.marginT10,
                                ]}
                              >
                                <Text style={[s.bold, s.font16]}>
                                  Average:{" "}
                                </Text>
                                {formatNumWithCommas(entry.average)}
                              </Text>
                              <Text style={[s.score, s.regular]}>
                                <Text style={[s.bold, s.font16]}>Count: </Text>
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
      </KeyboardAwareScrollView>
      <ScrollToTop visible={showScrollToTop} onPress={scrollToTop} />
    </View>
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
    medium: {
      fontFamily: "Nunito",
      fontWeight: "500",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
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
      color: theme.purple2,
      textAlign: "center",
      textDecorationLine: "underline",
      marginTop: 8,
    },
    accountSettingsContainer: {
      backgroundColor: theme.pink2,
      marginBottom: -10,
      marginTop: 10,
      paddingBottom: 10,
      paddingTop: 5,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    logoutLink: {
      fontSize: 16,
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
      marginBottom: 4,
    },
    statContainer: {
      alignItems: "center",
      backgroundColor: theme.theme == "dark" ? theme.white : "#efe9f0",
      margin: 20,
      paddingTop: 10,
      paddingBottom: 14,
      borderRadius: 20,
      paddingHorizontal: 20,
    },
    statItem: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
    },
    stat: {
      marginTop: 5,
      fontSize: 16,
      opacity: 0.9,
      color: theme.theme == "dark" ? "#fee7f5" : theme.text,
    },
    statNum: {
      color: "#17001c",
      backgroundColor: theme.theme == "dark" ? "#fee7f5" : "#FFFFFF",
      fontSize: 16,
      marginTop: 5,
      marginLeft: 10,
      borderRadius: 5,
    },
    joined: {
      textAlign: "center",
      marginTop: 8,
      marginBottom: 6,
      fontSize: 16,
      color: theme.text3,
    },
    none: {
      textAlign: "center",
      marginVertical: 8,
      fontSize: 14,
      color: theme.text3,
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
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      columnGap: 8,
      marginTop: 8,
    },
    rankText: {
      fontSize: 18,
      color: theme.text,
    },
    rankIcon: {
      width: 20,
      height: 20,
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
      color: theme.text,
      paddingHorizontal: 44,
    },
    modalSection: {
      paddingHorizontal: 5,
    },
    sectionLabel: {
      fontSize: 14,
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
      fontSize: 16,
    },
    placeholderColor: theme.indigo4,
    formError: {
      color: "#c0392b",
      fontSize: 14,
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 8,
    },
    formSuccess: {
      color: "#27ae60",
      fontSize: 14,
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 8,
    },
    deleteWarning: {
      fontSize: 14,
      color: theme.text3,
      textAlign: "center",
      marginHorizontal: 20,
      marginBottom: 10,
    },
    lifeListMachine: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
    },
    machineYearMan: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
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
    },
    sectionDescription: {
      color: theme.text3,
      fontSize: 15,
      lineHeight: 22,
    },
    textLink: {
      color: theme.purpleLight,
      textDecorationLine: "underline",
    },
    modalConfirmText: {
      textAlign: "center",
      fontSize: 18,
      marginHorizontal: 15,
      color: theme.text,
    },
    modalMachineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
    },
    font16: {
      color: theme.text3,
      fontSize: 16,
    },
    score: {
      paddingLeft: 10,
      color: theme.text,
      fontSize: 16,
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
  updateEmail: PropTypes.func,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  removeMachineFromLifeList: (machineId) =>
    dispatch(removeMachineFromLifeList(machineId)),
  clearSelectedState: () => dispatch(clearSelectedState()),
  updateEmail: (email) => dispatch(updateEmail(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
