# Enforces a consistent use of conditional expressions in jsx (jsx-conditional/jsx-conditional)

<a href="https://codecov.io/gh/luisadame/eslint-plugin-jsx-conditional">
  <img src="https://codecov.io/gh/luisadame/eslint-plugin-jsx-conditional/branch/main/graph/badge.svg?token=7Z541HVSB6"/>
</a>

Enforce or forbid the use of conditionals expressions using a ternary or a logical expression using an AND `&&` operator in JSX.
In other words, it allows to keep a consistent use of the way jsx elements are showned based on a condition

**Fixable**: This rule is automatically fixable by using the `--fix` option on the command line.

## Rule details

This rule checks that conditionals expressions or logical expression match a certain shape.

### Options

This rule accepts as a first argument one of these two possible values:

- `prefer-ternary`
- `prefer-and-operator`

The default value is `prefer-ternary`.

It also accepts a second argument defining the options of the rule. Options are:

- `exceptNotNullishAlternates`: this option is taken into account only on `prefer-and-operator` mode

### `prefer-ternary`

This option will check for logical expressions inside JSX code and if it finds a logical expression that follows the following shape:

```jsx
<>{identifier && JSXElement | JSXFragment}</>
```

And this would be auto fixable outputing the following code

```jsx
<>{identifier ? JSXElement | JSXFragment : null}</>
```

### Examples

✅ Examples of valid code:

```jsx
function Component({ propA }) {
  return <>{propA ? <span>Hello</span> : null}</>;
}
```

```jsx
function Component({ propA }) {
  return <>{propA ? <span>Hello</span> : <span>Hello</span>}</>;
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA ? (
        <>
          <span>Hello</span>
          <span>Hello 2</span>
        </>
      ) : null}
    </>
  );
}
```

❌ Examples of invalid code:

```jsx
function Component({ propA }) {
  return <>{propA && <span>Hello</span>}</>;
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA && <span>Hello</span>}
      {!propA && <span>Hello</span>}
    </>
  );
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA && (
        <>
          <span>Hello</span>
          <span>Hello 2</span>
        </>
      )}
    </>
  );
}
```

### `prefer-and-operator`

This option will check for conditional expressions inside JSX code and if it finds a conditional expression that follows the following shape:

```jsx
<>{identifier ? JSXElement | JSXFragment : JSXElement | JSXFragment}</>
```

And this would be auto fixable outputing the following code

```jsx
<>
  {identifier && JSXElement | JSXFragment}
  {!identifier && JSXElement | JSXFragment}
</>
```

Being two logical expressions where the first tests the condition and renders the consequent of the conditional expression and the second negates
the test and renders the alternate.

If a conditional expression is preferred over a logical expression when the alternate is not `null` or `undefined` you can tell the rule your
preferences by using the option `exceptNotNullishAlternates` as a second argument in the rule declaration on `.eslintrc`

Example:

```javascript
// .eslintrc.js
module.exports = {
  extends: [...],
  plugins: [..., 'jsx-conditional'],
  rules: {
    ...
    'jsx-conditional/jsx-conditional': ['error', 'prefer-and-operator', { exceptNotNullishAlternates: true }]
    ...
  }
}
```

### Examples

✅ Examples of valid code:

```jsx
function Component({ propA }) {
  return <>{propA && <span>Hello</span>}</>;
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA && <span>Hello</span>}
      {!propA && <span>Hello</span>}
    </>
  );
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA && (
        <>
          <span>Hello</span>
          <span>Hello 2</span>
        </>
      )}
    </>
  );
}
```

❌ Examples of invalid code:

```jsx
function Component({ propA }) {
  return <>{propA ? <span>Hello</span> : null}</>;
}
```

This can be valid if you prefer by indicating it in the options argument `{ exceptNotNullishAlternates: true }`, but without it the following code would be invalid.

```jsx
function Component({ propA }) {
  return <>{propA ? <span>Hello</span> : <span>Hello</span>}</>;
}
```

```jsx
function Component({ propA }) {
  return (
    <>
      {propA ? (
        <>
          <span>Hello</span>
          <span>Hello 2</span>
        </>
      ) : null}
    </>
  );
}
```

## When not to use it

You can decide to not use it or turn it off if you are not concerned about the consistency of rendering elements based on a condition, either by using a ternary operator or using a logical expression
