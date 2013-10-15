test( 'getSortData', function() {

  'use strict';

  var iso = new Isotope( '#get-sort-data', {
    layoutMode: 'fitRows',
    getSortData: {
      ninjaTurtle: '[data-ninja-turtle]',
      fruit: 'span.fruit',
      b: 'b parseFloat',
      i: 'i parseInt',
      bbroke: 'b foobar'
    }
  });

  var item = iso.items[0];

  equal( item.sortData.ninjaTurtle, 'leonardo', '[data-attr] shorthand' );
  equal( item.sortData.fruit, 'watermelon', 'query selector shorthand' );
  equal( item.sortData.b, 3.14, 'parseFloat parser' );
  equal( item.sortData.i, 42, 'parseInt parser' );
  equal( item.sortData.bbroke, '3.14', 'default nonparser' );

});
