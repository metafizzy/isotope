/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */

( function( window ) {

'use strict';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( layoutMode, Masonry, getSize ) {
  // create an Outlayer layout class
  var MasonryMode = layoutMode.create('masonry');
  // sub-class Masonry
  extend( MasonryMode.prototype, Masonry.prototype );

  MasonryMode.prototype.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  MasonryMode.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this.isotope._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.isotope.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.isotope.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  // debounced, layout on resize
  // HEADS UP this overwrites Outlayer.resize
  // Any changes in Outlayer.resize need to be manually added here
  MasonryMode.prototype.resize = function() {
    // don't trigger if size did not change
    var container = this._getSizingContainer();
    var size = getSize( container );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.size && size;
    if ( hasSizes && size.innerWidth === this._containerWidth ) {
      return;
    }

    this.isotope.layout();

    delete this.isotope.resizeTimeout;
  };

  return MasonryMode;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      '../layout-mode',
      'masonry/masonry',
      'get-size/get-size'
    ],
    masonryDefinition );
} else {
  // browser global
  masonryDefinition(
    window.Isotope.layoutMode,
    window.Masonry,
    window.getSize
  );
}

})( window );
