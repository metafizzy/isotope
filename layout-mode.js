( function( window ) {

'use strict';

// --------------------------  -------------------------- //

// var Isotope = window.Isotope;

var layoutMode = {};

layoutMode.options = {};
layoutMode.modes = {};

layoutMode.create = function( namespace, options ) {
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this._getMeasurement = isotope._getMeasurement;
      this.element = isotope.element;
      this.items = isotope.items;
      this.size = isotope.size;
      // this.getSize = isotope.getSize;
      // this._getElementOffset = isotope._getElementOffset;
    }
  }

  // default options
  if ( options ) {
    LayoutMode.options = options;
  }

  // Outlayer.prototype._getMeasurement = function( measurement, size ) {
  //   var option = this.options[ measurement ];
  //   var elem;
  //   if ( !option ) {
  //     // default to 0
  //     this[ measurement ] = 0;
  //   } else {
  //     if ( typeof option === 'string' ) {
  //       elem = this.element.querySelector( option );
  //     } else if ( isElement( option ) ) {
  //       elem = option;
  //     }
  //     // use size of element, if element
  //     this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  //   }
  // };



  LayoutMode.prototype.namespace = namespace;
  // set default options
  // layoutMode.options[ namespace ] = options || {};
  // register in Isotope
  layoutMode.modes[ namespace ] = LayoutMode;
  return LayoutMode;
};

var Isotope = window.Isotope = window.Isotope || {};
Isotope.layoutMode = layoutMode;

})( window );
