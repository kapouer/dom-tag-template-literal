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
.* our template placeholder
.*/

let template = document.createElement('template')

/**
 * Generates an array of DOM Nodes
 * @param  {...any} partials   Might be anything. DOM Nodes are handled, arrays are iterated over and then handled, everything else just gets passed through
 * @return {Node[]}            An array of DOM Nodes
 */
function generateNodes (...partials) {
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
  template.innerHTML = html
  let container = template.content

  // Replace placeholders with real Nodes
  placeholders.forEach(({ id, node }) => {
    const placeholder = container.querySelector(`generator-placeholder#${id}`)
    placeholder.parentNode.replaceChild(node, placeholder)
  })

  // Get array of Nodes
  return container
}

/**
 * A function that is suitable to be used as a function for tagged template strings
 * @param  {string[]}    strings  The literal parts of the template string
 * @param  {...values}   values   The interpolated parts of the template string
 * @return {Node[]}               An array of DOM Nodes
 */
function taggedTemplateHandler (strings, ...values) {
  // Create an array that puts the values back in their place
  const arr = strings.reduce((carry, current, index) => {
    return carry.concat(current, (index + 1 === strings.length) ? [] : values[index])
  }, [])

  // Generate the Node array
  return generateNodes(...arr)
}


function domify (strings, ...values) {
  let result = taggedTemplateHandler(strings, ...values)
  if (result.childNodes.length == 1) return result.firstChild
  else return result
}

module.exports = domify
