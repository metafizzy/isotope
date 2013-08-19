( function( window ) {

'use strict';

function fitRowsDefinition( layoutMode ) {

var FitRows = layoutMode.create( 'fitRows', {
  foo: 'bar'
});

var __resetLayout = FitRows.prototype._resetLayout;
FitRows.prototype._resetLayout = function() {
  // call original _resetLayout
  __resetLayout.call( this );
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

return FitRows;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode'
    ],
    fitRowsDefinition );
} else {
  // browser global
  fitRowsDefinition(
    window.Isotope.layoutMode
  );
}

})( window );
