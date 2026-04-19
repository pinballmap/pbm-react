import React, { useContext, useEffect, useRef, useState } from "react";
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
import { invokeCallback } from "../utils/navigationCallbacks";

const FindManufacturer = ({
  navigation,
  route,
  machines: { machines = [] },
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { onGoBackId } = route.params;

  const allManufacturers = [
    ...new Set(machines.map((m) => m.manufacturer).filter(Boolean)),
  ].sort();

  const [filteredManufacturers, setFilteredManufacturers] =
    useState(allManufacturers);
  const [query, setQuery] = useState("");
  const [selectedManufacturers, setSelectedManufacturers] = useState(
    route.params?.selectedManufacturers || [],
  );
  const selectedRef = useRef(route.params?.selectedManufacturers || []);

  const updateSelected = (manufacturers) => {
    selectedRef.current = manufacturers;
    setSelectedManufacturers(manufacturers);
  };

  useEffect(() => {
    return navigation.addListener("beforeRemove", () => {
      invokeCallback(onGoBackId, selectedRef.current);
    });
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        selectedManufacturers.length > 0 ? (
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
  }, [selectedManufacturers]);

  const handleSearch = (search = "") => {
    const formattedQuery = search
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();
    setQuery(search);
    setFilteredManufacturers(
      allManufacturers.filter((m) =>
        m
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^\w\s]/g, "")
          .toLowerCase()
          .trim()
          .includes(formattedQuery),
      ),
    );
  };

  const toggleManufacturer = (manufacturer) => {
    if (selectedManufacturers.includes(manufacturer)) {
      updateSelected(selectedManufacturers.filter((m) => m !== manufacturer));
    } else {
      updateSelected([...selectedManufacturers, manufacturer]);
    }
  };

  const renderRow = ({ item, index }) => {
    const isSelected = selectedManufacturers.includes(item);
    return (
      <Pressable onPress={() => toggleManufacturer(item)}>
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
            <Text style={{ fontSize: 18 }}>{item}</Text>
            {isSelected ? (
              <MaterialIcons name="cancel" size={18} color="#fd0091" />
            ) : null}
          </View>
        )}
      </Pressable>
    );
  };

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
            placeholder="Filter manufacturers..."
            placeholderTextColor={theme.indigo4}
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
      <View style={s.multiSelect}>
        {selectedManufacturers.length === 0 ? (
          <Text style={{ color: theme.purple2 }}>0 manufacturers selected</Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: theme.purple2 }}
            >{`${selectedManufacturers.length} manufacturer${selectedManufacturers.length > 1 ? "s" : ""} selected`}</Text>
            <Pressable
              onPress={() => updateSelected([])}
              style={{ marginLeft: 8 }}
            >
              <MaterialIcons name="cancel" size={18} color="#fd0091" />
            </Pressable>
          </View>
        )}
      </View>
      <FlatList
        {...keyboardDismissProp}
        keyboardShouldPersistTaps="always"
        data={filteredManufacturers}
        renderItem={renderRow}
        keyExtractor={(item) => item}
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

FindManufacturer.propTypes = {
  machines: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ machines }) => ({ machines });
export default connect(mapStateToProps, null)(FindManufacturer);
