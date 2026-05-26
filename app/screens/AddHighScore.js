import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  formatInputNumWithCommas,
  removeCommasFromNum,
} from "../utils/utilityFunctions";
import { addStandaloneScore } from "../actions";
import {
  BackglassImage,
  ConfirmationModal,
  DropDownButton,
  NotLoggedIn,
  PbmButton,
  Text,
  WarningButton,
} from "../components";

const deviceWidth = Dimensions.get("window").width;

const AddHighScore = ({ user }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const theme = useTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [score, setScore] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const savedTimeoutRef = useRef(null);

  const { loggedIn } = user;

  useEffect(() => () => clearTimeout(savedTimeoutRef.current), []);

  const handleSave = async () => {
    await dispatch(
      addStandaloneScore(selectedMachine.id, removeCommasFromNum(score)),
    );
    setConfirmModalVisible(false);
    setSelectedMachine(null);
    setScore("");
    clearTimeout(savedTimeoutRef.current);
    setSavedNotice(true);
    savedTimeoutRef.current = setTimeout(() => setSavedNotice(false), 2000);
  };

  const { opdb_img, opdb_img_height, opdb_img_width } = selectedMachine || {};
  const opdb_resized = opdb_img_width - (deviceWidth - 48);
  const opdb_img_height_calc =
    opdb_img_width > 0
      ? (deviceWidth - 48) * (opdb_img_height / opdb_img_width)
      : 0;
  const opdbImgHeight =
    opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
  const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      {savedNotice && (
        <View style={s.toastWrapper}>
          <View style={s.toastContainer}>
            <Text style={s.toastText}>Score saved!</Text>
          </View>
        </View>
      )}
      <ConfirmationModal
        visible={confirmModalVisible}
        closeModal={() => setConfirmModalVisible(false)}
      >
        <Text style={s.modalTitle}>
          Add score of{" "}
          <Text style={s.modalScore}>{formatInputNumWithCommas(score)}</Text> on{" "}
          <Text style={s.modalMachineName}>{selectedMachine?.name}</Text>?
        </Text>
        <PbmButton title={"Save Score"} onPress={handleSave} />
        <WarningButton
          title={"Cancel"}
          onPress={() => setConfirmModalVisible(false)}
        />
      </ConfirmationModal>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          backgroundColor: theme.base1,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {!loggedIn ? (
          <NotLoggedIn
            text={`You must be logged to add scores.`}
            onPress={() => navigation.navigate("Login")}
          />
        ) : (
          <>
            <Text style={s.description}>
              Select a machine and enter your score. The machine will be added
              to your life list.
            </Text>
            <Text style={s.description}>
              Scores entered here will not be associated with a location. If you
              want to add a score to a location-specific machine, lookup that
              location on the map.
            </Text>
            <View style={[s.section, { marginTop: 12 }]}>
              <Text style={s.sectionLabel}>Machine</Text>
              <DropDownButton
                title={
                  selectedMachine ? selectedMachine.name : "Select Machine"
                }
                onPress={() =>
                  navigation.navigate("FindMachine", {
                    onSelect: setSelectedMachine,
                  })
                }
              />
            </View>
            <View style={s.section}>
              <Text style={s.sectionLabel}>Score</Text>
              <TextInput
                style={[s.textInput, s.radius10]}
                keyboardType="numeric"
                underlineColorAndroid="transparent"
                onChangeText={(val) => setScore(formatInputNumWithCommas(val))}
                value={score}
                returnKeyType="done"
                placeholder={"123..."}
                placeholderTextColor={theme.indigo4}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {!!opdb_img && selectedMachine && (
              <View style={{ marginTop: 15 }}>
                <BackglassImage
                  width={opdbImgWidth}
                  height={opdbImgHeight}
                  source={opdb_img}
                />
              </View>
            )}
            <PbmButton
              title={"Save Score"}
              disabled={!selectedMachine || score.length === 0}
              onPress={() => setConfirmModalVisible(true)}
              margin={{ marginHorizontal: 20, marginTop: 10 }}
            />
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    description: {
      fontSize: 15,
      fontFamily: "Nunito-Regular",
      color: theme.text2,
      marginHorizontal: 15,
      marginTop: 10,
      lineHeight: 22,
    },
    section: {
      marginBottom: 10,
    },
    sectionLabel: {
      fontSize: 16,
      fontFamily: "Nunito-Bold",
      color: theme.text2,
      marginBottom: 5,
      textAlign: "center",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      height: 40,
      textAlign: "center",
      marginHorizontal: 20,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    radius10: {
      borderRadius: 10,
    },
    modalTitle: {
      textAlign: "center",
      marginBottom: 10,
      marginHorizontal: 40,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
    modalScore: {
      fontFamily: "Nunito-Bold",
    },
    modalMachineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontFamily: "Nunito-Bold",
    },
    toastWrapper: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 100,
    },
    toastContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    toastText: {
      color: "white",
      fontSize: 13,
      fontFamily: "Nunito-SemiBold",
    },
  });

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(AddHighScore);
