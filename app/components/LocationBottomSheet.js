import React, { useContext, useMemo } from "react";
import { Platform, Share, StyleSheet, View, Pressable } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ThemeContext } from "../theme-context";
import Text from "./PbmText";
import FavoriteLocation from "./FavoriteLocation";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import { formatAddress, getDistanceWithUnit } from "../utils/utilityFunctions";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import { CustomIcon } from "../components";
import { setSelectedMapLocation } from "../actions";
import {
  ALL_AGES_AT_TIMES,
  ALL_AGES_YES,
  PAYMENT_TYPE_FREE_PLAY,
} from "../utils/constants";

const NUM_MACHINES_TO_SHOW = 5;

// Drag-up past this (or a fast upward flick) opens LocationDetails;
// drag-down past this (or a fast downward flick) dismisses the sheet.
const DRAG_UP_TO_OPEN = -60;
const DRAG_DOWN_TO_DISMISS = 60;
const FLING_VELOCITY = 800;
// How far the sheet is allowed to rubber-band upward. The backdrop below
// is sized to this so it always fully covers the gap left behind.
const MAX_DRAG_UP = -90;
// The backdrop's fixed height (see styles.backdrop). Content height varies
// (machine list length, whether the type/age/payment row renders), so the
// downward drag is capped relative to the sheet's *measured* height rather
// than a fixed pixel value — otherwise a cap tuned for tall content lets a
// short sheet drag its top edge below the backdrop's, and a cap tuned for
// short content barely lets a tall sheet move at all.
const BACKDROP_HEIGHT = 100;
// How far off-screen the sheet slides on dismiss.
const EXIT_DISTANCE = 600;
// Fade-out duration for dismiss. Fixed, rather than tied to the slide
// spring's velocity-dependent settle time, so unmount timing is predictable.
const EXIT_FADE_DURATION = 200;

const LocationBottomSheet = React.memo(
  ({ navigation, location, locations, user, setSelectedMapLocation }) => {
    const { theme } = useContext(ThemeContext);
    const s = getStyles(theme);

    const translateY = useSharedValue(0);
    const exitOpacity = useSharedValue(1);
    // Measured on layout since content height varies; starts at the
    // stylesheet's minHeight so the first drag (before layout fires) has a
    // sane, if conservative, cap.
    const sheetHeight = useSharedValue(130);
    const onSheetLayout = (e) => {
      sheetHeight.value = e.nativeEvent.layout.height;
    };

    const {
      city,
      id,
      name,
      state,
      zip,
      machine_names_first_no_year,
      machine_count,
      street,
      location_type_id,
      lat,
      lon,
      payment_type,
    } = location;
    const cityState = state ? `${city}, ${state}` : city;

    const locationType = locations.locationTypes.find(
      (location) => location.id === location_type_id,
    );

    const onPress = () => {
      navigation.navigate("LocationDetails", { id });
    };

    const onDismiss = () => {
      setSelectedMapLocation(null);
    };

    const panGesture = useMemo(
      () =>
        Gesture.Pan()
          // require some deliberate vertical movement before the sheet
          // starts tracking the finger, so it doesn't fight the tap below
          .activeOffsetY([-10, 10])
          .failOffsetX([-20, 20])
          .onUpdate((e) => {
            if (e.translationY < 0) {
              // resist dragging up (it's a nudge, not real travel — the
              // sheet's height doesn't change) and cap it so the backdrop
              // above always covers the gap
              translateY.value = Math.max(MAX_DRAG_UP, e.translationY * 0.4);
            } else {
              // track 1:1, but stop before the sheet's top edge passes
              // below the backdrop's — past that point there's nothing
              // behind it but the map
              const maxDown = Math.max(0, sheetHeight.value - BACKDROP_HEIGHT);
              translateY.value = Math.min(e.translationY, maxDown);
            }
          })
          .onEnd((e) => {
            const draggedUp =
              e.translationY < DRAG_UP_TO_OPEN || e.velocityY < -FLING_VELOCITY;
            const draggedDown =
              e.translationY > DRAG_DOWN_TO_DISMISS ||
              e.velocityY > FLING_VELOCITY;

            if (draggedUp) {
              translateY.value = withTiming(-30, { duration: 150 });
              runOnJS(onPress)();
            } else if (draggedDown) {
              // carry the release velocity into the exit so a fast flick
              // keeps moving fast and a slow drag-past-threshold eases out
              // gently, instead of both snapping through the same fixed
              // timing curve
              translateY.value = withSpring(EXIT_DISTANCE, {
                velocity: e.velocityY,
                damping: 20,
                stiffness: 90,
              });
              exitOpacity.value = withTiming(
                0,
                { duration: EXIT_FADE_DURATION },
                (finished) => {
                  if (finished) {
                    runOnJS(onDismiss)();
                  }
                },
              );
            } else {
              translateY.value = withSpring(0, {
                damping: 18,
                stiffness: 220,
              });
            }
          }),
      [translateY, sheetHeight, exitOpacity, onPress, onDismiss],
    );

    const animatedSheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: exitOpacity.value,
    }));

    const animatedBackdropStyle = useAnimatedStyle(() => ({
      opacity: exitOpacity.value,
    }));

    return (
      <>
        {/* Color-matched fill behind the sheet so dragging it up doesn't
            reveal the map through the gap left below it. */}
        <Animated.View
          style={[s.backdrop, animatedBackdropStyle]}
          pointerEvents="none"
        />
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[s.container, animatedSheetStyle]}
            onLayout={onSheetLayout}
          >
            <Pressable
              style={({ pressed }) => (pressed ? s.pressed : s.notPressed)}
              onPress={onPress}
            >
              <View style={s.flexi}>
                <View style={{ zIndex: 10, flex: 1 }}>
                  <View style={s.locationNameContainer}>
                    <View style={s.nameItem}>
                      <Text style={s.locationName}>{name}</Text>
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        [
                          { marginRight: 4 },
                          pressed ? s.pressed : s.notPressed,
                        ],
                      ]}
                      onPress={async () => {
                        await Share.share({
                          message: `${location.name} https://pinballmap.com/map/?by_location_id=${location.id}`,
                        });
                      }}
                    >
                      <MaterialIcons
                        name={"ios-share"}
                        color={theme.theme == "dark" ? theme.text3 : "#786D7A"}
                        size={24}
                        style={{
                          height: 24,
                          width: 24,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                    </Pressable>
                    <View style={s.heartItem}>
                      <FavoriteLocation
                        locationId={id}
                        navigation={navigation}
                        removeFavorite={(cb) => cb()}
                      />
                    </View>
                  </View>
                  <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "top" }}>
                      <MaterialIcons name="location-on" style={s.metaIcon} />
                      <Text
                        style={[s.address]}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                      >
                        {formatAddress(street, cityState, zip)}
                      </Text>
                    </View>
                    <View style={s.margin}>
                      {machine_names_first_no_year.length === 0 ? (
                        <Text style={[s.plus, s.italic]}>No machines</Text>
                      ) : (
                        <Text>
                          {machine_names_first_no_year.map((name, index) => (
                            <Text key={name}>
                              <Text style={s.machineName}>
                                {`${name}${
                                  index !==
                                  machine_names_first_no_year.length - 1
                                    ? " \u2022 "
                                    : ""
                                }`}
                              </Text>
                            </Text>
                          ))}
                          {machine_count > NUM_MACHINES_TO_SHOW ? (
                            <Text style={[s.plus, s.italic]}>{`  ...plus ${
                              machine_count - NUM_MACHINES_TO_SHOW
                            } more!`}</Text>
                          ) : null}
                        </Text>
                      )}
                    </View>
                  </View>
                  {locationType ||
                  user.locationTrackingServicesEnabled ||
                  location.all_ages === ALL_AGES_YES ||
                  location.all_ages === ALL_AGES_AT_TIMES ||
                  payment_type === PAYMENT_TYPE_FREE_PLAY ? (
                    <View style={s.locationTypeContainer}>
                      {user.locationTrackingServicesEnabled ? (
                        <View style={s.vertAlign}>
                          <MaterialCommunityIcons
                            name="compass"
                            style={s.icon}
                          />
                          <Text
                            style={{
                              color: theme.text2,
                              fontFamily: "Nunito-Bold",
                            }}
                          >
                            {getDistanceWithUnit(
                              user.lat,
                              user.lon,
                              lat,
                              lon,
                              user.unitPreference,
                            )}
                          </Text>
                        </View>
                      ) : null}
                      {locationType ? (
                        <View style={s.vertAlign}>
                          <CustomIcon
                            name={locationType.icon}
                            size={30}
                            color={
                              theme.theme == "dark" ? theme.pink1 : theme.pink3
                            }
                            type={locationType.library}
                            style={s.icon}
                          />
                          <Text
                            style={{
                              color: theme.text2,
                              fontFamily: "Nunito-Bold",
                            }}
                          >
                            {locationType.name}
                          </Text>
                        </View>
                      ) : null}
                      {location.all_ages === ALL_AGES_YES ||
                      location.all_ages === ALL_AGES_AT_TIMES ? (
                        <View style={s.vertAlign}>
                          <MaterialCommunityIcons
                            name="human-male-child"
                            style={s.icon}
                          />
                          <Text
                            style={{
                              color: theme.text2,
                              fontFamily: "Nunito-Bold",
                            }}
                          >
                            {location.all_ages === ALL_AGES_YES
                              ? "All Ages"
                              : "All Ages At Times"}
                          </Text>
                        </View>
                      ) : null}
                      {payment_type === PAYMENT_TYPE_FREE_PLAY ? (
                        <View style={s.vertAlign}>
                          <FontAwesome6
                            name="coins"
                            iconStyle="solid"
                            style={s.icon}
                          />
                          <Text
                            style={{
                              color: theme.text2,
                              fontFamily: "Nunito-Bold",
                            }}
                          >
                            {payment_type}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "relative",
      bottom: 0,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: "100%",
      minHeight: 130,
      height: "auto",
      zIndex: 11,
    },
    // Sits behind `container`, covering the gap that opens up below the
    // sheet when it's dragged upward (see MAX_DRAG_UP).
    backdrop: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: BACKDROP_HEIGHT,
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      zIndex: 9,
    },
    flexi: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "space-around",
      backgroundColor: theme.theme == "dark" ? theme.white : theme.base2,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    plus: {
      color: theme.text3,
    },
    locationNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    nameItem: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: 6,
      justifyContent: "center",
    },
    heartItem: {
      justifyContent: "center",
      height: 34,
      width: 34,
      marginRight: 10,
    },
    locationName: {
      fontFamily: "Nunito-ExtraBold",
      fontSize: 20,
      lineHeight: 24,
      textAlign: "left",
      color: theme.pink1,
    },
    locationTypeContainer: {
      alignItems: "center",
      justifyContent: "space-around",
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 6,
      columnGap: 12,
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: theme.base3,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
      width: 16,
    },
    margin: {
      marginTop: 2,
      marginLeft: 5,
    },
    vertAlign: {
      flexDirection: "row",
      alignItems: "center",
    },
    address: {
      color: theme.text3,
      fontFamily: "Nunito-Regular",
      fontSize: 14,
      flex: 1,
      marginBottom: 5,
    },
    machineName: {
      fontFamily: "Nunito-Bold",
      fontSize: 15,
      color: theme.theme == "dark" ? theme.text : theme.purple,
    },
    italic: {
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    pressed: {
      opacity: 0.8,
    },
    notPressed: {
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
    icon: {
      fontSize: 24,
      marginRight: 6,
      color: theme.theme == "dark" ? theme.pink1 : theme.pink3,
    },
  });

LocationBottomSheet.propTypes = {
  sheetRef: PropTypes.object,
  index: PropTypes.number,
  user: PropTypes.object,
  navigation: PropTypes.object,
  location: PropTypes.object,
  setSelectedMapLocation: PropTypes.func,
};

const mapStateToProps = ({ locations, user }) => ({ locations, user });
export default connect(mapStateToProps, { setSelectedMapLocation })(
  LocationBottomSheet,
);
