import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon, ListItem } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  ActivityIndicator,
  DropDownButton,
  NotLoggedIn,
  PbmButton,
  WarningButton,
  Text,
} from "../components";
import {
  clearSelectedState,
  removeMachineFromList,
  setSelectedLocationType,
  setSelectedOperator,
  suggestLocation,
  resetSuggestLocation,
} from "../actions";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

let deviceWidth = Dimensions.get("window").width;

function SuggestLocation({
  navigation,
  route,
  setSelectedLocationType,
  setSelectedOperator,
  suggestLocation,
  resetSuggestLocation,
  location,
  removeMachineFromList,
  ...props
}) {
  const autoCompleteRef = useRef();
  const [locationName, setLocationName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [showSuggestLocationModal, setShowSuggestLocationModal] =
    useState(false);
  const [countryName, setCountryName] = useState("United States");
  const [countryCode, setCountryCode] = useState("US");

  useEffect(() => {
    if (route.params?.countryCode) {
      setCountryCode(route.params?.countryCode);
    }
    if (route.params?.countryName) {
      setCountryName(route.params?.countryName);
    }
  }, [route.params?.countryCode, route.params?.countryName]);

  const confirmSuggestLocationDetails = () => {
    const locationDetails = {
      locationName,
      street,
      city,
      state,
      zip,
      country: countryCode,
      phone,
      website,
      description,
    };
    suggestLocation(locationDetails);
  };

  const getDisplayText = (machine) => (
    <Text style={{ fontSize: 16 }}>
      <Text style={{ fontFamily: "Nunito-Bold" }}>{machine.name}</Text>
      <Text>{` (${machine.manufacturer}, ${machine.year})`}</Text>
    </Text>
  );

  const { navigate } = navigation;
  const { loggedIn } = props.user;
  const { locationTypes } = props.locations;
  const { operators } = props.operators;

  const {
    isSuggestingLocation,
    locationSuggested,
    machineList = [],
    operator,
    locationType,
  } = location;

  const locationTypeObj =
    locationTypes.find((type) => type.id === locationType) || {};
  const { name: locationTypeName = "Select location type" } = locationTypeObj;

  const operatorObj = operators.find((op) => op.id === operator) || {};
  const { name: operatorName = "Select operator" } = operatorObj;

  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  useEffect(() => {
    if (route.params?.setSelectedLocationType) {
      setSelectedLocationType(route.params?.setSelectedLocationType);
    }
  }, [route.params?.setSelectedLocationType]);

  useEffect(() => {
    if (route.params?.setSelectedOperator) {
      setSelectedOperator(route.params?.setSelectedOperator);
    }
  }, [route.params?.setSelectedOperator]);

  useEffect(() => {
    return () => props.clearSelectedState();
  }, []);

  const goToFindLocationType = () => {
    navigation.navigate("FindLocationType", {
      type: "search",
      previous_screen: "SuggestLocation",
    });
  };

  const goToFindOperator = () => {
    navigation.navigate("FindOperator", {
      type: "search",
      previous_screen: "SuggestLocation",
    });
  };

  const goToFindCountry = () => {
    navigation.navigate("FindCountry", {
      type: "search",
      previous_screen: "SuggestLocation",
    });
  };

  const setLocation = (details) => {
    setPhone(details.formatted_phone_number);
    setWebsite(details.website);
    setLocationName(details.name);
    autoCompleteRef.current.setAddressText(details.name);
    let streetNum = "";
    let locationStreet = "";
    Object.values(details.address_components).map((component) => {
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          streetNum = component.long_name;
          break;
        }
        case "route": {
          locationStreet = component.short_name;
          break;
        }
        case "locality": {
          setCity(component.long_name);
          break;
        }
        case "administrative_area_level_1": {
          setState(component.short_name);
          break;
        }
        case "country": {
          setCountryCode(component.short_name);
          setCountryName(component.long_name);
          break;
        }
        case "postal_code": {
          setZip(component.long_name);
          break;
        }
      }
    });
    setStreet(`${streetNum} ${locationStreet}`);
  };

  const reviewSubmission = () => {
    // Set location name in case the user has typed something that didn't
    // resolve to a location via autocomplete selection
    setLocationName(autoCompleteRef.current.getAddressText());
    setShowSuggestLocationModal(true);
  };

  return (
    <ThemeContext.Consumer>
      {({ theme }) => {
        const s = getStyles(theme);
        return (
          <KeyboardAwareScrollView
            {...keyboardDismissProp}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps="handled"
            style={s.background}
          >
            {!loggedIn ? (
              <NotLoggedIn
                text={"You must be logged in to submit a location. Thank you!"}
                onPress={() => navigation.navigate("Login")}
              />
            ) : (
              <View>
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={showSuggestLocationModal}
                  onRequestClose={() => {}}
                >
                  {isSuggestingLocation ? (
                    <ActivityIndicator />
                  ) : locationSuggested ? (
                    <SafeAreaProvider>
                      <SafeAreaView
                        style={{ flex: 1, backgroundColor: theme.base1 }}
                      >
                        <ScrollView
                          style={[s.successContainer, s.background]}
                          contentContainerStyle={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={s.success}>
                            <Text style={s.successBanner}>
                              {`Thanks for submitting that location!\n\n`}
                            </Text>
                            {`Please allow us 0-7 days to review and add it. No need to re-submit it or remind us (unless it's opening day!).\n\nNote: you usually won't get a message from us confirming that it's been added.`}
                          </Text>
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={45}
                            onPress={() => {
                              navigation.navigate("MapTab");
                              setShowSuggestLocationModal(false);
                              resetSuggestLocation();
                            }}
                            style={s.xButton}
                          />
                        </ScrollView>
                      </SafeAreaView>
                    </SafeAreaProvider>
                  ) : (
                    <SafeAreaProvider>
                      <SafeAreaView style={[{ flex: 1 }, s.background]}>
                        <ScrollView style={s.background}>
                          <View style={s.pageTitle}>
                            {machineList.length === 0 ||
                            locationName?.length === 0 ? (
                              <Text style={[s.pageTitleText, s.error]}>
                                Please fill in required fields
                              </Text>
                            ) : (
                              <Text style={s.pageTitleText}>
                                Please review your submission
                              </Text>
                            )}
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Location Name</Text>
                            {locationName?.length === 0 ? (
                              <Text style={[s.error, s.preview]}>
                                Include a location name
                              </Text>
                            ) : (
                              <Text style={s.preview}>{locationName}</Text>
                            )}
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Street</Text>
                            <Text style={s.preview}>{street}</Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>City</Text>
                            <Text style={s.preview}>{city}</Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>State</Text>
                            <Text style={s.preview}>{state}</Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Zip</Text>
                            <Text style={s.preview}>{zip}</Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Country</Text>
                            <Text style={s.preview}>{countryName}</Text>
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
                              {typeof locationType === "number" &&
                              locationType > -1
                                ? locationTypes
                                    .filter((type) => type.id === locationType)
                                    .map((type) => type.name)
                                : "None Selected"}
                            </Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Operator</Text>
                            <Text style={s.preview}>
                              {typeof operator === "number" && operator > -1
                                ? operators
                                    .filter((op) => op.id === operator)
                                    .map((op) => op.name)
                                : "None Selected"}
                            </Text>
                          </View>
                          <View style={s.previewContainer}>
                            <Text style={s.previewTitle}>Machine List</Text>
                            {machineList.length === 0 ? (
                              <Text style={[s.error, s.preview]}>
                                Include at least one machine
                              </Text>
                            ) : (
                              <View style={s.preview}>
                                {machineList.map((m) => (
                                  <Text style={s.previewMachine} key={m.name}>
                                    {m.name} ({m.manufacturer}, {m.year})
                                  </Text>
                                ))}
                              </View>
                            )}
                          </View>
                          <Text style={{ color: theme.purpleLight }}>
                            {`Unsure what "model" the machine is (e.g., Pro, Premium, LE, etc.)? The safest assumption is Pro (the baseline model).`}
                          </Text>
                          <PbmButton
                            title={"Submit Location"}
                            onPress={() => confirmSuggestLocationDetails()}
                            disabled={
                              machineList.length === 0 ||
                              locationName.length === 0
                            }
                          />
                          <WarningButton
                            title={"Go Back"}
                            onPress={() => setShowSuggestLocationModal(false)}
                          />
                        </ScrollView>
                      </SafeAreaView>
                    </SafeAreaProvider>
                  )}
                </Modal>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                >
                  <SafeAreaView edges={["right", "bottom", "left"]}>
                    <Text
                      style={[{ marginTop: 10 }, s.text]}
                    >{`Only submit NEW locations (check first! please).`}</Text>
                    <Text style={s.title}>Location Name</Text>
                    <GooglePlacesAutocomplete
                      ref={autoCompleteRef}
                      minLength={2}
                      placeholder="ex. Giovanni's Pizza"
                      textInputProps={{
                        placeholderTextColor: theme.indigo4,
                        style: [
                          {
                            fontFamily: "Nunito-Regular",
                            height: 40,
                            width: deviceWidth - 40,
                          },
                          s.textInput,
                          s.radius10,
                        ],
                      }}
                      onPress={(data, details = null) => {
                        setLocation(details);
                      }}
                      fetchDetails
                      query={{
                        key: process.env.GOOGLE_MAPS_KEY,
                        language: "en",
                      }}
                      styles={{
                        row: {
                          width: deviceWidth,
                          overflow: "hidden",
                        },
                        description: {
                          fontFamily: "Nunito-Regular",
                        },
                      }}
                      disableScroll
                    />
                    <Text style={s.title}>Street</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(street) => setStreet(street)}
                      returnKeyType="done"
                      placeholder={"ex. 123 Coast Village Road"}
                      placeholderTextColor={theme.indigo4}
                      textContentType="streetAddressLine1"
                      autoCapitalize="words"
                      value={street}
                    />
                    <Text style={s.title}>City</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(city) => setCity(city)}
                      returnKeyType="done"
                      placeholder={"ex. Montecito"}
                      placeholderTextColor={theme.indigo4}
                      textContentType="addressCity"
                      autoCapitalize="words"
                      value={city}
                    />
                    <Text style={s.title}>State</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(state) => setState(state)}
                      returnKeyType="done"
                      placeholder={"ex. CA"}
                      placeholderTextColor={theme.indigo4}
                      textContentType="addressState"
                      autoCapitalize="characters"
                      value={state}
                    />
                    <Text style={s.title}>Zip Code</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(zip) => setZip(zip)}
                      returnKeyType="done"
                      placeholder={"ex. 93108"}
                      placeholderTextColor={theme.indigo4}
                      textContentType="postalCode"
                      value={zip}
                    />
                    <Text style={s.title}>Country</Text>
                    <DropDownButton
                      title={countryName}
                      containerStyle={[{ marginTop: 0, marginHorizontal: 20 }]}
                      onPress={() => goToFindCountry()}
                    />
                    <Text style={s.title}>Phone</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(phone) => setPhone(phone)}
                      returnKeyType="done"
                      placeholder={"(805) xxx-xxxx"}
                      placeholderTextColor={theme.indigo4}
                      textContentType="telephoneNumber"
                      autoCapitalize="none"
                      value={phone}
                    />
                    <Text style={s.title}>Website</Text>
                    <TextInput
                      style={[
                        { height: 40, textAlign: "left" },
                        s.textInput,
                        s.radius10,
                      ]}
                      underlineColorAndroid="transparent"
                      onChangeText={(website) => setWebsite(website)}
                      returnKeyType="done"
                      placeholder={"https://..."}
                      placeholderTextColor={theme.indigo4}
                      textContentType="URL"
                      autoCapitalize="none"
                      value={website}
                    />
                    <Text style={s.title}>Location Notes</Text>
                    <TextInput
                      multiline={true}
                      style={[
                        { padding: 5, minHeight: 80, height: "auto" },
                        s.textInput,
                        s.radius10,
                      ]}
                      onChangeText={(description) =>
                        setDescription(description)
                      }
                      underlineColorAndroid="transparent"
                      placeholder={"Location description, hours, etc..."}
                      placeholderTextColor={theme.indigo4}
                      textAlignVertical="top"
                    />
                    <Text style={s.title}>Location Type</Text>
                    <DropDownButton
                      title={locationTypeName}
                      containerStyle={[{ marginTop: 0, marginHorizontal: 20 }]}
                      onPress={() => goToFindLocationType()}
                    />
                    <Text style={s.title}>Operator</Text>
                    <DropDownButton
                      containerStyle={[{ marginTop: 0, marginHorizontal: 20 }]}
                      title={operatorName}
                      onPress={() => goToFindOperator()}
                    />
                    <Text style={s.title}>Machines</Text>
                    <PbmButton
                      title={"Select machines"}
                      titleStyle={{
                        fontSize: 16,
                        color: theme.text3,
                        fontFamily: "Nunito-Regular",
                      }}
                      onPress={() =>
                        navigate("FindMachine", { multiSelect: true })
                      }
                      icon={
                        <MaterialCommunityIcons
                          name="plus"
                          style={s.plusButton}
                        />
                      }
                      iconPosition="right"
                      containerStyle={s.addMachinesContainer}
                      buttonStyle={s.addMachinesButton}
                    />
                    {machineList.length > 0 ? (
                      <View style={s.machineContainer}>
                        {machineList.map((machine) => (
                          <ListItem
                            key={machine.id}
                            containerStyle={s.listContainerStyle}
                            onPress={() => removeMachineFromList(machine)}
                          >
                            <ListItem.Content>
                              <Icon>
                                {
                                  <MaterialIcons
                                    name="cancel"
                                    size={15}
                                    color={theme.indigo4}
                                  />
                                }
                              </Icon>
                              <ListItem.Title>
                                {getDisplayText(machine)}
                              </ListItem.Title>
                            </ListItem.Content>
                          </ListItem>
                        ))}
                      </View>
                    ) : null}
                    <PbmButton
                      title={"Review Submission"}
                      onPress={reviewSubmission}
                    />
                  </SafeAreaView>
                </Pressable>
              </View>
            )}
          </KeyboardAwareScrollView>
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
    text: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 5,
      marginLeft: 15,
      marginRight: 15,
      color: theme.pink1,
      textAlign: "center",
    },
    title: {
      textAlign: "center",
      marginBottom: 5,
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Nunito-Bold",
      color: theme.text2,
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
      width: 80,
    },
    preview: {
      fontSize: 15,
      marginRight: 25,
      textAlign: "center",
      width: deviceWidth - 130,
    },
    previewMachine: {
      alignSelf: "stretch",
      textAlign: "center",
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
    viewPicker: {
      borderRadius: 25,
      elevation: 6,
      backgroundColor: theme.white,
      marginHorizontal: 20,
      paddingHorizontal: 10,
      fontFamily: "Nunito-Bold",
    },
    picker: {
      backgroundColor: "#ffffff",
    },
    hr: {
      marginLeft: 25,
      marginRight: 25,
      height: 2,
      marginTop: 10,
      backgroundColor: theme.indigo4,
    },
    successContainer: {
      paddingHorizontal: 30,
    },
    success: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "Nunito-Regular",
    },
    successBanner: {
      fontSize: 20,
      fontFamily: "Nunito-Bold",
      color: theme.purpleLight,
    },
    error: {
      color: theme.red2,
    },
    plusButton: {
      color: theme.red2,
      fontSize: 24,
      marginLeft: 5,
    },
    addMachinesContainer: {
      marginBottom: 15,
      marginHorizontal: 20,
    },
    addMachinesButton: {
      backgroundColor: theme.base3,
      borderRadius: 25,
    },
    listContainerStyle: {
      backgroundColor: "transparent",
      paddingTop: 0,
    },
    machineContainer: {
      marginHorizontal: 20,
      borderRadius: 25,
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      borderWidth: 1,
    },
    xButton: {
      textAlign: "right",
      color: theme.red2,
    },
    containerStyle: {
      marginTop: 0,
      marginHorizontal: 20,
    },
  });

SuggestLocation.propTypes = {
  locations: PropTypes.object,
  operators: PropTypes.object,
  user: PropTypes.object,
  navigation: PropTypes.object,
  location: PropTypes.object,
  removeMachineFromList: PropTypes.func,
  clearSelectedState: PropTypes.func,
  suggestLocation: PropTypes.func,
  setSelectedOperator: PropTypes.func,
  setSelectedLocationType: PropTypes.func,
  resetSuggestLocation: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = ({ location, locations, operators, user }) => ({
  location,
  locations,
  operators,
  user,
});
const mapDispatchToProps = (dispatch) => ({
  removeMachineFromList: (machine) => dispatch(removeMachineFromList(machine)),
  clearSelectedState: () => dispatch(clearSelectedState()),
  suggestLocation: (goBack, locationDetails) =>
    dispatch(suggestLocation(goBack, locationDetails)),
  setSelectedOperator: (id) => dispatch(setSelectedOperator(id)),
  setSelectedLocationType: (id) => dispatch(setSelectedLocationType(id)),
  resetSuggestLocation: () => dispatch(resetSuggestLocation()),
});
export default connect(mapStateToProps, mapDispatchToProps)(SuggestLocation);
