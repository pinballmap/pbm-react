import { View } from "react-native";
import { Text } from "./index";
import { CheckBox } from "@rneui/themed";
import React, { useContext } from "react";
import { ThemeContext } from "../theme-context";

const CheckBoxSetting = ({
  title,
  description,
  checkTitle,
  onPress,
  checked,
  s,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View>
      <View style={[s.pageTitle, { marginBottom: 4 }]}>
        <Text style={s.pageTitleText}>{title}</Text>
      </View>
      <CheckBox
        checked={checked}
        title={checkTitle}
        onPress={() => {
          // Sends the new checked value
          return onPress(!checked);
        }}
        containerStyle={{ backgroundColor: theme.base1, marginVertical: -8 }}
        fontFamily="Nunito-Bold"
        textStyle={{ fontSize: 16, color: theme.text }}
        checkedColor={theme.purple}
      />
      <Text style={s.text}>{description}</Text>
    </View>
  );
};

export default CheckBoxSetting;
