( function() {

'use strict';

function getItemsText( iso ) {
  var texts = [];
  for ( var i=0, len = iso.filteredItems.length; i < len; i++ ) {
    var item = iso.filteredItems[i];
    texts.push( getText( item.element ) );
  }
  return texts.join(',');
}

test( 'sorting', function() {

  // sorting with history
  ( function() {
    var iso = new Isotope( '#sorting1', {
      layoutMode: 'fitRows',
      transitionDuration: 0,
      getSortData: {
        letter: 'b',
        number: 'i'
      },
      sortBy: 'number'
    });

    iso.arrange({ sortBy: 'letter' });

    var texts = getItemsText( iso );

    equal( texts, 'A1,A2,A3,A4,B1,B2,B4', 'items sorted by letter, then number, via history' );

    iso.destroy();
  })();

  // sorting with array
  ( function() {
    var iso = new Isotope( '#sorting1', {
      layoutMode: 'fitRows',
      transitionDuration: 0,
      getSortData: {
        letter: 'b',
        number: 'i'
      },
      sortBy: [ 'letter', 'number' ]
    });

    equal( getItemsText( iso ), 'A1,A2,A3,A4,B1,B2,B4', 'sortBy array' );

    iso.arrange({
      sortAscending: false
    });
    equal( getItemsText( iso ), 'B4,B2,B1,A4,A3,A2,A1', 'sortAscending false' );

    iso.arrange({
      sortAscending: {
        letter: true,
        number: false
      }
    });
    equal( getItemsText( iso ), 'A4,A3,A2,A1,B4,B2,B1', 'sortAscending with object' );

    iso.destroy();
  })();

});

})();
