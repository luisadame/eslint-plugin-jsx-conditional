'use strict';

const rules = {
  'jsx-conditional': require('./lib/rules/jsx-conditional'),
};

module.exports = {
  rules,
  configs: {
    recommended: {
      plugins: ['jsx-conditional'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'jsx-conditional/jsx-conditional': 2,
      },
    },
    all: {
      plugins: ['jsx-conditional'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules,
    },
  },
};
