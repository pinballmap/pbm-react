/**
 * Keys used to cache startup API responses.
 *
 * These caches are only invalidated when the server's per-resource
 * updated_at (from /statuses.json) changes — that reflects edits to the
 * underlying data, not changes to which fields the app requests. Adding or
 * changing a field in one of these payloads (e.g. lmx_count on machines,
 * 2026-07-09) doesn't bump updated_at, so devices with a pre-existing cache
 * would never refetch and pick it up. Bump CACHE_SCHEMA_VERSION whenever a
 * payload shape changes to force exactly one fresh fetch on every device.
 */
export const CACHE_SCHEMA_VERSION = 1;
export const CACHE_KEY_REGIONS = `cache_regions_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_REGIONS_TIMESTAMP = `cache_regions_timestamp_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_MACHINES = `cache_machines_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_MACHINES_TIMESTAMP = `cache_machines_timestamp_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_LOCATION_TYPES = `cache_location_types_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_LOCATION_TYPES_TIMESTAMP = `cache_location_types_timestamp_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_OPERATORS = `cache_operators_v${CACHE_SCHEMA_VERSION}`;
export const CACHE_KEY_OPERATORS_TIMESTAMP = `cache_operators_timestamp_v${CACHE_SCHEMA_VERSION}`;

/**
 * Keys used to persist setting values
 */
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
