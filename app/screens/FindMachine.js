import React from "react";
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
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
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
import { FontAwesome6 } from "@expo/vector-icons";

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

class MultiSelectRow extends React.PureComponent {
  static contextType = ThemeContext;

  _onPress = () => {
    this.props.onPressItem(this.props.machine);
  };

  render() {
    const { index, machine, selected } = this.props;
    const theme = this.context.theme;
    const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;
    return (
      <Pressable
        onPress={this._onPress}
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
  }
}

MultiSelectRow.propTypes = {
  onPressItem: PropTypes.func,
  machine: PropTypes.object,
  selected: PropTypes.bool,
  index: PropTypes.number,
};

class FindMachine extends React.PureComponent {
  constructor(props) {
    super(props);
    const sortedMachines = alphaSortNameObj(props.machines.machines);

    this.state = {
      machines: sortedMachines,
      allMachines: sortedMachines,
      query: "",
      showModal: false,
      machine: {},
      condition: "",
      machineList: props.location.machineList,
      machinesInView: false,
      ic_enabled: undefined,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.props.route.params?.machineFilter
        ? "Select Machine to Filter"
        : `Select Machine${this.props.route.params?.multiSelect ? "s" : ""}`,
      headerRight: () =>
        this.props.route.params?.showDone ? (
          <Pressable onPress={() => this.props.navigation.goBack(null)}>
            {({ pressed }) => (
              <View
                style={{
                  marginRight: 10,
                }}
              >
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
  }

  componentDidUpdate() {
    this.props.navigation.setOptions({
      headerRight: () =>
        this.props.route.params?.showDone ? (
          <Pressable onPress={() => this.props.navigation.goBack(null)}>
            {({ pressed }) => (
              <View
                style={{
                  marginRight: 10,
                }}
              >
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
  }

  static contextType = ThemeContext;

  handleSearch = (query, machinesInView) => {
    const formattedQuery = query.toLowerCase();

    if (machinesInView) {
      const machinesInView = this.props.mapLocations.reduce((machines, loc) => {
        loc.machine_ids &&
          loc.machine_ids.map((machineId) => {
            if (machines.indexOf(machineId) === -1) machines.push(machineId);
          });

        return machines;
      }, []);

      const curMachines = this.state.allMachines.filter(
        (mach) => machinesInView.indexOf(mach.id) > -1,
      );
      const machines = curMachines.filter((m) =>
        m.name.toLowerCase().includes(formattedQuery),
      );
      this.setState({ query, machines });
    } else {
      const machines = this.state.allMachines.filter((m) =>
        m.name.toLowerCase().includes(formattedQuery),
      );
      this.setState({ query, machines });
    }
  };

  handleClear = () => {
    this.setState({ query: "" });
  };

  toggleViewMachinesInMapArea = (idx) => {
    if (idx === 0 && !!this.state.machinesInView) {
      this.handleSearch(this.state.query, false);
      this.setState({ machinesInView: false });
    } else if (idx === 1 && !!!this.state.machinesInView) {
      this.handleSearch(this.state.query, true);
      this.setState({ machinesInView: true });
    }
  };

  setSelected = (machine) => {
    if (this.props.route.params?.machineFilter) {
      this.props.setMachineFilter(machine);
      this.props.navigation.goBack();
    } else {
      this.setState({
        showModal: true,
        machine,
      });
    }
  };

  addMachine = () => {
    this.props.addMachineToLocation(
      this.state.machine,
      this.state.condition,
      this.state.ic_enabled,
    );
    this.setState({ showModal: false });
    this.props.navigation.goBack();
  };

  returnToMachineSelection = () => {
  returnToMachineSelection = () => {
    this.setState({
      showModal: false,
      machine: {},
      condition: "",
    });
  };

  returnToLocationDetails = () => {
    this.setState({
      showModal: false,
      machine: {},
      condition: "",
    });
    this.props.navigation.navigate("LocationDetails", {
      id: this.props.location.location.id,
    });
  };

  returnToLocationDetails = () => {
    this.setState({
      showModal: false,
      machine: {},
      condition: "",
    });
    this.props.navigation.navigate("LocationDetails", {
      id: this.props.location.location.id,
    });
  };

  renderRow = ({ item, index }) => {
    const theme = this.context.theme;
    const backgroundColor = index % 2 === 0 ? theme.base1 : theme.base2;
    return (
      <Pressable onPress={() => this.setSelected(item)}>
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

  renderMultiSelectRow = ({ item, index }) => (
    <MultiSelectRow
      machine={item}
      onPressItem={this.onPressMultiSelect}
      selected={!!this.props.location.machineList.find((m) => m.id === item.id)}
      index={index}
    />
  );

  onPressMultiSelect = (machine) => {
    const selected = !!this.props.location.machineList.find(
      (m) => m.id === machine.id,
    );

    if (selected) {
      this.props.removeMachineFromList(machine);
      this.setState({
        refresh: !this.state.refresh,
      });
    } else {
      this.props.addMachineToList(machine);
      this.setState({
        refresh: !this.state.refresh,
      });
    }
  };

  keyExtractor = (machine) => `${machine.id}`;

  onIcEnabledPressed = (ic_enabled) => {
    const prevState = this.state.ic_enabled;
    // uncheck if pressing the currently checked box
    if (
      (!!prevState && !!ic_enabled) ||
      (prevState === false && ic_enabled === false)
    ) {
      return this.setState({ ic_enabled: undefined });
    }

    this.setState({ ic_enabled });
  };

  UNSAFE_componentWillReceiveProps(props) {
    if (
      this.props.location.machineList.length === 0 &&
      props.location.machineList.length > 0
    )
      this.props.navigation.setParams({ showDone: true });

    if (
      this.props.location.machineList.length > 0 &&
      props.location.machineList.length === 0
    )
      this.props.navigation.setParams({ showDone: false });
  }

  render() {
    const { machineList = [] } = this.props.location;
    const multiSelect =
      (this.props.route.params && this.props.route.params["multiSelect"]) ||
      false;
    const isFiltering = this.props.route.params?.machineFilter;
    const selectedIdx = this.state.machinesInView ? 1 : 0;
    const theme = this.context.theme;
    const s = getStyles(theme);
    const keyboardDismissProp =
      Platform.OS === "ios"
        ? { keyboardDismissMode: "on-drag" }
        : { onScrollBeginDrag: Keyboard.dismiss };
    const { opdb_img, opdb_img_height, opdb_img_width } = this.state.machine;
    const opdb_resized = opdb_img_width - (deviceWidth - 48);
    const opdb_img_height_calc =
      (deviceWidth - 48) * (opdb_img_height / opdb_img_width);
    const opdbImgHeight =
      opdb_resized > 0 ? opdb_img_height_calc : opdb_img_height;
    const opdbImgWidth = opdb_resized > 0 ? deviceWidth - 48 : opdb_img_width;

    return (
      <>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => {}}
          transparent={false}
          statusBarTranslucent={true}
          navigationBarTranslucent={true}
        >
          <View style={{ flex: 1, backgroundColor: theme.base1 }}>
            <KeyboardAwareScrollView
              contentContainerStyle={{
                backgroundColor: theme.base1,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={s.verticalAlign}>
                <View style={s.headerContainer}>
                  <TouchableOpacity
                    onPress={() => this.returnToMachineSelection()}
                    style={s.backButton}
                    activeOpacity={0.5}
                  >
                    <FontAwesome6
                      name={
                        Platform.OS === "android"
                          ? "arrow-left"
                          : "chevron-left"
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
                    Add{" "}
                    <Text style={s.modalMachineName}>
                      {this.state.machine.name}
                    </Text>{" "}
                    to{" "}
                    <Text style={s.modalLocationName}>
                      {this.props.location.location.name}
                    </Text>
                  </Text>
                </View>
                <View style={s.headerContainer}>
                  <TouchableOpacity
                    onPress={() => this.returnToMachineSelection()}
                    style={s.backButton}
                    activeOpacity={0.5}
                  >
                    <FontAwesome6
                      name={
                        Platform.OS === "android"
                          ? "arrow-left"
                          : "chevron-left"
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
                    Add{" "}
                    <Text style={s.modalMachineName}>
                      {this.state.machine.name}
                    </Text>{" "}
                    to{" "}
                    <Text style={s.modalLocationName}>
                      {this.props.location.location.name}
                    </Text>
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
                  multiline={true}
                  placeholder={"You can also include a machine comment..."}
                  placeholderTextColor={theme.indigo4}
                  style={[{ padding: 5, height: 70 }, s.textInput]}
                  onChangeText={(condition) => this.setState({ condition })}
                  textAlignVertical="top"
                  underlineColorAndroid="transparent"
                />
                {this.state.machine.ic_eligible && (
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text>
                      Does machine have Stern Insider Connected enabled?
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Checkbox
                        value={this.state.ic_enabled}
                        onValueChange={() => this.onIcEnabledPressed(true)}
                        color={theme.purple}
                        style={s.checkStyle}
                      />
                      <Text style={[s.checkText, { marginRight: 20 }]}>
                        Yes
                      </Text>
                      <Checkbox
                        value={this.state.ic_enabled === false}
                        onValueChange={() => this.onIcEnabledPressed(false)}
                        color={theme.purple}
                        style={s.checkStyle}
                      />
                      <Text style={s.checkText}>No</Text>
                    </View>
                  </View>
                )}
                <PbmButton title={"Add"} onPress={this.addMachine} />
                <WarningButton
                  title={"Cancel"}
                  onPress={this.returnToLocationDetails}
                  onPress={this.returnToLocationDetails}
                />
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
              onChangeText={(query) =>
                this.handleSearch(query, this.state.machinesInView)
              }
              value={this.state.query}
              style={s.inputStyle}
              autoCorrect={false}
            />
          </View>
          {this.state.query.length > 0 && (
            <Pressable onPress={this.handleClear} style={{ height: 20 }}>
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
              onPress={this.toggleViewMachinesInMapArea}
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
                <Text style={{ color: theme.purple2 }}>{`${
                  machineList.length
                } machine${machineList.length > 1 ? "s" : ""} selected`}</Text>
              </View>
            )}
          </View>
        ) : null}
        <FlashList
          {...keyboardDismissProp}
          estimatedItemSize={41}
          keyboardShouldPersistTaps="always"
          data={this.state.machines}
          extraData={this.state.refresh}
          renderItem={multiSelect ? this.renderMultiSelectRow : this.renderRow}
          keyExtractor={this.keyExtractor}
          contentContainerStyle={{ backgroundColor: theme.base1 }}
        />
      </>
    );
  }
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
      left: 10,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      justifyContent: "center",
    },
    backButton: {
      position: "absolute",
      left: 10,
      top: 0,
      bottom: 0,
      justifyContent: "center",
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.theme == "dark" ? theme.base4 : theme.indigo4,
      borderWidth: 1,
      marginHorizontal: 30,
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
