import { View } from "react-native";
import { Text } from "./index";
import { Switch } from "@rneui/themed";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const SwitchSetting = ({ title, description, value, onValueChange, s }) => {
  const { theme } = useContext(ThemeContext);

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
          trackColor={{
            false: theme.base3,
            true: theme.purple,
          }}
          thumbColor={value ? theme.base1 : theme.white}
        />
      </View>
    </View>
  );
};

export default SwitchSetting;
