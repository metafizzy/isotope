( function( window ) {

'use strict';

function cellsByRowDefinition( layoutMode, getSize ) {

  var CellsByRow = layoutMode.create( 'cellsByRow' );

  CellsByRow.prototype._resetLayout = function() {
    var containerSize = this.isotope.size;
    this.itemIndex = 0;

    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'rowHeight', 'outerHeight' );

    var firstItem = this.items[0];
    var firstItemSize = firstItem && firstItem.element && getSize( firstItem.element );

    if ( !this.columnWidth ) {
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemSize ? firstItemSize.outerWidth :
        // or size of container
        containerSize.innerWidth;
    }

    if ( !this.rowHeight ) {
      // rowHeight fall back to item of first element
      this.rowHeight = firstItemSize ? firstItemSize.outerHeight :
        // or size of container
        containerSize.innerHeight;
    }
    // set cols
    this.cols = Math.floor( containerSize.innerWidth / this.columnWidth );
    this.cols = Math.max( this.cols, 1 );
  };

  CellsByRow.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    var col = this.itemIndex % this.cols;
    var row = Math.floor( this.itemIndex / this.cols );
    // center item within cell
    var x = ( col + 0.5 ) * this.columnWidth - item.size.outerWidth / 2;
    var y = ( row + 0.5 ) * this.rowHeight - item.size.outerHeight / 2;
    this.itemIndex++;
    return { x: x, y: y };
  };

  CellsByRow.prototype._getContainerSize = function() {
    return {
      height: Math.ceil( this.itemIndex / this.cols ) * this.rowHeight
    };
  };

  return CellsByRow;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode',
      'get-size/get-size'
    ],
    cellsByRowDefinition );
} else {
  // browser global
  cellsByRowDefinition(
    window.Isotope.layoutMode,
    window.getSize
  );
}


})( window );


