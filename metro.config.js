// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Support `.cjs` extensions (used by Firebase internally sometimes)
defaultConfig.resolver.sourceExts.push('cjs');

// Disable unstable package exports to avoid Firebase issues
defaultConfig.resolver.unstable_enablePackageExports = false;

defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

module.exports = defaultConfig;
