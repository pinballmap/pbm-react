const toMonthDayYear = (date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

// Format an ISO datetime string → "Jan 05, 2024"
export const formatDate = (isoString) => toMonthDayYear(new Date(isoString));

// Format a YYYY-MM-DD date string → "Jan 05, 2024" (safe local-time parsing)
export const formatDateStr = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return toMonthDayYear(new Date(y, m - 1, d));
};

const parseDateStr = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  return new Date(y, m - 1, d);
};

const toWeekdayDate = (date, withYear = true) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
  });

// Format YYYY-MM-DD start/end strings → "Wed, Dec 23, 2026" or
// "Wed, Dec 23 - Fri, Dec 25, 2026" (start year kept when years differ)
export const formatEventDateRange = (startStr, endStr) => {
  const start = parseDateStr(startStr);
  if (!endStr || endStr === startStr) return toWeekdayDate(start);

  const end = parseDateStr(endStr);
  const sameYear = start.getFullYear() === end.getFullYear();
  return `${toWeekdayDate(start, !sameYear)} - ${toWeekdayDate(end)}`;
};

// Format an ISO datetime string → "January 5, 2024"
export const formatLongDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Today's date as YYYY-MM-DD in local time
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Whole years elapsed since a date string
export const yearsSince = (dateStr) =>
  Math.floor((Date.now() - new Date(dateStr)) / (365.25 * 24 * 60 * 60 * 1000));
