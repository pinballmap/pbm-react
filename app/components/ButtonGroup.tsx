import React, { useContext } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";
import { ThemeContext } from "../theme-context";

let deviceWidth = Dimensions.get("window").width;

type ButtonComponent = React.ReactElement;
type ButtonObject = {
  element: React.ElementType<any & { isSelected?: boolean }>;
};

const ButtonGroup = ({ onPress, buttons, selectedIndex, containerStyle, innerBorderStyle, textStyle, selectedTextStyle, selectedButtonStyle, maxFontSizeMultiplier }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <View
      style={StyleSheet.flatten([
        s.buttonGroupContainer,
        containerStyle && containerStyle,
      ])}
    >
      {buttons?.map((button, i) => {
        const isSelected = selectedIndex === i;
        return (
          <View
            key={i}
            style={StyleSheet.flatten([
              s.button
            ])}
          >
            <Pressable
              onPress={() => {
                  onPress(i);
              }}
              style={s.button}
            >
              <View
                style={StyleSheet.flatten([
                  s.buttonGroupTextContainer,
                  isSelected && s.buttonGroupViewSelected,
                  isSelected && selectedButtonStyle,
                ])}
              >
                <Text
                  maxFontSizeMultiplier={maxFontSizeMultiplier ? maxFontSizeMultiplier : 1.5}
                  style={StyleSheet.flatten([
                    s.buttonGroupTextInactive,
                    s.semiBold,
                    textStyle && textStyle,
                    isSelected && s.buttonGroupTextSelected,
                    isSelected && s.bold,
                    isSelected && selectedTextStyle,
                  ])}
                >
                  {button}
                </Text>
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    button: {
      flex: 1,
    },
    buttonGroupTextContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonGroupContainer: {
      marginHorizontal: 10,
      marginBottom: 5,
      flexDirection: 'row',
      overflow: 'hidden',
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
    buttonGroupTextInactive: {
      color: theme.text2,
      fontSize: deviceWidth < 321 ? 12 : 14,
    },
    buttonGroupViewSelected: {
      borderWidth: 2,
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
            paddingVertical: 10

    },
    buttonGroupTextSelected: {
      color: theme.text2,
    },
  });

export default ButtonGroup;
