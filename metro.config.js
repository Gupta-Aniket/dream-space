// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Support `.cjs` extensions (used by Firebase internally sometimes)
defaultConfig.resolver.sourceExts.push('cjs');

// Disable unstable package exports to avoid Firebase issues
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
