import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { Screen, Text } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

let deviceWidth = Dimensions.get("window").width;

const Resources = () => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={{ flex: 1 }}>
      <Screen>
        <Text style={[{ marginTop: 10 }, s.text]}>
          <Text style={s.bold}>Pinball is fun!</Text>
          {` Here are some great pinball resources. But this is just the start! There are also local pinball groups on facebook. If you're a business owner looking to add machines, you can search for a local operator who will place and maintain machines at your venue.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://matchplay.events")
          }
          style={[
            s.logoWrapper,
            { backgroundColor: "#f5f5ff", paddingVertical: 10 },
          ]}
        >
          <Image
            source={require("../assets/images/Resource_Matchplay.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 8.08,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://matchplay.events/")
            }
          >{`Match Play Events`}</Text>
          {` is a tournament app which makes it easy to organize tournaments on any device. Your players can follow standings and results live on their own mobile devices.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://pindigo.app")}
          style={[
            s.logoWrapper,
            { backgroundColor: "#363377", paddingVertical: 10 },
          ]}
        >
          <Image
            source={require("../assets/images/Resource_Pindigo.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 3.53,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() => WebBrowser.openBrowserAsync("https://pindigo.app")}
          >{`Pindigo`}</Text>
          {` is an app for recording your scores. You can track all your high scores and compare them with friends.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://www.pinballnews.com/site/")
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_PinballNews.png")}
            style={{
              width: deviceWidth - 50,
              height: (deviceWidth - 50) / 4.07,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://www.pinballnews.com/site/")
            }
          >{`Pinball News`}</Text>
          {` is a great resource for keeping up with all the pinball news. Learn about upcoming games and events, read interviews and reviews, and much more.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://www.ifpapinball.com")
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_IFPA.jpg")}
            style={{
              width: deviceWidth - 50,
              height: (deviceWidth - 50) / 2.85,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          {`The `}
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://www.ifpapinball.com")
            }
          >{`IFPA`}</Text>
          {` - or the International Flipper Pinball Association - is a governing body for competitive pinball. Check out the calendar to find tournaments near you.`}
        </Text>
        <View style={s.hr}></View>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() => WebBrowser.openBrowserAsync("https://opdb.org/")}
          >{`OPDB`}</Text>
          {` - or the Open Pinball Database - is a machine database with an API. Its API is used by us, and a number of other apps. So it's like we're all talking to each other.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://pintips.net")}
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_Pintips.png")}
            style={{
              width: deviceWidth - 50,
              height: (deviceWidth - 50) / 7.63,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() => WebBrowser.openBrowserAsync("https://pintips.net")}
          >{`PinTips`}</Text>
          {` is a great place to quickly pick up tips about how to play specific machines. And it's very easy to contribute your own tips!`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://pinside.com/")}
          style={[
            s.logoWrapper,
            { backgroundColor: "#ff953e", paddingVertical: 10 },
          ]}
        >
          <Image
            source={require("../assets/images/Resource_Pinside.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 6.6,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() => WebBrowser.openBrowserAsync("https://pinside.com/")}
          >{`Pinside`}</Text>
          {` is a huge community resource. It's especially useful for solving issues with your machines. But it also has a whole lot more.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://scorbit.io/")}
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_Scorbit.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 2.87,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() => WebBrowser.openBrowserAsync("https://scorbit.io/")}
          >{`Scorbit`}</Text>
          {` is a platform (hardware/app) for tracking scores - and much more - in real-time. Operators can use it to track earnings. It does a lot, and its compatible with many machines.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://www.youtube.com/channel/UCp-cSoq5qVVyts7H8rQjV-w",
            )
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_PAPA.jpg")}
            style={{
              width: deviceWidth - 70,
              height: deviceWidth - 70,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://www.youtube.com/channel/UCp-cSoq5qVVyts7H8rQjV-w",
              )
            }
          >{`PAPA Pinball`}</Text>
          {` produces excellent tutorial videos. They're a great way to get familiar with machines and their rules. Old and new games alike are covered.`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://discord.com/invite/XffPx6VKTv")
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_PinballPeople.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 1.294,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={s.text}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://discord.com/invite/XffPx6VKTv",
              )
            }
          >{`Pinball People`}</Text>
          {` is a friendly Discord group for chatting all day about pinball. No politics, no hate, no drama. You can find at least one of us from Pinball Map in there, in case you have quick map comments or questions!`}
        </Text>
        <View style={s.hr}></View>
        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://www.deadflip.com/")
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_DeadFlip.png")}
            style={{
              width: deviceWidth - 70,
              height: deviceWidth - 70,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={[s.text, { marginBottom: 20 }]}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://www.deadflip.com/")
            }
          >{`Dead Flip`}</Text>
          {` is the preeminent pinball streamer! The host, Jack Danger, has been promoting pinball for years and is a funny person with a big fanbase.`}
        </Text>

        <Pressable
          onPress={() =>
            WebBrowser.openBrowserAsync("https://www.kineticist.co/")
          }
          style={[s.logoWrapper]}
        >
          <Image
            source={require("../assets/images/Resource_Kineticist.png")}
            style={{
              width: deviceWidth - 70,
              height: (deviceWidth - 70) / 2.994,
              resizeMode: "stretch",
            }}
          />
        </Pressable>
        <Text style={[s.text, { marginBottom: 20 }]}>
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync("https://www.kineticist.co/")
            }
          >{`Kineticist`}</Text>
          {` is a digital publication and community resource for the pinball and physical gaming communities. And we have a monthly `}
          <Text
            style={s.textLink}
            onPress={() =>
              WebBrowser.openBrowserAsync(
                "https://www.kineticist.co/author/ryan-tg",
              )
            }
          >{`Pinball Map New Locations Update`}</Text>
          {` article series on the site!`}
        </Text>
      </Screen>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    logoWrapper: {
      alignSelf: "center",
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      lineHeight: 22,
      marginLeft: 15,
      marginRight: 15,
      fontFamily: "regularFont",
    },
    bold: {
      fontFamily: "boldFont",
    },
    textLink: {
      textDecorationLine: "underline",
      color: theme.purple,
      fontSize: 16,
      fontFamily: "mediumFont",
    },
    hr: {
      marginLeft: 25,
      marginRight: 25,
      height: 2,
      marginVertical: 20,
      backgroundColor: theme.indigo4,
    },
  });

Resources.propTypes = {
  navigation: PropTypes.object,
  appAlert: PropTypes.string,
};

export default Resources;
