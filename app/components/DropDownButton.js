import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemeContext } from "../theme-context";
import { isThemeDark } from "../utils/themes";

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
          boxShadow: isThemeDark(theme.theme)
            ? "0 0 10 0 rgba(0, 0, 0, 0.6)"
            : "0 0 10 0 rgba(170, 170, 199, 0.3))",
        },
        containerStyle ? containerStyle : s.containerMargin,
      ]}
    />
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    dropdown: {
      backgroundColor: isThemeDark(theme.theme) ? theme.base3 : theme.base4,
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
