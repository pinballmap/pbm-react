import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemeContext } from "../theme-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../components";
import { FlashList } from "@shopify/flash-list";

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
      <FlashList
        {...keyboardDismissProp}
        data={selectedOperators}
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
  });

FindOperator.propTypes = {
  operators: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object,
};

const mapStateToProps = ({ operators }) => ({ operators });
export default connect(mapStateToProps, null)(FindOperator);
