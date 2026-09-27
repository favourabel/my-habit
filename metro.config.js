const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Intercept the final bundle and replace any raw 'import.meta' syntax for Web
const previousCustomSerializer = config.serializer?.customSerializer;
config.serializer = {
  ...config.serializer,
  customSerializer: async (entryPoint, preModules, graph, options) => {
    let bundle = previousCustomSerializer
      ? await previousCustomSerializer(entryPoint, preModules, graph, options)
      : null;

    if (!bundle) {
      const MetroServer = require("metro/src/Server");
      bundle = await MetroServer.prototype.buildCustomBundle.call(
        { _config: config },
        entryPoint,
        preModules,
        graph,
        options
      );
    }

    if (typeof bundle === "string") {
      return bundle.replace(/import\.meta/g, "({ url: '' })");
    } else if (bundle && typeof bundle.code === "string") {
      bundle.code = bundle.code.replace(/import\.meta/g, "({ url: '' })");
    }
    return bundle;
  },
};

module.exports = withNativeWind(config, { input: "./src/global.css" });