# PostCSS Bemit To Json [![Build Status][ci-img]][ci]

[PostCSS] plugin generates JSON from BEMIT (BEM & ITCSS) style CSS selectors.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/WebSeed/postcss-bemit-to-json.svg
[ci]:      https://travis-ci.org/WebSeed/postcss-bemit-to-json

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-bemit-to-json') ])
```

See [PostCSS] docs for examples for your environment.

```
Output doodles:

myBlock.$ == 'my-block'
myBlock.$primary == 'my-block my-block--primary'
myBlock.myElement == 'my-block__my-element'
myBlock.myElement.$blue == 'my-block__my-element my-block__my-element--blue'
```