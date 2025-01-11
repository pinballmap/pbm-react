import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getRegions,
  fetchLocationTypes,
  fetchMachines,
  fetchOperators,
  getLocationAndMachineCounts,
  setUnitPreference,
  setDisplayInsiderConnectedBadge,
} from "../actions";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator } from "../components";
import { retrieveItem } from "../config/utils";
import { KEY_DISPLAY_INSIDER_CONNECTED_BADGE_PREFERENCE } from "../utils/constants";

const AppWrapper = ({
  children,
  getRegions,
  getLocationTypes,
  getMachines,
  getOperators,
  getLocationAndMachineCounts,
  setUnitPreference,
  setDisplayInsiderConnectedBadge,
}) => {
  const [loading, setIsLoading] = useState(true);
  // Global variable to let us swap out to use the staging server if a store tester logs in
  global.API_URL = process.env.API_URL;

  const loaded = async () => {
    await SplashScreen.hideAsync();
    setIsLoading(false);
  };

  useEffect(() => {
    async function isLoading() {
      const allSettled = (promises) => {
        return Promise.all(
          promises.map((promise) =>
            promise
              .then((value) => ({ status: "fulfilled", value }))
              .catch((reason) => ({ status: "rejected", reason })),
          ),
        );
      };

      retrieveItem("unitPreference").then((unitPreference) =>
        setUnitPreference(!!unitPreference),
      );

      retrieveItem(KEY_DISPLAY_INSIDER_CONNECTED_BADGE_PREFERENCE).then(
        (displayInsiderConnectedPreference) =>
          setDisplayInsiderConnectedBadge(!!displayInsiderConnectedPreference),
      );

      try {
        await allSettled([
          getRegions("/regions.json"),
          getLocationTypes("/location_types.json"),
          getMachines("/machines.json?no_details=1"),
          getOperators("/operators.json?no_details=1"),
          getLocationAndMachineCounts(
            "/regions/location_and_machine_counts.json",
          ),
        ]);
        loaded();
      } catch (e) {
        loaded();
      }
    }

    isLoading();
  }, []);

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
});
export default connect(null, mapDispatchToProps)(AppWrapper);
