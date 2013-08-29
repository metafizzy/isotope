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

  LayoutMode.prototype.namespace = namespace;
  // register in Isotope
  layoutMode.modes[ namespace ] = LayoutMode;

  // ----- methods ----- //

  // default method handler
  // trigger Outlayer method with Isotope as this
  LayoutMode.prototype._outlayerMethod = function( methodName, args ) {
    return Outlayer.prototype[ methodName ].apply( this.isotope, args );
  };

  LayoutMode.prototype._resetLayout = function() {
    this._outlayerMethod( '_resetLayout', arguments );
  };

  LayoutMode.prototype._getItemLayoutPosition = function( /* item  */) {
    return this._outlayerMethod( '_getItemLayoutPosition', arguments );
  };

  LayoutMode.prototype._manageStamp = function(/* stamp */) {
    this._outlayerMethod( '_manageStamp', arguments );
  };

  LayoutMode.prototype._getContainerSize = function() {
    return this._outlayerMethod( '_getContainerSize', arguments );
  };

  LayoutMode.prototype.resize = function() {
    this._outlayerMethod( 'resize', arguments );
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
      // got column width, we can chill
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
