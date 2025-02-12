import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { Text } from "./index";
import { Image } from "expo-image";

const moment = require("moment");

const insiderConnectedImage = {
  dark: require("../assets/images/Insider_Connected_Dark.png"),
  light: require("../assets/images/Insider_Connected_Light.png"),
};

const Title = ({ machine }) => {
  const theme = useTheme();
  const s = getStyles(theme);

  return (
    <Text>
      <Text style={s.machineName}>{machine.name}</Text>
      {machine.year ? (
        <Text style={[s.fontSize20, s.pink1, s.mediumFont]}>{` (${
          machine.manufacturer && machine.manufacturer + ", "
        }${machine.year})`}</Text>
      ) : null}
    </Text>
  );
};

const MachineCard = ({ pressed, machine, displayInsiderConnectedBadge }) => {
  const theme = useTheme();
  const s = getStyles(theme);

  return (
    <View>
      <View
        style={[
          s.machineListContainer,
          pressed ? s.pressed : s.notPressed,
          { flexDirection: "row" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Title machine={machine} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <MaterialCommunityIcons
              name={
                machine.created_at !== machine.updated_at
                  ? "clock-time-four-outline"
                  : "clock-time-three-outline"
              }
              style={s.metaIcon}
            />
            <Text style={s.updated}>
              {machine.created_at !== machine.updated_at
                ? `Updated: ${moment(machine.updated_at).format("MMM DD, YYYY")}`
                : `Added: ${moment(machine.created_at).format("MMM DD, YYYY")}`}
            </Text>
          </View>
        </View>
        {displayInsiderConnectedBadge && machine.ic_enabled && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Image
              source={
                theme.theme === "dark"
                  ? insiderConnectedImage.dark
                  : insiderConnectedImage.light
              }
              style={{
                width: 55,
                height: 55,
                transform: [{ translateX: 10 }],
              }}
              contentFit="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    pressed: {
      borderColor: theme.pink2,
      borderWidth: 2,
      boxShadow: null,
      opacity: 0.8,
    },
    notPressed: {
      borderColor: "transparent",
      borderWidth: 2,
      opacity: 1.0,
    },
    machineName: {
      color: theme.theme == "dark" ? theme.text : theme.purple,
      fontFamily: "Nunito-ExtraBold",
      fontSize: 20,
    },
    fontSize20: {
      fontSize: 20,
    },
    mediumFont: {
      fontFamily: "Nunito-Medium",
    },
    pink1: {
      color: theme.theme === "dark" ? theme.pink1 : theme.text3,
      fontFamily: "Nunito-Regular",
    },
    updated: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    machineListContainer: {
      borderRadius: 25,
      marginBottom: 20,
      marginRight: 20,
      marginLeft: 20,
      backgroundColor: theme.white,
      boxShadow:
        theme.theme == "dark"
          ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
          : "0 0 10 0 rgba(170, 170, 199, 0.3)",
      paddingVertical: 10,
      paddingLeft: 15,
      paddingRight: 15,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
    },
  });

export default MachineCard;
