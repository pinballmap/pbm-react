import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
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
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import {
  addMachineToLocation,
  addMachineToList,
  addMachineToLifeList,
  removeMachineFromList,
  setMachineFilter,
  getMapAreaMachineIds,
} from "../actions";
import { fetchLifeListMachineIds } from "../actions/user_actions";
import {
  ActivityIndicator,
  BackglassImage,
  ButtonGroup,
  PbmButton,
  Text,
  Toast,
  useToast,
  WarningButton,
} from "../components";
import Checkbox from "expo-checkbox";

import {
  alphaSortNameObj,
  sortMachinesByLifeListMembership,
  sortMachinesByLmxCount,
  sortMachinesByManufacturer,
  sortMachinesByYear,
} from "../utils/utilityFunctions";

let deviceWidth = Dimensions.get("window").width;

const FULL_SORT_OPTIONS = [
  { key: "alpha", label: "Alphabetical" },
  { key: "year_desc", label: "Year (Newest First)" },
  { key: "year_asc", label: "Year (Oldest First)" },
  { key: "lmx_count_asc", label: "Rarest First" },
  { key: "lmx_count_desc", label: "Most Common First" },
  { key: "manufacturer", label: "Manufacturer" },
];

const SIMPLE_SORT_OPTIONS = [
  { key: "alpha", label: "Alphabetical" },
  { key: "year_desc", label: "Year (Newest First)" },
  { key: "year_asc", label: "Year (Oldest First)" },
  { key: "manufacturer", label: "Manufacturer" },
];

const LIFE_LIST_SORT_OPTION = {
  key: "not_in_life_list",
  label: "Not in Life List First",
};

const applySort = (array, sortOrder, lifeListIdsSet) => {
  if (sortOrder === "year_desc") return sortMachinesByYear(array, "desc");
  if (sortOrder === "year_asc") return sortMachinesByYear(array, "asc");
  if (sortOrder === "manufacturer") return sortMachinesByManufacturer(array);
  if (sortOrder === "lmx_count_asc")
    return sortMachinesByLmxCount(array, "asc");
  if (sortOrder === "lmx_count_desc")
    return sortMachinesByLmxCount(array, "desc");
  if (sortOrder === "not_in_life_list")
    return sortMachinesByLifeListMembership(array, lifeListIdsSet);
  return alphaSortNameObj(array);
};

const getDisplayText = (machine, theme, dimmed = false) => (
  <Text style={{ fontSize: 18 }}>
    <Text
      style={{
        fontFamily: "Nunito-Bold",
        color: dimmed ? "#9396ad" : theme.text,
      }}
    >
      {machine.name}
    </Text>
    <Text
      style={{
        color: dimmed ? "#9396ad" : theme.text3,
        fontFamily: "Nunito-Medium",
      }}
    >{` (${machine.manufacturer}, ${machine.year})`}</Text>
  </Text>
);

const MultiSelectRow = React.memo(
  ({
    index,
    machine,
    onPressItem,
    selected,
    disableSelection,
    inLifeList,
    onLifeListIconPress,
  }) => {
    const { theme } = useContext(ThemeContext);
    const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;

    return (
      <Pressable
        onPress={disableSelection ? undefined : () => onPressItem(machine)}
        disabled={disableSelection}
        style={({ pressed }) => [
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            justifyContent: "space-between",
          },
          pressed && !disableSelection
            ? { backgroundColor: theme.base4, opacity: 0.8 }
            : { backgroundColor, opacity: 1 },
        ]}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            {getDisplayText(machine, theme, disableSelection)}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {inLifeList && (
            <Pressable
              hitSlop={10}
              onPress={onLifeListIconPress}
              style={{ padding: 4 }}
            >
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={22}
                color={theme.theme === "dark" ? theme.pink1 : theme.pink3}
              />
            </Pressable>
          )}
          {selected ? (
            <MaterialIcons
              name="cancel"
              size={18}
              color="#fd0091"
              style={{ marginLeft: 6 }}
            />
          ) : null}
        </View>
      </Pressable>
    );
  },
);

MultiSelectRow.displayName = "MultiSelectRow";

MultiSelectRow.propTypes = {
  onPressItem: PropTypes.func,
  machine: PropTypes.object,
  selected: PropTypes.bool,
  disableSelection: PropTypes.bool,
  inLifeList: PropTypes.bool,
  onLifeListIconPress: PropTypes.func,
  index: PropTypes.number,
};

const FindMachine = ({
  navigation,
  route,
  machines: machinesProp,
  location,
  user,
  addMachineToLocation,
  addMachineToList,
  removeMachineFromList,
  setMachineFilter,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { toastMessage, showToast } = useToast();
  const { loggedIn, lifeListMachineIds } = user;

  const multiSelect = route.params?.multiSelect || false;
  const isFiltering = route.params?.machineFilter;
  const showFullSort =
    (multiSelect &&
      (isFiltering ||
        route.params?.activityMachineFilter ||
        route.params?.lifeListUserId)) ||
    !!route.params?.standaloneScore;
  const showSimpleSort = !!route.params?.simpleSort;
  const showSort = showFullSort || showSimpleSort;
  const showLifeListBadge = loggedIn && showFullSort;

  const sortOptions = useMemo(() => {
    if (showFullSort) {
      return loggedIn
        ? [...FULL_SORT_OPTIONS, LIFE_LIST_SORT_OPTION]
        : FULL_SORT_OPTIONS;
    }
    return SIMPLE_SORT_OPTIONS;
  }, [showFullSort, loggedIn]);

  const [sortOrder, setSortOrder] = useState("alpha");
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const lifeListIdsSet = useMemo(
    () => new Set(lifeListMachineIds),
    [lifeListMachineIds],
  );

  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (loggedIn) dispatch(fetchLifeListMachineIds());
    });
  }, [navigation, loggedIn]); // eslint-disable-line

  const allMachines = useMemo(() => {
    const sorted = applySort(
      [...machinesProp.machines],
      sortOrder,
      lifeListIdsSet,
    );
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
  }, [sortOrder, lifeListIdsSet]); // eslint-disable-line

  const { machineList = [] } = location;
  const { mapAreaMachineIds } = machinesProp;
  const mapAreaMachineIdsRef = useRef(mapAreaMachineIds);
  useEffect(() => {
    mapAreaMachineIdsRef.current = mapAreaMachineIds;
  }, [mapAreaMachineIds]);

  const [machines, setMachines] = useState(allMachines);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [machine, setMachine] = useState({});
  const [condition, setCondition] = useState("");
  const [machinesInView, setMachinesInView] = useState(false);
  const [isFetchingMapArea, setIsFetchingMapArea] = useState(false);
  const [icEnabled, setIcEnabled] = useState(undefined);
  const [showLifeListConfirmModal, setShowLifeListConfirmModal] =
    useState(false);
  const [addingToLifeList, setAddingToLifeList] = useState(false);

  const pendingNavActionRef = useRef(null);
  const isConfirmingLifeListRef = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.machineFilter
        ? "Select Machines for Filter"
        : `Select Machine${route.params?.multiSelect ? "s" : ""}`,
    });
  }, []);

  useEffect(() => {
    const lifeListUserId = route.params?.lifeListUserId;
    navigation.setOptions({
      headerRight: () =>
        route.params?.showDone ? (
          <Pressable
            onPress={() => {
              if (lifeListUserId) {
                setShowLifeListConfirmModal(true);
              } else {
                navigation.goBack(null);
              }
            }}
          >
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (navigation.isFocused()) {
      navigation.setParams({ showDone: machineList.length > 0 });
    }
  }, [machineList.length]);

  useEffect(() => {
    if (!route.params?.lifeListUserId) return;
    return navigation.addListener("beforeRemove", (e) => {
      if (machineList.length === 0 || isConfirmingLifeListRef.current) return;
      e.preventDefault();
      pendingNavActionRef.current = e.data.action;
      setShowLifeListConfirmModal(true);
    });
  }, [navigation, machineList.length, route.params?.lifeListUserId]);

  const handleSearch = (searchQuery, inView = machinesInView) => {
    const formattedQuery = searchQuery
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();

    const ids = mapAreaMachineIdsRef.current;
    const baseList =
      inView && ids.length > 0
        ? allMachines.filter((m) => ids.includes(m.id))
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

  useEffect(() => {
    handleSearch(query, machinesInView);
  }, [sortOrder, lifeListIdsSet]); // eslint-disable-line

  const toggleViewMachinesInMapArea = (idx) => {
    const inView = idx === 1;
    if (inView === machinesInView) return;
    if (inView) {
      setIsFetchingMapArea(true);
      dispatch(getMapAreaMachineIds()).then(() => {
        setIsFetchingMapArea(false);
        handleSearch(query, true);
      });
    } else {
      handleSearch(query, false);
    }
    setMachinesInView(inView);
  };

  const setSelected = useCallback(
    (selectedMachine) => {
      if (route.params?.standaloneScore) {
        navigation.navigate("AddHighScore", { selectedMachine });
      } else if (route.params?.machineFilter) {
        setMachineFilter(selectedMachine);
        navigation.goBack();
      } else {
        setMachine(selectedMachine);
        setShowModal(true);
      }
    },
    [route.params?.machineFilter, route.params?.standaloneScore, navigation],
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

  const handleLifeListConfirm = async () => {
    setAddingToLifeList(true);
    try {
      await Promise.all(
        machineList.map((m) => dispatch(addMachineToLifeList(m.id))),
      );
      dispatch(fetchLifeListMachineIds());
    } catch (err) {
      console.log(err);
    }
    setShowLifeListConfirmModal(false);
    setAddingToLifeList(false);
    machineList.forEach(removeMachineFromList);
    const action = pendingNavActionRef.current;
    pendingNavActionRef.current = null;
    if (action) {
      navigation.dispatch(action);
    } else {
      isConfirmingLifeListRef.current = true;
      navigation.goBack();
    }
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

  const handleLifeListIconPress = useCallback(
    () => showToast("Machine in your Life List"),
    [showToast],
  );

  const renderMultiSelectRow = useCallback(
    ({ item, index }) => {
      const inLifeList = lifeListIdsSet.has(item.id);
      return (
        <MultiSelectRow
          machine={item}
          onPressItem={multiSelect ? onPressMultiSelect : setSelected}
          selected={multiSelect && !!machineList.find((m) => m.id === item.id)}
          disableSelection={!!route.params?.lifeListUserId && inLifeList}
          inLifeList={showLifeListBadge && inLifeList}
          onLifeListIconPress={handleLifeListIconPress}
          index={index}
        />
      );
    },
    [
      multiSelect,
      machineList,
      onPressMultiSelect,
      setSelected,
      lifeListIdsSet,
      showLifeListBadge,
      route.params?.lifeListUserId,
      handleLifeListIconPress,
    ],
  );

  const keyExtractor = (m) => `${m.id}`;

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
              <Text style={{ textAlign: "center" }}>
                Tip: only add machines that are on the floor.
              </Text>
              <PbmButton title={"Add"} onPress={addMachine} />
              <WarningButton title={"Go Back"} onPress={cancelAddMachine} />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
      <Modal
        visible={showLifeListConfirmModal}
        onRequestClose={() => setShowLifeListConfirmModal(false)}
        transparent={false}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <View style={s.verticalAlign}>
            <Text style={s.modalTitle}>
              {"Add "}
              <Text style={s.modalMachineName}>{machineList.length}</Text>
              {` machine${machineList.length > 1 ? "s" : ""} to your life list?`}
            </Text>
            <PbmButton
              title={"Add to Life List"}
              onPress={handleLifeListConfirm}
              disabled={addingToLifeList}
            />
            <WarningButton
              title={"Cancel"}
              onPress={() => setShowLifeListConfirmModal(false)}
              disabled={addingToLifeList}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={s.sortModalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={[s.sortModalWrapper, s.boxShadow]}>
            <View style={s.sortModalContent}>
              {sortOptions.map((option) => {
                const isSelected = option.key === sortOrder;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => {
                      setSortOrder(option.key);
                      setSortModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      s.sortModalItem,
                      isSelected && s.sortModalItemSelected,
                      pressed && s.sortModalItemPressed,
                    ]}
                  >
                    <Text
                      maxFontSizeMultiplier={1.3}
                      style={[
                        s.sortModalItemText,
                        isSelected && s.sortModalItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={theme.text2}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
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
      {multiSelect || showSort ? (
        <View style={s.multiSelectRow}>
          <View style={s.multiSelectSpacer} />
          <View style={s.multiSelectCenterGroup}>
            {multiSelect &&
              (machineList.length === 0 ? (
                <Text style={{ color: theme.purple2 }}>
                  0 machines selected
                </Text>
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
              ))}
          </View>
          <View style={s.multiSelectRightGroup}>
            {showSort && (
              <Pressable
                hitSlop={10}
                style={({ pressed }) => [
                  s.sortIcon,
                  pressed && { opacity: 0.5 },
                ]}
                onPress={() => setSortModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="sort-variant"
                  color={
                    theme.theme == "dark" ? theme.purpleLight : theme.purple
                  }
                  size={24}
                />
              </Pressable>
            )}
          </View>
        </View>
      ) : null}
      {isFetchingMapArea ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          {...keyboardDismissProp}
          keyboardShouldPersistTaps="always"
          data={machines}
          extraData={
            multiSelect || showLifeListBadge
              ? [machineList, lifeListIdsSet]
              : undefined
          }
          renderItem={
            multiSelect || showLifeListBadge ? renderMultiSelectRow : renderRow
          }
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            backgroundColor: theme.base1,
            paddingBottom: insets.bottom,
          }}
        />
      )}
      <Toast message={toastMessage} />
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
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
    multiSelectRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: 5,
      paddingHorizontal: 20,
      backgroundColor: theme.base1,
    },
    multiSelectSpacer: {
      flex: 1,
    },
    multiSelectCenterGroup: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    multiSelectRightGroup: {
      flex: 1,
      alignItems: "flex-end",
    },
    sortIcon: {
      padding: 4,
    },
    boxShadow: {
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
    sortModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    sortModalWrapper: {
      width: "75%",
      maxWidth: 320,
      borderRadius: 12,
      backgroundColor: theme.white,
    },
    sortModalContent: {
      borderRadius: 12,
      overflow: "hidden",
    },
    sortModalItem: {
      height: 48,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    sortModalItemPressed: {
      opacity: 0.6,
    },
    sortModalItemSelected: {
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
    },
    sortModalItemText: {
      fontSize: 16,
      fontFamily: "Nunito-Medium",
      color: theme.text,
    },
    sortModalItemTextSelected: {
      fontFamily: "Nunito-Bold",
      color: theme.text2,
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
      fontFamily: "Nunito-SemiBold",
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
  user: PropTypes.object,
  setMachineFilter: PropTypes.func,
  route: PropTypes.object,
};

const mapStateToProps = ({ location, machines, user }) => ({
  location,
  machines,
  user,
});
const mapDispatchToProps = (dispatch) => ({
  addMachineToLocation: (machine, condition, ic_enabled) =>
    dispatch(addMachineToLocation(machine, condition, ic_enabled)),
  addMachineToList: (machine) => dispatch(addMachineToList(machine)),
  removeMachineFromList: (machine) => dispatch(removeMachineFromList(machine)),
  setMachineFilter: (machine) => dispatch(setMachineFilter(machine)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine);
