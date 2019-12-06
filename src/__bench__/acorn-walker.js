const { base, simple } = require('acorn-walk')
const noop = _ => _

Object.assign(base, {
	JSXOpeningElement(node, state, visit) {
		node.attributes.forEach(attr => {
			visit(attr.value, state)
		})
	},

	JSXClosingElement: noop,
	JSXText: noop,

	JSXExpressionContainer(node, state, visit) {
		visit(node.expression, state)
	},

	JSXElement(node, state, visit) {
		visit(node.openingElement, state)
		node.children.forEach(child => {
			visit(child, state)
		})
		if (node.closingElement) {
			visit(node.closingElement, state)
		}
	},
})

function walk(ast, visitors) {
	return simple(ast, visitors)
}

module.exports = {
	walk,
}
