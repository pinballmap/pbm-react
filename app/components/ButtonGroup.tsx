import React from "react";
import {
  View,
  Platform,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";

type ButtonComponent = React.ReactElement;
type ButtonObject = {
  element: React.ElementType<any & { isSelected?: boolean }>;
};

const ButtonGroupCustom = ({ onPress, buttons, selectedIndex, containerStyle, innerBorderStyle, textStyle, selectedTextStyle, selectedButtonStyle }) => {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        containerStyle && containerStyle,
      ])}
    >
      {buttons?.map((button, i) => {
        const isSelected = selectedIndex === i;
        return (
          <View
            key={i}
            style={StyleSheet.flatten([
              styles.button,
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
              style={styles.button}
            >
              <View
                style={StyleSheet.flatten([
                  styles.textContainer,
                  isSelected && selectedButtonStyle && selectedButtonStyle,
                ])}
              >
                {hasElementKey(button) ? (
                  <button.element isSelected={isSelected} />
                ) : (
                  <Text
                    style={StyleSheet.flatten([
                      {
                        fontSize: 13,
                        ...Platform.select({
                          android: {},
                          default: {
                            fontWeight: '500',
                          },
                        }),
                      },
                      textStyle && textStyle,
                    ])}
                  >
                    {button}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
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

const hasElementKey = (
  button: string | ButtonComponent | ButtonObject
): button is ButtonObject => {
  return (
    typeof button === 'object' && Boolean((button as ButtonObject).element)
  );
};

export default ButtonGroupCustom;
