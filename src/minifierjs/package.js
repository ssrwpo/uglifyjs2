"use strict";

Package.describe({
  name: 'ssrwpo:minifierjs',
  summary: 'JavaScript minifier',
  version: '2.0.0',
  git: 'https://github.com/ssr-server/uglifyjs2',
  documentation: 'README.md',
});

Npm.depends({
  'uglify-js': '2.8.21',
});

Package.onUse((api) => {
  api.use(['ecmascript@0.7.3', 'babel-compiler@6.18.2']);
  api.export(['meteorJsMinify']);
  api.addFiles(['minifier.js'], 'server');
});
