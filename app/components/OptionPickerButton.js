import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { ThemeContext } from "../theme-context";
import ConfirmationModal from "./ConfirmationModal";
import DropDownButton from "./DropDownButton";
import Text from "./PbmText";

const OptionPickerButton = ({
  title,
  description,
  options,
  selectedValue,
  onSelect,
  blankLabel = "None Selected",
  margin,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const [visible, setVisible] = useState(false);

  const items = [
    { value: null, label: blankLabel },
    ...options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option,
    ),
  ];

  const selectedLabel =
    items.find((item) => item.value === selectedValue)?.label ?? blankLabel;

  return (
    <>
      <DropDownButton
        title={selectedLabel}
        onPress={() => setVisible(true)}
        margin={margin}
      />
      <ConfirmationModal visible={visible} closeModal={() => setVisible(false)}>
        <View style={s.header}>
          {!!title && <Text style={s.headerTitle}>{title}</Text>}
          <MaterialCommunityIcons
            name="close-circle"
            size={35}
            onPress={() => setVisible(false)}
            style={s.xButton}
          />
        </View>
        {!!description && <Text style={s.description}>{description}</Text>}
        <View style={s.optionsList}>
          {items.map((item) => {
            const isSelected = item.value === selectedValue;
            return (
              <Pressable
                key={item.label}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
                style={({ pressed }) => [
                  s.item,
                  isSelected && s.itemSelected,
                  pressed && s.itemPressed,
                ]}
              >
                <Text
                  maxFontSizeMultiplier={1.3}
                  style={[s.itemText, isSelected && s.itemTextSelected]}
                >
                  {item.label}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={18}
                    color={theme.text2}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ConfirmationModal>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginTop: -25,
      paddingVertical: 8,
      justifyContent: "center",
    },
    headerTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-ExtraBold",
    },
    xButton: {
      position: "absolute",
      right: 3,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
    description: {
      textAlign: "center",
      marginHorizontal: 15,
      marginTop: 10,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-Regular",
    },
    optionsList: {
      marginTop: 10,
    },
    item: {
      height: 48,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    itemSelected: {
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
    },
    itemPressed: {
      opacity: 0.6,
    },
    itemText: {
      fontSize: 16,
      fontFamily: "Nunito-Medium",
      color: theme.text,
    },
    itemTextSelected: {
      fontFamily: "Nunito-Bold",
      color: theme.text2,
    },
  });

OptionPickerButton.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ]),
  ).isRequired,
  selectedValue: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  blankLabel: PropTypes.string,
  margin: PropTypes.object,
};

export default OptionPickerButton;
