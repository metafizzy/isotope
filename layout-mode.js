( function( window ) {

'use strict';

// --------------------------  -------------------------- //

var Isotope = window.Isotope;

function LayoutMode( isotope ) {
  this.isotope = isotope;
  // link options to isotope.options
  this.options = isotope && isotope.options[ this.namespace ];
}

// -------------------------- create -------------------------- //

LayoutMode.create = function( namespace, options ) {
  // subclass LayoutMode
  function Mode() {
    LayoutMode.apply( this, arguments );
  }
  Mode.prototype = new LayoutMode();
  Mode.prototype.namespace = namespace;
  // set default options
  Isotope.prototype.options[ namespace ] = options || {};
  // register in Isotope
  Isotope.layoutModes[ namespace ] = Mode;
  return Mode;
};

Isotope.LayoutMode = LayoutMode;

})( window );
