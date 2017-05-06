/**
 * fitRows layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( 'isotope/layout-modes/fit-rows',[
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var FitRows = LayoutMode.create('fitRows');

var proto = FitRows.prototype;

proto._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );

  if(this.options.centered) {
	  this.rowCount = 0;
	  this.positioned = 0;
	  this.numItems = this.isotope.filteredItems.length;
  }
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();
  
  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
   // items per row

 if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  } 

  if(this.options.centered) {
	  var itemsPerRow = Math.round(containerWidth / itemWidth);
	  var remainder = this.numItems % itemsPerRow;
	  var rows = Math.ceil(this.numItems / itemsPerRow);
	  var itemsLeftToPosition = this.numItems - this.positioned - 1;
	  if(this.x === 0) {
		  this.rowCount++;
		  if(remainder > 0 && rows === this.rowCount) {
			var takenSpace = itemWidth * itemsLeftToPosition;
			this.x = Math.round(( containerWidth / 2) - ( takenSpace / 2) - (itemWidth / 2));
		  }
	  }
  } 

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;
  
  if(this.options.centered) {
	  this.positioned++;
  }
  
  return position;
};

proto._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}));
