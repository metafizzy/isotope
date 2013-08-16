( function( window ) {

'use strict';

var Isotope = window.Isotope;
var Outlayer = window.Outlayer;
var FitRows = Isotope.LayoutMode.create( 'fitRows', {
  foo: 'bar'
});

FitRows.prototype._resetLayout = function() {
  Outlayer.prototype._resetLayout.apply( this.isotope, arguments );
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
};

FitRows.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();

  // if this element cannot fit in the current row
  if ( this.x !== 0 && item.size.outerWidth + this.x > this.isotope.size.innerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += item.size.outerWidth;

  return position;
};

FitRows.prototype._getContainerSize = function() {
  return { height: this.maxY };
};

})( window );
