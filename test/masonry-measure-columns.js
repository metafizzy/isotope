( function() {

'use strict';

test( 'Masonry.measureColumns', function() {

  var iso = new Isotope( '#masonry-measure-columns', {
    itemSelector: '.item',
    layoutMode: 'masonry',
    transitionDuration: 0
  });

  var msnryMode = iso.modes.masonry;
  equal( msnryMode.columnWidth, 60, 'after layout, measured first element' );

  iso.modes.masonry._getMeasurement( 'columnWidth', 'outerWidth' );
  equal( msnryMode.columnWidth, 0, '_getMeasurement, no option' );

  iso.modes.masonry.measureColumns();
  equal( msnryMode.columnWidth, 60, 'measureColumns, no option' );
  
  iso.arrange({ filter: '.c' });

  iso.modes.masonry.measureColumns();
  equal( msnryMode.columnWidth, 60, 'measureColumns after filter first item, no option' );

  iso.arrange({
    masonry: { columnWidth: 80 }
  });
  equal( msnryMode.columnWidth, 80, '.arrange() masonry.columnWidth option set number' );

  iso.arrange({
    masonry: { columnWidth: '.grid-sizer' }
  });
  equal( msnryMode.columnWidth, 70, '.arrange() masonry.columnWidth option set selector string' );

});

})();
