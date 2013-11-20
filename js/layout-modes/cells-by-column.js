( function( window ) {

'use strict';

function cellsByColumnDefinition( LayoutMode ) {

  var CellsByColumn = LayoutMode.create( 'cellsByColumn' );

  CellsByColumn.prototype._resetLayout = function() {
    // reset properties
    this.itemIndex = 0;
    // measurements
    this.getColumnWidth();
    this.getRowHeight();
    // set rows
    this.rows = Math.floor( this.isotope.size.innerHeight / this.rowHeight );
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
    this.resizeVertical();
  };

  return CellsByColumn;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode'
    ],
    cellsByColumnDefinition );
} else {
  // browser global
  cellsByColumnDefinition(
    window.Isotope.LayoutMode
  );
}


})( window );


