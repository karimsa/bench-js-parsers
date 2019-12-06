const crypto = require('crypto')

const { parse: babelParse } = require('@babel/parser')
const { default: babelTraverse } = require('@babel/traverse')
const acorn = require('acorn').Parser.extend(require('acorn-jsx')())
const { benchmark } = require('@karimsa/wiz/bench')
const esprima = require('esprima')
const meriyah = require('meriyah')

const { sourceFiles } = require('./helpers')
const { walk: acornWalk } = require('./acorn-walker')

const parsers = [
	{
		name: '@babel/parser',
		parse: src =>
			babelParse(src, {
				plugins: ['jsx'],
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
			acornWalk(ast, {
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
			acornWalk(ast, {
				CallExpression() {
					nodesFound++
				},
			})
			return nodesFound
		},
	},
]

console.log('Targets:')
sourceFiles.forEach(sourceFile => {
	const { file, source } = sourceFile
	const hasher = crypto.createHash('md5')
	hasher.update(source)
	const sourceHash = hasher.digest('hex')

	console.log(
		`  - ${file}:\n\tHash: ${sourceHash}\n\tSize: ${source.length} bytes`,
	)

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
console.log()
