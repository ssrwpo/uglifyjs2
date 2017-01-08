## Description
A JS minifier with more aggressive set of default options. Options are configurable
in your project's `package.json`.

> **Interesting side effect** This package increases security by removing part of
your server side code which is normally included by the Meteor's standard minifier.

## Usage
```
meteor remove standard-minifier-js
meteor add ssrwpo:uglifyjs2
```

## Configuration
### Default options
### Dead code elimination
### Compressor options
### Development minification
Meteor's standard minifier skip minification while in development. As dead code
removal could affect your project's behavior, this package allows you to minify
your code while developping.

In your `package.json`, add the following option to activate minification while
in development mode:
```json
"uglifyjs2": {
  ...
  "development": true,
  ...
}
```

## Tips
* Start with a small project when choosing your options.
* Don't add `reduce_vars` as option as it prevents Meteor from starting.

## Links
* [UglifyJS2](https://github.com/mishoo/UglifyJS2)
