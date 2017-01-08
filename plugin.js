"use strict";

import fs from 'fs';
import { Meteor } from 'meteor/meteor';

export const name = 'ssrwpo:uglifyjs2';

const manifestFileName = './package.json';

class UglifyJSMinifier {
  constructor() {
    this.minifyOptions = {
      /* eslint-disable camelcase */
      fromString: true,
      compress: {
        drop_debugger: true,
        unused: true,
        dead_code: true,
        drop_console: true,
        passes: 2,
        global_defs: {
          UGLYFYJS_DEAD: false,
        },
      },
      /* eslint-enable */
    };
    this.deadCodes = ['Meteor.isServer'];
    if (fs.lstatSync(manifestFileName).isFile()) {
      const manifest = fs.readFileSync(manifestFileName, 'utf8');
    }
  }
  minify(content) {
    const pattern = new RegExp(this.deadCodes.join('|'), 'g');
    if (content.length) {
      return UglifyJSMinify(
        content.replace(pattern, 'UGLYFYJS_DEAD')
        , this.minifyOptions
      ).code;
    }
    return '';
  }
  processFilesForBundle(files, options) {
    Plugin.nudge();
    const mode = options.minifyMode;
    // Don't minify anything for development
    if (mode === 'development') {
      files.forEach(function (file) {
        file.addJavaScript({
          data: file.getContentsAsBuffer(),
          sourceMap: file.getSourceMap(),
          path: file.getPathInBundle()
        });
      });
      return;
    }
    // Parse each file and create 2 accumlators:
    // * allMinifiedJs: A concatenation of all already minified file's content
    // * allUnminifiedJs: The unminified ones
    let allMinifiedJs = '';
    let allUnminifiedJs = '';
    files.forEach((file) => {
      // Don't reminify *.min.js.
      if (/\.min\.js$/.test(file.getPathInBundle())) {
        allMinifiedJs += file.getContentsAsString();
      } else {
        allUnminifiedJs += file.getContentsAsString();
      }
    });
    const data = allMinifiedJs + this.minify(allUnminifiedJs);
    if (data.length) {
      files[0].addJavaScript({ data });
    }
    Plugin.nudge();
  }
}

// Export Meteor package
Plugin.registerMinifier({
  extensions: ['js'],
  archMatching: 'web'
}, () => new UglifyJSMinifier());
