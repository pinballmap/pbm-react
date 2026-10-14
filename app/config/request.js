import * as Location from "expo-location";
import * as Application from "expo-application";
import store from "../store";
import { ACCOUNT_DISABLED } from "../actions/types";
import { todayStr } from "../utils/dateUtils";
import { getDistance } from "../utils/utilityFunctions";

const ACCOUNT_DISABLED_MSG =
  "Your account has been disabled. Please contact us if you think this is a mistake.";

const handleAccountDisabled = () => {
  store.dispatch({ type: ACCOUNT_DISABLED });
  throw ACCOUNT_DISABLED_MSG;
};

const withApiToken = (uri) => {
  const separator = uri.includes("?") ? "&" : "?";
  return `${uri}${separator}api_token=${process.env.EXPO_PUBLIC_PBM_API_TOKEN}`;
};

const apiFetch = (method, uri, body) => {
  const headers = {
    Accept: "application/json, text/plain, */*",
    AppVersion: Application.nativeApplicationVersion,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  return fetch(global.API_URL + withApiToken(uri), {
    method,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
};

const handleJsonResponse = async (response) => {
  if (response.status === 403) handleAccountDisabled();

  const data = await response.json();

  if (data.errors) {
    throw data.errors;
  }

  if (data.error) {
    throw data.error;
  }

  if (response.ok) return data;
};

export const postData = (uri, body) => {
  return apiFetch("post", uri, body)
    .then(handleJsonResponse)
    .catch((err) => {
      const errorText = typeof err === "object" ? err.toString() : err;
      return Promise.reject(errorText);
    });
};

export const putData = (uri, body) => {
  return apiFetch("put", uri, body)
    .then(handleJsonResponse)
    .catch((err) => {
      const errorText = typeof err === "object" ? err.toString() : err;
      return Promise.reject(errorText);
    });
};

export const getData = (uri) => {
  return apiFetch("get", uri)
    .then(async (response) => {
      if (response.status === 200) return response.json();

      if (response.status === 403) handleAccountDisabled();

      throw new Error("API response was not ok");
    })
    .catch((err) => Promise.reject(err));
};

// IFPA results are cached in memory to avoid refetching when the user toggles
// radius or returns to the Events screen without moving the map much
const IFPA_CACHE_TTL_MS = 60 * 60 * 1000;
const IFPA_SEARCH_CACHE_MAX = 20;
// Reuse a cached search if the map center is within this fraction of the radius
const IFPA_CENTER_TOLERANCE = 0.1;
const KM_PER_MILE = 1.609344;

const ifpaSearchCache = [];
const ifpaTournamentCache = new Map();

const isFresh = (entry) => Date.now() - entry.fetchedAt < IFPA_CACHE_TTL_MS;

export const getCachedIfpaData = (radius, distanceUnit, lat, lon) => {
  const date_today = todayStr();
  const entry = ifpaSearchCache.find((e) => {
    if (
      e.radius !== radius ||
      e.distanceUnit !== distanceUnit ||
      e.date !== date_today ||
      !isFresh(e)
    )
      return false;

    const miles = getDistance(e.lat, e.lon, lat, lon);
    const distance = distanceUnit === "k" ? miles * KM_PER_MILE : miles;
    return distance < radius * IFPA_CENTER_TOLERANCE;
  });
  return entry?.data;
};

export const getIfpaData = (radius, distanceUnit, lat, lon) => {
  const cached = getCachedIfpaData(radius, distanceUnit, lat, lon);
  if (cached) return Promise.resolve(cached);

  const date_today = todayStr();

  return getData(
    `/ifpa/tournaments.json?lat=${lat}&lon=${lon}&distance_unit=${distanceUnit}&radius=${radius}&start_date=${date_today}`,
  )
    .then((data) => {
      ifpaSearchCache.unshift({
        radius,
        distanceUnit,
        lat,
        lon,
        date: date_today,
        data,
        fetchedAt: Date.now(),
      });
      ifpaSearchCache.length = Math.min(
        ifpaSearchCache.length,
        IFPA_SEARCH_CACHE_MAX,
      );
      return data;
    })
    .catch((err) => Promise.reject(err));
};

export const getIfpaTournament = (tournament_id) => {
  const cached = ifpaTournamentCache.get(tournament_id);
  if (cached && isFresh(cached)) return Promise.resolve(cached.data);

  return getData(`/ifpa/tournaments/${tournament_id}.json`)
    .then((data) => {
      ifpaTournamentCache.set(tournament_id, { data, fetchedAt: Date.now() });
      return data;
    })
    .catch((err) => Promise.reject(err));
};

export const postFormData = (uri, formData) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", global.API_URL + withApiToken(uri));
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("AppVersion", Application.nativeApplicationVersion);
    xhr.onload = () => {
      try {
        if (xhr.status === 403) handleAccountDisabled();
        const data = JSON.parse(xhr.responseText);
        if (data.errors) {
          reject(
            typeof data.errors === "object"
              ? data.errors.toString()
              : data.errors,
          );
        } else if (data.error) {
          reject(
            typeof data.error === "object" ? data.error.toString() : data.error,
          );
        } else {
          resolve(data);
        }
      } catch (e) {
        reject(e.toString());
      }
    };
    xhr.onerror = () => reject("Network request failed");
    xhr.send(formData);
  });
};

export const deleteData = (uri, body) => {
  return apiFetch("delete", uri, body)
    .then(async (response) => {
      if (response.status === 403) handleAccountDisabled();

      try {
        const data = await response.json();
        if (response.ok) return data;
      } catch (e) {
        throw "Something went wrong.";
      }
    })
    .catch((err) => Promise.reject(err));
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchGPSLocation = async () => {
  let location;
  let tries = 1;
  const MAX_NUMBER_OF_TRIES = 3;
  do {
    location = await Promise.race([
      sleep(1500),
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      }),
    ]);
    if (location) return Promise.resolve(location);

    tries++;
  } while (!location && tries < MAX_NUMBER_OF_TRIES);

  await Location.getLastKnownPositionAsync();
  location = await Promise.race([
    sleep(1500),
    Location.getLastKnownPositionAsync(),
  ]);

  if (location) return Promise.resolve(location);

  return Promise.reject("Unable to determine your location");
};

export const getCurrentLocation = async () => {
  try {
    const { status: currentStatus } =
      await Location.getForegroundPermissionsAsync();
    if (currentStatus !== "granted") {
      await Location.requestForegroundPermissionsAsync();
    }
    const position = await fetchGPSLocation();
    return position;
  } catch (e) {
    return Promise.reject(e);
  }
};
