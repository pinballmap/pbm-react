import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedMapLocation, selectingMapMarker } from "../selectors";
import { setSelectedMapMarker } from "../actions";
import LocationCard from "./LocationCard";
import { sleep } from "../utils";
import { ThemeContext } from "../theme-context";
import ActivityIndicator from "./ActivityIndicator";

const LocationBottomSheet = React.memo(({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const dispatch = useDispatch();
  const location = useSelector(getSelectedMapLocation);
  const isBlocking = useSelector(selectingMapMarker);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (isBlocking) {
        setLoading(true);
        await sleep(500);
        dispatch(setSelectedMapMarker());
        setLoading(false);
      }
    })();
  }, [isBlocking]);

  if (!location) return null;

  const { city, id, name, state, zip, machine_names, street } = location;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <LocationCard
          city={city}
          id={id}
          name={name}
          state={state}
          zip={zip}
          locationType={{}}
          machines={machine_names}
          street={street}
          navigation={navigation}
          isBottomSheet
        />
      )}
    </View>
  );
});

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: theme.base1,
      width: "100%",
      height: 150,
    },
  });

LocationBottomSheet.propTypes = {
  sheetRef: PropTypes.object,
  index: PropTypes.number,
  navigation: PropTypes.object,
  location: PropTypes.object,
};

export default LocationBottomSheet;
