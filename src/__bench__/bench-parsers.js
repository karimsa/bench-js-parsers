const { parse: babelParse } = require('@babel/parser')
const babelPluginJSX = require('@babel/plugin-syntax-jsx')
const { default: babelTraverse } = require('@babel/traverse')
const acorn = require('acorn').Parser.extend(require('acorn-jsx')())
const acornWalk = require('acorn-walk')
const { benchmark } = require('@karimsa/wiz/bench')
const esprima = require('esprima')
const meriyah = require('meriyah')

const { sourceFiles } = require('./helpers')

const parsers = [
	{
		name: '@babel/parser',
		parse: src =>
			babelParse(src, {
				plugins: [babelPluginJSX],
			}),
		walk: ast => {
			let nodesFound = 0
			babelTraverse(ast, {
				CallExpression() {
					nodesFound++
				},
			})
			return nodesFound
		},
	},
	{
		name: 'acorn',
		parse: src => acorn.parse(src),
		walk: ast => {
			let nodesFound = 0
			acornWalk.simple(ast, {
				CallExpression() {
					nodesFound++
				},
			})
			return nodesFound
		},
	},
	{
		name: 'esprima',
		parse: src => esprima.parseScript(src, { jsx: true }),
		walkSource: src => {
			let nodesFound = 0
			esprima.parseScript(src, { jsx: true }, node => {
				if (node.type === 'CallExpression') {
					nodesFound++
				}
			})
			return nodesFound
		},
	},
	{
		name: 'meriyah',
		parse: src => meriyah.parseScript(src, { jsx: true }),
		walk: ast => {
			let nodesFound = 0
			acornWalk.simple(ast, {
				CallExpression() {
					nodesFound++
				},
			})
			return nodesFound
		},
	},
]

sourceFiles.forEach(sourceFile => {
	const { file, source } = sourceFile

	for (const parser of parsers) {
		const { name, parse, walk, walkSource } = parser

		benchmark(`parse: ${file} - ${name}`, b => {
			for (let i = 0; i < b.N(); i++) {
				parse(source)
			}
		})
		benchmark(`walk: ${file} - ${name}`, b => {
			let ids
			for (let i = 0; i < b.N(); i++) {
				if (walkSource) {
					ids = walkSource(source)
				} else {
					ids = walk(parse(source))
				}
			}
			b.stopTimer()

			if (ids === undefined) {
				throw new Error(`Walker did not return number of nodesFound`)
			}
			if (sourceFile.expectedIDs === undefined) {
				sourceFile.expectedIDs = {
					num: ids,
					parser: name,
				}
			} else if (sourceFile.expectedIDs.num !== ids) {
				throw new Error(
					`Traversing AST of ${name} found ${ids} nodesFound, but ${sourceFile.expectedIDs.num} were expected (as found by ${sourceFile.expectedIDs.parser})`,
				)
			}
		})
	}
})
