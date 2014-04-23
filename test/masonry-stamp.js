( function() {

'use strict';

test( 'Masonry stamp', function() {
  
  var iso = new Isotope( '#masonry-stamp', {
    layoutMode: 'masonry',
    itemSelector: '.item',
    stamp: '.stamp'
  });

  function checkPosition( item, x, y ) {
    var elem = item.element;
    var left = parseInt( elem.style.left, 10 );
    var top = parseInt( elem.style.top, 10 );
    deepEqual( [ left, top ], [ x, y ], 'item position ' + x + ', ' + y );
  }

  checkPosition( iso.items[0], 0, 0 );
  checkPosition( iso.items[1], 0, 30 );
  checkPosition( iso.items[2], 60, 45 );
  checkPosition( iso.items[3], 120, 45 );

});

})();
