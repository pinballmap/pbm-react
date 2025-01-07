import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Keyboard, Platform, Pressable, StyleSheet, View } from "react-native";
import { SearchBar } from "@rneui/base";
import { ThemeContext } from "../theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../components";
import { FlashList } from "@shopify/flash-list";
import { isThemeDark } from "../utils/themes";

const FindOperator = ({ navigation, route, operators: { operators = [] } }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const { onGoBack } = route.params;

  const allOperators = [
    { name: route.params?.type === "search" ? "N/A" : "All", id: -1 },
    ...operators,
  ];
  const [selectedOperators, setSelectedOperators] = useState(allOperators);
  const [query, setQuery] = useState("");

  const handleSearch = (search = "") => {
    const formattedQuery = search.toLowerCase();
    const operators = allOperators.filter((o) =>
      o.name.toLowerCase().includes(formattedQuery),
    );
    setQuery(search);
    setSelectedOperators(operators);
  };

  const _selectOperator = (id) => {
    onGoBack(id);
    navigation.goBack();
  };

  const renderRow = ({ item, index }) => (
    <Pressable onPress={() => _selectOperator(item.id)}>
      {({ pressed }) => (
        <View
          style={[
            { padding: 8 },
            pressed
              ? { backgroundColor: theme.base4, opacity: 0.8 }
              : {
                  backgroundColor: index % 2 === 0 ? theme.base1 : theme.base2,
                  opacity: 1,
                },
          ]}
        >
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
        </View>
      )}
    </Pressable>
  );

  const _keyExtractor = (operator) => `${operator.id}`;
  const keyboardDismissProp =
    Platform.OS === "ios"
      ? { keyboardDismissMode: "on-drag" }
      : { onScrollBeginDrag: Keyboard.dismiss };

  return (
    <>
      <SearchBar
        lightTheme={theme.theme !== "dark"}
        placeholder="Filter operators..."
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
            onPress={() => handleSearch()}
          />
        }
        onChangeText={handleSearch}
        inputStyle={{ color: theme.text, fontFamily: "Nunito-Regular" }}
        value={query}
        inputContainerStyle={s.filterInput}
        containerStyle={{
          backgroundColor: theme.base1,
          borderBottomWidth: 0,
          borderTopWidth: 0,
        }}
      />
      <FlashList
        {...keyboardDismissProp}
        data={selectedOperators}
        estimatedItemSize={41}
        renderItem={renderRow}
        keyExtractor={_keyExtractor}
        contentContainerStyle={{
          backgroundColor: theme.base1,
          paddingBottom: 20,
        }}
      />
    </>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    filterInput: {
      height: 40,
      backgroundColor: theme.white,
      borderRadius: 25,
      borderColor: isThemeDark(theme.theme) ? theme.base4 : theme.indigo4,
      borderWidth: 1,
      borderBottomWidth: 1,
      marginHorizontal: 10,
    },
  });

FindOperator.propTypes = {
  operators: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ operators }) => ({ operators });
export default connect(mapStateToProps, null)(FindOperator);
