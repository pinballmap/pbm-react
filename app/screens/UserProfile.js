import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Image, Pressable, StyleSheet, View } from "react-native";
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
      admin_rank_int,
      admin_title,
      contributor_rank_int,
      contributor_rank,
    } = profileInfo;
    let admin_icon;
    if (admin_rank_int == 1) {
      admin_icon = require("../assets/images/Rank_1.png");
    } else if (admin_rank_int == 2) {
      admin_icon = require("../assets/images/Rank_2.png");
    }
    let contributor_icon;
    if (contributor_rank_int == 3) {
      contributor_icon = require("../assets/images/Rank_3.png");
    } else if (contributor_rank_int == 4) {
      contributor_icon = require("../assets/images/Rank_4.png");
    } else if (contributor_rank_int == 5) {
      contributor_icon = require("../assets/images/Rank_5.png");
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
                    <WarningButton
                      title={"Log Me Out"}
                      onPress={() => {
                        this.setModalVisible(false);
                        this.props.logout();
                        this.props.navigation.navigate("Login");
                      }}
                      accessibilityLabel="Logout"
                      containerStyle={s.buttonContainer}
                    />
                    <PbmButton
                      title={"Stay Logged In"}
                      onPress={() => this.setModalVisible(false)}
                      accessibilityLabel="Stay LoggedIn"
                      containerStyle={s.buttonContainer}
                    />
                  </ConfirmationModal>
                  <View style={s.usernameContainer}>
                    <Text style={s.username}>{user.username}</Text>
                    {!!admin_rank_int && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{admin_title}</Text>
                        <Image source={admin_icon} style={s.rankIcon} />
                      </View>
                    )}
                    {!admin_rank_int && !!contributor_rank_int && (
                      <View style={s.rankView}>
                        <Text style={s.rankText}>{contributor_rank}</Text>
                        <Image source={contributor_icon} style={s.rankIcon} />
                      </View>
                    )}
                  </View>
                  <Text style={s.member}>{`Joined: ${moment(created_at).format(
                    "MMM DD, YYYY",
                  )}`}</Text>
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
                      <Text style={s.stat}>Machines comments:</Text>
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
                  <View style={s.savedLinkContainer}>
                    <Text
                      style={s.savedLink}
                      onPress={() => this.props.navigation.navigate("Saved")}
                    >
                      View saved locations
                    </Text>
                  </View>
                  <Text style={s.bold}>Locations Edited (up to 50):</Text>
                  <View style={{ paddingVertical: 8 }}>
                    {profile_list_of_edited_locations
                      .slice(0, 50)
                      .map((location) => (
                        <Pressable
                          key={location[0]}
                          onPress={() =>
                            this.props.navigation.navigate("LocationDetails", {
                              id: location[0],
                            })
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
                                  s.listTitleStyle,
                                  pressed ? s.textPressed : s.textNotPressed,
                                ]}
                              >
                                {location[1]}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                      ))}
                  </View>
                  <Text style={s.bold}>High Scores:</Text>
                  <View style={{ paddingTop: 8, paddingBottom: 15 }}>
                    {profile_list_of_high_scores.map((score, idx) => {
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
                            <ListItem.Title style={s.listTitleStyle}>
                              {`${score[2]} on ${score[1]} at ${score[0]} on ${score[3]}`}
                            </ListItem.Title>
                          </ListItem.Content>
                        </ListItem>
                      );
                    })}
                  </View>
                  <WarningButton
                    title={"Logout"}
                    onPress={() => this.setModalVisible(true)}
                    accessibilityLabel="Logout"
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
      borderRadius: 15,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: 0,
      backgroundColor: theme.white,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 2,
      marginHorizontal: 15,
      marginVertical: 6,
    },
    bold: {
      fontFamily: "boldFont",
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: theme.text,
      backgroundColor: theme.theme == "dark" ? "#312433" : theme.base2,
    },
    savedIcon: {
      fontSize: 24,
      color: theme.text3,
      marginRight: 5,
    },
    savedLinkContainer: {
      marginVertical: 15,
    },
    savedLink: {
      fontSize: 16,
      fontFamily: "regularBoldFont",
      color: theme.purple2,
      textAlign: "center",
      textDecorationLine: "underline",
    },
    buttonTitleStyle: {
      fontSize: 16,
      color: theme.text,
      fontFamily: "boldFont",
    },
    margin40: {
      marginLeft: 40,
      marginRight: 40,
      marginTop: 15,
      marginBottom: 15,
    },
    titleStyle: {
      color: theme.text3,
      fontSize: 16,
    },
    listTitleStyle: {
      marginHorizontal: 10,
      fontSize: 16,
      paddingVertical: 10,
      color: theme.text,
      fontFamily: "regularFont",
    },
    usernameContainer: {
      padding: 10,
      backgroundColor: theme.base2,
    },
    username: {
      fontFamily: "boldFont",
      fontSize: 18,
      color: theme.pink1,
      textAlign: "center",
    },
    statContainer: {
      alignItems: "center",
      backgroundColor: theme.theme == "dark" ? "#251b27" : "#efe9f0",
      marginHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    statItem: {
      flexDirection: "row",
      width: 220,
    },
    stat: {
      marginTop: 5,
      fontSize: 16,
      fontFamily: "mediumFont",
      opacity: 0.9,
      color: theme.theme == "dark" ? "#fee7f5" : theme.text,
      width: 160,
    },
    statNum: {
      fontFamily: "boldFont",
      color: "#17001c",
      backgroundColor: theme.theme == "dark" ? "#cf8dde" : theme.pink2,
      fontSize: 16,
      marginTop: 5,
      marginLeft: 10,
    },
    member: {
      textAlign: "center",
      marginBottom: 10,
      marginHorizontal: 20,
      paddingTop: 10,
      fontSize: 16,
      color: theme.text2,
      fontFamily: "mediumFont",
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
    pressed: {
      shadowColor: "transparent",
      opacity: 0.8,
      elevation: 0,
    },
    notPressed: {
      shadowColor: theme.shadow,
      opacity: 1.0,
      elevation: 2,
    },
    textPressed: {
      color: theme.text3,
    },
    textNotPressed: {
      color: theme.text,
    },
    rankView: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 8,
    },
    rankText: {
      fontSize: 16,
      fontFamily: "boldFont",
      color: theme.text3,
    },
    rankIcon: {
      width: 20,
      height: 20,
      resizeMode: "stretch",
      marginLeft: 5,
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
      fontSize: 16,
      color: theme.text3,
      fontFamily: "regularBoldFont",
      textAlign: "center",
    },
    externalLink: {
      fontSize: 16,
      fontFamily: "regularBoldFont",
      color: theme.purple,
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
