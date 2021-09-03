/**
 * @fileoverview Enforces a consisten use of conditional expressions with ternaries or logical expressions with and operator
 * @author Luis Adame
 */

"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/jsx-conditional");

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: "module",
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run("jsx-conditional", rule, {});
