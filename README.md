# dom-template-strings

[![Sauce Test Status](https://saucelabs.com/browser-matrix/kapouer+dom-template-strings.svg)](https://saucelabs.com/u/kapouer+dom-template-strings)

A wild fork of domify-template-strings.

> Interpolate DOM Nodes into ES2015 Template Strings

This package contains a tiny tag function for ES2015 template strings. It takes an HTML string and returns a `Node` object.

## Installation
```bash
npm install --save dom-template-strings
```

## Usage
The real fun part of creating pieces of DOM in JavaScript comes when you want to use things like event listeners on single elements. They can be a real pain if you want to set up your DOM tree in a declarative way if you don't want to use a full blown templating language or framework.

But with the right tag function, ES2015 template strings allow you to go for it just like that:

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

Just as an example. I'm not suggesting managing your application state through the DOM. :)

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

### Compatibility

Everywhere a `<template>` tag is native, or polyfillable using
https://github.com/webcomponents/template
or
https://github.com/kapouer/template (as a meantime replacement of the former):
`npm install @kapouer/template`.

