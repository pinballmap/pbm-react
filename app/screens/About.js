import React, { useContext, useEffect, useRef, useState } from "react";
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
import { Screen, ScrollToTop, Text } from "../components";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

let deviceWidth = Dimensions.get("window").width;

const About = ({ navigation, appAlert }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const [stats, setStats] = useState({
    num_locations: 0,
    num_lmxes: 0,
  });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

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
    <SafeAreaView edges={["right", "left"]} style={s.background}>
      <Screen
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Image
          source={require("../assets/images/pinballmapcom_nocom.png")}
          contentFit="contain"
          tintColor={theme.theme == "dark" ? "#adc7fd" : "#1d1c1d"}
          style={s.logo}
        />
        <View style={s.appAlert}>
          <Text
            style={[{ textAlign: "center", color: theme.pink1 }, s.boldHeader]}
          >
            Message of the Day
          </Text>
          <Text style={[{ color: theme.text3 }, s.text, s.boldText]}>
            {appAlert}
          </Text>
        </View>
        <View style={s.category}>
          <Text style={s.categoryText}>What About It</Text>
        </View>
        <View style={s.body}>
          <Text style={s.text}>
            {`Founded in 2008, Pinball Map is an open source, crowdsourced worldwide map of public pinball machines. We currently list `}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_locations)}
            </Text>{" "}
            {`locations and `}
            <Text style={s.boldText}>
              {formatNumWithCommas(stats.num_lmxes)}
            </Text>{" "}
            {`machines.`}
          </Text>
          <Text style={[s.text, s.boldText]}>
            {`Here's a page filled with current `}
            <Text
              onPress={() => navigation.navigate("Stats")}
              style={[s.pink, s.boldText]}
            >{`Pinball Map stats`}</Text>
            .
          </Text>
          <Text style={s.text}>
            {`The site is not monetized and `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://github.com/pinballmap/pbm-react",
                )
              }
            >{`the code`}</Text>
            {` is open source. The data is maintained by over 100 administrators and thousands of active users.`}
          </Text>
          <Text style={s.text}>
            {`To help maintain it (on the app or the website, `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com")
              }
            >
              pinballmap.com
            </Text>
            {`), create an account and add and remove machines and submit new locations. You can also add machine comments, edit location info, and add high scores.`}
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
        </View>

        <View style={s.category}>
          <Text style={s.categoryText}>Keep Up</Text>
        </View>
        <View style={s.body}>
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
            {`We sometimes have a few things for sale `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync("https://pinballmap.com/store")
              }
            >
              on our store
            </Text>
            {`.`}
          </Text>

          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync("https://pinballmap.com/store")
            }
          >
            <Image
              source={require("../assets/images/danny-pouch.jpg")}
              style={{
                width: deviceWidth - 30,
                height: (deviceWidth - 30) * 1.379,
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
            {`.`}
          </Text>
        </View>

        <View style={s.category}>
          <Text style={s.categoryText}>API</Text>
        </View>
        <View style={s.body}>
          <Text style={s.text}>
            {`Not only is the Pinball Map website and app open source, but there is also `}
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
            {`. With it, you can pull down map data and use it on your cool app. See `}
            <Text
              onPress={() =>
                navigation.navigate("FAQ", { section: "dataUsage" })
              }
              style={s.textLink}
            >{`this FAQ item about data usage`}</Text>
            {` for more information.`}
          </Text>
          <Text style={s.text}>
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://sternpinball.com/pinball-locator/",
                )
              }
            >{`Stern Pinball`}</Text>
            {` uses our data for their machine locator, as does `}
            <Text
              style={s.textLink}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://jerseyjackpinball.com/pages/pinball-map",
                )
              }
            >{`Jersey Jack Pinball`}</Text>
            {` for theirs. Our API is also used by `}
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
        </View>

        <View style={s.category}>
          <Text style={s.categoryText}>App Credits</Text>
        </View>
        <View style={s.body}>
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
          <Text style={s.text}>Elijah St Clair</Text>
          <Text style={[s.text, { marginBottom: 10 }]}>
            And other great folks (noted on Github)!
          </Text>
        </View>
        <View style={s.category}>
          <Text style={s.categoryText}>Support Us</Text>
        </View>
        <View style={s.body}>
          <Text style={s.text}>
            {`If you like the app, `}
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
            {`! And tell your friends about it.`}
          </Text>
          <Text style={s.text}>Thanks to our beta testers!</Text>
          <Text style={s.text}>
            And thanks to all our Ko-fi and Patreon supporters!
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
      <ScrollToTop visible={showScrollToTop} onPress={scrollToTop} />
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
      alignSelf: "center",
      marginVertical: 5,
      height: 65,
      width: 50,
    },
    text: {
      fontSize: 16,
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
      fontSize: 15,
      fontFamily: "Nunito-Medium",
    },
    appAlert: {
      borderWidth: 0,
      borderRadius: 15,
      margin: 10,
      paddingTop: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 0,
      backgroundColor: theme.theme == "dark" ? theme.base3 : "#efe9f0",
    },
    pink: {
      color: theme.pink1,
      textDecorationLine: "underline",
      fontSize: 15,
      fontFamily: "Nunito-Medium",
    },
    category: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: "#adc7fd",
    },
    body: {
      marginHorizontal: 15,
    },
    categoryText: {
      fontFamily: "Nunito-Bold",
      fontSize: 17,
      textAlign: "center",
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
