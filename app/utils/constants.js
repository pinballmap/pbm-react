/**
 * Keys used to persist setting values
 */
export const KEY_UNIT_PREFERENCE = "unitPreference"; // KM or M when display distances
export const KEY_THEME = "themeOverride"; // Which visual theme to use for te app
export const KEY_DISPLAY_INSIDER_CONNECTED_BADGE_PREFERENCE =
  "displayInsiderConnectedBadgePreference"; // Display the Insider Connected badge

/**
 * Setting Values
 * Represents the values for the app's theme setting.
 * These are the values that are stored and read as the theme option on the
 * settings screen is changed.
 */
export const THEME_SYSTEM_SETTING_VALUE = 0;
export const THEME_LIGHT_SETTING_VALUE = 1;
export const THEME_DARK_SETTING_VALUE = 2;

export const THEME_DEFAULT_VALUE = THEME_SYSTEM_SETTING_VALUE;

export const THEME_DARK = "dark";
export const THEME_LIGHT = ""; // Yes, it's empty
