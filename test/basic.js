const assert = require('assert')
const domify = require('../src/')

describe('domify tagged template string', function() {
  it('should return a DOM node', function() {
    let node = domify`<span></span>`
    assert.ok(node instanceof Node)
    assert.equal(node.tagName, "SPAN")
    assert.equal(node.ownerDocument, document)
  })

  it('should return a DOM fragment', function() {
    let node = domify`<tr><td>a</td></tr><tr><td>b</td></tr>`
    assert.ok(node instanceof Node)
    assert.equal(node.querySelectorAll('tr').length, 2)
    assert.equal(node.querySelectorAll('tr > td').length, 2)
    assert.equal(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE)
    assert.equal(node.ownerDocument, document)
  })

  it('should replace attributes values', function() {
    let obj = {
      style: 'color:red',
      text: 'awesome'
    }
    let node = domify`<span style="${obj.style}">${obj.text}</span>`
    assert.equal(node.innerHTML, obj.text)
    assert.equal(node.attributes.style.value, 'color:red')
    assert.equal(node.style.color, 'red')
  })

  it('should replace a Node value', function() {
    const items = [ 'One', 'Two', 'Three' ]
    const list = domify `<ul>${items.map(label => {
      const removeBtn = domify `<button>X</button>`
      const node = domify `<li>${label} ${removeBtn}</li>`
    return node
    })}</ul>`
    assert.equal(list.querySelectorAll('li').length, 3)
    assert.equal(list.querySelectorAll('li > button').length, 3)
    assert.equal(list.textContent, 'One XTwo XThree X')
  })
})

