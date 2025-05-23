import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image, ImageBackground } from "expo-image";
import {
  Dimensions,
  Platform,
  Text,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { logout } from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import PbmButton from "./PbmButton";
import WarningButton from "./WarningButton";

let deviceWidth = Dimensions.get("window").width;

const DrawerMenu = ({ logout, user, ...props }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const iconSize = 28;
  const iconColor = "#bec2e6";
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <DrawerContentScrollView {...props}>
      <ConfirmationModal visible={modalVisible}>
        <PbmButton
          title={"Log Me Out"}
          onPress={() => {
            setModalVisible(false);
            logout();
            props.navigation.navigate("Login");
          }}
        />
        <WarningButton
          title={"Stay Logged In"}
          onPress={() => setModalVisible(false)}
          accessibilityLabel="Stay Logged In"
        />
      </ConfirmationModal>
      <DrawerItemList {...props} />
      <View
        style={{
          width: "100%",
          paddingTop: 10,
          marginLeft: -10,
          paddingBottom: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            marginTop: 0,
            marginBottom: 2,
            height: 80,
            width: "100%",
            marginLeft: 20,
          }}
        >
          <Image
            source={
              theme.theme === "dark"
                ? require("../assets/images/pbm-logo-dark.png")
                : require("../assets/images/pbm-logo-light.png")
            }
            contentFit="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        {user.loggedIn ? (
          <Text allowFontScaling={false} style={s.nameText}>
            {user.username}
          </Text>
        ) : (
          <Pressable
            onPress={() => props.navigation.navigate("Signup")}
            style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
          >
            <Text allowFontScaling={false} style={s.nameText}>
              Sign up!
            </Text>
          </Pressable>
        )}
        <ImageBackground
          source={
            theme.theme === "dark"
              ? require("../assets/images/dots-background.png")
              : require("../assets/images/dots-background-light.png")
          }
          style={{
            zIndex: -1,
            width: 400,
            height: 130,
            position: "absolute",
            top: 0,
          }}
          imageStyle={{ opacity: theme.theme == "dark" ? 0.4 : 0.1 }}
        >
          {theme.theme == "dark" ? null : (
            <View
              style={{
                flex: 1,
                backgroundColor: "#cf8dde",
                opacity: 0.1,
              }}
            />
          )}
        </ImageBackground>
      </View>
      <DrawerItem
        label="Map"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialIcons
            name="search"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("MapTab")}
      />
      <DrawerItem
        label="Submit Location"
        allowFontScaling={false}
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons
            name="add-location"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() =>
          props.navigation.navigate("Map", { screen: "SuggestLocation" })
        }
      />
      <DrawerItem
        label="Contact"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialCommunityIcons
            name="email-outline"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Contact" })}
      />
      <DrawerItem
        label="About"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialIcons
            name="info-outline"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "About" })}
      />
      <DrawerItem
        label="Events"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialIcons
            name="event-note"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Events" })}
      />
      <DrawerItem
        label="FAQ"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialIcons
            name="question-answer"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "FAQ" })}
      />
      <DrawerItem
        label="Settings"
        labelStyle={s.labelStyle}
        allowFontScaling={false}
        icon={() => (
          <MaterialIcons
            name="settings"
            size={iconSize}
            color={iconColor}
            style={s.iconStyle}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Settings" })}
      />
      {user.loggedIn ? (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            { opacity: pressed ? 0.2 : 1.0 },
            s.container,
          ]}
        >
          <Text allowFontScaling={false} style={s.text}>
            Logout
          </Text>
          <MaterialCommunityIcons name="exit-run" style={s.icon} />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => props.navigation.navigate("Login")}
          style={({ pressed }) => [
            { opacity: pressed ? 0.2 : 1.0 },
            s.container,
          ]}
        >
          <Text allowFontScaling={false} style={s.text}>
            Login
          </Text>
          <MaterialCommunityIcons name="login" style={s.icon} />
        </Pressable>
      )}
    </DrawerContentScrollView>
  );
};
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginTop: deviceWidth < 325 ? 5 : 8,
      height: 55,
    },
    icon: {
      fontSize: 28,
      color: theme.colors.activeTab,
      position: "absolute",
      opacity: 0.9,
      paddingLeft: Platform.OS === "ios" ? 17 : 15,
      marginTop: 8,
    },
    iconStyle: {
      marginTop: 0,
    },
    text: {
      color: theme.colors.activeTab,
      fontFamily: "Nunito-Bold",
      fontSize: 20,
      position: "absolute",
      paddingLeft: 78,
      paddingRight: 120,
      top: 8,
    },
    nameText: {
      color: theme.colors.activeTab,
      fontFamily: "Nunito-ExtraBold",
      fontSize: 22,
      marginLeft: 20,
    },
    labelStyle: {
      color: theme.colors.primary,
      fontFamily: "Nunito-Bold",
      fontWeight: Platform.OS === "android" ? undefined : 700,
      fontSize: 20,
    },
  });

DrawerMenu.propTypes = {
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
