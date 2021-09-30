/**
 * @fileoverview Enforces a consisten use of conditional expressions with ternaries or logical expressions with and operator
 * @author Luis Adame
 */

const test = require('ava');
const RuleTester = require('eslint-ava-rule-tester');
const rule = require('../../../lib/rules/jsx-conditional');
const { stripIndent } = require('common-tags');

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true,
  },
};

const MESSAGE_IDS = {
  PreferTernary: 'preferTernary',
  PreferAndOperator: 'preferAndOperator',
};

const OPTIONS = {
  preferTernary: 'prefer-ternary',
  preferAndOperator: 'prefer-and-operator',
  additionalProperties: {
    exceptNotNullishAlternates: true,
  },
};

const validTestCases = [
  {
    code: `<div>{propA ? <span>Hello</span> : null}</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA ? <span>Hello</span> : null}</div>`,
  },
  {
    code: `<div>{propA ? <span>Hello</span> : undefined}</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `
      function Component({ propA }) {
        return (
          <div>
            <span>Other tag</span>
            {propA ? <span>Hello</span> : null}
          </div>
        );
      }
    `,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `
      class Component {
        render() {
          return (
            <div>
              <span>Other tag</span>
              {propA ? <span>Hello</span> : null}
            </div>
          );
        }
      }
    `,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA ? <span>Hello</span> : <span>Bye</span>}</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA && <span>Hello</span>}</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{!propA && <span>Hello</span>}</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{propA || 1}</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>Hello</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{'Hello'}</div>`,
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA && 1}</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{propA || 1}</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>Hello</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{'Hello'}</div>`,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `
      <div>
        {propA && <span>Hello</span>}
        {!propA && <span>Bye</span>}
      </div>
    `,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: stripIndent`
      <div>
        {propA ? (
          <>
            <span>Hello</span>
            <span>Hello 2</span>
          </>
          ) : null
        }
      </div>
    `,
    options: [OPTIONS.preferTernary],
  },
  {
    code: stripIndent`
      <div>
        {propA && (
          <>
            <span>Hello</span>
            <span>Hello 2</span>
          </>
        )}
      </div>
    `,
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{propA ? <span>Hello</span> : <span>Bye</span>}</div>`,
    options: [OPTIONS.preferAndOperator, OPTIONS.additionalProperties],
  },
];

const invalidTestCases = [
  {
    code: `<div>{propA && <span>Hello</span>}</div>`,
    output: `<div>{propA ? <span>Hello</span> : null}</div>`,
    options: [OPTIONS.preferTernary],
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        column: 6,
        endLine: 1,
        endColumn: 35,
      },
    ],
  },
  {
    code: stripIndent`
      function Component({ propA }) {
        return (
          <div>
            <span>Other tag</span>
            {propA && <span>Hello</span>}
          </div>
        );
      }
    `,
    options: [OPTIONS.preferTernary],
    output: stripIndent`
      function Component({ propA }) {
        return (
          <div>
            <span>Other tag</span>
            {propA ? <span>Hello</span> : null}
          </div>
        );
      }
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 5,
        column: 7,
        endLine: 5,
        endColumn: 36,
      },
    ],
  },
  {
    code: stripIndent`
      class Component {
        render() {
          return (
            <div>
              <span>Other tag</span>
              {propA ? <span>Hello</span> : null}
            </div>
          );
        }
      }
    `,
    options: [OPTIONS.preferAndOperator],
    output: stripIndent`
      class Component {
        render() {
          return (
            <div>
              <span>Other tag</span>
              {propA && <span>Hello</span>}
            </div>
          );
        }
      }
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 6,
        column: 9,
        endLine: 6,
        endColumn: 44,
      },
    ],
  },
  {
    code: `<div>{propA && <span>Hello</span>}</div>`,
    output: `<div>{propA ? <span>Hello</span> : null}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 35,
      },
    ],
    options: [OPTIONS.preferTernary],
  },

  {
    code: `<div>{propA ? <span>Hello</span> : undefined}</div>`,
    output: `<div>{propA && <span>Hello</span>}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 46,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{!propA && <span>Hello</span>}</div>`,
    output: `<div>{!propA ? <span>Hello</span> : null}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 36,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: stripIndent`
      <div>
        {propA && <span>Hello</span>}
        {!propA && <span>Bye</span>}
      </div>
    `,
    output: stripIndent`
      <div>
        {propA ? <span>Hello</span> : null}
        {!propA ? <span>Bye</span> : null}
      </div>
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 2,
        endLine: 2,
        column: 3,
        endColumn: 32,
      },
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 3,
        endLine: 3,
        column: 3,
        endColumn: 31,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: stripIndent`
      <div>
        {propA ? (
          <>
            <span>Hello</span>
            <span>Hello 2</span>
          </>
         ) : null}
      </div>
    `,
    output: stripIndent`
      <div>
        {propA && <>
            <span>Hello</span>
            <span>Hello 2</span>
          </>}
      </div>
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 2,
        endLine: 7,
        column: 3,
        endColumn: 13,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: stripIndent`
      <div>
        {propA && <>
            <span>Hello</span>
            <span>Hello 2</span>
        </>}
      </div>
    `,
    output: stripIndent`
      <div>
        {propA ? <>
            <span>Hello</span>
            <span>Hello 2</span>
        </> : null}
      </div>
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 2,
        endLine: 5,
        column: 3,
        endColumn: 7,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA ? <span>Hello</span> : <span>Bye</span>}</div>`,
    output: `<div>{propA && <span>Hello</span>}{!propA && <span>Bye</span>}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 53,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{isSomething() ? <span>Hello</span> : <span>Bye</span>}</div>`,
    output: `<div>{isSomething() && <span>Hello</span>}{!(isSomething()) && <span>Bye</span>}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 61,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{1 + 3 === 4 ? <span>Hello</span> : <span>Bye</span>}</div>`,
    output: `<div>{1 + 3 === 4 && <span>Hello</span>}{!(1 + 3 === 4) && <span>Bye</span>}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 59,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: stripIndent`
      <div>
        {[1, 2, 3].every(number => typeof number === 'number') ? (
          <div>
            <span>Multiple</span>
            <span>Children</span>
          </div>
        ) : (
          <span>Bye</span>
        )}
      </div>
    `,
    output: stripIndent`
      <div>
        {[1, 2, 3].every(number => typeof number === 'number') && <div>
            <span>Multiple</span>
            <span>Children</span>
          </div>}{!([1, 2, 3].every(number => typeof number === 'number')) && <span>Bye</span>}
      </div>
    `,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 2,
        endLine: 9,
        column: 3,
        endColumn: 5,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{a ? 1 : b ? 2 : 3}</div>`,
    output: `<div>{a && 1}{!a && b ? 2 : 3}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 25,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{propA && 1}</div>`,
    output: `<div>{propA ? 1 : null}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 18,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA && 'Hello'}</div>`,
    output: `<div>{propA ? 'Hello' : null}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 24,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: '<div>{propA && `Hello`}</div>',
    output: '<div>{propA ? `Hello` : null}</div>',
    errors: [
      {
        messageId: MESSAGE_IDS.PreferTernary,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 24,
      },
    ],
    options: [OPTIONS.preferTernary],
  },
  {
    code: `<div>{propA ? 1 : null}</div>`,
    output: `<div>{propA && 1}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 24,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: `<div>{propA ? 'Hello' : null}</div>`,
    output: `<div>{propA && 'Hello'}</div>`,
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 30,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
  {
    code: '<div>{propA ? `Hello` : null}</div>',
    output: '<div>{propA && `Hello`}</div>',
    errors: [
      {
        messageId: MESSAGE_IDS.PreferAndOperator,
        line: 1,
        endLine: 1,
        column: 6,
        endColumn: 30,
      },
    ],
    options: [OPTIONS.preferAndOperator],
  },
];

const ruleTester = new RuleTester(test, {
  parserOptions,
});

ruleTester.run('jsx-conditional', rule, {
  valid: validTestCases,
  invalid: invalidTestCases,
});
