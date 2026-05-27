import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";

type ButtonComponent = React.ReactElement;
type ButtonObject = {
  element: React.ElementType<any & { isSelected?: boolean }>;
};

const ButtonGroup = ({ onPress, buttons, selectedIndex, containerStyle, innerBorderStyle, textStyle, selectedTextStyle, selectedButtonStyle }) => {
  return (
    <View
      style={StyleSheet.flatten([
        s.container,
        containerStyle && containerStyle,
      ])}
    >
      {buttons?.map((button, i) => {
        const isSelected = selectedIndex === i;
        return (
          <View
            key={i}
            style={StyleSheet.flatten([
              s.button,
              i !== buttons.length - 1 &&
                {
                    borderRightColor:
                    (innerBorderStyle && innerBorderStyle.color),
                },
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
                  s.textContainer,
                  isSelected && selectedButtonStyle && selectedButtonStyle,
                ])}
              >
                <Text
                  style={StyleSheet.flatten([
                    {
                      fontSize: 13,
                    },
                    textStyle && textStyle,
                    isSelected && selectedTextStyle && selectedTextStyle,
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

const s = StyleSheet.create({
  button: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: '#e3e3e3',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: '#fff',
    height: 40,
  },
});

export default ButtonGroup;
