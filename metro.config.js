const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const config = getSentryExpoConfig(__dirname);
config.resolver.unstable_enablePackageExports = false;
module.exports = config;
