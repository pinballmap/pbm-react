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
  const minZoom = 0.025;
  if (Math.abs(swLat - neLat) < minZoom || Math.abs(swLon - neLon) < minZoom) {
    return {
      swLat: swLat - minZoom,
      swLon: swLon - minZoom,
      neLat: neLat + minZoom,
      neLon: neLon + minZoom,
    };
  } else return bounds;
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

export const alphaSortNameObj = (array) => {
  return array.sort((a, b) => {
    const locA = a.name.startsWith("The ")
      ? a.name.slice(4).toUpperCase()
      : a.name.toUpperCase();
    const locB = b.name.startsWith("The ")
      ? b.name.slice(4).toUpperCase()
      : b.name.toUpperCase();
    return locA < locB ? -1 : locA === locB ? 0 : 1;
  });
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
