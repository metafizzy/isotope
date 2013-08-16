( function( window ) {

'use strict';

// --------------------------  -------------------------- //

var Isotope = window.Isotope;
var Outlayer = window.Outlayer;

function LayoutMode( isotope ) {
  this.isotope = isotope;
  // link options to isotope.options
  this.options = isotope && isotope.options[ this.namespace ];
}

// default methods just defer to Isotope
LayoutMode.prototype._resetLayout = function() {
  Outlayer.prototype._resetLayout.apply( this.isotope, arguments );
};

LayoutMode.prototype._getItemLayoutPosition = function() {
  return Outlayer.prototype._getItemLayoutPosition.apply( this.isotope, arguments );
};

LayoutMode.prototype._manageStamp = function() {
  Outlayer.prototype._manageStamp.apply( this.isotope, arguments );
};

LayoutMode.prototype._getContainerSize = function() {
  return Outlayer.prototype._getContainerSize.apply( this.isotope, arguments );
};

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
