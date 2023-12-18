module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  extends: ["../eslint-plugin-teamsfx/config/shared.js"],
  overrides: [
    {
      files: ["src/**/*.ts"],
      extends: ["../eslint-plugin-teamsfx/config/header.js"],
    },
  ],
};
