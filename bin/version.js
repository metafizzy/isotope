const fs = require('fs');
const version = require('../package.json').version;

const file = 'js/isotope.js';
let src = fs.readFileSync( file, 'utf8' );
src = src.replace( /Isotope v\d+\.\d+\.\d+/, `Isotope v${version}` );
fs.writeFileSync( file, src, 'utf8' );
