import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ButtonGroup, Text } from "../components";
import { ThemeContext } from "../theme-context";

const ButtonGroupSetting = ({
  title,
  buttons,
  description,
  onPress,
  selectedIndex,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View style={s.container}>
      <View>
        <Text style={[s.titleText, s.bold]}>{title}</Text>
      </View>
      <ButtonGroup
        onPress={onPress}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={s.buttonGroupContainer}
        maxFontSizeMultiplier={1.3}
      />
      <Text style={[s.descriptionText, s.italic]}>{description}</Text>
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
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    container: {
      marginVertical: 15,
      marginHorizontal: 10,
    },
    titleText: {
      textAlign: "center",
      fontSize: 18,
      color: theme.text,
      marginBottom: 5,
    },
    buttonGroupContainer: {
      marginHorizontal: 0,
    },
    descriptionText: {
      fontSize: 14,
      color: theme.text2,
      lineHeight: 22,
      marginLeft: 5,
      marginRight: 15,
    },
  });

export default ButtonGroupSetting;
