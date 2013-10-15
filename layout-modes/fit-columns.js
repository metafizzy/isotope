( function( window ) {

'use strict';

function fitColumnsDefinition( LayoutMode ) {

  var FitColumns = LayoutMode.create('fitColumns');

  FitColumns.prototype._resetLayout = function() {
    this.x = 0;
    this.y = 0;
    this.maxX = 0;
  };

  FitColumns.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();

    // if this element cannot fit in the current row
    if ( this.y !== 0 && item.size.outerHeight + this.y > this.isotope.size.innerHeight ) {
      this.y = 0;
      this.x = this.maxX;
    }

    var position = {
      x: this.x,
      y: this.y
    };

    this.maxX = Math.max( this.maxX, this.x + item.size.outerWidth );
    this.y += item.size.outerHeight;

    return position;
  };

  FitColumns.prototype._getContainerSize = function() {
    return { width: this.maxX };
  };

  FitColumns.prototype.resize = function() {
    this.resizeVertical();
  };

  return FitColumns;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode'
    ],
    fitColumnsDefinition );
} else {
  // browser global
  fitColumnsDefinition(
    window.Isotope.LayoutMode
  );
}

})( window );
