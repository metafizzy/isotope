( function( window ) {

'use strict';

function cellsByColumnDefinition( layoutMode, getSize ) {

  var CellsByColumn = layoutMode.create( 'cellsByColumn' );

  CellsByColumn.prototype._resetLayout = function() {
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
    // set rows
    this.rows = Math.floor( containerSize.innerHeight / this.rowHeight );
    this.rows = Math.max( this.rows, 1 );
  };

  CellsByColumn.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    var col = Math.floor( this.itemIndex / this.rows );
    var row = this.itemIndex % this.rows;
    // center item within cell
    var x = ( col + 0.5 ) * this.columnWidth - item.size.outerWidth / 2;
    var y = ( row + 0.5 ) * this.rowHeight - item.size.outerHeight / 2;
    this.itemIndex++;
    return { x: x, y: y };
  };

  CellsByColumn.prototype._getContainerSize = function() {
    return {
      width: Math.ceil( this.itemIndex / this.rows ) * this.columnWidth
    };
  };

  CellsByColumn.prototype.resize = function() {
    this.isotope.resizeVertical();
  };

  return CellsByColumn;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode',
      'get-size/get-size'
    ],
    cellsByColumnDefinition );
} else {
  // browser global
  cellsByColumnDefinition(
    window.Isotope.layoutMode,
    window.getSize
  );
}


})( window );


