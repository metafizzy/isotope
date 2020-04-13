const fs = require('fs');
const requirejs = require('requirejs');

// get banner
let isotopeJsSrc = fs.readFileSync( 'js/isotope.js', 'utf8' );
let banner = isotopeJsSrc.split(' */')[0] + ' */\n\n';
banner = banner.replace( 'Isotope', 'Isotope PACKAGED' );

let options = {
  out: 'dist/isotope.pkgd.js',
  baseUrl: 'bower_components',
  optimize: 'none',
  include: [
    'jquery-bridget/jquery-bridget',
    'isotope-layout/js/isotope',
  ],
  paths: {
    'isotope-layout': '../',
    jquery: 'empty:',
  },
};

requirejs.optimize(
    options,
    function() {
      let pkgdSrc = fs.readFileSync( options.out, 'utf8' );
      let definitionRE = /define\(\s*'isotope-layout\/js\/isotope'(.|\n)+\],/;
      // remove named module
      pkgdSrc.replace( definitionRE, function( definition ) {
            // remove named module
            return definition.replace( "'isotope-layout/js/isotope',", '' )
              // use explicit file paths, './item' -> 'isotope-layout/js/item'
              .replace( /'.\//g, "'isotope-layout/js/" );
          } );
      pkgdSrc = banner + pkgdSrc;
      fs.writeFileSync( options.out, pkgdSrc );
    },
    function( err ) {
      throw new Error( err );
    },
);
