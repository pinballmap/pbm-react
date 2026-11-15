import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Pressable, StyleSheet } from "react-native";
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
      <ConfirmationModal
        visible={visible}
        closeModal={() => setVisible(false)}
        title={title}
      >
        {!!description && (
          <Text style={[s.description, s.regular]}>{description}</Text>
        )}
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
                style={[
                  s.itemText,
                  s.medium,
                  isSelected && s.itemTextSelected,
                  isSelected && s.bold,
                ]}
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
      </ConfirmationModal>
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Nunito",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    description: {
      textAlign: "center",
      marginHorizontal: 15,
      marginBottom: 10,
      fontSize: 14,
      color: theme.text3,
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
      color: theme.text,
    },
    itemTextSelected: {
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
