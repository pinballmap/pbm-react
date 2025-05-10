import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../theme-context";

const DropDownButton = ({ title, onPress, containerStyle }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  return (
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={s.dropdown}
      titleStyle={s.titleStyle}
      uppercase={false}
      icon={<MaterialIcons name="arrow-drop-down" style={s.dropdownIcon} />}
      iconPosition="right"
      containerStyle={[
        {
          overflow: "visible",
          borderRadius: 25,
          backgroundColor: theme.base1,
          shadowColor:
            theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
        containerStyle ? containerStyle : s.containerMargin,
      ]}
    />
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    dropdown: {
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      width: "100%",
      borderRadius: 25,
    },
    containerMargin: {
      marginTop: 5,
      marginHorizontal: 10,
    },
    dropdownIcon: {
      color: theme.text3,
      fontSize: 24,
      marginLeft: 5,
    },
    titleStyle: {
      color: theme.text3,
      fontSize: 16,
      fontFamily: "Nunito-Regular",
    },
  });

DropDownButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  icon: PropTypes.node,
  disabled: PropTypes.bool,
  containerStyle: PropTypes.array,
};

export default DropDownButton;
