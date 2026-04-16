import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const MultiSelectRow = React.memo(
  ({ index, machine, onPressItem, selected }) => {
    const { theme } = useContext(ThemeContext);
    const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;

    return (
      <Pressable
        onPress={() => onPressItem(machine)}
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
        <Text style={{ fontSize: 18, flex: 1 }}>
          {getDisplayText(machine, theme)}
        </Text>
        {selected ? (
          <MaterialIcons name="cancel" size={18} color="#fd0091" />
        ) : null}
      </Pressable>
    );
  },
);

MultiSelectRow.displayName = "MultiSelectRow";

MultiSelectRow.propTypes = {
  onPressItem: PropTypes.func,
  machine: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};

const FindMachine = ({
  navigation,
  route,
  machines: machinesProp,
  location,
  addMachineToLocation,
  addMachineToList,
  removeMachineFromList,
  setMachineFilter,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const allMachines = useMemo(() => {
    const sorted = alphaSortNameObj(machinesProp.machines);
    const manufacturerFilter = route.params?.manufacturerFilter || [];
    const machineTypeFilter = route.params?.machineTypeFilter || "";
    const machineYearGte = route.params?.machineYearGte ?? null;
    const machineYearLte = route.params?.machineYearLte ?? null;
    let filtered = sorted;
    if (manufacturerFilter.length > 0) {
      filtered = filtered.filter((m) =>
        manufacturerFilter.includes(m.manufacturer),
      );
    }
    if (machineTypeFilter === "em") {
      filtered = filtered.filter(
        (m) => m.machine_type === "em" || m.machine_type === "me",
      );
    }
    if (machineYearGte !== null) {
      filtered = filtered.filter((m) => m.year >= machineYearGte);
    }
    if (machineYearLte !== null) {
      filtered = filtered.filter((m) => m.year <= machineYearLte);
    }
    return filtered;
  }, []);

  const { machineList = [] } = location;
  const { mapAreaMachineIds } = machinesProp;

  const [machines, setMachines] = useState(allMachines);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [machine, setMachine] = useState({});
  const [condition, setCondition] = useState("");
  const [machinesInView, setMachinesInView] = useState(false);
  const [icEnabled, setIcEnabled] = useState(undefined);

  const isFirstRender = useRef(true);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.machineFilter
        ? "Select Machine to Filter"
        : `Select Machine${route.params?.multiSelect ? "s" : ""}`,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
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
  }, [route.params?.showDone]);

  // Replaces UNSAFE_componentWillReceiveProps: sync showDone with machineList changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    navigation.setParams({ showDone: machineList.length > 0 });
  }, [machineList.length]);

  const handleSearch = (searchQuery, inView = machinesInView) => {
    const formattedQuery = searchQuery
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();

    const baseList =
      inView && mapAreaMachineIds.length > 0
        ? allMachines.filter((m) => mapAreaMachineIds.includes(m.id))
        : allMachines;

    setMachines(
      baseList.filter((m) =>
        m.name
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^\w\s]/g, "")
          .toLowerCase()
          .trim()
          .includes(formattedQuery),
      ),
    );
    setQuery(searchQuery);
  };

  const toggleViewMachinesInMapArea = (idx) => {
    const inView = idx === 1;
    if (inView === machinesInView) return;
    handleSearch(query, inView);
    setMachinesInView(inView);
  };

  const setSelected = useCallback(
    (selectedMachine) => {
      if (route.params?.machineFilter) {
        setMachineFilter(selectedMachine);
        navigation.goBack();
      } else {
        setMachine(selectedMachine);
        setShowModal(true);
      }
    },
    [route.params?.machineFilter],
  );

  const addMachine = () => {
    addMachineToLocation(machine, condition, icEnabled);
    setShowModal(false);
    navigation.goBack();
  };

  const cancelAddMachine = () => {
    setShowModal(false);
    setMachine({});
    setCondition("");
  };

  const onIcEnabledPressed = (value) => {
    if ((!!icEnabled && !!value) || (icEnabled === false && value === false)) {
      setIcEnabled(undefined);
      return;
    }
    setIcEnabled(value);
  };

  const onPressMultiSelect = useCallback(
    (selectedMachine) => {
      const selected = !!machineList.find((m) => m.id === selectedMachine.id);
      if (selected) {
        removeMachineFromList(selectedMachine);
      } else {
        addMachineToList(selectedMachine);
      }
    },
    [machineList],
  );

  const renderRow = useCallback(
    ({ item, index }) => {
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
              <Text style={{ fontSize: 18 }}>
                {getDisplayText(item, theme)}
              </Text>
            </View>
          )}
        </Pressable>
      );
    },
    [theme, setSelected],
  );

  const renderMultiSelectRow = useCallback(
    ({ item, index }) => (
      <MultiSelectRow
        machine={item}
        onPressItem={onPressMultiSelect}
        selected={!!machineList.find((m) => m.id === item.id)}
        index={index}
      />
    ),
    [machineList, onPressMultiSelect],
  );

  const keyExtractor = (m) => `${m.id}`;

  const multiSelect = route.params?.multiSelect || false;
  const isFiltering = route.params?.machineFilter;
  const selectedIdx = machinesInView ? 1 : 0;
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  const { opdb_img, opdb_img_height, opdb_img_width } = machine;
  const opdb_resized = opdb_img_width - (deviceWidth - 48);
  const opdb_img_height_calc =
    (deviceWidth - 48) * (opdb_img_height / opdb_img_width);
  const opdbImgHeight =
    opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
  const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;

  return (
    <>
      <Modal
        visible={showModal}
        onRequestClose={() => {}}
        transparent={false}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ backgroundColor: theme.base1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={s.verticalAlign}>
              <Text style={s.modalTitle}>
                Add <Text style={s.modalMachineName}>{machine.name}</Text> to{" "}
                <Text style={s.modalLocationName}>
                  {location.location.name}
                </Text>
              </Text>
              {!!opdb_img && (
                <BackglassImage
                  width={opdbImgWidth}
                  height={opdbImgHeight}
                  source={opdb_img}
                />
              )}
              <TextInput
                multiline={true}
                placeholder={"You can also include a machine comment..."}
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
                      value={icEnabled}
                      onValueChange={() => onIcEnabledPressed(true)}
                      color={theme.purple}
                      style={s.checkStyle}
                    />
                    <Text style={[s.checkText, { marginRight: 20 }]}>Yes</Text>
                    <Checkbox
                      value={icEnabled === false}
                      onValueChange={() => onIcEnabledPressed(false)}
                      color={theme.purple}
                      style={s.checkStyle}
                    />
                    <Text style={s.checkText}>No</Text>
                  </View>
                </View>
              )}
              <PbmButton title={"Add"} onPress={addMachine} />
              <WarningButton title={"Cancel"} onPress={cancelAddMachine} />
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: theme.purple2 }}>{`${
                machineList.length
              } machine${machineList.length > 1 ? "s" : ""} selected`}</Text>
              <Pressable
                onPress={() => machineList.forEach(removeMachineFromList)}
                style={{ marginLeft: 8 }}
              >
                <MaterialIcons name="cancel" size={18} color="#fd0091" />
              </Pressable>
            </View>
          )}
        </View>
      ) : null}
      <FlatList
        {...keyboardDismissProp}
        keyboardShouldPersistTaps="always"
        data={machines}
        extraData={machineList}
        renderItem={multiSelect ? renderMultiSelectRow : renderRow}
        keyExtractor={keyExtractor}
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
      flex: 1,
      paddingLeft: 5,
      paddingRight: 65,
      height: 40,
      color: theme.text,
      fontSize: 18,
      fontFamily: "Nunito-Regular",
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
      marginTop: 80,
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
      marginBottom: 15,
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
  setMachineFilter: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = ({ location, machines }) => ({
  location,
  machines,
});
const mapDispatchToProps = (dispatch) => ({
  addMachineToLocation: (machine, condition, ic_enabled) =>
    dispatch(addMachineToLocation(machine, condition, ic_enabled)),
  addMachineToList: (machine) => dispatch(addMachineToList(machine)),
  removeMachineFromList: (machine) => dispatch(removeMachineFromList(machine)),
  setMachineFilter: (machine) => dispatch(setMachineFilter(machine)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine);
