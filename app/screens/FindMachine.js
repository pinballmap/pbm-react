import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ThemeContext } from "../theme-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LegendList } from "@legendapp/list";
import {
  addMachineToLocation,
  addMachineToList,
  removeMachineFromList,
  setMachineFilter,
} from "../actions";
import {
  BackglassImage,
  ButtonGroup,
  PbmButton,
  Text,
  WarningButton,
} from "../components";
import Checkbox from "expo-checkbox";
import { alphaSortNameObj } from "../utils/utilityFunctions";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

let deviceWidth = Dimensions.get("window").width;

const getDisplayText = (machine, theme) => (
  <Text style={{ fontSize: 18 }}>
    <Text style={{ fontFamily: "Nunito-Bold", color: theme.text }}>
      {machine.name}
    </Text>
    <Text
      style={{ color: theme.text3, fontFamily: "Nunito-Medium" }}
    >{` (${machine.manufacturer}, ${machine.year})`}</Text>
  </Text>
);

const MultiSelectRow = ({ index, machine, selected, onPressItem }) => {
  const { theme } = useContext(ThemeContext);
  const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;

  const _onPress = () => onPressItem(machine);

  return (
    <Pressable
      onPress={_onPress}
      style={({ pressed }) => [
        {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
          justifyContent: "space-between",
        },
        pressed
          ? { backgroundColor: theme.base4, opacity: 0.8 }
          : { backgroundColor, opacity: 1 },
      ]}
    >
      <Text style={{ fontSize: 18, width: deviceWidth - 40 }}>
        {getDisplayText(machine, theme)}
      </Text>
      {selected ? (
        <MaterialIcons
          name="cancel"
          size={18}
          color="#fd0091"
          style={{ paddingTop: 3 }}
        />
      ) : null}
    </Pressable>
  );
};

function FindMachine(props) {
  const {
    location,
    machines,
    mapLocations,
    addMachineToLocation,
    setMachineFilter,
  } = props;

  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  const sortedMachines = alphaSortNameObj(machines.machines);
  const [list, setList] = useState(sortedMachines);
  const [allMachines] = useState(sortedMachines);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [machine, setMachine] = useState({});
  const [condition, setCondition] = useState("");
  const [machineList, setMachineList] = useState(location.machineList || []);
  const [machinesInView, setMachinesInView] = useState(false);
  const [ic_enabled, setIcEnabled] = useState(undefined);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setMachineList(location.machineList || []);
  }, [location.machineList]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.machineFilter
        ? "Select Machine to Filter"
        : `Select Machine${route.params?.multiSelect ? "s" : ""}`,
      headerRight: () =>
        route.params?.showDone ? (
          <Pressable onPress={() => navigation.goBack(null)}>
            {({ pressed }) => (
              <View style={{ marginRight: 10 }}>
                <MaterialIcons
                  name="check-box"
                  size={32}
                  color={pressed ? "#95867c" : "#68b0f3"}
                />
              </View>
            )}
          </Pressable>
        ) : null,
    });
  }, [
    navigation,
    route.params?.machineFilter,
    route.params?.multiSelect,
    route.params?.showDone,
  ]);

  useEffect(() => {
    navigation.setParams?.({ showDone: (machineList?.length || 0) > 0 });
  }, [machineList, navigation]);

  const toArray = (maybeArrayOrObject) =>
    Array.isArray(maybeArrayOrObject)
      ? maybeArrayOrObject
      : Object.values(maybeArrayOrObject || {});

  const handleSearch = (q, wantInView) => {
    const formatted = q.toLowerCase();

    if (wantInView) {
      const idsInView = toArray(mapLocations).reduce((ids, loc) => {
        (loc?.machine_ids || []).forEach((id) => {
          if (!ids.includes(id)) ids.push(id);
        });
        return ids;
      }, []);

      const cur = allMachines.filter((m) => idsInView.includes(m.id));
      const filtered = cur.filter((m) =>
        m.name.toLowerCase().includes(formatted),
      );
      setQuery(q);
      setList(filtered);
    } else {
      const filtered = allMachines.filter((m) =>
        m.name.toLowerCase().includes(formatted),
      );
      setQuery(q);
      setList(filtered);
    }
  };

  const handleClear = () => {
    setQuery("");
    setList(allMachines);
  };

  const toggleViewMachinesInMapArea = (idx) => {
    if (idx === 0 && machinesInView) {
      handleSearch(query, false);
      setMachinesInView(false);
    } else if (idx === 1 && !machinesInView) {
      handleSearch(query, true);
      setMachinesInView(true);
    }
  };

  const setSelected = (m) => {
    if (route.params?.machineFilter) {
      setMachineFilter(m);
      navigation.goBack();
    } else {
      setShowModal(true);
      setMachine(m);
    }
  };

  const addMachineAndClose = () => {
    addMachineToLocation(machine, condition, ic_enabled);
    setShowModal(false);
    navigation.goBack();
  };

  const returnToMachineSelection = () => {
    setShowModal(false);
    setMachine({});
    setCondition("");
  };

  const returnToLocationDetails = () => {
    setShowModal(false);
    setMachine({});
    setCondition("");
    navigation.goBack();
  };

  const onPressMultiSelect = (m) => {
    const selected = machineList.find((x) => x.id === m.id);
    if (selected) {
      removeMachineFromList(m);
    } else {
      addMachineToList(m);
    }
    setRefresh((r) => !r);
  };

  const keyExtractor = (m) => `${m.id}`;

  const onIcEnabledPressed = (val) => {
    if (ic_enabled === val) setIcEnabled(undefined);
    else setIcEnabled(val);
  };

  const multiSelect = !!route.params?.multiSelect;
  const isFiltering = !!route.params?.machineFilter;
  const selectedIdx = machinesInView ? 1 : 0;
  const s = getStyles(theme);
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  const { opdb_img, opdb_img_height, opdb_img_width } = machine;
  const opdb_resized = (opdb_img_width || 0) - (deviceWidth - 48);
  const opdb_img_height_calc =
    (deviceWidth - 48) * ((opdb_img_height || 0) / (opdb_img_width || 1));
  const opdbImgHeight =
    opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
  const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;

  const renderRow = ({ item, index }) => {
    const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;
    return (
      <Pressable onPress={() => setSelected(item)}>
        {({ pressed }) => (
          <View
            style={[
              { padding: 8 },
              pressed
                ? { backgroundColor: theme.base4, opacity: 0.8 }
                : { backgroundColor, opacity: 1 },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{getDisplayText(item, theme)}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const renderMultiSelectRow = ({ item, index }) => (
    <MultiSelectRow
      machine={item}
      onPressItem={onPressMultiSelect}
      selected={!!(location.machineList || []).find((m) => m.id === item.id)}
      index={index}
    />
  );

  return (
    <>
      <Modal
        visible={showModal}
        onRequestClose={() => {}}
        transparent={false}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ backgroundColor: theme.base1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.verticalAlign}>
              <View style={[s.headerContainer, { marginTop: insets.top - 70 }]}>
                <TouchableOpacity
                  onPress={() => returnToMachineSelection()}
                  style={s.backButton}
                  activeOpacity={0.5}
                >
                  <FontAwesome6
                    name={
                      Platform.OS === "android" ? "arrow-left" : "chevron-left"
                    }
                    size={24}
                    color={theme.theme == "dark" ? theme.pink1 : theme.purple}
                    style={{
                      marginLeft: Platform.OS === "android" ? 0 : 10,
                      marginRight: 5,
                    }}
                  />
                </TouchableOpacity>
                <Text style={s.modalTitle}>
                  Add <Text style={s.modalMachineName}>{machine.name}</Text> to{" "}
                  <Text style={s.modalLocationName}>{location.name}</Text>
                </Text>
              </View>

              {!!opdb_img && (
                <BackglassImage
                  width={opdbImgWidth}
                  height={opdbImgHeight}
                  source={opdb_img}
                />
              )}

              <TextInput
                multiline
                placeholder="You can also include a machine comment..."
                placeholderTextColor={theme.indigo4}
                style={[{ padding: 5, height: 70 }, s.textInput]}
                onChangeText={setCondition}
                textAlignVertical="top"
                underlineColorAndroid="transparent"
              />

              {machine.ic_eligible && (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text>
                    Does machine have Stern Insider Connected enabled?
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                      value={ic_enabled === true}
                      onValueChange={() => onIcEnabledPressed(true)}
                      color={theme.purple}
                      style={s.checkStyle}
                    />
                    <Text style={[s.checkText, { marginRight: 20 }]}>Yes</Text>
                    <Checkbox
                      value={ic_enabled === false}
                      onValueChange={() => onIcEnabledPressed(false)}
                      color={theme.purple}
                      style={s.checkStyle}
                    />
                    <Text style={s.checkText}>No</Text>
                  </View>
                </View>
              )}

              <PbmButton title="Add" onPress={addMachineAndClose} />
              <WarningButton title="Cancel" onPress={returnToLocationDetails} />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: 40,
          marginBottom: 10,
        }}
      >
        <View style={s.inputContainer}>
          <MaterialIcons
            name="search"
            size={25}
            color={theme.indigo4}
            style={{ marginLeft: 10, marginRight: 0 }}
          />
          <TextInput
            placeholder="Filter machines..."
            placeholderTextColor={theme.indigo4}
            onChangeText={(q) => handleSearch(q, machinesInView)}
            value={query}
            style={s.inputStyle}
            autoCorrect={false}
          />
        </View>
        {query.length > 0 && (
          <Pressable onPress={handleClear} style={{ height: 20 }}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={theme.purple}
              style={{ position: "absolute", right: 30 }}
            />
          </Pressable>
        )}
      </View>

      {isFiltering ? (
        <View style={{ backgroundColor: theme.base1 }}>
          <ButtonGroup
            onPress={toggleViewMachinesInMapArea}
            selectedIndex={selectedIdx}
            buttons={["All Machines", "Machines in Map Area"]}
            containerStyle={s.buttonGroupContainer}
            textStyle={s.buttonGroupInactive}
            selectedButtonStyle={s.selButtonStyle}
            selectedTextStyle={s.selTextStyle}
            innerBorderStyle={s.innerBorderStyle}
          />
        </View>
      ) : null}

      {multiSelect ? (
        <View style={s.multiSelect}>
          {machineList.length === 0 ? (
            <Text style={{ color: theme.purple2 }}>0 machines selected</Text>
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.purple2 }}>
                {`${machineList.length} machine${machineList.length > 1 ? "s" : ""} selected`}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      <LegendList
        {...keyboardDismissProp}
        estimatedItemSize={41}
        recycleItems
        keyboardShouldPersistTaps="always"
        data={list}
        extraData={refresh}
        renderItem={multiSelect ? renderMultiSelectRow : renderRow}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ backgroundColor: theme.base1 }}
      />
    </>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.base1,
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
      paddingLeft: 5,
      paddingRight: 65,
      height: 40,
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      justifyContent: "center",
    },
    backButton: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      borderWidth: 1,
      marginHorizontal: 30,
      marginTop: 5,
      marginBottom: 10,
      borderRadius: 10,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
      color: theme.text,
    },
    verticalAlign: {
      flexDirection: "column",
      justifyContent: "top",
      marginTop: 60,
      marginBottom: 40,
    },
    multiSelect: {
      alignItems: "center",
      paddingBottom: 5,
      backgroundColor: theme.base1,
    },
    buttonGroupContainer: {
      marginBottom: 10,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
    buttonGroupInactive: {
      color: theme.text2,
      fontSize: 14,
      fontFamily: "Nunito-Medium",
    },
    innerBorderStyle: {
      width: 0,
    },
    selButtonStyle: {
      borderWidth: 2,
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "Nunito-Bold",
    },
    machineName: {
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    manYear: {
      color: theme.text3,
    },
    pressed: {
      backgroundColor: theme.base3,
      opacity: 0.8,
    },
    notPressed: {
      backgroundColor: "transparent",
    },
    modalTitle: {
      textAlign: "center",
      marginHorizontal: 40,
      marginVertical: 20,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
    },
    modalLocationName: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-SemiBold",
    },
    modalMachineName: {
      color: theme.theme == "dark" ? theme.pink1 : theme.purple,
      fontSize: 18,
      fontFamily: "Nunito-Bold",
    },
    checkText: {
      fontFamily: "Nunito-Bold",
      fontSize: 16,
      color: theme.text,
    },
    checkStyle: {
      backgroundColor: theme.base1,
      marginRight: 5,
    },
  });

FindMachine.propTypes = {
  machines: PropTypes.object,
  addMachineToLocation: PropTypes.func,
  addMachineToList: PropTypes.func,
  removeMachineFromList: PropTypes.func,
  navigation: PropTypes.object,
  location: PropTypes.object,
  multiSelect: PropTypes.bool,
  setMachineFilter: PropTypes.func,
  mapLocations: PropTypes.array,
  route: PropTypes.object,
};

const mapStateToProps = ({ location, machines, locations }) => ({
  location,
  machines,
  mapLocations: locations.mapLocations || {},
});

const mapDispatchToProps = (dispatch) => ({
  addMachineToLocation: (machine, condition, ic_enabled) =>
    dispatch(addMachineToLocation(machine, condition, ic_enabled)),
  addMachineToList: (machine) => dispatch(addMachineToList(machine)),
  removeMachineFromList: (machine) => dispatch(removeMachineFromList(machine)),
  setMachineFilter: (machine) => dispatch(setMachineFilter(machine)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FindMachine);
