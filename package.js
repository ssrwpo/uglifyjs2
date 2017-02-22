"use strict";

const name = 'ssrwpo:uglifyjs2';
Package.describe({
  name,
  version: '0.4.0',
  summary: 'Meteor package that exposes options for UglifyJS2 JS minifier',
  git: 'https://github.com/ssr-server/uglifyjs2',
  documentation: 'README.md',
});

const pkgs = ['ecmascript', 'abernix:standard-minifier-js@1.2.16', 'isobuild:minifier-plugin@1.0.0'];

Package.registerBuildPlugin({
  name,
  use: pkgs,
  sources: ['loadPackageJson.js', 'plugin.js'],
});

Package.onUse((api) => {
  api.versionsFrom('1.4.2.6');
  api.use(pkgs, 'server');
  api.export('loadPackageJson', 'server');
});

Package.onTest((api) => {
  api.use(pkgs.concat(['tinytest', name]), 'server');
  api.mainModule('uglifyjs2-tests.js');
});
