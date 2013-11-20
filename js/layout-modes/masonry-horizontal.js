( function( window ) {

'use strict';

// -------------------------- helpers -------------------------- //

var indexOf = Array.prototype.indexOf ?
  function( items, value ) {
    return items.indexOf( value );
  } :
  function ( items, value ) {
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item === value ) {
        return i;
      }
    }
    return -1;
  };

// -------------------------- definition -------------------------- //

function masonryHorizontalDefinition( getSize, LayoutMode ) {
  // create an Outlayer layout class
  var MasonryHorizontal = LayoutMode.create('masonryHorizontal');

  MasonryHorizontal.prototype._resetLayout = function() {
    this.getRowHeight();
    this._getMeasurement( 'gutter', 'outerHeight' );

    this.rowHeight += this.gutter;
    // measure rows
    this.rows = Math.floor( ( this.isotope.size.innerHeight + this.gutter ) / this.rowHeight );
    this.rows = Math.max( this.rows, 1 );

    // reset row Xs
    var i = this.rows;
    this.rowXs = [];
    while (i--) {
      this.rowXs.push( 0 );
    }

    this.maxX = 0;
  };

  MasonryHorizontal.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many rows does this brick span
    var rowSpan = Math.ceil( item.size.outerHeight / this.rowHeight );
    rowSpan = Math.min( rowSpan, this.rows );

    var rowGroup = this._getRowGroup( rowSpan );
    // get the minimum Y value from the rows
    var minimumX = Math.min.apply( Math, rowGroup );
    var shortRowIndex = indexOf( rowGroup, minimumX );

    // position the brick
    var position = {
      x: minimumX,
      y: this.rowHeight * shortRowIndex
    };

    // apply setHeight to necessary rows
    var setWidth = minimumX + item.size.outerWidth;
    var setSpan = this.rows + 1 - rowGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.rowXs[ shortRowIndex + i ] = setWidth;
    }

    return position;
  };

  /**
   * @param {Number} rowSpan - number of rows the element spans
   * @returns {Array} rowGroup
   */
  MasonryHorizontal.prototype._getRowGroup = function( rowSpan ) {
    if ( rowSpan < 2 ) {
      // if brick spans only one row, use all the row Xs
      return this.rowXs;
    }

    var rowGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.rows + 1 - rowSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of rowX values for that one group
      var groupRowXs = this.rowXs.slice( i, i + rowSpan );
      // and get the max value of the array
      rowGroup[i] = Math.max.apply( Math, groupRowXs );
    }
    return rowGroup;
  };

  MasonryHorizontal.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this.isotope._getElementOffset( stamp );
    // get the rows that this stamp affects
    var firstY = this.isotope.options.isOriginTop ? offset.top : offset.bottom;
    var lastY = firstY + stampSize.outerHeight;
    var firstRow = Math.floor( firstY / this.rowHeight );
    firstRow = Math.max( 0, firstRow );
    var lastRow = Math.floor( lastY / this.rowHeight );
    lastRow = Math.min( this.rows - 1, lastRow );
    // set rowXs to outside edge of the stamp
    var stampMaxX = ( this.isotope.options.isOriginLeft ? offset.left : offset.right ) +
      stampSize.outerWidth;
    for ( var i = firstRow; i <= lastRow; i++ ) {
      this.rowXs[i] = Math.max( stampMaxX, this.rowXs[i] );
    }
  };

  MasonryHorizontal.prototype._getContainerSize = function() {
    this.maxX = Math.max.apply( Math, this.rowXs );

    return {
      width: this.maxX
    };
  };

  MasonryHorizontal.prototype.resize = function() {
    this.resizeVertical();
  };

  return MasonryHorizontal;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'get-size/get-size',
      '../layout-mode'
    ],
    masonryHorizontalDefinition );
} else {
  // browser global
  masonryHorizontalDefinition(
    window.getSize,
    window.Isotope.LayoutMode
  );
}

})( window );
