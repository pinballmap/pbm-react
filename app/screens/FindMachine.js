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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ButtonGroup, SearchBar } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  addMachineToLocation,
  addMachineToList,
  removeMachineFromList,
  setMachineFilter,
} from "../actions";
import { PbmButton, Text, WarningButton } from "../components";

import { alphaSortNameObj } from "../utils/utilityFunctions";

let deviceHeight = Dimensions.get("window").height;

const getDisplayText = (machine, theme) => (
  <Text style={{ fontSize: 18 }}>
    <Text style={{ fontFamily: "boldFont", color: theme.text }}>
      {machine.name}
    </Text>
    <Text
      style={{ color: theme.text3, fontFamily: "mediumFont" }}
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
          { display: "flex", flexDirection: "row", padding: 8 },
          pressed
            ? { backgroundColor: theme.base4, opacity: 0.8 }
            : { backgroundColor, opacity: 1 },
        ]}
      >
        <Text style={{ fontSize: 18 }}>{getDisplayText(machine, theme)}</Text>
        {selected ? (
          <MaterialIcons
            name="cancel"
            size={18}
            color="#fd0091"
            style={{ paddingTop: 3, paddingLeft: 5 }}
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
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.props.route.params?.machineFilter
        ? "Select Machine to Filter"
        : "Select Machines",
      headerRight: () =>
        this.props.route.params?.showDone ? (
          <Pressable onPress={() => this.props.navigation.goBack(null)}>
            {({ pressed }) => (
              <View
                style={{
                  backgroundColor: "#fec3e7",
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: pressed ? "#95867c" : "#9718b1",
                    fontSize: 18,
                    fontFamily: "boldFont",
                  }}
                >
                  Done
                </Text>
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
                  backgroundColor: "#fec3e7",
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  borderRadius: 10,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: pressed ? "#95867c" : "#9718b1",
                    fontSize: 18,
                    fontFamily: "boldFont",
                  }}
                >
                  Done
                </Text>
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
    this.props.addMachineToLocation(this.state.machine, this.state.condition);
    this.setState({ showModal: false });
    this.props.navigation.goBack();
  };

  cancelAddMachine = () => {
    this.setState({
      showModal: false,
      machine: {},
      condition: "",
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
    const selectedIdx = this.state.machinesInView ? 1 : 0;
    const theme = this.context.theme;
    const s = getStyles(theme);
    const keyboardDismissProp =
      Platform.OS === "ios"
        ? { keyboardDismissMode: "on-drag" }
        : { onScrollBeginDrag: Keyboard.dismiss };
    return (
      <>
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => {}}
          transparent={false}
        >
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <KeyboardAwareScrollView
              {...keyboardDismissProp}
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps="handled"
              style={s.background}
            >
              <View style={s.verticalAlign}>
                <Text style={s.modalTitle}>
                  Add{" "}
                  <Text style={s.modalPurple2}>{this.state.machine.name}</Text>{" "}
                  to{" "}
                  <Text style={s.modalPurple}>
                    {this.props.location.location.name}
                  </Text>
                </Text>
                <TextInput
                  multiline={true}
                  placeholder={"You can also include a machine comment..."}
                  placeholderTextColor={theme.indigo4}
                  numberOfLines={3}
                  style={[{ padding: 5, height: 70 }, s.textInput]}
                  onChangeText={(condition) => this.setState({ condition })}
                  textAlignVertical="top"
                  underlineColorAndroid="transparent"
                />
                <PbmButton title={"Add"} onPress={this.addMachine} />
                <WarningButton
                  title={"Cancel"}
                  onPress={this.cancelAddMachine}
                />
              </View>
            </KeyboardAwareScrollView>
          </Pressable>
        </Modal>
        <SearchBar
          lightTheme={theme.theme !== "dark"}
          placeholder="Filter machines..."
          placeholderTextColor={theme.indigo4}
          platform="default"
          searchIcon={
            <MaterialIcons name="search" size={25} color={theme.indigo4} />
          }
          clearIcon={
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={theme.indigo4}
              onPress={() => this.handleSearch("")}
            />
          }
          onChangeText={(query) =>
            this.handleSearch(query, this.state.machinesInView)
          }
          inputStyle={{ color: theme.text, fontFamily: "regularFont" }}
          value={this.state.query}
          inputContainerStyle={s.filterInput}
          containerStyle={{
            backgroundColor: theme.base1,
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
          autoCorrect={false}
        />
        {!multiSelect ? (
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
              <Text style={{ color: theme.pink1 }}>0 machines selected</Text>
            ) : (
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={{ color: theme.pink1 }}>{`${
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
    filterInput: {
      height: 35,
      backgroundColor: theme.white,
      borderRadius: 25,
      borderColor: theme.indigo4,
      borderWidth: 1,
      borderBottomWidth: 1,
      marginHorizontal: 5,
    },
    textInput: {
      backgroundColor: theme.white,
      borderColor: theme.indigo4,
      borderWidth: 1,
      marginHorizontal: 30,
      marginTop: 15,
      marginBottom: 10,
      borderRadius: 10,
      fontFamily: "regularFont",
      fontSize: 16,
      color: theme.text,
    },
    verticalAlign: {
      flexDirection: "column",
      justifyContent: "center",
      height: deviceHeight,
    },
    multiSelect: {
      alignItems: "center",
      padding: 5,
      backgroundColor: theme.pink2,
    },
    buttonGroupContainer: {
      height: 40,
      marginBottom: 10,
      borderWidth: 0,
      borderRadius: 25,
      backgroundColor: theme.base3,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 6,
      elevation: 6,
      overflow: "visible",
    },
    buttonGroupInactive: {
      color: theme.text2,
      fontSize: 14,
      fontFamily: "mediumFont",
    },
    innerBorderStyle: {
      width: 0,
    },
    selButtonStyle: {
      borderWidth: 4,
      borderColor: theme.base4,
      backgroundColor: theme.white,
      borderRadius: 25,
    },
    selTextStyle: {
      color: theme.text2,
      fontFamily: "boldFont",
    },
    machineName: {
      fontFamily: "boldFont",
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
      fontSize: 18,
      fontFamily: "boldFont",
    },
    modalPurple: {
      color: theme.theme == "dark" ? theme.purple : theme.purple2,
      fontSize: 18,
      fontFamily: "blackFont",
    },
    modalPurple2: {
      color: theme.theme == "dark" ? theme.purple2 : theme.purple,
      fontSize: 18,
      fontFamily: "blackFont",
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
  addMachineToLocation: (machine, condition) =>
    dispatch(addMachineToLocation(machine, condition)),
  addMachineToList: (machine) => dispatch(addMachineToList(machine)),
  removeMachineFromList: (machine) => dispatch(removeMachineFromList(machine)),
  setMachineFilter: (machine) => dispatch(setMachineFilter(machine)),
});
export default connect(mapStateToProps, mapDispatchToProps)(FindMachine);
