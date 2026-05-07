import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Keyboard,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { ThemeContext } from "../theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ConfirmationModal,
  PbmButton,
  Text,
  WarningButton,
} from "../components";
import { flagGroups } from "../utils/flags";
import flagImages, { getFlagWidth } from "../utils/flagImages";
import { postData } from "../config/request";

const FindFlag = ({ navigation, route, user }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { userId } = route.params;

  const [query, setQuery] = useState("");
  const [pendingFlag, setPendingFlag] = useState(null);
  const [saving, setSaving] = useState(false);

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();

  const sections = flagGroups
    .map((group) => ({
      ...group,
      data: query
        ? group.data.filter((f) => normalize(f.name).includes(normalize(query)))
        : group.data,
    }))
    .filter((group) => group.data.length > 0);

  const handleSearch = (text) => setQuery(text);

  const selectFlag = (flag) => {
    Keyboard.dismiss();
    setPendingFlag(flag);
  };

  const confirmFlag = async () => {
    setSaving(true);
    try {
      await postData(`/users/${userId}/update_user_flag.json`, {
        user_email: user.email,
        user_token: user.authentication_token,
        flag: pendingFlag.code,
      });
      navigation.navigate("UserProfileStack");
    } catch {
      setSaving(false);
      setPendingFlag(null);
    }
  };

  const renderRow = ({ item, index }) => (
    <Pressable onPress={() => selectFlag(item)}>
      {({ pressed }) => (
        <View
          style={[
            s.row,
            pressed
              ? { backgroundColor: theme.base4, opacity: 0.8 }
              : {
                  backgroundColor: index % 2 === 0 ? theme.base1 : theme.base2,
                },
          ]}
        >
          <Image
            source={flagImages[item.code]}
            style={s.rowFlag}
            contentFit="cover"
          />
          <Text style={s.rowName}>{item.name}</Text>
        </View>
      )}
    </Pressable>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={s.sectionHeader}>
      <Text style={s.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  return (
    <>
      <ConfirmationModal
        visible={!!pendingFlag}
        closeModal={() => setPendingFlag(null)}
        loading={saving}
      >
        {pendingFlag && (
          <>
            <Image
              source={flagImages[pendingFlag.code]}
              style={[
                s.confirmFlag,
                { width: getFlagWidth(pendingFlag.code, 40) },
              ]}
            />
            <Text style={s.confirmName}>{pendingFlag.name}</Text>
            <PbmButton title="Select this flag" onPress={confirmFlag} />
            <WarningButton
              title="Cancel"
              onPress={() => setPendingFlag(null)}
            />
          </>
        )}
      </ConfirmationModal>
      <View style={s.searchRow}>
        <View style={s.inputContainer}>
          <MaterialIcons
            name="search"
            size={25}
            color={theme.indigo4}
            style={{ marginLeft: 10, marginRight: 0 }}
          />
          <TextInput
            placeholder="Filter flags..."
            placeholderTextColor={theme.indigo4}
            onChangeText={handleSearch}
            value={query}
            style={s.inputStyle}
            autoCorrect={false}
          />
        </View>
        {query.length > 0 && (
          <Pressable onPress={() => handleSearch("")} style={{ height: 20 }}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={theme.purple}
              style={{ position: "absolute", right: 30 }}
            />
          </Pressable>
        )}
      </View>
      <SectionList
        {...keyboardDismissProp}
        sections={sections}
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.code}
        contentContainerStyle={{
          backgroundColor: theme.base1,
          paddingBottom: insets.bottom,
        }}
      />
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    searchRow: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: 40,
      marginBottom: 10,
    },
    inputContainer: {
      borderWidth: 1,
      backgroundColor: theme.white,
      borderRadius: 25,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      height: 40,
      display: "flex",
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 0,
      marginHorizontal: 20,
    },
    inputStyle: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 65,
      height: 40,
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
    sectionHeader: {
      backgroundColor: theme.base3,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
    sectionHeaderText: {
      fontSize: 12,
      fontFamily: "Nunito-Bold",
      color: theme.text3,
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    rowFlag: {
      width: 30,
      height: 22,
      marginRight: 12,
      borderRadius: 3,
    },
    rowName: {
      fontSize: 18,
      fontFamily: "Nunito-Regular",
      color: theme.text,
      flex: 1,
    },
    confirmFlag: {
      height: 40,
      alignSelf: "center",
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 8,
    },
    confirmName: {
      fontSize: 18,
      fontFamily: "Nunito-Bold",
      color: theme.text,
      textAlign: "center",
      marginBottom: 16,
      paddingHorizontal: 20,
    },
  });

FindFlag.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(FindFlag);
