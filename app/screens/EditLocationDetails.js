import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
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
  Screen,
  Text,
  WarningButton,
} from "../components";
import {
  clearSelectedState,
  setSelectedOperator,
  setSelectedLocationType,
  updateLocationDetails,
} from "../actions";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

let deviceWidth = Dimensions.get("window").width;

function EditLocationDetails({
  navigation,
  route,
  setSelectedLocationType,
  setSelectedOperator,
  ...props
}) {
  const confirmEditLocationDetails = () => {
    props.updateLocationDetails(navigation.goBack, phone, website, description);
  };

  const [phone, setPhone] = useState(props.location.location.phone);
  const [website, setWebsite] = useState(props.location.location.website);
  const [description, setDescription] = useState(
    props.location.location.description,
  );

  const { operator, locationType, name, location_type_id, operator_id } =
    props.location.location;
  const { locationTypes } = props.locations;
  const { operators } = props.operators;
  const { updatingLocationDetails } = props.location.location;
  const selectedLocationType = route.params?.setSelectedLocationType;
  const selectedOperator = route.params?.setSelectedOperator;
  const locationTypeId = locationType
    ? locationType
    : selectedLocationType
    ? selectedLocationType
    : location_type_id;

  const operatorId = operator
    ? operator
    : selectedOperator
    ? selectedOperator
    : operator_id;

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
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  const [showEditLocationDetailsModal, setShowEditLocationDetailsModal] =
    useState(false);

  React.useEffect(() => {
    navigation.setOptions({ title: name });
    return () => props.clearSelectedState();
  }, []);

  React.useEffect(() => {
    if (selectedLocationType) {
      setSelectedLocationType(selectedLocationType);
    }
  }, [selectedLocationType]);

  React.useEffect(() => {
    if (selectedOperator) {
      setSelectedOperator(selectedOperator);
    }
  }, [selectedOperator]);

  const goToFindLocationType = () => {
    navigation.navigate("FindLocationType", {
      previous_screen: "EditLocationDetails",
      type: "search",
    });
  };

  const goToFindOperator = () => {
    navigation.navigate("FindOperator", {
      previous_screen: "EditLocationDetails",
      type: "search",
    });
  };

  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const s = getStyles(theme);
        return (
          <Screen keyboardShouldPersistTaps="handled" {...keyboardDismissProp}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={showEditLocationDetailsModal}
              onRequestClose={() => {}}
            >
              <SafeAreaProvider>
                <SafeAreaView style={s.background}>
                  <ScrollView style={{ backgroundColor: theme.base1 }}>
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
                </SafeAreaView>
              </SafeAreaProvider>
            </Modal>
            {updatingLocationDetails ? (
              <ActivityIndicator />
            ) : (
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                }}
              >
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                  <Text style={s.title}>Phone</Text>
                  <TextInput
                    style={[{ height: 40 }, s.textInput, s.radius10]}
                    underlineColorAndroid="transparent"
                    onChangeText={(phone) => setPhone(phone)}
                    value={phone}
                    returnKeyType="done"
                    placeholder={phone || "(503) xxx-xxxx"}
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
                    placeholder={website || "https://..."}
                    placeholderTextColor={theme.indigo4}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Text style={s.title}>Location Notes</Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={4}
                    style={[{ height: 100 }, s.textInput, s.radius10]}
                    onChangeText={(description) => setDescription(description)}
                    value={description}
                    underlineColorAndroid="transparent"
                    placeholder={description || "Location description..."}
                    placeholderTextColor={theme.indigo4}
                    textAlignVertical="top"
                  />
                  <Text style={[s.subText, s.margin8]}>
                    If this venue is{" "}
                    <Text style={{ fontFamily: "Nunito-Bold" }}>
                      closed or no longer has machines
                    </Text>
                    , simply remove the machines from the listing!
                  </Text>
                  <Text style={[s.subText, s.margin8]}>
                    If this venue has{" "}
                    <Text style={{ fontFamily: "Nunito-Bold" }}>
                      moved to a new address
                    </Text>{" "}
                    (or changed names), please{" "}
                    <Text
                      onPress={() => navigation.navigate("Contact")}
                      style={s.textLink}
                    >
                      {"contact us"}
                    </Text>
                    {` and we'll fix it `}
                    <Text
                      style={{ fontFamily: "Nunito-Bold", color: theme.pink1 }}
                    >{`(include the location name in your message)`}</Text>
                    .
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
                </View>
              </Pressable>
            )}
          </Screen>
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
      color: theme.purple,
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
      backgroundColor: theme.pink2,
    },
    pageTitleText: {
      textAlign: "center",
      fontFamily: "Nunito-Italic",
      fontSize: 18,
      color: theme.pink1,
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
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
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
      marginVertical: 8,
    },
    textLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
    },
  });

EditLocationDetails.propTypes = {
  locations: PropTypes.object,
  location: PropTypes.object,
  operators: PropTypes.object,
  updateLocationDetails: PropTypes.func,
  navigation: PropTypes.object,
  setSelectedOperator: PropTypes.func,
  setSelectedLocationType: PropTypes.func,
  clearSelectedState: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = ({ locations, location, operators }) => ({
  locations,
  location,
  operators,
});
const mapDispatchToProps = (dispatch) => ({
  updateLocationDetails: (goBack, phone, website, description) =>
    dispatch(updateLocationDetails(goBack, phone, website, description)),
  setSelectedOperator: (id) => dispatch(setSelectedOperator(id)),
  setSelectedLocationType: (id) => dispatch(setSelectedLocationType(id)),
  clearSelectedState: () => dispatch(clearSelectedState()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditLocationDetails);
