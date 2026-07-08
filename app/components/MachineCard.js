import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
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
      <Text style={s.machineName}>{machine.name}</Text>
      {machine.year ? (
        <Text style={[s.fontSize20, s.pink1, s.mediumFont]}>{` (${
          machine.manufacturer && machine.manufacturer + ", "
        }${machine.year})`}</Text>
      ) : null}
    </Text>
  );
};

const MachineCard = ({
  highlightProgress,
  machine,
  displayInsiderConnectedBadge,
  lifeListIconTapGesture,
}) => {
  const theme = useTheme();
  const s = getStyles(theme);

  const animatedHighlightStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      highlightProgress.value,
      [0, 1],
      [theme.white, theme.pink2],
    ),
  }));

  return (
    <Animated.View style={[s.machineListContainer, animatedHighlightStyle]}>
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
            <GestureDetector gesture={lifeListIconTapGesture}>
              <View style={s.lifeListIconWrap}>
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  style={s.lifeListIcon}
                />
              </View>
            </GestureDetector>
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
    </Animated.View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
    },
    updated: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    machineListContainer: {
      flexDirection: "row",
      borderRadius: 25,
      backgroundColor: theme.white,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
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
