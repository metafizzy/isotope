/* eslint-env node */

module.exports = {
  plugins: [ 'metafizzy' ],
  extends: 'plugin:metafizzy/browser',
  env: {
    browser: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 5,
  },
  globals: {
    Isotope: 'readonly',
    QUnit: 'readonly',
    define: 'readonly',
  },
  rules: {
    'no-var': 'off',
    'prefer-spread': 'off',
    strict: 'off',
  },
  ignorePatterns: [
    'sandbox/browserify/bundle.js',
  ],
};
