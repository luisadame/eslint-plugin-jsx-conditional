/**
 * @fileoverview Rule to ensure the consistent use of conditional expressions in jsx syntax
 * @author Luis Adame Rodríguez <https://github.com/luisadame>
 */

"use strict";

/**
 * Utilities
 */

function isLogicalExpression(node) {
  return node.expression.type === "LogicalExpression";
}

function isConditionalExpression(node) {
  return node.expression.type === "ConditionalExpression";
}

function conditionalExpressionInNode(node) {
  return isConditionalExpression(node) || isLogicalExpression(node);
}

function logicalExpressionHasCorrectShape(node) {
  return (
    node.expression.operator === "&&" &&
    node.expression.right.type === "JSXElement"
  );
}

function alternateIsNotNullOrUndefined(conditionalExpression) {
  const alternateNode = conditionalExpression.alternate;
  const isNull =
    alternateNode.type === "Literal" && alternateNode.value === null;
  const isUndefined =
    alternateNode.type === "Identifier" && alternateNode.name === "undefined";

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
function validateTernary(node, context) {
  if (!isConditionalExpression(node)) return;

  const conditionalExpressionNode = node.expression;

  if (alternateIsNotNullOrUndefined(conditionalExpressionNode)) return;

  const rangeFromIdentifierAndConsequent = [
    conditionalExpressionNode.test.end,
    conditionalExpressionNode.consequent.start,
  ];

  const rangeFromConsequentToEndOfExpression = [
    conditionalExpressionNode.consequent.end,
    conditionalExpressionNode.end,
  ];

  context.report({
    node,
    messageId: "preferAndOperator",
    fix(fixer) {
      return [
        fixer.replaceTextRange(rangeFromIdentifierAndConsequent, " && "),
        fixer.removeRange(rangeFromConsequentToEndOfExpression),
      ];
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

  const operatorRange = [
    logicalExpressionNode.left.end,
    logicalExpressionNode.right.start,
  ];
  context.report({
    node,
    messageId: "preferTernary",
    fix(fixer) {
      return [
        fixer.replaceTextRange(operatorRange, " ? "),
        fixer.insertTextAfter(logicalExpressionNode.right, " : null"),
      ];
    },
  });
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "layout",
    docs: {
      description:
        "enforce the consistent use of either ternary operators or and operators for conditions in JSX",
      category: "Stylistic issues",
      recommended: false,
    },
    fixable: "whitespace",
    schema: [
      {
        enum: ["prefer-ternary", "prefer-and-operator"],
      },
    ],
    messages: {
      preferTernary:
        "Ternary operator is preferred over AND (&&) operator in conditional expression",
      preferAndOperator:
        "And operator is preferred over ternary operator in conditional expression",
    },
  },
  create: function (context) {
    const preferredOption = context.options[0] || "prefer-ternary";
    return {
      JSXExpressionContainer(node) {
        if (!conditionalExpressionInNode(node)) return;

        if (preferredOption === "prefer-ternary") {
          validateAndOperator(node, context);
        } else {
          validateTernary(node, context);
        }
      },
    };
  },
};
