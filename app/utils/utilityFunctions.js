//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in miles)
export function getDistance(lat1, lon1, lat2, lon2) {
  var R = 3956; // miles
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

export const coordsToBounds = ({
  lat,
  lon,
  latDelta = 0.05,
  lonDelta = 0.05,
}) => ({
  swLat: lat - latDelta,
  swLon: lon - lonDelta,
  neLat: lat + latDelta,
  neLon: lon + lonDelta,
});

export const boundsToCoords = ({ swLat, swLon, neLat, neLon }) => ({
  lat: (swLat + neLat) / 2,
  lon: (swLon + neLon) / 2,
});

export const atLeastMinZoom = (bounds) => {
  const { swLat, swLon, neLat, neLon } = bounds;
  // If a search resolves a small set of coords, enforce a minimum zoom. Otherwise,
  // add a negligible buffer.
  const minZoom = 0.025;
  const buffer = 0.0015;
  const offSet =
    Math.abs(swLat - neLat) < minZoom || Math.abs(swLon - neLon) < minZoom
      ? minZoom
      : buffer;

  return {
    swLat: swLat - offSet,
    swLon: swLon - offSet,
    neLat: neLat + offSet,
    neLon: neLon + offSet,
  };
};

export const formatNumWithCommas = (num) => {
  if (!num) return "";
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export const formatInputNumWithCommas = (num) => {
  if (!num) return "";
  return (parseInt(num.replace(/[^\d]+/gi, "")) || 0).toLocaleString("en-US");
};
export const removeCommasFromNum = (num) => {
  if (!num) return "";
  return num.toString().replace(/,/g, "");
};

const compareMachineNames = (a, b) => {
  const nameA = a.name.startsWith("The ")
    ? a.name.slice(4).toUpperCase()
    : a.name.toUpperCase();
  const nameB = b.name.startsWith("The ")
    ? b.name.slice(4).toUpperCase()
    : b.name.toUpperCase();
  return nameA < nameB ? -1 : nameA === nameB ? 0 : 1;
};

export const alphaSortNameObj = (array) => {
  return array.sort(compareMachineNames);
};

export const alphaSort = (array) => {
  return array.sort((a, b) => {
    const locA = a.startsWith("The ")
      ? a.slice(4).toUpperCase()
      : a.toUpperCase();
    const locB = b.startsWith("The ")
      ? b.slice(4).toUpperCase()
      : b.toUpperCase();
    return locA < locB ? -1 : locA === locB ? 0 : 1;
  });
};

export const sortMachinesByYear = (array, direction = "desc") => {
  return array.sort((a, b) => {
    if (!a.year && !b.year) return compareMachineNames(a, b);
    if (!a.year) return 1;
    if (!b.year) return -1;
    if (a.year === b.year) return compareMachineNames(a, b);
    return direction === "desc" ? b.year - a.year : a.year - b.year;
  });
};

export const sortMachinesByManufacturer = (array) => {
  return array.sort((a, b) => {
    if (!a.manufacturer && !b.manufacturer) return compareMachineNames(a, b);
    if (!a.manufacturer) return 1;
    if (!b.manufacturer) return -1;
    const manA = a.manufacturer.toUpperCase();
    const manB = b.manufacturer.toUpperCase();
    if (manA === manB) return compareMachineNames(a, b);
    return manA < manB ? -1 : 1;
  });
};

export const sortMachinesByLmxCount = (array, direction = "asc") => {
  return array.sort((a, b) => {
    if (a.lmx_count === b.lmx_count) return compareMachineNames(a, b);
    return direction === "asc"
      ? a.lmx_count - b.lmx_count
      : b.lmx_count - a.lmx_count;
  });
};

export const getDistanceWithUnit = (lat1, lon1, lat2, lon2, unitPreference) => {
  const defaultKm = Boolean(unitPreference);
  let distance = getDistance(lat1, lon1, lat2, lon2);
  if (defaultKm) {
    distance = distance / 0.62137;
  }
  distance = formatNumWithCommas(
    distance > 9 ? Math.round(distance) : distance.toFixed(1),
  );
  return `${distance} ${defaultKm ? "km" : "mi"}`;
};
