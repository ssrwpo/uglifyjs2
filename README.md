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

## Links
* [UglifyJS2](https://github.com/mishoo/UglifyJS2)
