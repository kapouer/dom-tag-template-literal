const assert = require('assert')
const dom = require('../src/')

describe('dom tagged template string', function() {
  it('should return a DOM node', function() {
    let node = dom`<span></span>`
    assert.ok(node instanceof Node)
    assert.equal(node.tagName, "SPAN")
  })

  it('should return a DOM node that has no parentNode', function() {
    let node = dom`<span></span>`
    assert.ok(node instanceof Node)
    assert.ok(node.parentNode == null)
    assert.equal(node.tagName, "SPAN")
  })

  it('should return a DOM fragment', function() {
    let node = dom`<tr><td>a</td></tr><tr><td>b</td></tr>`
    assert.ok(node instanceof Node)
    assert.equal(node.querySelectorAll('tr').length, 2)
    assert.equal(node.querySelectorAll('tr > td').length, 2)
    assert.equal(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE)
  })

  it('should replace attributes values', function() {
    let obj = {
      className: 'myclass',
      text: 'awesome'
    }
    let node = dom`<span class="${obj.className}">${obj.text}</span>`
    assert.equal(node.innerHTML, obj.text)
    assert.equal(node.className, obj.className)
  })

  it('should not display null or undefined value', function() {
    let obj = {
      className: null,
      text: 'awesome'
    }
    let node = dom`<span class="${obj.className}" title="${obj.ratat}">${obj.text}</span>`
    assert.equal(node.innerHTML, obj.text)
    assert.equal(node.getAttribute('class'), "")
    assert.equal(node.getAttribute('title'), "")
  })

  it('should replace a Node value', function() {
    const items = [ 'One', 'Two', 'Three' ]
    const list = dom`<ul>${getItems(items)}</ul>`
    function getItems(items) {
      return items.map(label => {
        const node = document.createElement('li')
        node.innerHTML = label
        return node
      })
    }
    assert.equal(list.querySelectorAll('li').length, 3)
    assert.equal(list.textContent, 'OneTwoThree')
  })

  it('should replace a NodeList', function() {
    const items = dom`<div><li>One</li><li>Two</li><li>Three</li></div>`
    const list = dom`<ul>${items.childNodes}</ul>`
    assert.equal(list.querySelectorAll('li').length, 3)
    assert.equal(list.textContent, 'OneTwoThree')
  })

  it('should replace a DocumentFragment', function() {
    const items = dom`<li>One</li><li>Two</li><li>Three</li>`
    const list = dom`<ul>${items}</ul>`
    assert.equal(list.querySelectorAll('li').length, 3)
    assert.equal(list.textContent, 'OneTwoThree')
  })

  it('should return a DOM Element when ther is only whitespace chars around template', function() {
    let node = dom`
  
      <div>
        content
      </div>


    `
    
    assert.ok(node instanceof Node)
    assert.equal(node.nodeType, Node.ELEMENT_NODE)
  })

  it('should return a DOM Fragment when there is non-whitespace chars around template', function() {
    let node = dom`
      
      Hello
      
      <div>
        content
      </div>


    `
    
    assert.ok(node instanceof Node)
    assert.equal(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE)
  })

  it('should remove whitespace chars around template', function() {
    let node = dom`
      
      Hello
      
      <div>
        content
      </div>


    `
    
    assert.ok(node instanceof Node)
    assert.equal(node.nodeType, Node.DOCUMENT_FRAGMENT_NODE)
    assert.equal(node.childNodes.length, 2)
  })
})

