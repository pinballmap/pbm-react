import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { EvilIcons } from "@expo/vector-icons";
import { ListItem } from "@rneui/base";
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
import { getData } from "../config/request";
import { logout } from "../actions";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import * as WebBrowser from "expo-web-browser";

const moment = require("moment");

class UserProfile extends Component {
  state = {
    modalVisible: false,
    fetchingUserInfo: this.props.user.loggedIn ? true : false,
    profile_info: {},
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount() {
    //The listener will refetch user profile data every time the profile screen is navigated to
    this.focusListener = this.props.navigation.addListener("focus", () => {
      const id = this.props.user.id;
      if (id) {
        getData(`/users/${id}/profile_info.json`).then((data) => {
          this.setState({
            fetchingUserInfo: false,
            profile_info: data.profile_info,
          });
        });
      }
    });
  }

  getStatNum(stat) {
    return stat ? ` ${formatNumWithCommas(stat)} ` : " 0 ";
  }

  render() {
    if (this.state.fetchingUserInfo) return <ActivityIndicator />;
    const { user } = this.props;
    const profileInfo = this.state.profile_info ?? {};
    const {
      profile_list_of_edited_locations = [],
      profile_list_of_high_scores = [],
      created_at,
      num_machines_added,
      num_machines_removed,
      num_lmx_comments_left,
      num_locations_suggested,
      num_locations_edited,
      num_total_submissions,
      admin_title,
      contributor_rank,
    } = profileInfo;

    let admin_icon;
    if (admin_title == "Global Administrator") {
      admin_icon = require("../assets/images/GlobalAdministrator.png");
    } else if (admin_title == "Regional Administrator") {
      admin_icon = require("../assets/images/RegionalAdministrator.png");
    }
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
              {!user.loggedIn ? (
                <NotLoggedIn
                  text={`You're not logged in, so you don't have a profile!`}
                  onPress={() => this.props.navigation.navigate("Login")}
                />
              ) : (
                <View>
                  <ConfirmationModal visible={this.state.modalVisible}>
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
                  <View style={s.usernameContainer}>
                    <Text style={s.username}>{user.username}</Text>
                    {!!admin_title && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{admin_title}</Text>
                        <Image source={admin_icon} style={s.rankIcon} />
                      </View>
                    )}
                    {!admin_title && !!contributor_rank && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{contributor_rank}</Text>
                        <Image
                          contentFit="fill"
                          source={contributor_icon}
                          style={s.rankIcon}
                        />
                      </View>
                    )}
                    <Text style={s.joined}>
                      {`Joined: ${moment(created_at).format("MMM DD, YYYY")}`}
                    </Text>
                    <Text
                      style={s.savedLink}
                      onPress={() => this.props.navigation.navigate("Saved")}
                    >
                      View saved locations
                    </Text>
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
                  <View style={{ paddingVertical: 8 }}>
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
                  <Text style={s.section}>High scores</Text>
                  <View style={{ paddingTop: 8, paddingBottom: 15 }}>
                    {profile_list_of_high_scores.length === 0 ? (
                      <Text style={s.none}>No high scores yet</Text>
                    ) : (
                      profile_list_of_high_scores.map((score, idx) => {
                        return (
                          <ListItem
                            containerStyle={s.background}
                            key={`${score[0]}-${score[1]}-${score[2]}-${score[3]}-${idx}`}
                          >
                            <ListItem.Content
                              style={{
                                marginHorizontal: 5,
                                backgroundColor: theme.white,
                                borderRadius: 15,
                              }}
                            >
                              <ListItem.Title style={s.scoreTitle}>
                                {`${score[2]} on ${score[1]} at ${score[0]} on ${score[3]}`}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        );
                      })
                    )}
                  </View>
                  <WarningButton
                    title={"Logout"}
                    onPress={() => this.setModalVisible(true)}
                  />
                  <View style={s.externalUpdateContainer}>
                    <Text style={s.externalUpdateText}>
                      Want to update your password, or email, or delete your
                      account? These can be done on your
                    </Text>
                    <View style={s.externalLinkContainer}>
                      <Text
                        style={s.externalLink}
                        onPress={() =>
                          WebBrowser.openBrowserAsync(
                            "https://pinballmap.com/users/" +
                              user.username +
                              "/profile",
                          )
                        }
                      >
                        Profile page on the website
                      </Text>
                      <EvilIcons name="external-link" style={s.externalIcon} />
                    </View>
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
    background: {
      backgroundColor: theme.base1,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    list: {
      borderRadius: 25,
      paddingVertical: 2,
      paddingHorizontal: 20,
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
      marginHorizontal: 15,
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
    savedLink: {
      fontSize: 16,
      fontFamily: "Nunito-SemiBold",
      color: theme.purple2,
      textAlign: "center",
      textDecorationLine: "underline",
    },
    locationName: {
      marginHorizontal: 10,
      fontSize: 18,
      paddingVertical: 10,
      fontFamily: "Nunito-Bold",
    },
    scoreTitle: {
      marginHorizontal: 10,
      fontSize: 16,
      paddingVertical: 10,
      color: theme.text,
      fontFamily: "Nunito-Medium",
    },
    usernameContainer: {
      paddingTop: 10,
      paddingBottom: 14,
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
      marginVertical: 8,
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
    externalUpdateContainer: {
      marginHorizontal: 20,
    },
    externalLinkContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    externalUpdateText: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Medium",
      textAlign: "center",
    },
    externalLink: {
      fontSize: 14,
      fontFamily: "Nunito-SemiBold",
      textDecorationLine: "underline",
      color: theme.pink1,
    },
    externalIcon: {
      fontSize: 24,
      color: theme.text2,
    },
  });

UserProfile.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
