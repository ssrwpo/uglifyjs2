"use strict";

import fs from 'fs';
import { Meteor } from 'meteor/meteor';

// Package's name
export const name = 'ssrwpo:uglifyjs2';

const npmManifestFileName = './package.json';

class UglifyJSMinifier {
  constructor() {
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
        },
      },
      /* eslint-enable */
    };
    this.deadCodes = ['Meteor.isServer'];
    // Analyse user's package.json for package options
    if (fs.lstatSync(npmManifestFileName).isFile()) {
      const npmManifest = JSON.parse(fs.readFileSync(npmManifestFileName, 'utf8'));
      if (npmManifest.uglifyjs2) {
        const { development, deadCodes, options } = npmManifest.uglifyjs2;
        this.forceDevelopmentMinification = development || false;
        if (deadCodes) {
          this.deadCodes = deadCodes;
        }
        if (options) {
          this.minifyOptions = Object.assign(this.minifyOptions, options);
        }
      }
    }
    this.processFilesForBundle = this.processFilesForBundle.bind(this);
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
