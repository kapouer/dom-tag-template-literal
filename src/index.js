/**
 * Just generates some kind-of-random ID. It just needs to be distinguishable from regular IDs
 * @return {string}  The generated ID
 */
let counter = 0
function generateId () {
  counter++
  return `p-${counter}-${Date.now()}`
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
  const html = partials.reduce((carry, partial) => {
    if (Array.isArray(partial)) {
      carry.concat(partial)
    } else if (typeof partial === 'object' && partial instanceof Node) {
      const id = generateId()
      placeholders.push({ id, node: partial })
      return carry.concat(`<generator-placeholder id="${id}"></generator-placeholder>`)
    } else {
      return carry.concat(partial)
    }
  }, []).join('')

  // Wrap in temporary container node
  let template = doc.createElement('template')
  template.innerHTML = html
  let container = template.content

  // Replace placeholders with real Nodes
  placeholders.forEach(({ id, node }) => {
    const placeholder = container.querySelector(`generator-placeholder#${id}`)
    placeholder.parentNode.replaceChild(node, placeholder)
  })
  template.innerHTML = ""
  // Get array of Nodes
  return container
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
  var doc = this && this.nodeType == Node.DOCUMENT_NODE || document
  let result = taggedTemplateHandler(doc, strings, ...values)
  if (result.childNodes.length == 1) return result.firstChild
  else return result
}

module.exports = domify
