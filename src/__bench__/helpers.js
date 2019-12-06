const fs = require('fs')
const path = require('path')

const wiz = require('@karimsa/wiz/bench')

const modules = path.join(__dirname, '..', '..', 'node_modules')

const sourceFiles = [
	{
		file: 'bootstrap.min.js',
		path: path.join(modules, 'bootstrap', 'dist', 'js', 'bootstrap.min.js'),
	},
	{
		file: 'jquery.min.js',
		path: path.join(modules, 'jquery', 'dist', 'jquery.min.js'),
	},
	{
		file: 'react.development.js',
		path: path.join(modules, 'react', 'cjs', 'react.development.js'),
	},
	{
		file: 'app.jsx (todomvc)',
		path: path.join(
			__dirname,
			'..',
			'..',
			'todomvc',
			'examples',
			'react',
			'js',
			'app.jsx',
		),
	},
].map(file => {
	file.source = fs.readFileSync(file.path, 'utf8')
	return file
})

function benchmark(title, fn) {
	for (const { file, source } of sourceFiles) {
		wiz.benchmark(`${title}: ${file}`, b => {
			return fn(source, b)
		})
	}
}

module.exports = {
	sourceFiles,
	benchmark,
}
