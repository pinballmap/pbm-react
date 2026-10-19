import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import Text from "../components/PbmText";
import {
  ActivityIndicator,
  ButtonGroup,
  EventCard,
  Pagination,
  ScrollToTop,
} from "../components";
import { getCachedEvents, getEvents } from "../config/request";
import * as WebBrowser from "expo-web-browser";
import { boundsToCoords } from "../utils/utilityFunctions";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Events = ({ query, user }) => {
  const [gettingEvents, setGettingEvents] = useState(true);
  const [events, setEvents] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [pageState, setPageState] = useState({ searchKey: null, page: 1 });
  const [expandedIds, setExpandedIds] = useState([]);
  const [error, setError] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [radius, setRadius] = useState(50);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef(null);

  const theme = useTheme();
  const s = getStyles(theme);
  const insets = useSafeAreaInsets();

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const { neLat, neLon, swLat, swLon } = query;
  const distanceUnit = user.unitPreference ? "kilometers" : "miles";
  const distanceUnitAbbrev = user.unitPreference ? "km" : "mi";
  const buttons = [
    `50 ${distanceUnitAbbrev}`,
    `150 ${distanceUnitAbbrev}`,
    `250 ${distanceUnitAbbrev}`,
  ];

  const { lat: mapLat, lon: mapLon } = boundsToCoords({
    neLat,
    neLon,
    swLat,
    swLon,
  });

  // The page belongs to the search it was chosen for, so a new radius, map
  // location, or unit starts back at page 1 without an extra fetch
  const searchKey = `${radius}|${user.unitPreference}|${mapLat}|${mapLon}`;
  const page = pageState.searchKey === searchKey ? pageState.page : 1;

  // Changing radius triggers the fetch via the focus effect below
  const updateIdx = (selectedIdx) => {
    const radiusArray = [50, 150, 250];
    setSelectedIdx(selectedIdx);
    setRadius(radiusArray[selectedIdx]);
  };

  // Changing page triggers the fetch via the focus effect below
  const goToPage = (newPage) => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setPageState({ searchKey, page: newPage });
  };

  useFocusEffect(
    useCallback(() => {
      const distanceUnitParam = user.unitPreference ? "k" : "m";
      const showEvents = (data) => {
        setError(false);
        setEvents(data.events ? data.events : []);
        setPagy(data.pagy ?? null);
        setGettingEvents(false);
      };

      const cached = getCachedEvents(
        radius,
        distanceUnitParam,
        mapLat,
        mapLon,
        page,
      );
      if (cached) {
        showEvents(cached);
        return;
      }

      // Ignore responses that arrive after radius/location/page changed or the screen blurred
      let cancelled = false;
      setEvents([]);
      setGettingEvents(true);
      getEvents(radius, distanceUnitParam, mapLat, mapLon, page)
        .then((data) => {
          if (!cancelled) showEvents(data);
        })
        .catch(() => {
          if (cancelled) return;
          setError(true);
          setGettingEvents(false);
        });

      return () => {
        cancelled = true;
      };
    }, [radius, mapLat, mapLon, user.unitPreference, page]),
  );

  const toggleDetails = (id) =>
    setExpandedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      {gettingEvents ? (
        <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
          <ButtonGroup
            onPress={updateIdx}
            selectedIndex={selectedIdx}
            buttons={buttons}
            containerStyle={{ marginBottom: 10 }}
          />
          <View style={s.background}>
            <ActivityIndicator />
          </View>
        </ScrollView>
      ) : error ? (
        <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
          <ButtonGroup
            onPress={updateIdx}
            selectedIndex={selectedIdx}
            buttons={buttons}
            containerStyle={{ marginBottom: 10 }}
          />
          <Text
            style={[
              s.bold,
              {
                textAlign: "center",
                marginTop: 15,
                color: theme.text2,
              },
            ]}
          >
            {`Something went wrong. In the meantime, you can check the `}
            <Text
              style={[s.textLink, s.regular]}
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://www.ifpapinball.com/calendar/",
                )
              }
            >
              IFPA calendar
            </Text>
            {` on their site.`}
          </Text>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, backgroundColor: theme.base1 }}>
          <FlatList
            ref={flatListRef}
            data={events}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: insets.bottom,
            }}
            ListHeaderComponent={
              <>
                <ButtonGroup
                  onPress={updateIdx}
                  selectedIndex={selectedIdx}
                  buttons={buttons}
                />
                <Text style={[s.sourceText, s.regular]}>
                  {`Events mostly come from the `}
                  <Text
                    style={[s.smallLink, s.regular]}
                    onPress={() =>
                      WebBrowser.openBrowserAsync(
                        "https://www.ifpapinball.com/calendar/",
                      )
                    }
                  >
                    International Flipper Pinball Association (IFPA)
                  </Text>
                </Text>
              </>
            }
            ListEmptyComponent={
              <Text
                style={[s.problem, s.bold]}
              >{`No IFPA-sanctioned events found within ${radius} ${distanceUnit} of current map location.`}</Text>
            }
            renderItem={({ item }) => (
              <EventCard
                event={item}
                expanded={expandedIds.includes(item.id)}
                onToggleDetails={toggleDetails}
                showVenue
              />
            )}
            extraData={expandedIds}
            ListFooterComponent={
              pagy ? (
                <Pagination
                  page={page}
                  pages={pagy.pages}
                  hasNext={!!pagy.next}
                  onPageChange={goToPage}
                />
              ) : null
            }
            keyExtractor={(event) => `${event.id}`}
          />
          <ScrollToTop visible={showScrollToTop} onPress={scrollToTop} />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    regular: {
      fontFamily: "Nunito",
      fontWeight: "400",
    },
    bold: {
      fontFamily: "Nunito",
      fontWeight: "700",
    },
    background: {
      padding: 30,
      backgroundColor: theme.base1,
    },
    problem: {
      textAlign: "center",
      color: theme.text,
      marginTop: 20,
      paddingHorizontal: 10,
      fontSize: 15,
    },
    sourceText: {
      textAlign: "center",
      color: theme.text3,
      fontSize: 13,
      marginTop: 0,
      marginBottom: 5,
      paddingHorizontal: 20,
    },
    smallLink: {
      textDecorationLine: "underline",
      color: theme.pink1,
      fontSize: 13,
    },
    textLink: {
      textDecorationLine: "underline",
      color: "#7cc5ff",
    },
  });

const mapStateToProps = ({ query, user }) => ({
  query,
  user,
});
export default connect(mapStateToProps)(Events);
