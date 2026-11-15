import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import ConfirmationModal from "./ConfirmationModal";
import { retrieveItem } from "../config/utils";
import Text from "./PbmText";

const AppAlert = ({ motd }) => {
  const [visible, setIsVisible] = useState(false);
  // Map can be mounted under another screen (deep link, cold-start restore),
  // so wait until it is actually showing
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!motd || !isFocused) return;

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
  }, [motd, isFocused]);

  return (
    <ConfirmationModal
      visible={visible}
      closeModal={() => setIsVisible(false)}
      title="Message of the Day!"
    >
      <View style={s.appAlert}>
        <Text style={{ fontSize: 16 }}>{motd}</Text>
      </View>
    </ConfirmationModal>
  );
};

AppAlert.propTypes = {
  motd: PropTypes.string,
};

const s = StyleSheet.create({
  appAlert: {
    paddingHorizontal: 10,
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
