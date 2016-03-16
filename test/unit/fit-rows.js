QUnit.test( 'fitRows', function( assert ) {
  'use strict';

  var iso = new Isotope( '#fitrows-gutter', {
    layoutMode: 'fitRows',
    itemSelector: '.item',
    transitionDuration: 0
  });

  function checkPosition( item, x, y ) {
    var elem = item.element;
    var left = parseInt( elem.style.left, 10 );
    var top = parseInt( elem.style.top, 10 );
    assert.deepEqual( [ left, top ], [ x, y ], 'item position ' + x + ', ' + y );
  }

  checkPosition( iso.items[0], 0, 0 );
  checkPosition( iso.items[1], 60, 0 );

  // check gutter
  iso.options.fitRows = {
    gutter: 10
  };
  iso.layout();

  checkPosition( iso.items[0], 0, 0 );
  checkPosition( iso.items[1], 70, 0 );

  // check gutter, with element sizing
  iso.options.fitRows = {
    gutter: '.gutter-sizer'
  };
  iso.layout();

  checkPosition( iso.items[0], 0, 0 );
  checkPosition( iso.items[1], 78, 0 );

});
