import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AppState } from "react-native";
import { connect } from "react-redux";
import {
  getRegions,
  getRegionsSuccess,
  fetchLocationTypes,
  getLocationTypeSuccess,
  fetchMachines,
  getMachinesSuccess,
  fetchOperators,
  getOperatorsSuccess,
  getLocationAndMachineCounts,
  setUnitPreference,
  setDisplayInsiderConnectedBadge,
  setSelectedActivitiesFilter,
  setSelectedLocationActivitiesFilter,
} from "../actions";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator } from "../components";
import { getData } from "../config/request";
import { retrieveItem, storeItem } from "../config/utils";
import { KEY_DISPLAY_INSIDER_CONNECTED_BADGE_PREFERENCE } from "../utils/constants";
import {
  CACHE_KEY_REGIONS,
  CACHE_KEY_REGIONS_TIMESTAMP,
  CACHE_KEY_MACHINES,
  CACHE_KEY_MACHINES_TIMESTAMP,
  CACHE_KEY_LOCATION_TYPES,
  CACHE_KEY_LOCATION_TYPES_TIMESTAMP,
  CACHE_KEY_OPERATORS,
  CACHE_KEY_OPERATORS_TIMESTAMP,
} from "../utils/constants";

const ONE_HOUR_MS = 60 * 60 * 1000;

const RESOURCE_CONFIGS = [
  {
    statusType: "regions",
    url: "/regions.json",
    cacheKey: CACHE_KEY_REGIONS,
    timestampKey: CACHE_KEY_REGIONS_TIMESTAMP,
    extract: (apiData) => apiData.regions,
  },
  {
    statusType: "machines",
    url: "/machines.json?no_details=1",
    cacheKey: CACHE_KEY_MACHINES,
    timestampKey: CACHE_KEY_MACHINES_TIMESTAMP,
    extract: (apiData) => apiData.machines,
  },
  {
    statusType: "location_types",
    url: "/location_types.json",
    cacheKey: CACHE_KEY_LOCATION_TYPES,
    timestampKey: CACHE_KEY_LOCATION_TYPES_TIMESTAMP,
    extract: (apiData) => apiData.location_types,
  },
  {
    statusType: "operators",
    url: "/operators.json?no_details=1",
    cacheKey: CACHE_KEY_OPERATORS,
    timestampKey: CACHE_KEY_OPERATORS_TIMESTAMP,
    extract: (apiData) => apiData.operators,
  },
];

// Checks statuses.json and loads each resource from cache if up-to-date,
// or fetches fresh from the network if stale/missing. The loaders map each
// statusType to a dispatch function that accepts the raw data array.
const checkAndRefreshCachedData = async (loaders) => {
  const statusData = await getData("/statuses.json");
  const serverTimestamps = Object.fromEntries(
    statusData.statuses.map((s) => [s.status_type, s.updated_at]),
  );

  await Promise.all(
    RESOURCE_CONFIGS.map(async (resource) => {
      const serverTimestamp = serverTimestamps[resource.statusType];
      const cachedTimestamp = await retrieveItem(resource.timestampKey);

      if (cachedTimestamp === serverTimestamp) {
        const cachedData = await retrieveItem(resource.cacheKey);
        if (cachedData) {
          loaders[resource.statusType](cachedData);
          return;
        }
      }

      const apiData = await getData(resource.url);
      const extracted = resource.extract(apiData);
      await Promise.all([
        storeItem(resource.cacheKey, extracted),
        storeItem(resource.timestampKey, serverTimestamp),
      ]);
      loaders[resource.statusType](extracted);
    }),
  );
};

const AppWrapper = ({
  children,
  getRegions,
  getLocationTypes,
  getMachines,
  getOperators,
  getLocationAndMachineCounts,
  setUnitPreference,
  setDisplayInsiderConnectedBadge,
  setSelectedActivitiesFilter,
  setSelectedLocationActivitiesFilter,
  loadRegionsFromCache,
  loadMachinesFromCache,
  loadLocationTypesFromCache,
  loadOperatorsFromCache,
}) => {
  const [loading, setIsLoading] = useState(true);
  // Global variable to let us swap out to use the staging server if a store tester logs in
  global.API_URL = process.env.EXPO_PUBLIC_API_URL;

  const appStateRef = useRef(AppState.currentState);
  const lastStatusCheckRef = useRef(null);

  const loaded = async () => {
    await SplashScreen.hideAsync();
    setIsLoading(false);
  };

  const loaders = {
    regions: loadRegionsFromCache,
    machines: loadMachinesFromCache,
    location_types: loadLocationTypesFromCache,
    operators: loadOperatorsFromCache,
  };

  const refreshData = useCallback(async () => {
    try {
      await checkAndRefreshCachedData(loaders);
    } catch (e) {
      // statuses.json unavailable or another error — fall back to full fetch
      await Promise.allSettled([
        getRegions("/regions.json"),
        getLocationTypes("/location_types.json"),
        getMachines("/machines.json?no_details=1"),
        getOperators("/operators.json?no_details=1"),
      ]);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      retrieveItem("unitPreference").then((unitPreference) =>
        setUnitPreference(!!unitPreference),
      );
      retrieveItem(KEY_DISPLAY_INSIDER_CONNECTED_BADGE_PREFERENCE).then(
        (displayInsiderConnectedPreference) =>
          setDisplayInsiderConnectedBadge(!!displayInsiderConnectedPreference),
      );

      const savedActivities = (await retrieveItem("selectedActivities")) || [];
      if (savedActivities.length > 0) {
        setSelectedActivitiesFilter(savedActivities);
      }

      const savedLocationActivities =
        (await retrieveItem("selectedLocationActivities")) || [];
      if (savedLocationActivities.length > 0) {
        setSelectedLocationActivitiesFilter(savedLocationActivities);
      }

      try {
        await Promise.all([
          refreshData(),
          getLocationAndMachineCounts(
            "/regions/location_and_machine_counts.json",
          ),
        ]);
      } finally {
        lastStatusCheckRef.current = Date.now();
        loaded();
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        lastStatusCheckRef.current &&
        Date.now() - lastStatusCheckRef.current >= ONE_HOUR_MS
      ) {
        refreshData().then(() => {
          lastStatusCheckRef.current = Date.now();
        });
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [refreshData]);

  if (loading) return <ActivityIndicator />;

  return <>{children}</>;
};

AppWrapper.propTypes = {
  children: PropTypes.node,
  getRegions: PropTypes.func,
  getLocationTypes: PropTypes.func,
  getMachines: PropTypes.func,
  getOperators: PropTypes.func,
  getLocationAndMachineCounts: PropTypes.func,
  loadRegionsFromCache: PropTypes.func,
  loadMachinesFromCache: PropTypes.func,
  loadLocationTypesFromCache: PropTypes.func,
  loadOperatorsFromCache: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  getRegions: (url) => dispatch(getRegions(url)),
  getLocationTypes: (url) => dispatch(fetchLocationTypes(url)),
  getMachines: (url) => dispatch(fetchMachines(url)),
  getOperators: (url) => dispatch(fetchOperators(url)),
  getLocationAndMachineCounts: (url) =>
    dispatch(getLocationAndMachineCounts(url)),
  setUnitPreference: (pref) => dispatch(setUnitPreference(pref)),
  setDisplayInsiderConnectedBadge: (pref) =>
    dispatch(setDisplayInsiderConnectedBadge(pref)),
  setSelectedActivitiesFilter: (activities) =>
    dispatch(setSelectedActivitiesFilter(activities)),
  setSelectedLocationActivitiesFilter: (activities) =>
    dispatch(setSelectedLocationActivitiesFilter(activities)),
  loadRegionsFromCache: (regions) => dispatch(getRegionsSuccess({ regions })),
  loadMachinesFromCache: (machines) =>
    dispatch(getMachinesSuccess({ machines })),
  loadLocationTypesFromCache: (location_types) =>
    dispatch(getLocationTypeSuccess({ location_types })),
  loadOperatorsFromCache: (operators) =>
    dispatch(getOperatorsSuccess({ operators })),
});

export default connect(null, mapDispatchToProps)(AppWrapper);
