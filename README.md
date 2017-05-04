# dom-template-strings

Create DOM Nodes or Fragments using ES2015 Template Strings.

A fork of [domify-template-strings](https://github.com/Loilo/domify-template-strings).

[![Sauce Test Status](https://saucelabs.com/browser-matrix/kapouer+dom-template-strings.svg)](https://saucelabs.com/u/kapouer+dom-template-strings)


## Installation
```bash
npm install --save dom-template-strings
```

## Usage

```javascript
const dom = require('dom-template-strings')

const loginBtn = dom `<button>login</button>`
loginBtn.onclick = () => {
  alert('You have been logged in!')
}

document.body.appendChild(
   dom `<p>Click here to ${loginBtn}!</p>`
)
```

The interpolated values the `dom` function handles are

1. DOM `Node` objects, which will be inserted at the corresponding slot in the DOM tree.
2. Arrays, which will be handled recursively.
3. null or undefined values are converted to empty string (as of version 1.1.0)

All other values will be passed like in usual template strings.


### Example with arrays

```javascript
const dom = require('dom-template-strings')

const items = [ 'One', 'Two', 'Three' ]

const list = dom `<ul>${items.map(label => {
  const removeBtn = dom `<button>X</button>`
  const node = dom `<li>${label} ${removeBtn}</li>`

  removeBtn.onclick = () => node.remove()

  return node
})}</ul>`

document.body.appendChild(list)
```


### Multiple root nodes

Multiple nodes are returned as a document fragment:

```javascript
const dom = require('dom-template-strings')

document.body.appendChild(dom`<p>One</p><p>Two</p><p>One</p>`)
```

### Another document

Another document can be used to own the nodes:

```javascript
const dom = require('dom-template-strings')
let mydoc = document.cloneNode();
let frag = dom.bind(mydoc)`<p>One</p><p>Two</p><p>One</p>`;
document.body.appendChild(document.adoptNode(frag));
```

## Compatibility

### template tag support

Everywhere a `<template>` tag is native, or polyfillable using
https://github.com/webcomponents/template
or
https://github.com/kapouer/template (as a meantime replacement of the former):
`npm install @kapouer/template`.

### es2015

Software written with dom-template-strings can be babelified to es5, see for
example the one-liners in package.json.


## License

MIT, see LICENSE file.

