import React, { useContext, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Dimensions,
  Platform,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { logout } from "../actions";
import ConfirmationModal from "./ConfirmationModal";
import PbmButton from "./PbmButton";
import WarningButton from "./WarningButton";

let deviceWidth = Dimensions.get("window").width;

const DrawerMenu = ({ loggedIn, logout, ...props }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const iconSize = 24;
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
            props.navigation.navigate("Map", { screen: "Login" });
          }}
          accessibilityLabel="Logout"
          containerStyle={s.buttonContainer}
        />
        <WarningButton
          title={"Stay Logged In"}
          onPress={() => setModalVisible(false)}
          accessibilityLabel="Stay Logged In"
          containerStyle={s.buttonContainer}
        />
      </ConfirmationModal>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Map"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons name="search" size={iconSize} color={iconColor} />
        )}
        onPress={() => props.navigation.navigate("MapStack")}
      />
      <DrawerItem
        label="Submit Location"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons
            name="add-location"
            size={iconSize}
            color={iconColor}
          />
        )}
        onPress={() =>
          props.navigation.navigate("Map", { screen: "SuggestLocation" })
        }
      />
      <DrawerItem
        label="Contact"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialCommunityIcons
            name="email-outline"
            size={iconSize}
            color={iconColor}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Contact" })}
      />
      <DrawerItem
        label="About"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons
            name="info-outline"
            size={iconSize}
            color={iconColor}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "About" })}
      />
      <DrawerItem
        label="Events"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons name="event-note" size={iconSize} color={iconColor} />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Events" })}
      />
      <DrawerItem
        label="FAQ"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons
            name="question-answer"
            size={iconSize}
            color={iconColor}
          />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "FAQ" })}
      />
      <DrawerItem
        label="Settings"
        labelStyle={s.labelStyle}
        icon={() => (
          <MaterialIcons name="settings" size={iconSize} color={iconColor} />
        )}
        onPress={() => props.navigation.navigate("Map", { screen: "Settings" })}
      />
      {loggedIn ? (
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            { opacity: pressed ? 0.2 : 1.0 },
            s.container,
          ]}
        >
          <Text style={s.text}>Logout</Text>
          <MaterialCommunityIcons name="exit-run" style={s.icon} />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => props.navigation.navigate("Map", { screen: "Login" })}
          style={({ pressed }) => [
            { opacity: pressed ? 0.2 : 1.0 },
            s.container,
          ]}
        >
          <Text style={s.text}>Login</Text>
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
      fontSize: 24,
      color: theme.colors.activeTab,
      position: "absolute",
      opacity: 0.9,
      paddingLeft: 15,
    },
    text: {
      color: theme.colors.activeTab,
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      position: "absolute",
      paddingLeft: 55,
      paddingRight: 120,
      top: 3,
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
    },
    labelStyle: {
      color: theme.colors.primary,
      fontFamily: "Nunito-Bold",
      fontWeight: Platform.OS === "android" ? undefined : 700,
      fontSize: 16,
    },
  });

DrawerMenu.propTypes = {
  loggedIn: PropTypes.bool,
  logout: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ loggedIn: user.loggedIn });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
