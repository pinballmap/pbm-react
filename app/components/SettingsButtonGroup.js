import React from "react";
import { View } from "react-native";
import { ButtonGroup } from "@rneui/base";
import { Text } from "../components";

const ButtonGroupSetting = ({
  title,
  buttons,
  description,
  onPress,
  selectedIndex,
  s,
}) => {
  return (
    <View>
      <View style={s.pageTitle}>
        <Text style={s.pageTitleText}>{title}</Text>
      </View>
      <ButtonGroup
        onPress={onPress}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={s.buttonGroupContainer}
        textStyle={s.buttonGroupInactive}
        selectedButtonStyle={s.selButtonStyle}
        selectedTextStyle={s.selTextStyle}
        innerBorderStyle={s.innerBorderStyle}
      />
      <Text style={s.text}>{description}</Text>
    </View>
  );
};

export default ButtonGroupSetting;
