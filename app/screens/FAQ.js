import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import { Screen, Text } from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

const FAQ = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={s.background}>
      <Screen>
        <View style={s.container}>
          <View style={s.child}>
            <Text
              style={s.bold}
            >{`How do I search for a particular machine?`}</Text>
            <Text
              style={s.text}
            >{`When you're on the map screen, click the "filter" button in the upper right, then choose a machine. Then go back to the map and it will only show places with that machine.`}</Text>
            <Text
              style={s.bold}
            >{`I get an error every time I try to add a machine, or comment, or anything.`}</Text>
            <Text style={s.text}>
              {`You probably haven't confirmed your account. You should have received an email (check your spam!). `}
              <Text
                style={s.textLink}
                onPress={() => navigation.navigate("ResendConfirmation")}
              >
                {"Or go here to have it resent."}
              </Text>
            </Text>
            <Text
              style={s.bold}
            >{`The location name has changed. Can I change it?`}</Text>
            <Text style={s.text}>
              {`Only administrators can edit location names. Please `}
              <Text
                onPress={() => navigation.navigate("Contact")}
                style={s.textLink}
              >
                {"contact us"}
              </Text>
              {`, and make sure to tell us the name of the location.`}
            </Text>
            <Text
              style={s.bold}
            >{`This location closed/no longer has machines. What do I do - do I need to tell you?`}</Text>
            <Text
              style={s.text}
            >{`Simply remove all the machines from it. Empty locations are periodically removed.`}</Text>
            <Text
              style={s.bold}
            >{`This location has moved. Should I add a location description that no administrator will ever see? Or should I remove the machines from it and re-submit?`}</Text>
            <Text style={s.text}>
              {`Neither! Administrators can change the address. Please `}
              <Text
                onPress={() => navigation.navigate("Contact")}
                style={s.textLink}
              >
                {"contact us"}
              </Text>
              {`, and make sure to tell us the name of the location that has moved. It's preferable to simply change the address because that retains the location history.`}
            </Text>
            <Text style={s.bold}>{`How do I get listed as an operator?`}</Text>
            <Text style={s.text}>
              {
                <Text
                  onPress={() => navigation.navigate("Contact")}
                  style={s.textLink}
                >
                  {"Contact us"}
                </Text>
              }
              {` and we'll add you. Once you tag all of your locations, you'll be able to quickly see all your locations using the "Filter". You can also choose to be notified about comments made to your machines. Let us know if you want those notifications!`}
            </Text>
            <Text
              style={s.bold}
            >{`I am an operator, and people are leaving bad comments on my machines. Can you make them stop, or disable comments on my machines?`}</Text>
            <Text style={s.text}>
              {`We can't control the comments that people make, nor will we disable comments at an individual venue. Some operators find reports of technical issues to be very useful; and some do not. Some operators wish that folks would only leave "general" machine comments and not "specific" comments (we can't control this). On the other hand, most regular users find machine comments to be a very valuable feature. It is difficult to perfectly cater to everyone.\n\n`}
              <Text style={{ fontFamily: "Nunito-Bold" }}>
                To users leaving comments:
              </Text>{" "}
              {`It is generally preferable to directly tell operators about problems. For example, in person or with a note to staff at the venue. Many pinball issues are minor and temporary, and leaving a comment about them on the map puts it "on the record" and it may remain there long after the issue is resolved.\n\n`}
              <Text style={{ fontFamily: "Nunito-Bold" }}>To operators:</Text>{" "}
              {`Users notice when operators remove and re-add the same machine in order to clear out comments they don't like. It makes it seem like the operator is whitewashing comments rather than fixing issues. We strongly discourage doing this, and instead ask that operators try to keep a level head amidst comments they don't like, and leave a note saying the issue is fixed. It's better in the long term and this comment history is actually really valuable.`}
            </Text>
            <Text
              style={s.bold}
            >{`How do I remove a machine from a location?`}</Text>
            <Text
              style={s.text}
            >{`You have to be logged in (if you don't have account, please create one). Click on the machine name, and then look for the "remove" button or the trash can icon.`}</Text>
            <Text
              style={s.bold}
            >{`This location is temporarily closed. Should I remove the machines from it?`}</Text>
            <Text
              style={s.text}
            >{`No. If a place is seasonal or closed due to restrictions, and is expected to re-open, please do not remove the machines from it. Just edit the location description to say it's temporarily closed. You can also make sure the phone number is listed, so that people can easily call and check on the status.`}</Text>
            <Text
              style={s.bold}
            >{`I see you have a ranking system for contributors. How do I earn a contributor badge and title?`}</Text>
            <Text
              style={s.text}
            >{`Great question! As a small token of acknowledgement of your contributions to the map, if you make more than 50 contributions, we christen you a "Super Mapper". After 250 contributions, you are a "Legendary Mapper". And after 500 amazing map contributions, you are a "Grand Champ Mapper"!`}</Text>
            <Text
              style={s.bold}
            >{`How can I submit a backglass photo to the “machine details” screen?`}</Text>
            <Text style={s.text}>
              The photos we display come from the Open Pinball Database (OPDB),
              and so you should upload your high quality photo using{" "}
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync("https://opdb.org/images/create")
                }
              >
                this form
              </Text>{" "}
              (you must first create an OPDB account). The photos you upload
              will not immediately appear in this app.
            </Text>
            <Text style={s.text}>
              <Text style={{ fontFamily: "Nunito-Bold" }}>
                General backglass/translite photo guidelines
              </Text>
              : Take photo straight on, not at an angle. Crop image to show only
              artwork. Avoid glare, if possible
            </Text>
            <Text
              style={s.bold}
            >{`Can you include "bat games" like SlugFest on the map?`}</Text>
            <Text style={s.text}>
              No, no bat games. We fully understand that pitch and bat games
              resemble pinball machines and the collectors that collect them
              also usually collect pinball machines. We used to include bat
              games, but found that non-pinball machines like that were a
              slippery slope toward including more and more non-pinball
              machines. We only want to map pinball machines. In general, if the
              machine is not listed on{" "}
              <Text
                style={s.textLink}
                onPress={() => WebBrowser.openBrowserAsync("https://opdb.org")}
              >
                OPDB
              </Text>{" "}
              then we will not include it.
            </Text>
            <Text
              style={s.bold}
            >{`The Location List isn't showing a location that I think it should.`}</Text>
            <Text
              style={s.text}
            >{`The Location List lists what is currently shown on the map. If you pan/zoom the map, it will list different things.`}</Text>
            <Text style={s.bold}>{`How do I add a new location?`}</Text>
            <Text style={s.text}>
              {`Fill out `}
              <Text
                onPress={() => navigation.navigate("SuggestLocation")}
                style={s.textLink}
              >
                {"this form"}
              </Text>
              {` (or go to the menu icon in the lower right of the map screen and choose "Submit Location"). Our administrators moderate submissions, so please allow 0 - 7 days or so for it to be approved. The more accurate and thorough your submission, the quicker it will get added!`}
            </Text>
            <Text
              style={s.bold}
            >{`Can I add my private collection to the map?`}</Text>
            <Text
              style={s.text}
            >{`No. Pinball Map only lists publicly-accessible locations. The definition of "public" varies - some places have entrance fees, or limited hours. But overall, the location has to be inclusive and accessible. So please don't submit your house or a private club that excludes people from becoming members.`}</Text>
            <Text
              style={s.bold}
            >{`When I search for a city, the city is listed twice (and maybe the second instance of it is misspelled). Or, I see the same location listed twice. Or, the place is in the wrong spot on the map. Etc.`}</Text>
            <Text style={s.text}>
              {`These are data entry mistakes. Please `}
              <Text
                onPress={() => navigation.navigate("Contact")}
                style={s.textLink}
              >
                {"contact us"}
              </Text>
              {` so we can fix them.`}
            </Text>
            <Text style={s.bold}>{`Why was my comment removed?`}</Text>
            <Text style={s.text}>
              {`Our administrators may deem your machine or location comment to be inappropriate because:\n\n`}

              {`\u2022 It contains a personal attack\n\n`}

              {`\u2022 It isn't relevant (for example, promoting a tournament in a machine comment) or constructive\n\n`}

              {`\u2022 It is offensive`}
            </Text>
            <Text style={s.bold}>{`Why was my account disabled?`}</Text>
            <Text style={s.text}>
              {`\u2022 If your account has been used to mess with data on the site, then we may ban it. Bad behavior includes, but is not limited to: deleting machines that are at a location; adding machines that are not at a location; leaving lots of inappropriate/abusive comments.\n\n`}

              {`\u2022 You created a sockpuppet account to hype your location and/or disparage the competition. This is unethical and it makes the site worse. Don't do this. Look in the mirror.\n\n`}

              {`\u2022 You signed up with a disposable email account. We sometimes have legitimate reasons for contacting you individually. Disposable emails are most often used by people who abuse the site.`}
            </Text>
            <Text
              style={s.bold}
            >{`I can't remember my password. How do I reset it?`}</Text>
            <Text style={s.text}>
              {`You can reset it via`}{" "}
              <Text
                onPress={() => navigation.navigate("PasswordReset")}
                style={s.textLink}
              >
                {"this link"}
              </Text>
              .
            </Text>
            <Text style={s.bold}>{`Can you add a feature that I want?`}</Text>
            <Text style={s.text}>
              {`Maybe! We can try. Pinball Map is an open source app. You can submit "issues" to`}{" "}
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://github.com/pinballmap/pbm-react",
                  )
                }
              >{`the Github repository`}</Text>
              {`, and you can also directly contribute code.`}
            </Text>
            <Text style={s.bold}>{`What is your privacy policy?`}</Text>
            <Text style={s.text}>
              Please see the{" "}
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync("https://pinballmap.com/privacy")
                }
              >
                detailed privacy policy on our website
              </Text>
              {`. The overview: We do not track or store user locations, nor store any personal information. We do not sell any user data. We do not use third-party analytics. This site is not monetized. We keep a log of map edits that users make.\n\nThis app uses Mapbox for the map, and they seem to enable telemetry by default. It is used to improve their data, and not for ads. We cannot disable it en masse. You can `}
              <Text
                style={s.textLink}
                onPress={() =>
                  WebBrowser.openBrowserAsync(
                    "https://www.mapbox.com/telemetry/",
                  )
                }
              >
                read more about it here
              </Text>
              {`, and you should be able to disable it in the app by clicking the (i) icon on the map.`}
            </Text>
            <Text style={s.bold}>
              {`Have a question that we didn't cover here?`}{" "}
              <Text
                onPress={() => navigation.navigate("Contact")}
                style={s.textLink}
              >
                {"Ask us!"}
              </Text>
            </Text>
          </View>
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
    container: {
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      flex: 1,
    },
    child: {
      margin: "auto",
    },
    text: {
      fontSize: 16,
      color: theme.text2,
      lineHeight: 22,
      marginBottom: 15,
      marginLeft: 15,
      marginRight: 15,
    },
    bold: {
      fontFamily: "Nunito-Bold",
      fontSize: 17,
      marginBottom: 10,
      padding: 10,
      color: "#ede8fe",
      backgroundColor: "#4e3a52",
    },
    textLink: {
      textDecorationLine: "underline",
      color: theme.theme == "dark" ? theme.pink3 : theme.pink1,
      fontFamily: "Nunito-Medium",
    },
  });

FAQ.propTypes = {
  navigation: PropTypes.object,
};

export default FAQ;
