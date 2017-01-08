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
The following default options are activated:
```
uglifyjs2: {
  deadCodes: ['Meteor.isServer'],
  options: {
    fromString: true,
    compress: {
      properties: true,
      dead_code: true,
      drop_debugger: true,
      conditionals: true,
      comparisons: true,
      evaluate: true,
      booleans: true,
      loops: true,
      unused: true,
      hoist_funs: true,
      if_return: true,
      join_vars: true,
      cascade: true,
      collapse_vars: true,
      negate_iife: true,
      pure_getters: true,
      drop_console: true,
      keep_fargs: false,
      keep_fnames: false,
      passes: 2,
      global_defs: {
        UGLYFYJS_DEAD: false
      }
    }
  }
}
```

### Dead code elimination
A list of `String`s is used for text replacement as a global definition
transformed into `UGLYFYJS_DEAD` allowing minifications with dead code removal.
This acts as macro for code removal in your project.

By default, the list only contains: `['Meteor.isServer']`.

### UglifyJS2 options

### Development minification
Meteor's standard minifier skip minification while in development. As dead code
removal could affect your project's behavior, this package allows you to minify
your code while developping.

In your `package.json`, add the `development` option to activate minification
while in development mode:
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
