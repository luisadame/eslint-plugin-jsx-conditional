"use strict";

const rules = {
  "jsx-conditional": require("./lib/rules/jsx-conditional"),
}

module.exports = {
  rules,
  configs: {
    recommended: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        "jsx-conditional": 2,
      },
    },
    all: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      rules,
    }
  },
};
