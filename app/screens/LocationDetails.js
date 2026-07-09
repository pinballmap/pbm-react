import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { connect, useDispatch } from "react-redux";
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Mapbox from "@rnmapbox/maps";
import openMap from "react-native-open-maps";
import { throttle } from "throttle-debounce";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6/static";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import {
  ActivityIndicator,
  ConfirmationModal,
  CustomIcon,
  FavoriteLocation,
  LocationActivity,
  PbmButton,
  ReadMore,
  RemoveMachineModal,
  Text,
  WarningButton,
} from "../components";
import {
  clearFilters,
  confirmLocationIsUpToDate,
  deleteLocationPicture,
  fetchLocation,
  fetchLocationPictures,
  fetchLocationPictureFullRes,
  setCurrentMachine,
  setSelectedMapLocation,
  updateMap,
  uploadLocationPicture,
} from "../actions";
import {
  alphaSortNameObj,
  getDistanceWithUnit,
  sortMachinesByManufacturer,
  sortMachinesByYear,
} from "../utils/utilityFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MachineCard from "../components/MachineCard";
import { formatNumWithCommas } from "../utils/utilityFunctions";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import { Image } from "expo-image";
import flagImages, { getFlagWidth } from "../utils/flagImages";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_PUBLIC);

let deviceWidth = Dimensions.get("window").width;

import { formatDateStr, yearsSince } from "../utils/dateUtils";

const SORT_OPTIONS = [
  { key: "alpha", label: "Alphabetical" },
  { key: "year_desc", label: "Year (Newest First)" },
  { key: "year_asc", label: "Year (Oldest First)" },
  { key: "manufacturer", label: "Manufacturer" },
];

const MachineListItem = ({
  machine,
  s,
  theme,
  navigation,
  dispatch,
  displayInsiderConnectedBadge,
  onSwipeDeletePress,
  onLifeListIconPress,
  swipeableRef,
}) => {
  const highlightProgress = useSharedValue(0);
  const localSwipeableRef = useRef(null);

  useLayoutEffect(() => {
    highlightProgress.value = 0;
    localSwipeableRef.current?.close();
  }, [machine.id, highlightProgress]);

  const openMachineDetails = useCallback(() => {
    navigation.navigate("MachineDetails", { machineName: machine.name });
    dispatch(setCurrentMachine(machine.id));
  }, [navigation, dispatch, machine.id, machine.name]);

  const highlightOn = () => {
    highlightProgress.value = withTiming(1, { duration: 100 });
  };
  const highlightOff = () => {
    highlightProgress.value = withTiming(0, { duration: 150 });
  };

  const lifeListIconTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .hitSlop(10)
        .onEnd((_event, success) => {
          if (success) {
            runOnJS(onLifeListIconPress)();
          }
        }),
    [onLifeListIconPress],
  );

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(10)
        .requireExternalGestureToFail(lifeListIconTapGesture)
        .onTouchesDown(() => {
          highlightProgress.value = withTiming(1, { duration: 100 });
        })
        .onEnd((_event, success) => {
          if (success) {
            runOnJS(openMachineDetails)();
          }
        })
        .onFinalize((_event, success) => {
          // On a successful tap we're navigating away — fade out slowly so
          // the highlight doesn't visibly revert before the screen transition
          // starts, which reads as the app pausing before responding.
          highlightProgress.value = withTiming(0, {
            duration: success ? 400 : 150,
          });
        }),
    [openMachineDetails, highlightProgress, lifeListIconTapGesture],
  );

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      highlightProgress.value,
      [0, 1],
      [theme.white, theme.pink2],
    ),
  }));

  return (
    <Animated.View style={[s.machineRowWrapper, animatedWrapperStyle]}>
      <View style={s.machineRowClip}>
        <Swipeable
          ref={(ref) => {
            localSwipeableRef.current = ref;
            swipeableRef(ref);
          }}
          overshootRight={false}
          rightThreshold={40}
          requireExternalGestureToFail={tapGesture}
          onSwipeableOpenStartDrag={highlightOn}
          onSwipeableCloseStartDrag={highlightOn}
          onSwipeableWillClose={highlightOff}
          renderRightActions={() => (
            <Pressable
              style={s.swipeDeleteAction}
              onPress={() => onSwipeDeletePress(machine)}
            >
              <FontAwesome6
                name="trash-can"
                iconStyle="solid"
                size={22}
                color="#ffffff"
              />
            </Pressable>
          )}
        >
          <GestureDetector gesture={tapGesture}>
            <View>
              <MachineCard
                highlightProgress={highlightProgress}
                machine={machine}
                displayInsiderConnectedBadge={displayInsiderConnectedBadge}
                lifeListIconTapGesture={lifeListIconTapGesture}
              />
            </View>
          </GestureDetector>
        </Swipeable>
      </View>
    </Animated.View>
  );
};

const LocationDetails = (props) => {
  const scale = useSharedValue(1);
  const pinchScale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const fittedWidth = useSharedValue(0);
  const fittedHeight = useSharedValue(0);
  const naturalImageSize = useRef({ width: 0, height: 0 });
  const randomMachineNameScale = useSharedValue(0);
  const diceRotation = useSharedValue(0);
  const { route } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const s = getStyles(theme);
  const listRef = useRef(null);
  const [locationId, setLocationId] = useState(props.route.params["id"]);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [pictures, setPictures] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [fullResUrl, setFullResUrl] = useState(null);
  const [fullResLoading, setFullResLoading] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [deletingPicture, setDeletingPicture] = useState(false);
  const [photoTipsModalVisible, setPhotoTipsModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [randomMachineModalVisible, setRandomMachineModalVisible] =
    useState(false);
  const [randomMachineName, setRandomMachineName] = useState(null);
  const [showRemoveMachineModal, setShowRemoveMachineModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("alpha");
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const toastTimeoutRef = useRef(null);
  const mapPressedRef = useRef(false);
  const sortedMachinesRef = useRef([]);
  const swipeableRefs = useRef({});
  const pickRandomMachine = useMemo(
    () =>
      throttle(
        400,
        () => {
          const list = sortedMachinesRef.current;
          if (list.length === 0) return;
          const pick = list[Math.floor(Math.random() * list.length)];
          setRandomMachineName(pick.nameManYear);
          randomMachineNameScale.value = 0;
          randomMachineNameScale.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
        },
        { noTrailing: true },
      ),
    [],
  );
  const randomMachineNameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: randomMachineNameScale.value }],
  }));
  const diceRotationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${diceRotation.value}deg` }],
  }));
  const insets = useSafeAreaInsets();
  const topMargin = insets.top;

  const location = props.location.location;
  const { operators } = props.operators;
  const {
    id: userId,
    loggedIn,
    lat: userLat,
    lon: userLon,
    locationTrackingServicesEnabled,
    unitPreference,
    displayInsiderConnectedBadgePreference,
  } = props.user;
  const { name: opName, id: opId } =
    operators.find((operator) => operator.id === location.operator_id) ?? {};

  const machineCatalogById = useMemo(() => {
    const map = new Map();
    props.machines.machines.forEach((m) => map.set(m.id, m));
    return map;
  }, [props.machines.machines]);

  const machinesAtLocation = useMemo(() => {
    if (!location.location_machine_xrefs) return [];
    return location.location_machine_xrefs.map((machine) => {
      const machineDetails = machineCatalogById.get(machine.machine_id);
      return { ...machineDetails, ...machine };
    });
  }, [location.location_machine_xrefs, machineCatalogById]);

  const sortedMachines = useMemo(() => {
    const machines = [...machinesAtLocation];
    if (sortOrder === "year_desc") return sortMachinesByYear(machines, "desc");
    if (sortOrder === "year_asc") return sortMachinesByYear(machines, "asc");
    if (sortOrder === "manufacturer")
      return sortMachinesByManufacturer(machines);
    return alphaSortNameObj(machines);
  }, [machinesAtLocation, sortOrder]);

  const locationRef = useRef(props.location.location);
  useEffect(() => {
    locationRef.current = props.location.location;
  }, [props.location.location]);

  useEffect(() => {
    const onMount = async () => {
      try {
        const { location: l } = await dispatch(
          fetchLocation(locationId, loggedIn ? userId : undefined),
        );
        if (l.errors) throw new Error("Unable to find location");
        dispatch(setSelectedMapLocation(null));
        Mapbox.setTelemetryEnabled(false);
        if (l.lpx_count > 0) {
          dispatch(fetchLocationPictures(locationId))
            .then(setPictures)
            .catch(() => setPictures([]));
        } else {
          setPictures([]);
        }
      } catch (e) {
        Alert.alert("That location is gone, friend.", "", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    };
    onMount();

    // component unmount
    return () => {
      if (!!route.params["refreshMap"] && !mapPressedRef.current) {
        dispatch(updateMap(locationRef.current.lat, locationRef.current.lon));
      }
    };
  }, []);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      4,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const updateFittedSize = () => {
    const { width: imgW, height: imgH } = naturalImageSize.current;
    if (!imgW || !imgH || !containerWidth.value || !containerHeight.value) {
      return;
    }
    const containerRatio = containerWidth.value / containerHeight.value;
    const imageRatio = imgW / imgH;
    if (imageRatio > containerRatio) {
      fittedWidth.value = containerWidth.value;
      fittedHeight.value = containerWidth.value / imageRatio;
    } else {
      fittedHeight.value = containerHeight.value;
      fittedWidth.value = containerHeight.value * imageRatio;
    }
  };

  const handlePhotoContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    containerWidth.value = width;
    containerHeight.value = height;
    updateFittedSize();
  };

  const handleFullResImageLoad = (e) => {
    const { width, height } = e.source;
    naturalImageSize.current = { width, height };
    updateFittedSize();
  };

  const clampTranslation = () => {
    "worklet";
    const maxTranslateX = Math.max(
      0,
      (fittedWidth.value * pinchScale.value - containerWidth.value) / 2,
    );
    const maxTranslateY = Math.max(
      0,
      (fittedHeight.value * pinchScale.value - containerHeight.value) / 2,
    );
    translateX.value = Math.min(
      Math.max(translateX.value, -maxTranslateX),
      maxTranslateX,
    );
    translateY.value = Math.min(
      Math.max(translateY.value, -maxTranslateY),
      maxTranslateY,
    );
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      pinchScale.value = Math.max(1, savedScale.value * e.scale);
      clampTranslation();
    })
    .onEnd(() => {
      savedScale.value = pinchScale.value;
      if (pinchScale.value <= 1) {
        translateX.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(0, { duration: 150 });
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        clampTranslation();
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (pinchScale.value <= 1) {
        return;
      }
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
      clampTranslation();
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const photoGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const pinchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: pinchScale.value },
    ],
  }));

  const resetZoom = () => {
    pinchScale.value = withTiming(1, { duration: 200 });
    savedScale.value = 1;
    translateX.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  useEffect(() => {
    if (locationId !== route.params["id"]) {
      setLocationId(route.params["id"]);
      setPictures(null);
      setShowScrollToTop(false);
      setConfirmModalVisible(false);
      setPhotoModalVisible(false);
      setPhotoIndex(0);
      setFullResUrl(null);
      setFullResLoading(false);
      setUploadingPicture(false);
      setDeletingPicture(false);
      setPhotoTipsModalVisible(false);
      setDeleteConfirmVisible(false);
      setShowRemoveMachineModal(false);
      setSortOrder("alpha");
      setSortModalVisible(false);
      clearTimeout(toastTimeoutRef.current);
      setToastMessage(null);
      mapPressedRef.current = false;
      swipeableRefs.current = {};
      listRef.current?.scrollToTop({ animated: false });
      dispatch(setSelectedMapLocation(null));
      dispatch(
        fetchLocation(route.params["id"], loggedIn ? userId : undefined),
      ).then(({ location: l } = {}) => {
        if (l?.lpx_count > 0) {
          dispatch(fetchLocationPictures(route.params["id"]))
            .then(setPictures)
            .catch(() => setPictures([]));
        } else {
          setPictures([]);
        }
      });
    }
  }, [route.params["id"]]);

  const showToast = (message) => {
    clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  };

  const copyToClipboard = async (value) => {
    await Clipboard.setStringAsync(value);
    showToast("Copied!");
  };

  const handleLifeListIconPress = () => showToast("Machine in your Life List");

  const scrollToTop = () => {
    listRef.current?.scrollToTop({ animated: true });
  };

  const handleScroll = (event) => {
    const positionY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(positionY > 150);
  };

  const handleConfirmPress = (id, loggedIn) => {
    if (loggedIn) {
      const { email, username, authentication_token } = props.user;
      const body = {
        user_email: email,
        user_token: authentication_token,
      };
      dispatch(confirmLocationIsUpToDate(body, id, username));
      setConfirmModalVisible(false);
    } else {
      setConfirmModalVisible(false);
      navigation.navigate("Login");
    }
  };

  const handleSwipeDeletePress = (machine) => {
    swipeableRefs.current[machine.id]?.close();
    if (loggedIn) {
      dispatch(setCurrentMachine(machine.id));
      setShowRemoveMachineModal(true);
    } else {
      navigation.navigate("Login");
    }
  };

  const onMapPress = () => {
    mapPressedRef.current = true;
    dispatch(clearFilters(false));
    dispatch(updateMap(location.lat, location.lon));
    dispatch(setSelectedMapLocation(location.id));
    navigation.navigate("MapTab");
  };

  const openPhotoModal = (index, pics = pictures) => {
    setPhotoIndex(index);
    setFullResUrl(null);
    setDeleteConfirmVisible(false);
    setPhotoModalVisible(true);
    setFullResLoading(true);
    resetZoom();
    dispatch(fetchLocationPictureFullRes(pics[index].id))
      .then((data) => setFullResUrl(data.url))
      .catch(() => {})
      .finally(() => setFullResLoading(false));
  };

  const goToPrevPhoto = () => {
    const newIndex = photoIndex - 1;
    setPhotoIndex(newIndex);
    setFullResUrl(null);
    setDeleteConfirmVisible(false);
    resetZoom();
    setFullResLoading(true);
    dispatch(fetchLocationPictureFullRes(pictures[newIndex].id))
      .then((data) => setFullResUrl(data.url))
      .catch(() => {})
      .finally(() => setFullResLoading(false));
  };

  const goToNextPhoto = () => {
    const newIndex = photoIndex + 1;
    setPhotoIndex(newIndex);
    setFullResUrl(null);
    setDeleteConfirmVisible(false);
    resetZoom();
    setFullResLoading(true);
    dispatch(fetchLocationPictureFullRes(pictures[newIndex].id))
      .then((data) => setFullResUrl(data.url))
      .catch(() => {})
      .finally(() => setFullResLoading(false));
  };

  const openPhotoPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: false,
      quality: 0.9,
    });
    if (result.canceled) return;
    const { uri, width, height } = result.assets[0];
    setUploadingPicture(true);
    dispatch(uploadLocationPicture(location.id, uri, width, height))
      .then(() =>
        dispatch(fetchLocationPictures(location.id)).then(setPictures),
      )
      .catch(() => Alert.alert("Upload failed. Please try again."))
      .finally(() => setUploadingPicture(false));
  };

  const handleUploadPicture = async () => {
    if (!loggedIn) {
      navigation.navigate("Login");
      return;
    }
    const seen = await AsyncStorage.getItem("photoTipsSeen");
    if (seen) {
      openPhotoPicker();
    } else {
      setPhotoTipsModalVisible(true);
    }
  };

  const handlePhotoTipsConfirm = async () => {
    await AsyncStorage.setItem("photoTipsSeen", "true");
    setPhotoTipsModalVisible(false);
    setTimeout(openPhotoPicker, 300);
  };

  const handleDeletePicture = () => {
    const lpxId = pictures[photoIndex].id;
    setDeletingPicture(true);
    dispatch(deleteLocationPicture(lpxId))
      .then(() => {
        const newPictures = pictures.filter((p) => p.id !== lpxId);
        setPictures(newPictures);
        if (newPictures.length === 0) {
          setPhotoModalVisible(false);
        } else {
          const newIndex = Math.min(photoIndex, newPictures.length - 1);
          openPhotoModal(newIndex, newPictures);
        }
      })
      .catch(() => Alert.alert("Delete failed. Please try again."))
      .finally(() => setDeletingPicture(false));
  };

  if (
    props.location.isFetchingLocation ||
    !props.location.location.id ||
    props.location.addingMachineToLocation
  ) {
    return <ActivityIndicator />;
  }

  sortedMachinesRef.current = sortedMachines;
  const {
    icon: locationIcon,
    library: iconLibrary,
    name: locationTypeName,
  } = props.locations.locationTypes.find(
    (type) => type.id === location.location_type_id,
  ) || {};
  const cityState = location.state
    ? `${location.city}, ${location.state}`
    : location.city;

  const dateDiff = yearsSince(location.date_last_updated);

  const iconStyles = {
    iconImage: ["get", "icon"],
    iconSize: 0.65,
    textSize: 20,
    textField: ["get", "machine_count"],
    textColor: "#fdebfc",
    textOffset: [0, 0.05],
    textFont: ["Nunito Sans ExtraBold"],
  };
  const featureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: location.id,
        properties: {
          icon: "marker_10_sel",
          machine_count: location.machine_count,
        },
        geometry: {
          type: "Point",
          coordinates: [Number(location.lon), Number(location.lat)],
        },
      },
    ],
  };

  let contributor_icon;
  if (location.last_updated_by_contributor_rank == "Super Mapper") {
    contributor_icon = require("../assets/images/SuperMapper.png");
  } else if (location.last_updated_by_contributor_rank == "Legendary Mapper") {
    contributor_icon = require("../assets/images/LegendaryMapper.png");
  } else if (
    location.last_updated_by_contributor_rank == "Grand Champ Mapper"
  ) {
    contributor_icon = require("../assets/images/GrandChampMapper.png");
  }

  const header = (
    <View
      style={{
        flex: 1,
        marginTop: topMargin,
      }}
    >
      <View style={[{ marginTop: -topMargin }, s.mapViewContainer]}>
        <Pressable
          style={({ pressed }) => [
            [
              { top: topMargin },
              s.directionsButton,
              s.mapViewButton,
              s.boxShadow,
              pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
            ],
          ]}
          onPress={() => {
            openMap({
              end: `${location.name} ${location.city} ${
                location.state || ""
              } ${location.zip}`,
            });
          }}
        >
          <MaterialCommunityIcons
            name={"directions"}
            color={theme.purpleLight}
            size={30}
            style={{
              height: 30,
              width: 30,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            [
              { top: topMargin },
              s.mapButton,
              s.mapViewButton,
              s.boxShadow,
              pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
            ],
          ]}
          onPress={onMapPress}
        >
          <FontAwesome6
            name={"map-location"}
            iconStyle="solid"
            color={theme.purpleLight}
            size={24}
            style={{
              height: 24,
              width: 24,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            [
              { top: topMargin },
              s.shareButton,
              s.mapViewButton,
              s.boxShadow,
              pressed ? s.quickButtonPressed : s.mapViewButtonNotPressed,
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
            color={theme.purpleLight}
            size={26}
            style={{
              height: 26,
              width: 26,
              justifyContent: "center",
              alignSelf: "center",
            }}
          />
        </Pressable>
        <Mapbox.MapView
          scaleBarEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          projection="mercator"
          attributionPosition={{ bottom: 35, left: 90 }}
          logoPosition={{ bottom: 35, left: 5 }}
          styleURL={
            theme.theme === "dark"
              ? "mapbox://styles/ryantg/clkj675k4004u01pxggjdcn7w"
              : Mapbox.StyleURL.Outdoors
          }
          style={s.mapHeight}
        >
          <Mapbox.Camera
            zoomLevel={11}
            centerCoordinate={[Number(location.lon), Number(location.lat)]}
            animationMode="none"
            animationDuration={0}
          />
          <Mapbox.ShapeSource
            id={"shape-source-id-1"}
            shape={featureCollection}
          >
            <Mapbox.SymbolLayer id={"symbol-id3"} style={iconStyles} />
            <Mapbox.Images
              images={{
                marker_10_sel: require("../assets/marker-10-sel.png"),
              }}
            />
          </Mapbox.ShapeSource>
        </Mapbox.MapView>
      </View>

      <View style={s.locationOuterContainer}>
        <View style={s.locationContainer}>
          <View style={s.locationNameContainer}>
            <View style={s.nameItem}>
              <Text style={s.locationName}>{location.name}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                s.editDetailsIcon,
                s.boxShadow,
                pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
              ]}
              onPress={() =>
                loggedIn
                  ? navigation.navigate("EditLocationDetails")
                  : navigation.navigate("Login")
              }
            >
              <MaterialCommunityIcons
                name="pencil"
                color={theme.theme == "dark" ? theme.purpleLight : theme.purple}
                size={18}
              />
            </Pressable>
            <View style={s.heartItem}>
              <FavoriteLocation
                locationId={location.id}
                navigation={navigation}
                removeFavorite={(cb) => cb()}
              />
            </View>
          </View>
          <View style={s.locationMetaContainer}>
            <Text style={[s.text2, s.fontSize15, s.marginRight]}>
              {location.street}, {cityState} {location.zip}
            </Text>

            {location.location_type_id || locationTrackingServicesEnabled ? (
              <View
                style={[
                  {
                    justifyContent: "space-around",
                    marginTop: 10,
                    marginBottom: 10,
                  },
                  s.row,
                ]}
              >
                {locationTrackingServicesEnabled && (
                  <View style={[s.row]}>
                    <MaterialCommunityIcons
                      name="compass"
                      style={s.distanceIcon}
                    />
                    <Text
                      style={[
                        {
                          marginLeft: 5,
                          fontSize: 15,
                          color: theme.text2,
                        },
                        s.bold,
                      ]}
                    >
                      {getDistanceWithUnit(
                        userLat,
                        userLon,
                        location.lat,
                        location.lon,
                        unitPreference,
                      )}
                    </Text>
                  </View>
                )}

                {location.location_type_id && (
                  <View style={[s.row]}>
                    <CustomIcon
                      name={locationIcon}
                      size={24}
                      color={
                        theme.theme == "dark" ? theme.purpleLight : theme.pink3
                      }
                      type={iconLibrary}
                    />
                    <Text
                      style={[
                        {
                          marginLeft: 5,
                          fontSize: 15,
                          color: theme.text2,
                        },
                        s.bold,
                      ]}
                    >
                      {locationTypeName}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}

            {location.phone ? (
              <View style={[s.row, s.marginB]}>
                <MaterialCommunityIcons name="phone" style={s.metaIcon} />
                <Text
                  style={[s.fontSize14, s.link]}
                  onPress={() => Linking.openURL(`tel://${location.phone}`)}
                >
                  {location.phone}
                </Text>
              </View>
            ) : null}

            {location.website ? (
              <View style={[s.row, s.marginB]}>
                <MaterialCommunityIcons name="web" style={s.metaIcon} />
                <Text
                  style={[s.fontSize14, s.link]}
                  onPress={() => WebBrowser.openBrowserAsync(location.website)}
                >
                  Website
                </Text>
              </View>
            ) : null}

            {location.place_id ? (
              <View style={[s.row, s.marginB]}>
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  style={s.metaIcon}
                />
                <Text
                  style={[s.fontSize14, s.link]}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/search/?api=1&query=${location.name}&query_place_id=${location.place_id}`,
                    )
                  }
                >
                  Hours
                  <Text
                    style={[
                      s.text3,
                      s.fontSize14,
                      s.opacity,
                      s.italic,
                      s.noUnderline,
                    ]}
                  >
                    {" "}
                    (Google Maps)
                  </Text>
                </Text>
              </View>
            ) : null}

            {!!opName && (
              <View style={s.marginB}>
                <View style={s.row}>
                  <MaterialCommunityIcons name="wrench" style={s.metaIcon} />
                  <Text style={[s.text, s.fontSize14]}>
                    <Text style={s.opacity}>Operator: </Text>
                    <Text
                      style={[
                        s.opacity1,
                        location.operator_website ? s.link : s.text3,
                      ]}
                      onPress={
                        location.operator_website
                          ? () =>
                              WebBrowser.openBrowserAsync(
                                location.operator_website,
                              )
                          : null
                      }
                    >
                      {opName}
                    </Text>
                  </Text>
                  {!!location.operator_email_opt_in && (
                    <Pressable
                      style={s.operatorContactIcon}
                      onPress={() =>
                        copyToClipboard(location.operator_email_opt_in)
                      }
                    >
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={18}
                        color={theme.purple}
                      />
                    </Pressable>
                  )}
                  {!!location.operator_phone_opt_in && (
                    <Pressable
                      style={s.operatorContactIcon}
                      onPress={() =>
                        copyToClipboard(location.operator_phone_opt_in)
                      }
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={18}
                        color={theme.purple}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            )}

            {!!location.description && (
              <View
                style={[
                  s.marginB,
                  s.marginRight,
                  {
                    flexDirection: "row",
                    alignItems: "top",
                    paddingRight: 5,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="notebook-outline"
                  style={s.metaIcon}
                />
                <ReadMore
                  text={location.description}
                  style={[s.text2, s.italic, s.fontSize14, s.opacity]}
                />
              </View>
            )}

            {!!location.date_last_updated && (
              <View
                style={[
                  s.marginB,
                  s.marginRight,
                  {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    paddingRight: 5,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  style={s.metaIcon}
                />
                <Text style={[s.text3, s.fontSize14]}>
                  {`Location edited ${formatNumWithCommas(location.user_submissions_count)} times by ${formatNumWithCommas(location.users_count)} user${location.users_count == 1 ? "" : "s"}. Last updated`}
                  <Text style={s.text3}>
                    {!!location.last_updated_by_username && ` by `}
                    {!!location.last_updated_by_username && (
                      <Text
                        style={{
                          fontFamily: "Nunito-SemiBold",
                          color: theme.pink1,
                          textDecorationLine: "underline",
                        }}
                        onPress={() =>
                          location.last_updated_by_user_id &&
                          navigation.navigate("UserProfilePublic", {
                            userId: location.last_updated_by_user_id,
                            username: location.last_updated_by_username,
                          })
                        }
                      >
                        {`${location.last_updated_by_username}`}
                      </Text>
                    )}
                    <View style={s.iconView}>
                      {!!location.last_updated_by_admin_title && (
                        <MaterialCommunityIcons
                          name="shield-account"
                          size={15}
                          style={s.adminIcon}
                          color={theme.shield}
                        />
                      )}
                      {!!location.last_updated_by_contributor_rank && (
                        <Image
                          contentFit="contain"
                          source={contributor_icon}
                          style={s.rankIcon}
                          contentPosition="bottom"
                        />
                      )}
                      {!!location.last_updated_by_user_id &&
                        !!opId &&
                        opId === location.last_updated_by_operator_id && (
                          <MaterialCommunityIcons
                            name="wrench"
                            style={[s.rankIcon, s.operatorIcon]}
                            size={15}
                            color={theme.wrench}
                          />
                        )}
                      {!!location.last_updated_by_flag &&
                        flagImages[location.last_updated_by_flag] && (
                          <Image
                            source={flagImages[location.last_updated_by_flag]}
                            style={[
                              s.flagIcon,
                              {
                                width: getFlagWidth(
                                  location.last_updated_by_flag,
                                  15,
                                ),
                              },
                            ]}
                          />
                        )}
                    </View>
                    {` on `}
                    <Text style={s.italic}>
                      {formatDateStr(location.date_last_updated)}
                    </Text>
                  </Text>
                </Text>
              </View>
            )}
            {dateDiff >= 2 && (
              <Animated.View style={[s.staleView, animatedStyle]}>
                <Text style={s.staleText}>
                  {`No updates in over `}
                  <Text style={s.staleTextBold}>{`${dateDiff} years`}</Text>
                  {`. Please help update the listing!`}
                </Text>
              </Animated.View>
            )}

            {pictures === null && location.lpx_count > 0 ? (
              <ActivityIndicator style={s.photoStripLoading} />
            ) : pictures?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={s.photoStrip}
                contentContainerStyle={s.photoStripContent}
              >
                {pictures.map((pic, index) => (
                  <Pressable
                    key={pic.id}
                    onPress={() => openPhotoModal(index)}
                    style={s.photoThumb}
                  >
                    <Image
                      source={{ uri: pic.url }}
                      style={s.photoThumbImage}
                      contentFit="cover"
                    />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}

            <View style={s.quickButtonContainer}>
              <View style={s.quickButtonSubContainer}>
                <Pressable
                  style={({ pressed }) => [
                    s.quickButton,
                    s.boxShadow,
                    pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
                  ]}
                  onPress={() =>
                    loggedIn
                      ? navigation.navigate("FindMachine")
                      : navigation.navigate("Login")
                  }
                >
                  <MaterialCommunityIcons
                    name={"plus-outline"}
                    color={
                      theme.theme == "dark" ? theme.purpleLight : theme.purple
                    }
                    size={30}
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  />
                </Pressable>
                <Text style={s.quickButtonText}>Add machine</Text>
              </View>
              <LocationActivity locationId={location.id} />
              <View style={s.quickButtonSubContainer}>
                <Pressable
                  style={({ pressed }) => [
                    s.quickButton,
                    s.boxShadow,
                    pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
                  ]}
                  onPress={() => setConfirmModalVisible(true)}
                >
                  <MaterialCommunityIcons
                    name={"check-outline"}
                    color={
                      theme.theme == "dark" ? theme.purpleLight : theme.purple
                    }
                    size={26}
                    style={{
                      height: 26,
                      width: 26,
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  />
                </Pressable>
                <Text style={s.quickButtonText}>Confirm lineup</Text>
              </View>
              <View style={s.quickButtonSubContainer}>
                <Pressable
                  style={({ pressed }) => [
                    s.quickButton,
                    s.boxShadow,
                    pressed ? s.quickButtonPressed : s.quickButtonNotPressed,
                  ]}
                  onPress={handleUploadPicture}
                  disabled={uploadingPicture}
                >
                  <MaterialCommunityIcons
                    name={uploadingPicture ? "loading" : "camera-plus-outline"}
                    color={
                      theme.theme == "dark" ? theme.purpleLight : theme.purple
                    }
                    size={28}
                    style={{
                      height: 28,
                      width: 28,
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  />
                </Pressable>
                <Text style={s.quickButtonText}>
                  {uploadingPicture ? "Uploading..." : "Add photo"}
                </Text>
              </View>
            </View>
          </View>
          <View style={s.lmxCountRow}>
            <View style={s.lmxCountSpacer} />
            <View style={s.lmxCountCenterGroup}>
              <Text style={s.lmxCountText}>
                {sortedMachines.length}{" "}
                {sortedMachines.length === 1 ? "machine" : "machines"}
              </Text>
              {sortedMachines.length > 1 && (
                <Pressable
                  style={({ pressed }) => [
                    s.randomMachineIcon,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    diceRotation.value = withTiming(diceRotation.value + 360, {
                      duration: 500,
                      easing: Easing.out(Easing.quad),
                    });
                    setRandomMachineName(null);
                    setRandomMachineModalVisible(true);
                  }}
                >
                  <Animated.View style={diceRotationAnimatedStyle}>
                    <MaterialCommunityIcons
                      name="dice-multiple-outline"
                      color={
                        theme.theme == "dark" ? theme.purpleLight : theme.purple
                      }
                      size={22}
                    />
                  </Animated.View>
                </Pressable>
              )}
            </View>
            <View style={s.lmxCountRightGroup}>
              {sortedMachines.length > 1 && (
                <Pressable
                  hitSlop={10}
                  style={({ pressed }) => [
                    s.sortIcon,
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => setSortModalVisible(true)}
                >
                  <MaterialCommunityIcons
                    name="sort-variant"
                    color={
                      theme.theme == "dark" ? theme.purpleLight : theme.purple
                    }
                    size={22}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.base1 }}>
      <FlashList
        ref={listRef}
        data={sortedMachines}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MachineListItem
            machine={item}
            s={s}
            theme={theme}
            navigation={navigation}
            dispatch={dispatch}
            displayInsiderConnectedBadge={
              displayInsiderConnectedBadgePreference
            }
            onSwipeDeletePress={handleSwipeDeletePress}
            onLifeListIconPress={handleLifeListIconPress}
            swipeableRef={(ref) => {
              swipeableRefs.current[item.id] = ref;
            }}
          />
        )}
        ListHeaderComponent={header}
        onScroll={handleScroll}
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
          backgroundColor: theme.base1,
        }}
      />
      <Modal
        visible={photoModalVisible}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={s.photoModalOverlay}>
            <Pressable
              style={s.photoModalClose}
              onPress={() => setPhotoModalVisible(false)}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={36}
                color="white"
              />
            </Pressable>

            <GestureDetector gesture={photoGesture}>
              <View
                style={s.photoModalImageContainer}
                onLayout={handlePhotoContainerLayout}
              >
                {fullResLoading ? (
                  <ActivityIndicator />
                ) : fullResUrl ? (
                  <Animated.View style={[{ flex: 1 }, pinchAnimatedStyle]}>
                    <Image
                      source={{ uri: fullResUrl }}
                      style={s.photoModalImage}
                      contentFit="contain"
                      onLoad={handleFullResImageLoad}
                    />
                  </Animated.View>
                ) : null}
              </View>
            </GestureDetector>

            <View style={s.photoModalNav}>
              <Pressable
                onPress={goToPrevPhoto}
                disabled={photoIndex === 0}
                style={[
                  s.photoNavButton,
                  photoIndex === 0 && s.photoNavDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={36}
                  color={photoIndex === 0 ? "rgba(255,255,255,0.3)" : "white"}
                />
              </Pressable>
              <Text style={s.photoCounter}>
                {photoIndex + 1} / {pictures?.length}
              </Text>
              <Pressable
                onPress={goToNextPhoto}
                disabled={photoIndex === pictures?.length - 1}
                style={[
                  s.photoNavButton,
                  photoIndex === pictures?.length - 1 && s.photoNavDisabled,
                ]}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={36}
                  color={
                    photoIndex === pictures?.length - 1
                      ? "rgba(255,255,255,0.3)"
                      : "white"
                  }
                />
              </Pressable>
            </View>

            {loggedIn && (
              <View style={s.photoModalDeleteContainer}>
                {deleteConfirmVisible ? (
                  <View style={s.deleteConfirmContainer}>
                    <Text style={s.deleteConfirmText}>Delete this photo?</Text>
                    <View style={s.deleteConfirmRow}>
                      <PbmButton
                        title={deletingPicture ? "Deleting…" : "Yes, delete"}
                        onPress={handleDeletePicture}
                        disabled={deletingPicture}
                        margin={{ marginHorizontal: 6, marginVertical: 0 }}
                      />
                      <WarningButton
                        title="Cancel"
                        onPress={() => setDeleteConfirmVisible(false)}
                        margin={{ marginHorizontal: 6, marginVertical: 0 }}
                      />
                    </View>
                  </View>
                ) : (
                  <WarningButton
                    title={"Delete"}
                    margin={s.deleteButton}
                    onPress={() => setDeleteConfirmVisible(true)}
                    leftIcon={
                      <FontAwesome6
                        size={18}
                        color="#ffffff"
                        name="trash-can"
                        style={{ marginRight: 10 }}
                      />
                    }
                  />
                )}
              </View>
            )}
          </View>
        </GestureHandlerRootView>
      </Modal>

      <ConfirmationModal
        visible={photoTipsModalVisible}
        closeModal={() => setPhotoTipsModalVisible(false)}
      >
        <Text style={s.confirmText}>Photo Tips</Text>
        <Text style={s.photoTipsText}>
          Choose a picture that gives a feel for the place. No need to include a
          picture of every single machine.
        </Text>
        <PbmButton title={"Choose a Photo"} onPress={handlePhotoTipsConfirm} />
        <WarningButton
          title={"Cancel"}
          onPress={() => setPhotoTipsModalVisible(false)}
        />
      </ConfirmationModal>
      <ConfirmationModal
        visible={confirmModalVisible}
        closeModal={() => setConfirmModalVisible(false)}
      >
        <Text style={s.confirmText}>
          Confirm the lineup at{" "}
          <Text style={s.confirmTextMachineName}>{location.name}</Text>?
        </Text>
        <PbmButton
          title={"Confirm Lineup"}
          onPress={() => handleConfirmPress(location.id, loggedIn)}
        />
        <WarningButton
          title={"Cancel"}
          onPress={() => setConfirmModalVisible(false)}
        />
      </ConfirmationModal>
      {showRemoveMachineModal && (
        <RemoveMachineModal
          closeModal={() => setShowRemoveMachineModal(false)}
        />
      )}
      <ConfirmationModal
        visible={randomMachineModalVisible}
        closeModal={() => setRandomMachineModalVisible(false)}
      >
        <Text style={s.confirmText}>
          Can&apos;t decide which machine to play? Let us help.
        </Text>
        {randomMachineName && (
          <Animated.View style={randomMachineNameAnimatedStyle}>
            <Text
              style={[
                s.confirmText,
                s.confirmTextMachineName,
                s.randomMachineNameText,
              ]}
            >
              {randomMachineName}
            </Text>
          </Animated.View>
        )}
        <PbmButton
          title={"Pick a random machine"}
          onPress={pickRandomMachine}
        />
        <WarningButton
          title={"Close"}
          onPress={() => setRandomMachineModalVisible(false)}
        />
      </ConfirmationModal>
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable
          style={s.sortModalOverlay}
          onPress={() => setSortModalVisible(false)}
        >
          <View style={[s.sortModalWrapper, s.boxShadow]}>
            <View style={s.sortModalContent}>
              {SORT_OPTIONS.map((option) => {
                const isSelected = option.key === sortOrder;
                return (
                  <Pressable
                    key={option.key}
                    onPress={() => {
                      setSortOrder(option.key);
                      setSortModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      s.sortModalItem,
                      isSelected && s.sortModalItemSelected,
                      pressed && s.yearButtonPressed,
                    ]}
                  >
                    <Text
                      maxFontSizeMultiplier={1.3}
                      style={[
                        s.sortModalItemText,
                        isSelected && s.sortModalItemTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color={theme.text2}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
      {showScrollToTop && (
        <Pressable onPress={scrollToTop} style={[s.upButton, s.boxShadow]}>
          <FontAwesome6
            name="arrow-up"
            iconStyle="solid"
            size={32}
            color={theme.white}
          />
        </Pressable>
      )}
      {toastMessage && (
        <View style={s.copiedNoticeWrapper}>
          <View style={s.copiedNoticeContainer}>
            <Text style={s.copiedNotice}>{toastMessage}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    mapViewContainer: {
      height: 200,
      width: "100%",
    },
    mapHeight: {
      height: 230,
    },
    locationOuterContainer: {
      flex: 3,
      backgroundColor: theme.base1,
      marginBottom: 10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    boxShadow: {
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
    locationContainer: {
      marginHorizontal: 15,
      marginBottom: 10,
    },
    locationNameContainer: {
      marginTop: 15,
      marginBottom: 5,
      marginLeft: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    locationName: {
      fontFamily: "Nunito-ExtraBold",
      fontSize: deviceWidth < 325 ? 22 : 24,
      lineHeight: deviceWidth < 325 ? 28 : 30,
      color: theme.pink1,
    },
    locationMetaContainer: {
      paddingTop: 0,
      paddingBottom: 0,
      marginHorizontal: 5,
      flex: 1,
    },
    quickButtonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    quickButtonSubContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "25%",
    },
    fontSize14: {
      fontSize: 14,
    },
    fontSize15: {
      fontSize: 15,
    },
    bold: {
      fontFamily: "Nunito-Bold",
    },
    marginB: {
      marginTop: Platform.OS === "android" ? 2 : 0,
      marginBottom: 10,
    },
    marginRight: {
      marginRight: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    noUnderline: {
      textDecorationLine: "none",
    },
    link: {
      textDecorationLine: "underline",
      color: theme.blue4,
      fontFamily: "Nunito-Regular",
    },
    text: {
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
    text2: {
      color: theme.text2,
      fontFamily: "Nunito-Regular",
    },
    text3: {
      color: theme.text3,
      fontFamily: "Nunito-Regular",
    },
    italic: {
      fontFamily: "Nunito-Italic",
      fontStyle: Platform.OS === "android" ? undefined : "italic",
    },
    opacity: {
      opacity: 0.8,
    },
    opacity1: {
      opacity: 1,
    },
    staleView: {
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: "rgba(127, 182, 227, 0.2)",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    staleText: {
      color: theme.red2,
      fontFamily: "Nunito-SemiBold",
      textAlign: "center",
    },
    staleTextBold: {
      color: theme.red2,
      fontFamily: "Nunito-ExtraBold",
    },
    quickButton: {
      borderWidth: 1,
      borderColor: theme.pink2,
      padding: 10,
      marginHorizontal: 4,
      zIndex: 10,
      borderRadius: 22,
      height: 44,
      width: 44,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: theme.white,
    },
    quickButtonText: {
      color: theme.theme == "dark" ? theme.purpleLight : theme.text,
      fontSize: 12,
      lineHeight: 14,
      marginTop: 8,
      textAlign: "center",
    },
    mapViewButton: {
      padding: 10,
      zIndex: 10,
      borderRadius: 20,
      height: 42,
      width: 42,
      alignSelf: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.theme == "dark" ? theme.border : theme.white,
    },
    directionsButton: {
      position: "absolute",
      right: 10,
    },
    mapButton: {
      position: "absolute",
      right: 60,
    },
    shareButton: {
      position: "absolute",
      right: 110,
    },
    metaIcon: {
      paddingTop: 0,
      fontSize: 18,
      color: theme.indigo4,
      marginRight: 5,
      opacity: 0.6,
    },
    distanceIcon: {
      fontSize: 22,
      color: theme.theme == "dark" ? theme.purpleLight : theme.pink3,
    },
    nameItem: {
      flex: 1,
      justifyContent: "center",
    },
    heartItem: {
      justifyContent: "center",
      height: 34,
      width: 34,
      marginRight: 10,
    },
    lmxCountRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 6,
    },
    lmxCountSpacer: {
      flex: 1,
    },
    lmxCountCenterGroup: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    lmxCountRightGroup: {
      flex: 1,
      alignItems: "flex-end",
    },
    sortIcon: {
      padding: 4,
    },
    sortModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "stretch",
    },
    sortModalWrapper: {
      marginHorizontal: 50,
      borderRadius: 12,
      backgroundColor: theme.white,
    },
    sortModalContent: {
      borderRadius: 12,
      overflow: "hidden",
    },
    sortModalItem: {
      height: 48,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    sortModalItemSelected: {
      backgroundColor: theme.theme == "dark" ? theme.base3 : theme.base4,
    },
    sortModalItemText: {
      fontSize: 16,
      fontFamily: "Nunito-Medium",
      color: theme.text,
    },
    sortModalItemTextSelected: {
      fontFamily: "Nunito-Bold",
      color: theme.text2,
    },
    yearButtonPressed: {
      opacity: 0.6,
    },
    lmxCountText: {
      fontSize: 16,
      fontFamily: "Nunito-Bold",
      color: theme.text,
    },
    machineRowWrapper: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 25,
      backgroundColor: theme.white,
      shadowColor:
        theme.theme == "dark" ? "rgb(0, 0, 0)" : "rgb(126, 126, 145)",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    machineRowClip: {
      borderRadius: 25,
      overflow: "hidden",
    },
    swipeDeleteAction: {
      width: 80,
      backgroundColor: theme.red2,
      justifyContent: "center",
      alignItems: "center",
    },
    randomMachineIcon: {
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
      height: 28,
      width: 28,
    },
    quickButtonPressed: {
      backgroundColor: theme.indigo4,
    },
    quickButtonNotPressed: {
      backgroundColor: theme.white,
    },
    mapViewButtonNotPressed: {
      backgroundColor:
        theme.theme == "dark"
          ? "rgba(29, 28, 28, 0.8)"
          : "rgba(255,255,255, 0.9)",
    },
    confirmText: {
      textAlign: "center",
      marginHorizontal: 15,
      fontSize: 18,
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
    confirmTextMachineName: {
      color: theme.purpleLight,
      fontFamily: "Nunito-Bold",
    },
    randomMachineNameText: {
      marginTop: 20,
      marginBottom: 10,
    },
    photoTipsText: {
      textAlign: "center",
      marginHorizontal: 15,
      marginTop: 10,
      marginBottom: 5,
      fontSize: 15,
      color: theme.text,
      fontFamily: "Nunito-Regular",
    },
    upButton: {
      justifyContent: "center",
      position: "absolute",
      right: 25,
      bottom: 25,
      backgroundColor: theme.purple,
      padding: 10,
      borderRadius: 15,
    },
    adminIcon: {
      width: 15,
      height: 15,
      marginLeft: 2,
      marginBottom: -2,
    },
    rankIcon: {
      width: 15,
      height: 15,
      marginLeft: 3,
      marginRight: 2,
      marginBottom: -2,
    },
    flagIcon: {
      height: 15,
      marginHorizontal: 2,
      borderRadius: 3,
      marginBottom: -1,
    },
    operatorIcon: {
      marginHorizontal: 2,
    },
    iconView: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    operatorContactIcon: {
      marginLeft: 6,
      padding: 3,
    },
    editDetailsIcon: {
      justifyContent: "center",
      alignItems: "center",
      height: 34,
      width: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: theme.pink2,
      marginRight: 4,
    },
    photoStrip: {
      marginVertical: 8,
    },
    photoStripLoading: {
      marginVertical: 16,
      alignSelf: "flex-start",
      marginLeft: 14,
    },
    photoStripContent: {
      paddingHorizontal: 5,
      gap: 8,
    },
    photoThumb: {
      width: 80,
      height: 80,
      borderRadius: 8,
      overflow: "hidden",
    },
    photoThumbImage: {
      width: 80,
      height: 80,
    },
    photoModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.93)",
      justifyContent: "center",
    },
    photoModalClose: {
      position: "absolute",
      top: 50,
      right: 16,
      zIndex: 10,
    },
    photoModalImageContainer: {
      flex: 1,
      justifyContent: "center",
      marginTop: 90,
      marginBottom: 10,
    },
    photoModalImage: {
      width: "100%",
      height: "100%",
    },
    photoModalNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      gap: 20,
    },
    photoNavButton: {
      padding: 8,
    },
    photoNavDisabled: {
      opacity: 0.3,
    },
    photoCounter: {
      color: "white",
      fontFamily: "Nunito-SemiBold",
      fontSize: 15,
      minWidth: 50,
      textAlign: "center",
    },
    photoModalDeleteContainer: {
      alignItems: "center",
      paddingBottom: 36,
      paddingTop: 4,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    deleteConfirmContainer: {
      alignItems: "center",
      gap: 10,
    },
    deleteConfirmRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    deleteConfirmText: {
      color: "white",
      fontFamily: "Nunito-Regular",
      fontSize: 14,
    },
    copiedNoticeWrapper: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 100,
    },
    copiedNoticeContainer: {
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 6,
    },
    copiedNotice: {
      color: "white",
      fontSize: 13,
      fontFamily: "Nunito-SemiBold",
    },
  });

const mapStateToProps = ({
  application,
  location,
  locations,
  operators,
  machines,
  user,
}) => ({ application, location, locations, operators, machines, user });
export default connect(mapStateToProps)(LocationDetails);
