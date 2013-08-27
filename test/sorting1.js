( function() {

'use strict';

var docElem = document.documentElement;

var getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };

function getItemsText( iso ) {
  var texts = [];
  for ( var i=0, len = iso.filteredItems.length; i < len; i++ ) {
    var item = iso.filteredItems[i];
    texts.push( getText( item.element ) );
  }
  return texts.join(',');
}

test( 'sort uses history', function() {
  var iso = new Isotope( '#sorting1', {
    layoutMode: 'fitRows',
    transitionDuration: 0,
    getSortData: {
      letter: 'b',
      number: 'i'
    },
    sortBy: 'number'
  });

  iso.layout({ sortBy: 'letter' });

  var texts = getItemsText( iso );

  equal( texts, 'A1,A2,A3,A4,B1,B2,B4', 'items sorted by letter, then number, via history' );

  iso.destroy();
});

})();
