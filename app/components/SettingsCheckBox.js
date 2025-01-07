import { View } from "react-native";
import { Text } from "./index";
import { CheckBox } from "@rneui/themed";
import React from "react";

const CheckBoxSetting = ({
  title,
  description,
  checkTitle,
  onPress,
  checked,
  s,
}) => {
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
        containerStyle={s.checkBoxContainer}
        fontFamily="Nunito-Bold"
        textStyle={s.checkBoxTextStyle}
        checkedColor={s.checkBoxCheckedColor}
      />
      <Text style={s.text}>{description}</Text>
    </View>
  );
};

export default CheckBoxSetting;
