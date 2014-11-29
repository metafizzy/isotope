// package metadata file for Meteor.js
'use strict';

var packageName = 'isotope:isotope';  // http://atmospherejs.com/isotope/isotope
var where = 'client';  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'Isotope (official): filter and sort magical layouts: fit rows, packery, masonry, fit columns etc.',  // limited to 100 characters
  version: packageJson.version,
  git: 'https://github.com/metafizzy/isotope.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.export('Isotope');
  api.addFiles([
    'dist/isotope.pkgd.js',
    'meteor/export.js'
  ], where);
});

Package.onTest(function (api) {
  api.use(packageName, where);
  api.use(['tinytest', 'http'], where);

  api.addFiles([
    'test/tests.css',
    'meteor/test.js'
  ], where);
});
