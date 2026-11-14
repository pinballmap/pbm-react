import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { useTheme } from "@react-navigation/native";
import { Text } from "./index";
import { Image } from "expo-image";

import { formatDate } from "../utils/dateUtils";

const insiderConnectedImage = {
  dark: require("../assets/images/Insider_Connected_Dark.png"),
  light: require("../assets/images/Insider_Connected_Light.png"),
};

const Title = ({ machine }) => {
  const theme = useTheme();
  const s = getStyles(theme);

  return (
    <Text style={s.fontSize20}>
      <Text style={[s.machineName, s.extraBold]}>{machine.name}</Text>
      {machine.year ? (
        <Text style={[s.fontSize20, s.pink1, s.medium]}>{` (${
          machine.manufacturer && machine.manufacturer + ", "
        }${machine.year})`}</Text>
      ) : null}
    </Text>
  );
};

const MachineCard = ({
  pressed,
  machine,
  displayInsiderConnectedBadge,
  onLifeListIconPress,
}) => {
  const theme = useTheme();
  const s = getStyles(theme);

  return (
    <View style={[s.machineListContainer, pressed && s.pressed]}>
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
          <Text style={[s.updated, s.italic]}>
            {machine.created_at !== machine.updated_at
              ? `Updated: ${formatDate(machine.updated_at)}`
              : `Added: ${formatDate(machine.created_at)}`}
          </Text>
        </View>
      </View>
      {(machine.in_life_list ||
        (displayInsiderConnectedBadge && machine.ic_enabled)) && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {machine.in_life_list && (
            <Pressable
              hitSlop={10}
              onPress={onLifeListIconPress}
              style={s.lifeListIconWrap}
            >
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                style={s.lifeListIcon}
              />
            </Pressable>
          )}
          {displayInsiderConnectedBadge && machine.ic_enabled && (
            <Image
              source={
                theme.theme === "dark"
                  ? insiderConnectedImage.dark
                  : insiderConnectedImage.light
              }
              style={{
                width: 55,
                height: 55,
                marginLeft: -8,
                transform: [{ translateX: 10 }],
              }}
              contentFit="contain"
            />
          )}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    italic: {
      fontFamily: "Nunito",
      fontWeight: "400",
      fontStyle: "italic",
    },
    medium: {
      fontFamily: "Nunito",
      fontWeight: "500",
    },
    extraBold: {
      fontFamily: "Nunito",
      fontWeight: "800",
    },
    machineName: {
      color: theme.theme == "dark" ? theme.text : theme.purple,
      fontSize: 20,
    },
    fontSize20: {
      fontSize: 20,
    },
    pink1: {
      color: theme.theme === "dark" ? theme.pink1 : theme.text3,
    },
    updated: {
      fontSize: 14,
      color: theme.timestamp,
      flex: 1,
    },
    machineListContainer: {
      flexDirection: "row",
      borderRadius: 25,
      marginBottom: 20,
      marginHorizontal: 20,
      backgroundColor: theme.white,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    pressed: {
      backgroundColor: theme.pink2,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: "#9582b5",
      marginRight: 5,
      opacity: 0.6,
    },
    lifeListIconWrap: {
      padding: 4,
    },
    lifeListIcon: {
      fontSize: 22,
      color: theme.theme === "dark" ? theme.pink1 : theme.pink3,
    },
  });

export default MachineCard;
