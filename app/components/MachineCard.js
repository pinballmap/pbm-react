import React from "react";
import { View, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { Text } from "./index";
const moment = require("moment");

// TODO: pull from settings after adding setting option
const showInsiderConnectedBadge = true;

const insiderConnectedImage = {
  dark: require("../assets/images/Insider_Connected_Vertical_RED_and_WHT_300_dpi.png"),
  light: require("../assets/images/Insider_Connected_Vertical_standard_300_dpi.png"),
};

const Title = ({ machine, s }) => (
  <Text>
    <Text style={s.machineName}>{machine.name}</Text>
    {machine.year ? (
      <Text style={[s.fontSize20, s.pink1, s.mediumFont]}>{` (${
        machine.manufacturer && machine.manufacturer + ", "
      }${machine.year})`}</Text>
    ) : null}
  </Text>
);

const MachineCard = ({ pressed, machine, s }) => {
  const theme = useTheme();

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
          <Title machine={machine} s={s} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
            }}
          >
            <MaterialCommunityIcons
              name={
                machine.created_at != machine.updated_at
                  ? "clock-time-four-outline"
                  : "clock-time-three-outline"
              }
              style={s.metaIcon}
            />
            <Text style={s.updated}>
              {machine.created_at != machine.updated_at
                ? `Updated: ${moment(machine.updated_at).format("MMM DD, YYYY")}`
                : `Added: ${moment(machine.created_at).format("MMM DD, YYYY")}`}
            </Text>
          </View>
        </View>
        {showInsiderConnectedBadge && machine.ic_enabled && (
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
                width: 50,
                height: 50,
                // Translation account for the space on the right and small TM so the card feels balanced
                transform: [{ translateX: 10 }],
              }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default MachineCard;
