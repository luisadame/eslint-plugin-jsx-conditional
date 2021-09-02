/**
 * @fileoverview Rule to ensure the consistent conditional expressions in jsx syntax
 * @author Luis Adame Rodríguez <https://github.com/luisadame>
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",
        docs: {
            description: "enforce the consistent use of either ternary operators or and operators for conditions in JSX",
            category: "Stylistic issues",
            recommended: false,
        },
        fixable: "whitespace",
        schema: [
            {
                enum: ["prefer-ternary", "prefer-and-operator"]
            }
        ],
        messages: {
            unexpected: "Unexpected usage of {{description}}."
        }
    },
    create: function(context) {
        return {

        };
    }
};
