/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended'
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'@stylistic/eslint-plugin'
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: [ '.svelte' ]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		"no-unused-vars": "warn",
		"prefer-const": "warn",
		"@typescript-eslint/no-unused-vars": "warn",
		"@stylistic/max-len": [ "warn", { "code": 80 } ]
	},
	overrides: [
		{
			files: [ '*.svelte' ],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
		},
		{
			rules: {
				// "@stylistic/max-len": [ "error", { "code": 40 } ]
			}
		}
	]
};
