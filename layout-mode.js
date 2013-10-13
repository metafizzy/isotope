( function( window ) {

'use strict';

// --------------------------  -------------------------- //

function layoutModeDefinition( getSize, Outlayer ) {

var layoutMode = {};

layoutMode.modes = {};

layoutMode.create = function( namespace, options ) {
  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this._getMeasurement = isotope._getMeasurement;
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  // default options
  if ( options ) {
    LayoutMode.options = options;
  }

  LayoutMode.prototype.namespace = namespace;
  // register in Isotope
  layoutMode.modes[ namespace ] = LayoutMode;


  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  ( function() {
    var facadeMethods = [
      '_resetLayout',
      '_getItemLayoutPosition',
      '_manageStamp',
      '_getContainerSize',
      '_getElementOffset',
      'resize',
      'layout'
    ];

    for ( var i=0, len = facadeMethods.length; i < len; i++ ) {
      var methodName = facadeMethods[i];
      LayoutMode.prototype[ methodName ] = getOutlayerMethod( methodName );
    }

    function getOutlayerMethod( methodName ) {
      return function() {
        return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
      };
    }
  })();

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  LayoutMode.prototype.resizeVertical = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    if ( hasSizes && size.innerHeight === this.isotope.size.innerHeight ) {
      return;
    }

    this.isotope.layout();
  };

  // ----- measurements ----- //

  LayoutMode.prototype.getColumnWidth = function() {
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    if ( this.columnWidth ) {
      // got column width, we can chill
      return;
    }
    // columnWidth fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this.columnWidth = firstItemSize && firstItemSize.outerWidth ||
      // or size of container
      this.isotope.size.innerWidth;
  };

  LayoutMode.prototype.getRowHeight = function() {
    this._getMeasurement( 'rowHeight', 'outerHeight' );
    if ( this.rowHeight ) {
      // got rowHeight, we can chill
      return;
    }
    // columnWidth fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this.rowHeight = firstItemSize && firstItemSize.outerHeight ||
      // or size of container
      this.isotope.size.innerHeight;
  };

  LayoutMode.prototype.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  LayoutMode.prototype.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -----  ----- //

  return LayoutMode;
};


return layoutMode;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'get-size/get-size',
      'outlayer/outlayer'
    ],
    layoutModeDefinition );
} else {
  // browser global
  window.Isotope = window.Isotope || {};
  window.Isotope.layoutMode = layoutModeDefinition(
    window.getSize,
    window.Outlayer
  );
}


})( window );
