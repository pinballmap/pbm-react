import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Image } from "expo-image";
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
          contentFit="contain"
          tintColor={theme.theme == "dark" ? "#adc7fd" : "#1d1c1d"}
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
          <Text style={s.category}>What About It</Text>
          <Text style={s.text}>
            Founded in 2008, Pinball Map is an open source, crowdsourced
            worldwide map of public pinball machines. We currently list{" "}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_locations)}
            </Text>{" "}
            locations and{" "}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_lmxes)}
            </Text>{" "}
            machines.
          </Text>
          <Text style={s.text}>
            The site is not monetized and{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://github.com/pinballmap/pbm-react",
                )
              }
            >{`the code`}</Text>{" "}
            is open source. The data is maintained by over 100 administrators
            and thousands of active users.
          </Text>
          <Text style={s.text}>
            To help maintain it (on the app or the website,{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com")
              }
            >
              pinballmap.com
            </Text>
            ), create an account and add and remove machines and submit new
            locations. You can also add machine comments, edit location info,
            and add high scores.
          </Text>
          <Text style={s.text}>
            {`You can `}
            <Text
              onPress={() => navigation.navigate("Contact")}
              style={s.textLink}
            >{`contact us`}</Text>
            {`, and you also might find wisdom `}
            <Text
              onPress={() => navigation.navigate("FAQ")}
              style={s.textLink}
            >{`in the FAQ`}</Text>
            .
          </Text>

          <Image
            source={require("../assets/images/purple-machine.png")}
            tintColor={theme.theme == "dark" ? "#f6d3fc" : "#66017b"}
            style={s.purpleMachine}
          />

          <Text style={s.category}>Keep Up</Text>
          <Text style={s.text}>
            {`Check the `}
            <Text
              onPress={() =>
                WebBrowser.openBrowserAsync("https://blog.pinballmap.com/")
              }
              style={s.textLink}
            >{`blog`}</Text>
            {` to keep up with map news.`}
          </Text>
          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync("https://blog.pinballmap.com/")
            }
          >
            <Image
              source={require("../assets/images/sass_sticker_blog.jpg")}
              style={{
                width: deviceWidth - 30,
                height: (deviceWidth - 30) / 1.3053,
                marginBottom: 10,
                borderRadius: 15,
              }}
              contentFit="contain"
            />
          </Pressable>
          <Text style={s.text}>
            {`Follow us on `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://fosstodon.org/@pinballmap")
              }
            >
              Mastodon
            </Text>
            {` or `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://bsky.app/profile/pinballmap.com",
                )
              }
            >
              Bluesky
            </Text>
            {`.`}
          </Text>
          <Text style={s.text}>
            {`Join `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://discord.gg/zK6xjyYHJf")
              }
            >
              our Discord
            </Text>
            {` to chat with developers, administrators, and fellow users.`}
          </Text>

          <Text style={s.text}>
            Listen to our podcast,{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pod.pinballmap.com/")
              }
            >{`Mappin' Around with Scott & Ryan`}</Text>
            !
          </Text>
          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync("https://pod.pinballmap.com/")
            }
          >
            <Image
              source={require("../assets/images/mappin-logo-600.png")}
              style={{
                width: deviceWidth - 30,
                height: deviceWidth - 30,
                marginBottom: 10,
                borderRadius: 15,
              }}
              contentFit="contain"
            />
          </Pressable>

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

          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync("https://pinballmap.com/store")
            }
          >
            <Image
              source={require("../assets/images/beanie-three-500.jpg")}
              style={{
                width: deviceWidth - 30,
                height: (deviceWidth - 30) / 1.121,
                marginBottom: 10,
                borderRadius: 15,
              }}
              contentFit="contain"
            />
          </Pressable>

          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync("https://pinballmap.com/store")
            }
          >
            <Image
              source={require("../assets/images/pbm-both-stickers.png")}
              style={{
                width: deviceWidth - 30,
                height: (deviceWidth - 30) / 1.4195,
                marginBottom: 10,
              }}
              contentFit="contain"
            />
          </Pressable>

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

          <Text style={s.category}>API</Text>
          <Text style={s.text}>
            Not only is the Pinball Map website and app open source, but there
            is also{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://pinballmap.com/api/v1/docs",
                )
              }
            >
              an API
            </Text>
            . With it, you can pull down map data and use it on your cool app.
          </Text>
          <Text style={s.text}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://sternpinball.com/pinball-locator/",
                )
              }
            >{`Stern Pinball`}</Text>{" "}
            uses our data for their machine locator. Our API is also used by{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://matchplay.events")
              }
            >{`MatchPlay Events`}</Text>{" "}
            and{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pindigo.app/")
              }
            >{`Pindigo`}</Text>{" "}
            and{" "}
            <Text
              style={s.textLink}
              onPress={() => WebBrowser.openBrowserAsync("https://pintips.net")}
            >{`PinTips`}</Text>{" "}
            and{" "}
            <Text
              style={s.textLink}
              onPress={() => WebBrowser.openBrowserAsync("https://scorbit.io/")}
            >{`Scorbit`}</Text>{" "}
            and{" "}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://kineticist.com/")
              }
            >{`Kineticist`}</Text>
            , and more!
          </Text>

          <Text style={s.category}>App Credits</Text>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://github.com/bpoore")
            }
          >
            Beth Poore
          </Text>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://github.com/ryantg")
            }
          >
            Ryan Gratzer
          </Text>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://github.com/scottwainstock")
            }
          >
            Scott Wainstock
          </Text>
          <Text style={{ fontSize: 16 }}>Elijah St Clair</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            And other great folks (noted on Github)!
          </Text>
          <Text style={s.category}>Support Us</Text>
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
            ! And tell your friends about it.
          </Text>
          <Text style={s.text}>Thanks to our beta testers!</Text>
          <Text style={{ fontSize: 16 }}>
            And thanks to all our <Text style={{ fontSize: 16 }}>Ko-fi</Text>{" "}
            and <Text style={{ fontSize: 16 }}>Patreon</Text> supporters!
          </Text>
          {Platform.OS === "android" ? (
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync("https://ko-fi.com/pinballmap")
              }
            >
              <Image
                source={require("../assets/images/kofi_button_black.png")}
                style={{
                  width: deviceWidth - 30,
                  height: (deviceWidth - 30) / 6.385,
                  marginVertical: 10,
                }}
                contentFit="contain"
              />
            </Pressable>
          ) : null}
        </View>
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
      height: (deviceWidth - 30) / 6.759,
      width: deviceWidth - 30,
    },
    purpleMachine: {
      flex: 1,
      alignSelf: "center",
      marginVertical: 5,
      height: 65,
      width: 50,
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
      borderRadius: 15,
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
    category: {
      fontFamily: "Nunito-Bold",
      fontSize: 17,
      textAlign: "center",
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginHorizontal: -15,
      marginBottom: 10,
      marginTop: 5,
      backgroundColor: "#adc7fd",
      color: "#503d49",
      textTransform: "uppercase",
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
