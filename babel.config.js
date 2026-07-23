module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Inline Drizzle's generated .sql migration files as strings.
      ["inline-import", { extensions: [".sql"] }],
      // Reanimated/worklets must stay LAST in the plugin list.
      "react-native-worklets/plugin",
    ],
  };
};
