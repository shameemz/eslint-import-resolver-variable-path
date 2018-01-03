# eslint-import-resolver-variable-path
[![Maintenance Status][status-image]][status-url] [![npm][npm-version-image]][npm-url]

A [babel-plugin-variable-path-resolver][babel-plugin-variable-path-resolver] resolver for [eslint-plugin-import][eslint-plugin-import]

## Installation

```sh
npm install --save-dev eslint-plugin-import eslint-import-resolver-variable-path
```

## Usage

Inside your `.eslintrc` file, pass this resolver to `eslint-plugin-import`:
```
"settings": {
  "import/resolver": "variable-path"
}
```

And see [babel-plugin-variable-path-resolver][babel-plugin-variable-path-resolver] to know how to configure your aliases.

### Example

```json
{
  "extends": "airbnb",
  "rules": {
    "comma-dangle": 0
  },
  "settings": {
    "import/resolver": "variable-path"
  }
}
```

## License

MIT, see [LICENSE.md](/LICENSE.md) for details.

[status-image]: https://img.shields.io/badge/status-maintained-brightgreen.svg
[status-url]: https://github.com/shameemz/eslint-import-resolver-variable-path

[npm-version-image]: https://img.shields.io/npm/v/eslint-import-resolver-variable-path.svg
[npm-url]: https://www.npmjs.com/package/eslint-import-resolver-variable-path

[babel-plugin-variable-path-resolver]: https://github.com/shameemz/babel-plugin-variable-path-resolver
[eslint-plugin-import]: https://www.npmjs.com/package/eslint-plugin-import
