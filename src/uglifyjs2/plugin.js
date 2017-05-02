"use strict";

// Package's name
// eslint-disable-next-line import/prefer-default-export
export const name = 'ssrwpo:uglifyjs2';

class UglifyJSMinifier {
  constructor() {
    this.packageDebug = false;
    this.fileRemoval = [
      'packages/ddp-server.js',
      'packages/shell-server.js',
      'packages/ssrwpo_uglifyjs2.js',
    ];
    this.aggressive = false;
    this.forceDevelopmentMinification = false;
    this.minifyOptions = {
      /* eslint-disable camelcase */
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
          UGLYFYJS_DEAD: false,
          _UGLYFYJS_DEAD: false,
        },
      },
      /* eslint-enable */
    };
    this.deadCodes = [
      '_meteor.Meteor.isServer',
      'Meteor.isServer',
      "process.env.NODE_ENV !== 'production'",
    ];
    // Analyse user's package.json for package options
    const npmManifest = loadPackageJson();
    if (npmManifest.uglifyjs2) {
      const {
        development, deadCodes, options, packageDebug, fileRemoval, aggressive,
      } = npmManifest.uglifyjs2;
      this.forceDevelopmentMinification = development || false;
      this.packageDebug = packageDebug || false;
      if (aggressive) { this.aggressive = aggressive; }
      if (fileRemoval) { this.fileRemoval = fileRemoval; }
      if (deadCodes) { this.deadCodes = deadCodes; }
      if (options) { this.minifyOptions = Object.assign(this.minifyOptions, options); }
    }
    this.processFilesForBundle = this.processFilesForBundle.bind(this);
  }
  minify(content) {
    const pattern = new RegExp(this.deadCodes.join('|'), 'g');
    if (content.length) {
      const contentReplaced = content
        .replace(pattern, 'UGLYFYJS_DEAD')
        .replace(/process.env.NODE_ENV !== 'production'/g, 'UGLYFYJS_DEAD');
      if (this.packageDebug) {
        // eslint-disable-next-line no-console
        console.log('** content before minification:\n', contentReplaced);
      }
      return meteorJsMinify(contentReplaced, this.minifyOptions).code;
    }
    return '';
  }
  processFilesForBundle(files, options) {
    const mode = options.minifyMode;
    // Don't minify anything for development except if forced
    if (mode === 'development') {
      files.forEach((file) => {
        const data = this.forceDevelopmentMinification &&
        !(/\.min\.js$/.test(file.getPathInBundle()))
          ? this.minify(file.getContentsAsString())
          : file.getContentsAsBuffer();
        file.addJavaScript({
          data,
          sourceMap: file.getSourceMap(),
          path: file.getPathInBundle(),
        });
        Plugin.nudge();
      });
      return;
    }
    // Force production mode
    process.env.NODE_ENV = "production";
    // Parse each file and create 2 accumlators:
    // * allMinifiedJs: A concatenation of all already minified file's content
    // * allUnminifiedJs: The unminified ones
    let allMinifiedJs = '';
    let allUnminifiedJs = '';
    files.forEach((file) => {
      const path = file.getPathInBundle();
      if (this.fileRemoval.includes(path)) {
        if (this.packageDebug) {
          // eslint-disable-next-line no-console
          console.log('file removed:', path);
        }
      } else {
        const content = file.getContentsAsString();
        if (this.packageDebug) {
          // eslint-disable-next-line no-console
          console.log('file added:', path);
        }
        // Don't reminify *.min.js.
        if (/\.min\.js$/.test(path)) {
          allMinifiedJs += content;
        } else {
          allUnminifiedJs += this.aggressive ? content : this.minify(content);
        }
        Plugin.nudge();
      }
    });
    const data = this.aggressive
      ? this.minify(allMinifiedJs + allUnminifiedJs)
      : allMinifiedJs + allUnminifiedJs;
    if (data.length) {
      files[0].addJavaScript({ data });
    }
  }
}

// Export Meteor package
Plugin.registerMinifier({
  extensions: ['js'],
  archMatching: 'web',
}, () => new UglifyJSMinifier());
