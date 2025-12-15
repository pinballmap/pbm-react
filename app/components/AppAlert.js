import React, { useContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Pressable, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ConfirmationModal from "./ConfirmationModal";
import { ThemeContext } from "../theme-context";
import { retrieveItem } from "../config/utils";
import Text from "./PbmText";

const AppAlert = ({ motd }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);

  const [visible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!motd) return;

    const updateMOTD = async () => {
      // If this is the first time a user is firing up the app, do not initially show MOTD
      const auth = await retrieveItem("auth");
      if (!auth) return;

      const appAlert = await retrieveItem("appAlert");
      if (appAlert !== motd) {
        setIsVisible(true);
        AsyncStorage.setItem("appAlert", JSON.stringify(motd));
      }
    };
    updateMOTD();
  }, [motd]);

  return (
    <ConfirmationModal visible={visible} closeModal={() => setIsVisible(false)}>
      <Pressable>
        <View style={s.appAlertHeader}>
          <Text style={s.appAlertTitle}>Message of the Day!</Text>
          <MaterialCommunityIcons
            name="close-circle"
            size={35}
            onPress={() => setIsVisible(false)}
            style={s.xButton}
          />
        </View>
        <View style={s.appAlert}>
          <Text style={{ fontSize: 15 }}>{motd}</Text>
        </View>
      </Pressable>
    </ConfirmationModal>
  );
};

AppAlert.propTypes = {
  motd: PropTypes.string,
};

const getStyles = (theme) =>
  StyleSheet.create({
    appAlertTitle: {
      color: theme.purple2,
      textAlign: "center",
      fontSize: 18,
      fontFamily: "Nunito-Bold",
    },
    appAlertHeader: {
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base4,
      marginTop: -25,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingVertical: 8,
      justifyContent: "center",
      paddingHorizontal: 35,
    },
    appAlert: {
      padding: 10,
      paddingBottom: 0,
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
  });

const mapStateToProps = ({ regions }) => {
  const { regions: allRegions = [] } = regions ?? {};
  const motd = allRegions.length
    ? allRegions.filter((region) => region.id === 1)[0].motd
    : "";

  return {
    motd,
  };
};
export default connect(mapStateToProps)(AppAlert);
