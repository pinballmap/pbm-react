import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
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
  const route = useRoute();
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

  useEffect(() => {
    if (route.params?.selectedMachine) {
      setSelectedMachine(route.params.selectedMachine);
      navigation.setParams({ selectedMachine: undefined });
    }
  }, [route.params?.selectedMachine, navigation]);

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
            <Text style={[s.toastText, s.semiBold]}>Score saved!</Text>
          </View>
        </View>
      )}
      <ConfirmationModal
        visible={confirmModalVisible}
        closeModal={() => setConfirmModalVisible(false)}
      >
        <Text style={[s.modalTitle, s.regular]}>
          Add score of{" "}
          <Text style={s.bold}>{formatInputNumWithCommas(score)}</Text> on{" "}
          <Text style={[s.modalMachineName, s.bold]}>
            {selectedMachine?.name}
          </Text>
          ?
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
            <Text style={[s.description, s.regular]}>
              Select a machine and enter your score. The machine will be added
              to your life list.
            </Text>
            <Text style={[s.description, s.regular]}>
              Scores entered here will not be associated with a location. If you
              want to add a score to a location-specific machine, lookup that
              location on the map.
            </Text>
            <View style={[s.section, { marginTop: 12 }]}>
              <Text style={[s.sectionLabel, s.bold]}>Machine</Text>
              <DropDownButton
                title={
                  selectedMachine ? selectedMachine.name : "Select Machine"
                }
                onPress={() =>
                  navigation.navigate("FindMachine", {
                    standaloneScore: true,
                  })
                }
              />
            </View>
            <View style={s.section}>
              <Text style={[s.sectionLabel, s.bold]}>Score</Text>
              <TextInput
                style={[s.textInput, s.regular, s.radius10]}
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
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    semiBold: {
      fontFamily: "Nunito",
      fontWeight: "600",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    description: {
      fontSize: 16,
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
      color: theme.text2,
      marginBottom: 5,
      textAlign: "center",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      textAlign: "center",
      marginHorizontal: 20,
      fontSize: 16,
      padding: 10,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    radius10: {
      borderRadius: 10,
    },
    modalTitle: {
      textAlign: "center",
      marginBottom: 10,
      marginHorizontal: 40,
      fontSize: 18,
    },
    modalMachineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
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
    },
  });

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(AddHighScore);
