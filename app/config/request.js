import * as Location from "expo-location";
import * as Application from "expo-application";
// import { useState } from 'react';

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

export const getIfpaData = (address, radius, distanceUnit) => {
  return fetch(
    `https://api.ifpapinball.com/v1/calendar/search?api_key=${process.env.IFPA_API_KEY}&address=${address}&${distanceUnit}=${radius}`,
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
    await Location.requestForegroundPermissionsAsync();
    const position = await fetchGPSLocation();
    return position;
  } catch (e) {
    return Promise.reject(e);
  }
};
