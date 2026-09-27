module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { 
          jsxImportSource: "nativewind",
          reactCompiler: false // 👈 THIS IS THE FIX
        },
      ],
      "nativewind/babel",
    ],
    plugins: ["babel-plugin-transform-import-meta"],
  };
};