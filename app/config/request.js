import * as Location from "expo-location";
import * as Application from "expo-application";
const moment = require("moment");

export const postData = (uri, body) => {
  return fetch(global.API_URL + uri, {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      AppVersion: Application.nativeApplicationVersion,
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const data = await response.json();

      if (data.errors) {
        throw data.errors;
      }

      if (data.error) {
        throw data.error;
      }

      if (response.ok) return data;
    })
    .catch((err) => {
      const errorText = typeof err === "object" ? err.toString() : err;
      return Promise.reject(errorText);
    });
};

export const putData = (uri, body) => {
  return fetch(global.API_URL + uri, {
    method: "put",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      AppVersion: Application.nativeApplicationVersion,
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const data = await response.json();

      if (data.errors) {
        throw data.errors;
      }

      if (data.error) {
        throw data.error;
      }

      if (response.ok) return data;
    })
    .catch((err) => {
      const errorText = typeof err === "object" ? err.toString() : err;
      return Promise.reject(errorText);
    });
};

export const getData = (uri) => {
  return fetch(global.API_URL + uri, {
    headers: {
      AppVersion: Application.nativeApplicationVersion,
    },
  })
    .then((response) => {
      if (response.status === 200) return response.json();

      throw new Error("API response was not ok");
    })
    .catch((err) => Promise.reject(err));
};

export const getIfpaData = (radius, distanceUnit, lat, lon) => {
  const date_today = moment().format("YYYY-MM-DD");
  const date_1year = moment().add(1, "year").format("YYYY-MM-DD");

  return fetch(
    `https://api.ifpapinball.com/tournament/search?api_key=${process.env.EXPO_PUBLIC_IFPA_API_KEY}&latitude=${lat}&longitude=${lon}&distance_unit=${distanceUnit}&radius=${radius}&total=50&start_date=${date_today}&end_date=${date_1year}`,
  )
    .then((response) => {
      if (response.status === 200) return response.json();

      throw new Error("IFPA API response was not ok");
    })
    .catch((err) => Promise.reject(err));
};

export const getIfpaTournament = (tournament_id) => {
  return fetch(
    `https://api.ifpapinball.com/tournament/${tournament_id}?api_key=${process.env.EXPO_PUBLIC_IFPA_API_KEY}`,
  )
    .then((response) => {
      if (response.status === 200) return response.json();

      throw new Error("IFPA API response was not ok");
    })
    .catch((err) => Promise.reject(err));
};

export const deleteData = (uri, body) => {
  return fetch(global.API_URL + uri, {
    method: "delete",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
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
