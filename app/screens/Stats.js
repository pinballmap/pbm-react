import React, { useContext, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../theme-context";
import { getData } from "../config/request";
import { triggerUpdateBounds } from "../actions";
import { Screen, Text } from "../components";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Stats = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const s = getStyles(theme);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const getLocationsByCity = async (city, state) => {
    try {
      const stateParam = state ? `&by_state_id=${state}` : "";
      const { locations } = await getData(
        `/locations?by_city_id=${city}${stateParam}&no_details=1`,
      );
      if (!Array.isArray(locations) || !locations.length) throw new Error();

      const bounds = locations.reduce((prev, cur) => {
        let { swLat, swLon, neLat, neLon } = prev;
        if (!neLat || cur.lat > neLat) neLat = parseFloat(cur.lat);
        if (!swLat || cur.lat < swLat) swLat = parseFloat(cur.lat);
        if (!neLon || cur.lon > neLon) neLon = parseFloat(cur.lon);
        if (!swLon || cur.lon < swLon) swLon = parseFloat(cur.lon);
        return { swLat, swLon, neLon, neLat };
      }, {});

      dispatch(triggerUpdateBounds(bounds));
      navigation.navigate("MapStack");
    } catch (e) {
      Alert.alert("No locations found for that city.");
    }
  };

  const [counts, setCounts] = useState({
    num_locations: null,
    num_lmxes: null,
    total_user_count: null,
    total_user_submission_count: null,
    total_user_submission_count_week: null,
  });
  const [topMachines, setTopMachines] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topCitiesByMachine, setTopCitiesByMachine] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      getData("/regions/location_and_machine_counts.json"),
      getData("/users/total_user_count.json"),
      getData("/user_submissions/total_user_submission_count.json"),
      getData("/user_submissions/total_user_submission_count_week.json"),
      getData("/location_machine_xrefs/top_n_machines.json"),
      getData("/locations/top_locations.json"),
      getData("/locations/top_cities.json"),
      getData("/locations/top_cities_by_machine.json"),
      getData("/user_submissions/top_users.json"),
    ]).then(
      ([
        locationCounts,
        userCount,
        submissionCount,
        submissionCountWeek,
        machines,
        locations,
        cities,
        citiesByMachine,
        users,
      ]) => {
        if (isCancelled) return;

        setCounts({
          num_locations: locationCounts?.num_locations ?? null,
          num_lmxes: locationCounts?.num_lmxes ?? null,
          total_user_count: userCount?.total_user_count ?? null,
          total_user_submission_count:
            submissionCount?.total_user_submission_count ?? null,
          total_user_submission_count_week:
            submissionCountWeek?.total_user_submission_count_week ?? null,
        });

        if (machines?.machines) setTopMachines(machines.machines);
        if (Array.isArray(locations)) setTopLocations(locations);
        if (Array.isArray(cities)) setTopCities(cities);
        if (Array.isArray(citiesByMachine))
          setTopCitiesByMachine(citiesByMachine);
        if (Array.isArray(users)) setTopUsers(users);
      },
    );

    return () => {
      isCancelled = true;
    };
  }, []);

  const fmt = (val) => (val !== null ? formatNumWithCommas(val) : "...");

  const cityDisplay = (city, state) => (state ? `${city}, ${state}` : city);

  return (
    <SafeAreaView edges={["right", "left"]} style={s.background}>
      <LinearGradient
        colors={[theme.base1 + "00", theme.base1]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 50,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <Screen contentContainerStyle={{ paddingBottom: insets.bottom }}>
        <View style={s.child}>
          <Text style={s.text}>
            {`Started mapping in 2008. Added "user accounts" in 2017, and since 2018/19 improved the stats we tracked.`}
          </Text>
          <Text style={s.text}>
            Currently listing{" "}
            <Text style={s.bold}>{fmt(counts.num_locations)}</Text> locations
            and <Text style={s.bold}>{fmt(counts.num_lmxes)}</Text> machines.
          </Text>
          <Text style={s.text}>
            <Text style={s.bold}>{fmt(counts.total_user_count)}</Text>{" "}
            registered user accounts (since 2017).
          </Text>
          <Text style={s.text}>
            <Text style={s.bold}>
              {fmt(counts.total_user_submission_count)}
            </Text>{" "}
            map edits (since 2015-ish).
          </Text>
          <Text style={s.text}>
            <Text style={s.bold}>
              {fmt(counts.total_user_submission_count_week)}
            </Text>{" "}
            map edits in the last week.
          </Text>

          <Text style={s.category}>Top 25 Machines</Text>
          {topMachines.map((machine, index, arr) => (
            <View
              key={index}
              style={[s.row, index === arr.length - 1 && s.rowLast]}
            >
              <Text style={s.rank}>{index + 1}.</Text>
              <View style={s.rowMain}>
                <Text style={s.rowName}>{machine.machine_name}</Text>
                <Text style={s.rowSub}>
                  {machine.manufacturer}, {machine.year}
                </Text>
              </View>
              <Text style={s.rowCount}>
                {formatNumWithCommas(machine.machine_count)}
              </Text>
            </View>
          ))}

          <Text style={s.category}>25 Biggest Locations</Text>
          {topLocations.map((location, index, arr) => (
            <Pressable
              key={index}
              style={[s.row, index === arr.length - 1 && s.rowLast]}
              onPress={() =>
                navigation.navigate("LocationDetails", { id: location.id })
              }
            >
              <Text style={s.rank}>{index + 1}.</Text>
              <View style={s.rowMain}>
                <Text style={[s.rowName, s.underline]}>{location.name}</Text>
                <Text style={s.rowSub}>
                  {cityDisplay(location.city, location.state)}
                </Text>
              </View>
              <Text style={s.rowCount}>
                {formatNumWithCommas(location.machine_count)}
              </Text>
            </Pressable>
          ))}

          <Text style={s.category}>Top 10 Cities by Locations</Text>
          {topCities.map((city, index, arr) => (
            <Pressable
              key={index}
              style={[s.row, index === arr.length - 1 && s.rowLast]}
              onPress={() => getLocationsByCity(city.city, city.state)}
            >
              <Text style={s.rank}>{index + 1}.</Text>
              <Text style={[s.rowMain, s.rowName, s.underline]}>
                {cityDisplay(city.city, city.state)}
              </Text>
              <Text style={s.rowCount}>
                {formatNumWithCommas(city.location_count)}
              </Text>
            </Pressable>
          ))}

          <Text style={s.category}>Top 10 Cities by Machines</Text>
          {topCitiesByMachine.map((city, index, arr) => (
            <Pressable
              key={index}
              style={[s.row, index === arr.length - 1 && s.rowLast]}
              onPress={() => getLocationsByCity(city.city, city.state)}
            >
              <Text style={s.rank}>{index + 1}.</Text>
              <Text style={[s.rowMain, s.rowName, s.underline]}>
                {cityDisplay(city.city, city.state)}
              </Text>
              <Text style={s.rowCount}>
                {formatNumWithCommas(city.machines_count)}
              </Text>
            </Pressable>
          ))}

          <Text style={s.category}>Top 25 Users</Text>
          {topUsers.map((user, index, arr) => (
            <Pressable
              key={index}
              style={[s.row, index === arr.length - 1 && s.rowLast]}
              onPress={() =>
                navigation.navigate("UserProfilePublic", {
                  userId: user.id,
                  username: user.username,
                })
              }
            >
              <Text style={s.rank}>{index + 1}.</Text>
              <Text style={[s.rowMain, s.rowName, s.underline]}>
                {user.username}
              </Text>
              <Text style={s.rowCount}>
                {formatNumWithCommas(user.user_submissions_count)}
              </Text>
            </Pressable>
          ))}
        </View>
      </Screen>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: theme.base1,
    },
    child: {
      margin: "auto",
      padding: 15,
    },
    text: {
      fontSize: 15,
      color: theme.text2,
      lineHeight: 22,
      marginBottom: 10,
    },
    bold: {
      fontFamily: "Nunito-Bold",
    },
    category: {
      fontFamily: "Nunito-Bold",
      fontSize: 17,
      textAlign: "center",
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: "#adc7fd",
      color: "#503d49",
      textTransform: "uppercase",
      marginHorizontal: -15,
      marginBottom: 5,
      marginTop: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 7,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    rank: {
      width: 30,
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
    },
    rowMain: {
      flex: 1,
      marginRight: 8,
      justifyContent: "center",
    },
    rowName: {
      fontSize: 15,
      color: theme.text2,
      fontFamily: "Nunito-SemiBold",
      lineHeight: 20,
    },
    rowSub: {
      fontSize: 13,
      color: theme.text3,
      lineHeight: 18,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowCount: {
      fontSize: 14,
      color: theme.text3,
      fontFamily: "Nunito-SemiBold",
      textAlign: "right",
    },
    underline: {
      textDecorationLine: "underline",
    },
  });

import PropTypes from "prop-types";

Stats.propTypes = {
  navigation: PropTypes.object,
};

export default Stats;
