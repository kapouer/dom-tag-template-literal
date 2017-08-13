# dom-template-strings

Create DOM Nodes or Fragments using ES2015 Template Strings.

A fork of [domify-template-strings](https://github.com/Loilo/domify-template-strings).

[![Sauce Test Status](https://saucelabs.com/browser-matrix/kapouer+dom-template-strings.svg)](https://saucelabs.com/u/kapouer+dom-template-strings)


## Installation
```bash
npm install --save dom-template-strings
```

## Usage

### New in version 2
The standalone version exports itself as `Document.prototype.dom`, so one can do:
```html
<script src="dist/dom-template-strings.js"></script>
<script>
  document.body.appendChild(document.dom`<div>${document.location.toString()}</div>`)
</script>
```
It is a breaking change from version 1 which used to export a global `dom` function.


### using require

The exported module function is bound to the current document:
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

Since version 2.2.0 it is also possible to pass instances of
- DocumentFragment
- NodeList


### trim whitespace

Since version 2.3.0, if the string literal has whitespace before or after a single node,
it is removed. This doesn't happen when there are other characters.

```javascript
var node = dom`
  <div>hello</div>
`
assert.equal(node.nodeType, 1)
```


### Multiple root nodes

Multiple nodes are returned as a document fragment:

```javascript
const dom = require('dom-template-strings')

document.body.appendChild(dom`<p>One</p><p>Two</p><p>One</p>`)
```

Since version 2.4.0 mapping mapping an array of dom nodes, even of length one,
returns a document fragment:

```javascript
const dom = require('dom-template-strings')
dom`${[document.createElement('div')]}`.nodeType == Node.DOCUMENT_FRAGMENT_NODE
```

### Another document

Another document can be used to own the nodes:

```javascript
const dom = require('dom-template-strings')
let mydoc = document.cloneNode()
let frag = dom.bind(mydoc)`<p>One</p><p>Two</p><p>One</p>`
document.body.appendChild(document.adoptNode(frag))
```

It can also be added to all documents, exactly like the standalone version:

```javascript
Document.prototype.dom = require('dom-template-strings')
let doc = document.cloneNode()
let frag = doc.dom`<p>test</p>`
// frag.ownerDocument == doc
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

