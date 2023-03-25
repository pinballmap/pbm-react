import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FETCHING_LOCATION_TRACKING_ENABLED,
  FETCHING_LOCATION_TRACKING_SUCCESS,
  FETCHING_LOCATION_TRACKING_FAILURE,
  LOG_IN,
  LOG_OUT,
  LOGIN_LATER,
  FETCHING_FAVORITE_LOCATIONS_SUCCESS,
  FAVORITE_LOCATION_ADDED,
  FAVORITE_LOCATION_REMOVED,
  SELECT_FAVORITE_LOCATION_FILTER_BY,
  SUBMITTING_MESSAGE,
  MESSAGE_SUBMITTED,
  MESSAGE_SUBMISSION_FAILED,
  CLEAR_MESSAGE,
  SET_UNIT_PREFERENCE,
  HIDE_NO_LOCATION_TRACKING_MODAL,
  INITIAL_FETCHING_LOCATION_TRACKING_FAILURE,
} from "../actions/types";

export const initialState = {
  isFetchingLocationTrackingEnabled: false,
  lat: null,
  lon: null,
  locationTrackingServicesEnabled: false,
  loggedIn: false,
  loginLater: false,
  authentication_token: "",
  email: "",
  id: null,
  username: "",
  faveLocations: [],
  selectedFavoriteLocationFilter: 0,
  submittingMessage: false,
  confirmationMessage: "",
  unitPreference: 0,
  showNoLocationTrackingModal: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_LOCATION_TRACKING_ENABLED:
      return {
        ...state,
        isFetchingLocationTrackingEnabled: true,
      };
    case FETCHING_LOCATION_TRACKING_SUCCESS:
      return {
        ...state,
        isFetchingLocationTrackingEnabled: false,
        lat: Number(action.lat),
        lon: Number(action.lon),
        locationTrackingServicesEnabled: true,
      };
    case INITIAL_FETCHING_LOCATION_TRACKING_FAILURE:
      return {
        ...state,
        isFetchingLocationTrackingEnabled: false,
        lat: 45.51322,
        lon: -122.6587,
        locationTrackingServicesEnabled: false,
      };
    case FETCHING_LOCATION_TRACKING_FAILURE:
      return {
        ...state,
        showNoLocationTrackingModal: true,
      };
    case HIDE_NO_LOCATION_TRACKING_MODAL:
      return {
        ...state,
        showNoLocationTrackingModal: false,
      };
    case LOG_IN: {
      if (!action.credentials) return state;

      AsyncStorage.setItem("auth", JSON.stringify(action.credentials));

      return {
        ...state,
        loggedIn: true,
        authentication_token: action.credentials.authentication_token,
        email: action.credentials.email,
        id: action.credentials.id,
        username: action.credentials.username,
      };
    }
    case LOG_OUT: {
      AsyncStorage.setItem("auth", JSON.stringify({ loggedIn: false }));

      return {
        ...state,
        loggedIn: false,
        loginLater: false,
        authentication_token: "",
        email: "",
        id: null,
        username: "",
      };
    }
    case LOGIN_LATER: {
      AsyncStorage.setItem("auth", JSON.stringify({ loggedIn: false }));

      return {
        ...state,
        loginLater: true,
      };
    }
    case FETCHING_FAVORITE_LOCATIONS_SUCCESS:
      return {
        ...state,
        faveLocations: action.faveLocations,
      };
    case FAVORITE_LOCATION_ADDED:
      return {
        ...state,
        addingFavoriteLocation: false,
        favoriteModalText: "Successfully added location to your saved list",
      };
    case FAVORITE_LOCATION_REMOVED:
      return {
        ...state,
        removingFavoriteLocation: false,
        favoriteModalText: "Successfully removed location from your saved list",
        faveLocations: state.faveLocations.filter(
          (location) => location.location_id !== action.id,
        ),
      };
    case SELECT_FAVORITE_LOCATION_FILTER_BY:
      return {
        ...state,
        selectedFavoriteLocationFilter: action.idx,
      };
    case SUBMITTING_MESSAGE:
      return {
        ...state,
        submittingMessage: true,
      };
    case MESSAGE_SUBMITTED:
      return {
        ...state,
        submittingMessage: false,
        confirmationMessage:
          "Thanks for the message! We'll try to respond soon.",
      };
    case MESSAGE_SUBMISSION_FAILED:
      return {
        ...state,
        submittingMessage: false,
        confirmationMessage: "Oops something went wrong",
      };
    case CLEAR_MESSAGE:
      return {
        ...state,
        confirmationMessage: "",
      };
    case SET_UNIT_PREFERENCE:
      return {
        ...state,
        unitPreference: action.unitPreference,
      };
    default:
      return state;
  }
};
