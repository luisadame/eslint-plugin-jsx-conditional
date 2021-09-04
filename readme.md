# Enforces a consistent use of conditional expressions in jsx (jsx-conditional/jsx-conditional)

Enforce or forbid the use of conditionals expressions using a ternary or a logical expression using an AND `&&` operator in JSX.
In other words, it allows to keep a consistent use of the way jsx elements are showned based on a condition

**Fixable**: This rule is automatically fixable by using the `--fix` option on the command line.

## Rule details

This rule checks that conditionals expressions or logical expression match a certain shape.

### Options

This rule accepts an argument that can be one of two possible values:

- `prefer-ternary`
- `prefer-and-operator`

The default value is `prefer-ternary`.

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
<>{identifier ? JSXElement | JSXFragment : null}</>
```

And this would be auto fixable outputing the following code

```jsx
<>{identifier && JSXElement | JSXFragment}</>
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
