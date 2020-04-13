QUnit.test( 'sorting', function( assert ) {

  'use strict';

  // sorting with history
  ( function() {
    var iso = new Isotope( '#sorting1', {
      layoutMode: 'fitRows',
      transitionDuration: 0,
      getSortData: {
        letter: 'b',
        number: 'i',
      },
      sortBy: 'number',
    } );

    iso.arrange({ sortBy: 'letter' });

    var texts = getItemsText( iso );

    assert.equal( texts, 'A1,A2,A3,A4,B1,B2,B4',
        'items sorted by letter, then number, via history' );

    iso.destroy();
  } )();

  // sorting with array
  ( function() {
    var iso = new Isotope( '#sorting1', {
      layoutMode: 'fitRows',
      transitionDuration: 0,
      getSortData: {
        letter: 'b',
        number: 'i',
      },
      sortBy: [ 'letter', 'number' ],
    } );

    assert.equal( getItemsText( iso ), 'A1,A2,A3,A4,B1,B2,B4', 'sortBy array' );

    iso.arrange({
      sortAscending: false,
    });
    assert.equal( getItemsText( iso ), 'B4,B2,B1,A4,A3,A2,A1', 'sortAscending false' );

    iso.arrange({
      sortAscending: {
        letter: true,
        number: false,
      },
    });
    assert.equal( getItemsText( iso ),
        'A4,A3,A2,A1,B4,B2,B1', 'sortAscending with object' );

    iso.destroy();
  } )();

  ( function() {
    var iso = new Isotope( '#sorting2', {
      layoutMode: 'fitRows',
      transitionDuration: 0,
      getSortData: {
        letter: 'b',
        number: 'i',
        axis: 'span',
      },
      sortBy: [ 'axis' ],
    } );

    iso.arrange({ sortBy: 'number' });
    assert.equal( getItemsText( iso ), 'B1X,A1X,B1Y,A1Y,B2X,A2X,B2Y,A2Y',
        'sort history 1' );

    iso.arrange({ sortBy: 'letter' });
    assert.equal( getItemsText( iso ), 'A1X,A1Y,A2X,A2Y,B1X,B1Y,B2X,B2Y',
        'sort history 2' );

  } )();

  function getItemsText( iso ) {
    var texts = iso.filteredItems.map( function( item ) {
      return item.element.textContent;
    } );
    return texts.join(',');
  }

} );
