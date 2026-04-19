import React, { useContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FlatList, Linking, Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import {
  ButtonGroup,
  ConfirmationModal,
  LocationCard,
  Text,
} from "../components";
import { getDistanceWithUnit } from "../utils/utilityFunctions";
import {
  selectLocationListFilterBy,
  getListLocations,
} from "../actions/locations_actions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const NEAR_FILTER_IDX = 0;

const LocationList = ({
  locations,
  user,
  query,
  selectLocationListFilterBy,
  getListLocations,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [showNoLocationTrackingModal, setShowNoLocationTrackingModal] =
    useState(false);
  const flatListRef = useRef(null);

  const { listLocations, listPagy, isFetchingList, locationTypes } = locations;
  const { lat, lon, locationTrackingServicesEnabled, unitPreference } = user;
  const { swLat, swLon, neLat, neLon } = query;
  const filterIdx = locations.selectedLocationListFilter;
  const bounds = { swLat, swLon, neLat, neLon };

  // Fetch on mount and when navigation focus fires
  useEffect(() => {
    return navigation.addListener("focus", () => {
      setPage(1);
      getListLocations(bounds, 1, filterIdx);
    });
  }, [navigation, swLat, swLon, neLat, neLon, filterIdx]);

  const updateIndex = (buttonIndex) => {
    if (buttonIndex === NEAR_FILTER_IDX && !locationTrackingServicesEnabled) {
      setShowNoLocationTrackingModal(true);
    }
    selectLocationListFilterBy(buttonIndex);
    setPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    getListLocations(bounds, 1, buttonIndex);
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    getListLocations(bounds, newPage, filterIdx);
  };

  const displayLocations = listLocations;

  const showPagination = listPagy && listPagy.pages > 1;

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.base1, position: "relative" }}
    >
      <ConfirmationModal
        visible={showNoLocationTrackingModal}
        closeModal={() => setShowNoLocationTrackingModal(false)}
      >
        <Pressable>
          <View>
            <Text style={s.confirmText}>
              Location tracking must be enabled to use this feature!
            </Text>
            <Text
              style={[s.confirmText, s.link, s.margin10]}
              onPress={() => Linking.openSettings()}
            >
              Go to phone settings to enable.
            </Text>
            <MaterialCommunityIcons
              name="close-circle"
              size={35}
              onPress={() => setShowNoLocationTrackingModal(false)}
              style={s.xButton}
            />
          </View>
        </Pressable>
      </ConfirmationModal>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={filterIdx}
        buttons={["Near", "A-Z", "# Pins", "Date"]}
        containerStyle={s.buttonGroupContainer}
        textStyle={s.buttonGroupInactive}
        selectedButtonStyle={s.selButtonStyle}
        selectedTextStyle={s.selTextStyle}
        innerBorderStyle={s.innerBorderStyle}
      />
      {isFetchingList ? (
        <View style={s.loadingContainer}>
          <Text style={s.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={displayLocations}
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          renderItem={({ item }) => (
            <LocationCard
              locationType={
                item.location_type_id
                  ? (locationTypes.find(
                      (location) => location.id === item.location_type_id,
                    ) ?? {})
                  : {}
              }
              name={item.name}
              distance={
                locationTrackingServicesEnabled
                  ? getDistanceWithUnit(
                      lat,
                      lon,
                      item.lat,
                      item.lon,
                      unitPreference,
                    )
                  : undefined
              }
              street={item.street}
              city={item.city}
              state={item.state}
              zip={item.zip}
              machines={item.machine_names_first}
              navigation={navigation}
              id={item.id}
              numMachines={item.machine_count}
            />
          )}
          keyExtractor={(item) => `list-item-${item.id}`}
          ListFooterComponent={
            showPagination ? (
              <View style={s.paginationContainer}>
                <Pressable
                  onPress={() => goToPage(page - 1)}
                  disabled={page === 1}
                  style={[s.pageButton, page === 1 && s.pageButtonInactive]}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={22}
                    color={page === 1 ? theme.text3 : theme.text2}
                  />
                  <Text
                    style={[
                      s.pageButtonText,
                      page === 1 && s.pageButtonTextInactive,
                    ]}
                  >
                    Prev
                  </Text>
                </Pressable>
                <Text style={s.pageIndicator}>
                  {page} / {listPagy.pages}
                </Text>
                <Pressable
                  onPress={() => goToPage(page + 1)}
                  disabled={!listPagy.next}
                  style={[s.pageButton, !listPagy.next && s.pageButtonInactive]}
                >
                  <Text
                    style={[
                      s.pageButtonText,
                      !listPagy.next && s.pageButtonTextInactive,
                    ]}
                  >
                    Next
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={!listPagy.next ? theme.text3 : theme.text2}
                  />
                </Pressable>
              </View>
            ) : null
          }
        />
      )}
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
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    buttonGroupContainer: {
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
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      color: theme.text2,
      fontFamily: "Nunito-Regular",
      fontSize: 16,
    },
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
      fontFamily: "Nunito-Regular",
      color: theme.purple,
      paddingHorizontal: 30,
    },
    xButton: {
      position: "absolute",
      top: -10,
      right: 3,
      color: theme.theme == "dark" ? theme.base4 : theme.base1,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "visible",
    },
    margin10: {
      marginTop: 10,
      marginBottom: 5,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
    paginationContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 12,
    },
    pageButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: theme.white,
      borderWidth: 1,
      borderColor: theme.pink2,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    pageButtonInactive: {
      borderColor: theme.theme == "dark" ? theme.base3 : theme.base2,
      shadowOpacity: 0,
      elevation: 0,
    },
    pageButtonText: {
      color: theme.text2,
      fontFamily: "Nunito-SemiBold",
      fontSize: 14,
    },
    pageButtonTextInactive: {
      color: theme.text3,
    },
    pageIndicator: {
      color: theme.text3,
      fontFamily: "Nunito-Regular",
      fontSize: 14,
      minWidth: 40,
      textAlign: "center",
    },
  });

LocationList.propTypes = {
  locations: PropTypes.object,
  user: PropTypes.object,
  query: PropTypes.object,
  selectLocationListFilterBy: PropTypes.func,
  getListLocations: PropTypes.func,
};

const mapStateToProps = ({ locations, user, query }) => ({
  locations,
  user,
  query,
});
const mapDispatchToProps = (dispatch) => ({
  selectLocationListFilterBy: (idx) =>
    dispatch(selectLocationListFilterBy(idx)),
  getListLocations: (bounds, page, filterIdx) =>
    dispatch(getListLocations(bounds, page, filterIdx)),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
