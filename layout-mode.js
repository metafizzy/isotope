( function( window ) {

'use strict';

// --------------------------  -------------------------- //

var Isotope = window.Isotope;

Isotope.createLayoutMode = function( namespace, options ) {
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link options to isotope.options
    this.options = isotope && isotope.options[ this.namespace ];
  }
  LayoutMode.prototype.namespace = namespace;
  // set default options
  Isotope.prototype.options[ namespace ] = options || {};
  // register in Isotope
  Isotope.layoutModes[ namespace ] = LayoutMode;
  return LayoutMode;
};

})( window );
