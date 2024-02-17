import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dimensions, Image, Platform, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { getData } from "../config/request";
import { Screen, Text } from "../components";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

let deviceWidth = Dimensions.get("window").width;

const About = ({ navigation, appAlert }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [stats, setStats] = useState({
    num_locations: 0,
    num_lmxes: 0,
  });

  useEffect(() => {
    let isCancelled = false;

    getData("/regions/location_and_machine_counts.json").then((data) => {
      if (!isCancelled) {
        if (data && data.num_lmxes && data.num_locations) {
          setStats({
            num_lmxes: data.num_lmxes,
            num_locations: data.num_locations,
          });
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={s.background}>
      <Screen>
        <Image
          source={require("../assets/images/pinballmapcom_nocom.png")}
          resizeMode="contain"
          style={s.logo}
        />
        <View style={s.child}>
          <View style={s.appAlert}>
            <Text
              style={[
                { textAlign: "center", color: theme.pink1 },
                s.boldHeader,
              ]}
            >
              Message of the Day
            </Text>
            <Text style={[{ color: theme.text3 }, s.text, s.boldText]}>
              {appAlert}
            </Text>
          </View>

          <Text style={s.text}>
            Founded in 2008, Pinball Map is an open source, crowdsourced
            worldwide map of public pinball machines.
          </Text>

          <Text style={s.text}>
            We currently list{" "}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_locations)}
            </Text>{" "}
            locations and{" "}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_lmxes)}
            </Text>{" "}
            machines. You can update the map using this app or the website:{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com")
              }
            >
              pinballmap.com
            </Text>
            . The data is managed by over 100 administrators and thousands of
            active users.
          </Text>

          <Image
            source={require("../assets/images/purple-machine.png")}
            resizeMode="contain"
            style={s.purpleMachine}
          />

          <Text style={s.text}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://github.com/pinballmap/pbm-react",
                )
              }
            >{`This app's code`}</Text>{" "}
            is open source, and you can contribute to it. You can also use the
            data{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://pinballmap.com/api/v1/docs",
                )
              }
            >
              via our API
            </Text>
            . With the API, we supply the mapping data for the{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://sternpinball.com/pinball-locator/",
                )
              }
            >{`Stern Pinball website`}</Text>
            , and are used by{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pindigo.app/")
              }
            >{`Pindigo`}</Text>
            ,{" "}
            <Text
              style={s.textLink}
              onPress={() => WebBrowser.openBrowserAsync("http://pintips.net")}
            >{`PinTips`}</Text>
            ,{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("http://matchplay.events")
              }
            >{`MatchPlay Events`}</Text>
            ,{" "}
            <Text
              style={s.textLink}
              onPress={() => WebBrowser.openBrowserAsync("https://scorbit.io/")}
            >{`Scorbit`}</Text>
            ,{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://kineticist.co/")
              }
            >{`Kineticist`}</Text>
            , and more!
          </Text>

          <Text style={s.text}>
            <Text
              onPress={() => navigation.navigate("Contact")}
              style={s.textLink}
            >{`Contact Us`}</Text>
            . Or you can start a discussion about anything on our{" "}
            <Text
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://github.com/pinballmap/pbm/discussions",
                )
              }
              style={s.textLink}
            >{`Github discussion page`}</Text>
            .
          </Text>

          <Text style={s.text}>
            <Text
              onPress={() =>
                WebBrowser.openBrowserAsync("https://blog.pinballmap.com/")
              }
              style={s.pink}
            >{`Read the blog`}</Text>
            .{" "}
            <Text
              onPress={() => navigation.navigate("FAQ")}
              style={s.textLink}
            >{`Read the FAQ (and Privacy Policy)`}</Text>
            .
          </Text>

          <Text style={s.text}>
            Listen to our old podcast,{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pod.pinballmap.com/")
              }
            >{`Mappin' Around with Scott & Ryan`}</Text>
            !
          </Text>

          <Text style={s.text}>
            Follow{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://fosstodon.org/@pinballmap")
              }
            >
              @pinballmap
            </Text>{" "}
            on Mastodon!
          </Text>

          <Text style={s.text}>
            We sometimes have a few things for sale{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com/store")
              }
            >
              on our store
            </Text>
            .
          </Text>

          <Text style={s.text}>
            {"And finally, we've compiled some "}
            <Text
              style={s.pink}
              onPress={() => navigation.navigate("Resources")}
            >
              additional pinball resources
            </Text>
            !
          </Text>

          <Image
            source={require("../assets/images/pbm-both-stickers.png")}
            style={{
              width: deviceWidth - 40,
              height: (deviceWidth - 40) / 1.4195,
              marginBottom: 10,
            }}
            resizeMode="contain"
          />

          <Text style={s.boldHeader}>App Credits:</Text>
          <Text style={{ fontSize: 16 }}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://github.com/bpoore")
              }
            >
              Beth Poore
            </Text>{" "}
            (Development)
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://github.com/ryantg")
              }
            >
              Ryan Gratzer
            </Text>{" "}
            (Design & Dev)
          </Text>
          <Text style={{ fontSize: 16 }}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://github.com/scottwainstock")
              }
            >
              Scott Wainstock
            </Text>{" "}
            (API)
          </Text>
          <Text style={{ fontSize: 16 }}>Elijah St Clair (DevOps)</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            And other great folks (noted on Github)!
          </Text>
          <Text style={s.text}>
            If you like the app,&nbsp;
            {Platform.OS === "ios" ? (
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "itms-apps://itunes.apple.com/us/app/pinball-map/id359275713?mt=8",
                  )
                }
              >
                please rate and review it
              </Text>
            ) : (
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync("market://details?id=com.pbm")
                }
              >
                please rate and review it
              </Text>
            )}
            !
          </Text>
          <Text style={s.text}>Thanks to our beta testers!</Text>
          <Text style={{ fontSize: 16 }}>
            And thanks to all our
            {Platform.OS === "ios" ? (
              <Text style={{ fontSize: 16 }}> Patreon </Text>
            ) : (
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync("https://patreon.com/pinballmap")
                }
              >
                {" "}
                Patreon{" "}
              </Text>
            )}
            supporters!
          </Text>
        </View>
        {Platform.OS === "android" ? (
          <Image
            source={require("../assets/images/patreon.png")}
            resizeMode="contain"
            onPress={() =>
              WebBrowser.openBrowserAsync("https://patreon.com/pinballmap")
            }
            style={[s.patreonLogo]}
          />
        ) : null}
      </Screen>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
    },
    logo: {
      marginTop: 10,
      flex: 1,
      alignSelf: "center",
      width: deviceWidth - 30,
      borderRadius: Platform.OS === "ios" ? 10 : 0,
      backgroundColor: theme.theme == "dark" ? "#ac9fc7" : theme.base1,
    },
    purpleMachine: {
      flex: 1,
      height: 60,
      alignSelf: "center",
      marginVertical: 5,
    },
    patreonLogo: {
      flex: 1,
      width: deviceWidth - 40,
      alignSelf: "center",
    },
    child: {
      margin: "auto",
      padding: 15,
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 10,
    },
    boldText: {
      fontFamily: "Nunito-Bold",
    },
    boldHeader: {
      fontFamily: "Nunito-Bold",
      fontSize: 18,
      marginBottom: 10,
    },
    textLink: {
      textDecorationLine: "underline",
      color: theme.purple2,
      fontSize: 16,
      fontFamily: "Nunito-Medium",
    },
    appAlert: {
      borderWidth: 0,
      borderRadius: 10,
      marginBottom: 10,
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 0,
      backgroundColor: theme.theme == "dark" ? theme.base3 : "#efe9f0",
    },
    pink: {
      color: theme.pink1,
      textDecorationLine: "underline",
      fontSize: 16,
      fontFamily: "Nunito-Medium",
    },
  });

About.propTypes = {
  navigation: PropTypes.object,
  appAlert: PropTypes.string,
};

const mapStateToProps = ({ regions }) => {
  const appAlert = regions.regions.filter((region) => region.id === 1)[0].motd;

  return {
    appAlert,
  };
};
export default connect(mapStateToProps)(About);
