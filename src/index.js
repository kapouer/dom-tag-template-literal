(function() {
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = domify
} else {
  Node.prototype.dom = domify
  Document.prototype.dom = domify
}

/**
 * Just generates some kind-of-random ID. It just needs to be distinguishable from regular IDs
 * @return {string}  The generated ID
 */
let counter = 0
function generateId () {
  counter++
  return `p-${counter}-${Date.now()}`
}

function trim(node){
  const outerWhitespaceNodeReducer = ({isLastOuterTextNodeFound, whitespaceNodes}, currentNode) => {
    if(isLastOuterTextNodeFound){
      return {isLastOuterTextNodeFound: true, whitespaceNodes}
    } else {
      if(currentNode.nodeType === Node.TEXT_NODE){
        if(currentNode.textContent.replace(/^\s+/, "")){
          currentNode.textContent = currentNode.textContent.replace(/^\s+/, "")
          return {isLastOuterTextNodeFound: true, whitespaceNodes}
        } else {
          whitespaceNodes.push(currentNode)
          return {isLastOuterTextNodeFound: false, whitespaceNodes}
        }
      } else {
        return {isLastOuterTextNodeFound: true, whitespaceNodes}
      }
    }
  }

  const {whitespaceNodes: leftWhiteSpaceNodes} = [...node.childNodes].reduce(
    outerWhitespaceNodeReducer
    ,{
      isLastOuterTextNodeFound: false
      ,whitespaceNodes: []
    }
  )

  const {whitespaceNodes: rightWhiteSpaceNodes} = [...node.childNodes].reduceRight(
    outerWhitespaceNodeReducer
    ,{
      isLastOuterTextNodeFound: false
      ,whitespaceNodes: []
    }
  )

  if(leftWhiteSpaceNodes.length) leftWhiteSpaceNodes.forEach(node => node.remove())
  if(rightWhiteSpaceNodes.length) rightWhiteSpaceNodes.forEach(node => node.remove())
  
  if (node.childNodes.length == 1) {
    let child = node.firstChild
    node.removeChild(child)
    return child
  } else {
    return node
  }
}

/**
 * Generates an array of DOM Nodes
 * @param  {...any} partials   Might be anything. DOM Nodes are handled, arrays are iterated over and then handled, everything else just gets passed through
 * @return {Node[]}            An array of DOM Nodes
 */
function generateNodes (doc, ...partials) {
  // Array of placeholder IDs
  const placeholders = []
  // Generate regular HTML string first
  function reducer(carry, partial) {
    if (partial && partial.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
      partial = partial.childNodes
    }
    if (Array.isArray(partial)) {
      carry.concat(partial)
    } else if (typeof partial === 'object' && partial instanceof Node) {
      const id = generateId()
      placeholders.push({ id, node: partial })
      return carry.concat(`<${partial.nodeName} id="${id}"></${partial.nodeName}>`)
    } else if (partial && typeof partial.item == "function" && typeof partial.length == "number") {
      return carry.concat(Array.prototype.reduce.call(partial, reducer, []))
    } else {
      return carry.concat(partial)
    }
  }
  const html = partials.reduce(reducer, []).join('')

  // Wrap in temporary container node
  let template = doc.createElement('template')
  template.innerHTML = html
  let container = template.content

  // Replace placeholders with real Nodes
  placeholders.forEach(({ id, node }) => {
    const placeholder = container.querySelector(`${node.nodeName}#${id}`)
    placeholder.parentNode.replaceChild(node, placeholder)
  })
  return trim(container)
}

/**
 * A function that is suitable to be used as a function for tagged template strings
 * @param  {string[]}    strings  The literal parts of the template string
 * @param  {...values}   values   The interpolated parts of the template string
 * @return {Node[]}               An array of DOM Nodes
 */
function taggedTemplateHandler (doc, strings, ...values) {
  // Create an array that puts the values back in their place
  const arr = strings.reduce((carry, current, index) => {
    return carry.concat(current, (index + 1 === strings.length) ? [] : values[index])
  }, [])

  // Generate the Node array
  return generateNodes(doc, ...arr)
}


function domify (strings, ...values) {
  var doc = document
  if (this) {
    if (this.nodeType == Node.DOCUMENT_NODE) doc = this
    else if (this.ownerDocument) doc = this.ownerDocument
  }
  return taggedTemplateHandler(doc, strings, ...values)
}

})()
