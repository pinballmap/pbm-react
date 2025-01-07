import { View } from "react-native";
import { Text } from "./index";
import { Switch } from "@rneui/themed";
import React from "react";

const SwitchSetting = ({ title, description, value, onValueChange, s }) => {
  return (
    <View>
      <View style={[s.pageTitle, { marginBottom: 4 }]}>
        <Text style={s.pageTitleText}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: -8,
        }}
      >
        <Text style={[s.text, { flex: 1 }]}>{description}</Text>
        <Switch
          value={value}
          onValueChange={() => {
            // Sends the new checked value
            return onValueChange(!value);
          }}
          trackColor={s.switchTrackColor}
          thumbColor={
            value ? s.switchThumbColors.true : s.switchThumbColors.false
          }
        />
      </View>
    </View>
  );
};

export default SwitchSetting;
