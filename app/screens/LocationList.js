import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FlatList, Linking, StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme-context";
import {
  ActivityIndicator,
  ButtonGroup,
  ConfirmationModal,
  LocationCard,
  Pagination,
  ScrollToTop,
  Text,
} from "../components";
import { getDistanceWithUnit } from "../utils/utilityFunctions";
import {
  selectLocationListFilterBy,
  getListLocations,
} from "../actions/locations_actions";
import { fetchLifeListMachineIds } from "../actions/user_actions";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NEAR_FILTER_IDX = 0;

const LocationList = ({
  locations,
  user,
  query,
  selectLocationListFilterBy,
  getListLocations,
  fetchLifeListMachineIds,
}) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [showNoLocationTrackingModal, setShowNoLocationTrackingModal] =
    useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef(null);
  const needsRefetchRef = useRef(true);
  const listNeedsRefetchRef = useRef(false);

  const {
    listLocations,
    listPagy,
    isFetchingList,
    locationTypes,
    listNeedsRefetch,
  } = locations;
  const {
    id: userId,
    loggedIn,
    lat,
    lon,
    locationTrackingServicesEnabled,
    unitPreference,
    lifeListMachineIds,
  } = user;
  const { swLat, swLon, neLat, neLon } = query;
  const filterIdx = locations.selectedLocationListFilter;
  const bounds = { swLat, swLon, neLat, neLon };
  const lifeListMachineIdSet = useMemo(
    () => new Set(lifeListMachineIds),
    [lifeListMachineIds],
  );

  useEffect(() => {
    listNeedsRefetchRef.current = listNeedsRefetch;
  }, [listNeedsRefetch]);

  // Keep the "not in list" counts fresh every time this screen is viewed,
  // since machines can be added/removed from the life list elsewhere (e.g.
  // MachineDetails) without this screen knowing.
  useEffect(() => {
    return navigation.addListener("focus", () => {
      if (loggedIn) fetchLifeListMachineIds();
    });
  }, [navigation, loggedIn]); // eslint-disable-line

  // Fetch on mount and when bounds change. Skip the fetch when merely returning
  // from a child screen (e.g. LocationDetails) so the user's page and scroll
  // position are preserved, unless machines were added/removed (listNeedsRefetch).
  // filterIdx is intentionally excluded: filter changes always call getListLocations
  // directly via updateIndex.
  useEffect(() => {
    needsRefetchRef.current = true;
    return navigation.addListener("focus", () => {
      if (!needsRefetchRef.current && !listNeedsRefetchRef.current) return;
      needsRefetchRef.current = false;
      setPage(1);
      getListLocations(bounds, 1, filterIdx);
    });
  }, [navigation, swLat, swLon, neLat, neLon]); // eslint-disable-line

  const updateIndex = (buttonIndex) => {
    if (buttonIndex === NEAR_FILTER_IDX && !locationTrackingServicesEnabled) {
      setShowNoLocationTrackingModal(true);
    }
    selectLocationListFilterBy(buttonIndex);
    setPage(1);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    getListLocations(bounds, 1, buttonIndex);
  };

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    getListLocations(bounds, newPage, filterIdx);
  };

  const displayLocations = listLocations;

  const showPagination = listPagy && listPagy.pages > 1;

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      <ConfirmationModal
        visible={showNoLocationTrackingModal}
        closeModal={() => setShowNoLocationTrackingModal(false)}
      >
        <View>
          <Text style={[s.confirmText, s.regular]}>
            Location tracking must be enabled to use this feature.
          </Text>
          <Text
            style={[s.confirmText, s.regular, s.link, s.margin10]}
            onPress={() => Linking.openSettings()}
          >
            Go to phone settings to enable
          </Text>
        </View>
      </ConfirmationModal>
      {isFetchingList ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ref={flatListRef}
          data={displayLocations}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <ButtonGroup
              onPress={updateIndex}
              selectedIndex={filterIdx}
              buttons={["Near", "A-Z", "# Pins", "Date"]}
              containerStyle={{ marginBottom: 10 }}
            />
          }
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: insets.bottom,
          }}
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
              notInListCount={
                loggedIn && lifeListMachineIds.length > 0 && item.machine_ids
                  ? item.machine_ids.filter(
                      (machineId) => !lifeListMachineIdSet.has(machineId),
                    ).length
                  : undefined
              }
              userId={userId}
              allAges={item.all_ages}
              paymentType={item.payment_type}
            />
          )}
          keyExtractor={(item) => `list-item-${item.id}`}
          ListFooterComponent={
            showPagination ? (
              <Pagination
                page={page}
                pages={listPagy.pages}
                hasNext={!!listPagy.next}
                onPageChange={goToPage}
              />
            ) : null
          }
        />
      )}
      <ScrollToTop visible={showScrollToTop} onPress={scrollToTop} />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    confirmText: {
      textAlign: "center",
      fontSize: 16,
      marginHorizontal: 10,
      paddingHorizontal: 30,
    },
    margin10: {
      marginTop: 10,
      marginBottom: 5,
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
    },
  });

LocationList.propTypes = {
  locations: PropTypes.object,
  user: PropTypes.object,
  query: PropTypes.object,
  selectLocationListFilterBy: PropTypes.func,
  getListLocations: PropTypes.func,
  fetchLifeListMachineIds: PropTypes.func,
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
  fetchLifeListMachineIds: () => dispatch(fetchLifeListMachineIds()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
