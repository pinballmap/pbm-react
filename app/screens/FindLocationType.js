import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { invokeCallback } from "../utils/navigationCallbacks";

const FindLocationType = ({
  navigation,
  route,
  locations: { locationTypes = [] },
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { onGoBackId } = route.params;
  const multiSelect = route.params?.multiSelect || false;

  const allLocationTypes = [
    { name: route.params?.optionNA ? "N/A (or unknown)" : "All", id: -1 },
    ...locationTypes,
  ];
  const [selectedLocationTypes, setLocationTypes] = useState(allLocationTypes);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(
    route.params?.selectedIds || [],
  );
  const selectedIdsRef = React.useRef(route.params?.selectedIds || []);

  const updateSelectedIds = (ids) => {
    selectedIdsRef.current = ids;
    setSelectedIds(ids);
  };

  useEffect(() => {
    if (!multiSelect) return;
    return navigation.addListener("beforeRemove", () => {
      invokeCallback(onGoBackId, selectedIdsRef.current);
    });
  }, [multiSelect, navigation]);

  useEffect(() => {
    if (!multiSelect) return;
    navigation.setOptions({
      headerRight: () =>
        selectedIds.length > 0 ? (
          <Pressable onPress={() => navigation.goBack()}>
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
  }, [multiSelect, selectedIds]);

  const handleSearch = (search = "") => {
    const formattedQuery = search
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();
    const selectedLocationTypes = allLocationTypes.filter((o) =>
      o.name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^\w\s]/g, "")
        .toLowerCase()
        .trim()
        .includes(formattedQuery),
    );
    setQuery(search);
    setLocationTypes(selectedLocationTypes);
  };

  const _selectLocationType = (id) => {
    invokeCallback(onGoBackId, id);
    navigation.goBack();
  };

  const _toggleLocationType = (id) => {
    if (id === -1) {
      updateSelectedIds([]);
      navigation.goBack();
      return;
    }
    if (selectedIds.includes(id)) {
      updateSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      updateSelectedIds([...selectedIds, id]);
    }
  };

  const renderRow = ({ item, index }) => {
    const isSelected = multiSelect && selectedIds.includes(item.id);
    return (
      <Pressable
        onPress={() =>
          multiSelect
            ? _toggleLocationType(item.id)
            : _selectLocationType(item.id)
        }
      >
        {({ pressed }) => (
          <View
            style={[
              {
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              },
              pressed
                ? { backgroundColor: theme.base4, opacity: 0.8 }
                : {
                    backgroundColor:
                      index % 2 === 0 ? theme.base1 : theme.base2,
                    opacity: 1,
                  },
            ]}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            {isSelected ? (
              <MaterialIcons name="cancel" size={18} color="#fd0091" />
            ) : null}
          </View>
        )}
      </Pressable>
    );
  };

  const _keyExtractor = (locationType) => `${locationType.id}`;
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  return (
    <>
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
            placeholder="Filter location types..."
            placeholderTextColor={theme.indigo4}
            onPress={() => handleSearch()}
            onChangeText={handleSearch}
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
      {multiSelect ? (
        <View style={s.multiSelect}>
          {selectedIds.length === 0 ? (
            <Text style={{ color: theme.purple2 }}>0 types selected</Text>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: theme.purple2 }}
              >{`${selectedIds.length} type${selectedIds.length > 1 ? "s" : ""} selected`}</Text>
              <Pressable
                onPress={() => updateSelectedIds([])}
                style={{ marginLeft: 8 }}
              >
                <MaterialIcons name="cancel" size={18} color="#fd0091" />
              </Pressable>
            </View>
          )}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <FlatList
          {...keyboardDismissProp}
          data={selectedLocationTypes}
          renderItem={renderRow}
          keyExtractor={_keyExtractor}
          contentContainerStyle={{
            backgroundColor: theme.base1,
            paddingBottom: insets.bottom,
          }}
        />
        <LinearGradient
          colors={[theme.base1 + "00", theme.base1]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            pointerEvents: "none",
          }}
        />
      </View>
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
    multiSelect: {
      alignItems: "center",
      paddingBottom: 5,
      backgroundColor: theme.base1,
    },
  });

FindLocationType.propTypes = {
  locationTypes: PropTypes.object,
  locations: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ locations }) => ({ locations });
export default connect(mapStateToProps, null)(FindLocationType);
