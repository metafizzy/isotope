( function( window ) {

'use strict';

function horizontalDefinition( LayoutMode ) {

  var Horizontal = LayoutMode.create( 'horizontal', {
    verticalAlignment: 0
  });

  Horizontal.prototype._resetLayout = function() {
    this.x = 0;
  };

  Horizontal.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    var y = ( this.isotope.size.innerHeight - item.size.outerHeight ) *
      this.options.verticalAlignment;
    var x = this.x;
    this.x += item.size.outerWidth;
    return { x: x, y: y };
  };

  Horizontal.prototype._getContainerSize = function() {
    return { width: this.x };
  };

  Horizontal.prototype.resize = function() {
    this.resizeVertical();
  };

  return Horizontal;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode'
    ],
    horizontalDefinition );
} else {
  // browser global
  horizontalDefinition(
    window.Isotope.LayoutMode
  );
}

})( window );
