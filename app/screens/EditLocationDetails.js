import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import {
  ActivityIndicator,
  DropDownButton,
  PbmButton,
  Text,
  WarningButton,
} from "../components";
import {
  clearSelectedState,
  setSelectedOperator,
  setSelectedLocationType,
  updateLocationDetails,
} from "../actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isThemeDark } from "../utils/themes";

let deviceWidth = Dimensions.get("window").width;

function EditLocationDetails({ navigation, ...props }) {
  const dispatch = useDispatch();
  const confirmEditLocationDetails = () => {
    dispatch(
      updateLocationDetails(navigation.goBack, phone, website, description),
    );
  };

  const [phone, setPhone] = useState(props.location.location.phone);
  const [website, setWebsite] = useState(props.location.location.website);
  const [description, setDescription] = useState(
    props.location.location.description,
  );

  const { locationType, operator, location } = props.location;
  const { name, location_type_id, operator_id } = location;

  const { locationTypes } = props.locations;
  const { operators } = props.operators;
  const { updatingLocationDetails } = props.location.location;
  const insets = useSafeAreaInsets();
  const machineNameMargin =
    Platform.OS === "android"
      ? insets.top - (PixelRatio.getFontScale() - 1) * 10 + 6
      : insets.top - (PixelRatio.getFontScale() - 1) * 10 + 1;
  const locationTypeId = locationType ? locationType : location_type_id;
  const operatorId = operator ? operator : operator_id;

  const locationTypeObj =
    locationTypes.find((type) => type.id === locationTypeId) || {};
  const {
    name: locationTypeName = locationTypeId === -1
      ? "N/A"
      : "Select location type",
  } = locationTypeObj;

  const operatorObj = operators.find((op) => op.id === operatorId) || {};
  const { name: operatorName = operator === -1 ? "N/A" : "Select operator" } =
    operatorObj;

  const [showEditLocationDetailsModal, setShowEditLocationDetailsModal] =
    useState(false);

  useEffect(() => {
    navigation.setOptions({ title: name });
    return () => dispatch(clearSelectedState());
  }, []);

  const goToFindLocationType = () => {
    navigation.navigate("FindLocationType", {
      onGoBack: (id) => dispatch(setSelectedLocationType(id)),
    });
  };

  const goToFindOperator = () => {
    navigation.navigate("FindOperator", {
      onGoBack: (id) => dispatch(setSelectedOperator(id)),
    });
  };

  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const s = getStyles(theme);
        return (
          <View style={{ flex: 1, backgroundColor: theme.base1 }}>
            <ScrollView
              contentContainerStyle={{
                flex: 1,
                backgroundColor: theme.base1,
                paddingBottom: 30,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Modal
                animationType="slide"
                transparent={false}
                visible={showEditLocationDetailsModal}
                onRequestClose={() => {}}
              >
                <View style={{ flex: 1, backgroundColor: theme.base1 }}>
                  <ScrollView
                    contentContainerStyle={{
                      backgroundColor: theme.base1,
                      paddingBottom: 30,
                      paddingTop: machineNameMargin,
                    }}
                  >
                    <View style={s.pageTitle}>
                      <Text style={s.pageTitleText}>
                        Please review your edits
                      </Text>
                    </View>
                    <View style={s.previewContainer}>
                      <Text style={s.previewTitle}>Phone</Text>
                      <Text style={s.preview}>{phone}</Text>
                    </View>
                    <View style={s.previewContainer}>
                      <Text style={s.previewTitle}>Website</Text>
                      <Text style={s.preview}>{website}</Text>
                    </View>
                    <View style={s.previewContainer}>
                      <Text style={s.previewTitle}>Location Notes</Text>
                      <Text style={s.preview}>{description}</Text>
                    </View>
                    <View style={s.previewContainer}>
                      <Text style={s.previewTitle}>Location Type</Text>
                      <Text style={s.preview}>
                        {typeof locationTypeId === "number" &&
                        locationTypeId > -1
                          ? locationTypes
                              .filter((type) => type.id === locationTypeId)
                              .map((type) => type.name)
                          : "None Selected"}
                      </Text>
                    </View>
                    <View style={s.previewContainer}>
                      <Text style={s.previewTitle}>Operator</Text>
                      <Text style={s.preview}>
                        {typeof operatorId === "number" && operatorId > -1
                          ? operators
                              .filter((op) => op.id === operatorId)
                              .map((operator) => operator.name)
                          : "None Selected"}
                      </Text>
                    </View>
                    <PbmButton
                      title={"Confirm Location Details"}
                      onPress={() => confirmEditLocationDetails()}
                    />
                    <WarningButton
                      title={"Cancel"}
                      onPress={() => setShowEditLocationDetailsModal(false)}
                    />
                  </ScrollView>
                </View>
              </Modal>
              {updatingLocationDetails ? (
                <ActivityIndicator />
              ) : (
                <ScrollView>
                  <Text style={[s.subText, s.margin8]}>
                    {`Does the location have a new name or address?`}
                    <Text
                      onPress={() =>
                        navigation.navigate("Contact", { locationName: name })
                      }
                      style={[s.textLink, { fontFamily: "Nunito-Bold" }]}
                    >
                      {"Contact us"}
                    </Text>
                    {` with the details!`}
                  </Text>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={50}
                  >
                    <Text style={s.title}>Phone</Text>
                    <TextInput
                      style={[{ height: 40 }, s.textInput, s.radius10]}
                      underlineColorAndroid="transparent"
                      onChangeText={(phone) => setPhone(phone)}
                      value={phone}
                      returnKeyType="done"
                      placeholder={"(503) xxx-xxxx"}
                      placeholderTextColor={theme.indigo4}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Text style={s.title}>Website</Text>
                    <TextInput
                      style={[{ height: 40 }, s.textInput, s.radius10]}
                      underlineColorAndroid="transparent"
                      onChangeText={(website) => setWebsite(website)}
                      value={website}
                      returnKeyType="done"
                      placeholder={"https://..."}
                      placeholderTextColor={theme.indigo4}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Text style={s.title}>Location Notes</Text>
                    <TextInput
                      multiline={true}
                      style={[{ height: 100 }, s.textInput, s.radius10]}
                      onChangeText={(description) =>
                        setDescription(description)
                      }
                      value={description}
                      underlineColorAndroid="transparent"
                      placeholder={
                        "Hours; what type of payment system(s) they use (door fee, cash, cards)"
                      }
                      placeholderTextColor={theme.indigo4}
                      textAlignVertical="top"
                    />
                  </KeyboardAvoidingView>
                  <Text style={[s.subText, s.margin8]}>
                    Is this location{" "}
                    <Text style={{ fontFamily: "Nunito-Bold" }}>
                      closed or are all the machines gone
                    </Text>
                    ? Simply remove the machines!
                  </Text>

                  <Text style={s.title}>Location Type</Text>
                  <DropDownButton
                    title={locationTypeName}
                    containerStyle={[s.containerStyle]}
                    onPress={() => goToFindLocationType()}
                  />
                  <Text style={s.title}>Operator</Text>
                  <DropDownButton
                    title={operatorName}
                    containerStyle={[{ marginBottom: 10 }, s.containerStyle]}
                    onPress={() => goToFindOperator()}
                  />
                  <PbmButton
                    title={"Review Location Details"}
                    onPress={() => setShowEditLocationDetailsModal(true)}
                  />
                </ScrollView>
              )}
            </ScrollView>
          </View>
        );
      }}
    </ThemeContext.Consumer>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    previewContainer: {
      flexDirection: "row",
      width: "100%",
      marginVertical: 10,
      alignItems: "center",
      flexWrap: "wrap",
    },
    previewTitle: {
      marginLeft: 25,
      textAlign: "left",
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      width: 80,
      color: theme.purpleLight,
    },
    preview: {
      fontSize: 15,
      marginRight: 25,
      textAlign: "center",
      width: deviceWidth - 130,
      fontFamily: "Nunito-Regular",
    },
    pageTitle: {
      paddingVertical: 10,
      backgroundColor: theme.base4,
    },
    pageTitleText: {
      textAlign: "center",
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
      fontSize: 18,
      color: theme.purpleLight,
    },
    title: {
      textAlign: "center",
      marginBottom: 5,
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Nunito-Bold",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: isThemeDark(theme.theme) ? theme.base4 : theme.indigo4,
      color: theme.text,
      borderWidth: 1,
      marginHorizontal: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    radius10: {
      borderRadius: 10,
    },
    hr: {
      marginLeft: 25,
      marginRight: 25,
      height: 2,
      marginTop: 10,
      backgroundColor: theme.indigo4,
    },
    containerStyle: {
      marginTop: 0,
      marginHorizontal: 20,
    },
    subText: {
      marginHorizontal: 30,
      fontSize: 14,
      fontFamily: "Nunito-Medium",
    },
    purple: {
      color: theme.purple,
    },
    margin8: {
      marginTop: 8,
    },
    textLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
    },
  });

const mapStateToProps = ({ locations, location, operators }) => ({
  locations,
  location,
  operators,
});
export default connect(mapStateToProps)(EditLocationDetails);
