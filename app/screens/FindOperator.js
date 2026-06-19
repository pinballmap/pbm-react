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
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import { Text } from "../components";
import { invokeCallback } from "../utils/navigationCallbacks";

const FindOperator = ({ navigation, route, operators: { operators = [] } }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const { onGoBackId } = route.params;
  const isFilterMode = !route.params?.optionNA;

  const allOperators = [
    ...(route.params?.optionNA ? [{ name: "N/A (or unknown)", id: -1 }] : []),
    ...operators,
  ];
  const [selectedOperators, setSelectedOperators] = useState(allOperators);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(
    route.params?.selectedOperatorId || "",
  );
  const selectedIdRef = useRef(route.params?.selectedOperatorId || "");

  const updateSelectedId = (id) => {
    selectedIdRef.current = id;
    setSelectedId(id);
  };

  useEffect(() => {
    if (!isFilterMode) return;
    return navigation.addListener("beforeRemove", () => {
      invokeCallback(onGoBackId, selectedIdRef.current || -1);
    });
  }, [navigation]);

  const handleSearch = (search = "") => {
    const formattedQuery = search
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^\w\s]/g, "")
      .toLowerCase()
      .trim();
    const operators = allOperators.filter((o) =>
      o.name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^\w\s]/g, "")
        .toLowerCase()
        .trim()
        .includes(formattedQuery),
    );
    setQuery(search);
    setSelectedOperators(operators);
  };

  const _selectOperator = (id) => {
    if (!isFilterMode) {
      invokeCallback(onGoBackId, id);
      navigation.goBack();
    } else {
      updateSelectedId(id);
      navigation.goBack();
    }
  };

  const _clearOperator = () => {
    updateSelectedId("");
  };

  const renderRow = ({ item, index }) => {
    const isSelected = isFilterMode && item.id === selectedId;
    return (
      <Pressable onPress={() => _selectOperator(item.id)}>
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
              <Pressable onPress={_clearOperator}>
                <MaterialIcons name="cancel" size={18} color="#fd0091" />
              </Pressable>
            ) : null}
          </View>
        )}
      </Pressable>
    );
  };

  const _keyExtractor = (operator) => `${operator.id}`;
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
            placeholder="Filter operators..."
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
      {isFilterMode && selectedId ? (
        <View style={s.selected}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: theme.purple2 }}>1 operator selected</Text>
            <Pressable onPress={_clearOperator} style={{ marginLeft: 8 }}>
              <MaterialIcons name="cancel" size={18} color="#fd0091" />
            </Pressable>
          </View>
        </View>
      ) : null}
      <FlatList
        {...keyboardDismissProp}
        data={selectedOperators}
        renderItem={renderRow}
        keyExtractor={_keyExtractor}
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
    selected: {
      alignItems: "center",
      paddingBottom: 5,
      backgroundColor: theme.base1,
    },
  });

FindOperator.propTypes = {
  operators: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ operators }) => ({ operators });
export default connect(mapStateToProps, null)(FindOperator);
