QUnit.test( 'LayoutMode.getSegmentSize', function( assert ) {
'use strict';

  var CellsByRow = Isotope.LayoutMode.create('cellsByRow');

  CellsByRow.prototype._resetLayout = function() {
    this.getColumnWidth();
    this.getRowHeight();
  };

  var iso = new Isotope( '#get-segment-size', {
    layoutMode: 'cellsByRow',
    itemSelector: '.item',
    cellsByRow: {
      columnWidth: 17,
      rowHeight: 23
    }
  });

  var cellsByRow = iso.modes.cellsByRow;
  assert.equal( cellsByRow.columnWidth, 17, 'explicit columnWidth option set' );
  assert.equal( cellsByRow.rowHeight, 23, 'explicit rowHeight option set' );

  // set element sizing
  iso.options.cellsByRow.columnWidth = '.grid-sizer';
  iso.options.cellsByRow.rowHeight = '.grid-sizer';
  cellsByRow.getColumnWidth();
  cellsByRow.getRowHeight();
  assert.equal( cellsByRow.columnWidth, 57, 'element sizing columnWidth' );
  assert.equal( cellsByRow.rowHeight, 47, 'element sizing rowHeight' );

  // default to first item
  delete iso.options.cellsByRow.columnWidth;
  delete iso.options.cellsByRow.rowHeight;
  cellsByRow.getColumnWidth();
  cellsByRow.getRowHeight();
  assert.equal( cellsByRow.columnWidth, 60, 'first item columnWidth' );
  assert.equal( cellsByRow.rowHeight, 30, 'first item rowHeight' );

});
