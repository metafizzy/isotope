( function( window ) {

'use strict';

function fitRowsDefinition( LayoutMode ) {

var FitRows = LayoutMode.create('fitRows');

FitRows.prototype._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this.row = 0;
  this.rows = [];
  this._getMeasurement( 'gutter', 'outerWidth' );

  if (this.options.equalheight) {
    for (var i=0; i < this.isotope.items.length; i++) {
      this.isotope.items[i].css({
        height: 'auto'
      });
    }
  }
};

/**
 * Working but glicthy with newly appended element via ajax
 * must reinvoke isotope('layout') to properly realign the horizontal position
 * after isotope('appended), not sure why?
 */
FitRows.prototype._getItemLayoutPosition = function( item ) {
  
  item.getSize();
  
  var itemWidth = item.size.outerWidth;
  
  // if this element cannot fit in the current row
  // need to add extra pixel to avoid layout dropping in some edge
  // bootstrap grid in firefox
  var containerWidth = Math.ceil(this.isotope.size.innerWidth + 1;

  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }
 
  // New row?
  if (this.x == 0 && this.y != 0) {
    this.row++;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
  this.x += itemWidth;
  
  
  // Compare Y from this row and previous row
  if (typeof this.rows[this.row] == 'undefined') {
    this.rows[this.row] = [];
    this.rows[this.row].start = this.y;
    this.rows[this.row].end = this.maxY;
  }
  else {
    this.rows[this.row].end = Math.max(this.rows[this.row].end, this.maxY);
  }

  // Record row number to item
  item.row = this.row;

  return position;
};


FitRows.prototype._equalHeight = function() {
  
  // Should we use this.isotope.filteredItems or this.isotope.items?
  
  for (var i=0; i < this.isotope.items.length; i++) {
    var row = this.isotope.items[i].row,
        data = this.rows[row];
    
    if (data) {
      var height =  data.end - data.start;

      height -= this.isotope.items[i].size.borderTopWidth + this.isotope.items[i].size.borderBottomWidth;
      height -= this.isotope.items[i].size.marginTop + this.isotope.items[i].size.marginBottom;
      height -= this.gutter.height || 0;
      
      if (this.isotope.items[i].size.isBorderBox == false) {
        height -= this.isotope.items[i].size.paddingTop + this.isotope.items[i].size.paddingBottom;
      }
      
      this.isotope.items[i].size.height = height;
      
      this.isotope.items[i].css({
        height : height.toString() + 'px',
      });
    }
  }
}


FitRows.prototype._getContainerSize = function() {
  if (this.options.equalheight) {
    this._equalHeight();
  }

  return { height: this.maxY };
};

return FitRows;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode'
    ],
    fitRowsDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = fitRowsDefinition(
    require('../layout-mode')
  );
} else {
  // browser global
  fitRowsDefinition(
    window.Isotope.LayoutMode
  );
}

})( window );
