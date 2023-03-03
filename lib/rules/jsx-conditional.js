/**
 * @fileoverview Rule to ensure the consistent use of conditional expressions in jsx syntax
 * @author Luis Adame Rodríguez <https://github.com/luisadame>
 */

'use strict';

/**
 * Utilities
 */

function isLogicalExpression(node) {
  return node.expression.type === 'LogicalExpression';
}

function isConditionalExpression(node) {
  return node.expression.type === 'ConditionalExpression';
}

function conditionalExpressionInNode(node) {
  return isConditionalExpression(node) || isLogicalExpression(node);
}

function logicalExpressionHasCorrectShape(node) {
  return (
    node.expression.operator === '&&' &&
    (node.expression.right.type === 'JSXElement' ||
      node.expression.right.type === 'JSXFragment')
  );
}

function alternateIsNotNullish(conditionalExpression) {
  const alternateNode = conditionalExpression.alternate;
  const isNull =
    alternateNode.type === 'Literal' && alternateNode.value === null;
  const isUndefined =
    alternateNode.type === 'Identifier' && alternateNode.name === 'undefined';

  return !isNull && !isUndefined;
}

/**
 * Validators
 */

/**
 * Makes sure that the conditional expression we are currently
 * validating is using a ternary operator and if not we convert
 * it to a logical expression using an and operator
 */
function validateTernary(node, context, exceptNotNullishAlternates) {
  if (!isConditionalExpression(node)) return;

  const conditionalExpressionNode = node.expression;

  const isAlternateNotNullish = alternateIsNotNullish(
    conditionalExpressionNode
  );

  if (isAlternateNotNullish && exceptNotNullishAlternates) return;

  const rangeFromTestAndConsequent = [
    conditionalExpressionNode.test.range[1],
    conditionalExpressionNode.consequent.range[0],
  ];

  const rangeFromConsequentToEndOfExpression = [
    conditionalExpressionNode.consequent.range[1],
    conditionalExpressionNode.range[1],
  ];

  let alternateNotNullishFixer = null;

  if (isAlternateNotNullish) {
    const sourceCode = context.getSourceCode();

    let testSourceCode = sourceCode.getText(conditionalExpressionNode.test);

    // If the test is not an identifier wrap it up in parenthesis
    // and negate it, prettifiers should be able to solve this
    // situation after
    if (conditionalExpressionNode.test.type !== 'Identifier') {
      testSourceCode = `(${testSourceCode})`;
    }

    const alternateSourceCode = sourceCode.getText(
      conditionalExpressionNode.alternate
    );

    alternateNotNullishFixer = (fixer) =>
      fixer.insertTextAfter(
        node,
        `{!${testSourceCode} && ${alternateSourceCode}}`
      );
  }

  context.report({
    node,
    messageId: 'preferAndOperator',
    fix(fixer) {
      return [
        fixer.replaceTextRange(rangeFromTestAndConsequent, ' && '),
        fixer.removeRange(rangeFromConsequentToEndOfExpression),
        alternateNotNullishFixer ? alternateNotNullishFixer(fixer) : null,
      ].filter((fixer) => fixer !== null);
    },
  });
}

/**
 * Makes sure that the conditional expression we are currently
 * validating is using the and operator and if not we convert
 * it to a ternary operator
 */
function validateAndOperator(node, context) {
  if (!isLogicalExpression(node)) return;

  const logicalExpressionNode = node.expression;

  if (!logicalExpressionHasCorrectShape(node)) return;

  const tokensBetweenLeftAndRightNodes = context
    .getSourceCode()
    .getTokensBetween(logicalExpressionNode.left, logicalExpressionNode.right);

  const operatorToken = tokensBetweenLeftAndRightNodes.find(
    (token) => token.type === 'Punctuator' && token.value === '&&'
  );

  if (!operatorToken) return;

  context.report({
    node,
    messageId: 'preferTernary',
    fix(fixer) {
      return [
        fixer.replaceTextRange(operatorToken.range, '?'),
        fixer.insertTextAfter(logicalExpressionNode, ' : null'),
      ];
    },
  });
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce the consistent use of either ternary operators or and operators for conditions in JSX',
      category: 'Stylistic issues',
      recommended: false,
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['prefer-ternary', 'prefer-and-operator'],
      },
      {
        type: 'object',
        properties: {
          exceptNotNullishAlternates: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferTernary:
        'Ternary operator is preferred over AND (&&) operator in conditional expression',
      preferAndOperator:
        'And operator is preferred over ternary operator in conditional expression',
    },
  },
  create: function (context) {
    const preferredOption = context.options[0] || 'prefer-ternary';
    const additionalProperties = context.options[1];
    const exceptNotNullishAlternates =
      additionalProperties?.exceptNotNullishAlternates || false;

    return {
      JSXExpressionContainer(node) {
        if (!conditionalExpressionInNode(node)) return;

        if (preferredOption === 'prefer-ternary') {
          validateAndOperator(node, context);
        } else {
          validateTernary(node, context, exceptNotNullishAlternates);
        }
      },
    };
  },
};
