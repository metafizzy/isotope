/* eslint-disable id-length */

var Isotope = window.Isotope = require('../../js/isotope');
var $ = require('jquery');
require('jquery-bridget');

// enable $().isotope() plugin
$.bridget( 'isotope', Isotope );

var $container = $('#container').isotope({
  layoutMode: 'fitRows',
  transitionDuration: '0.8s',
  cellsByRow: {
    columnWidth: 130,
    rowHeight: 140,
  },
  getSortData: {
    number: '.number parseInt',
    symbol: '.symbol',
    name: '.name',
    category: '[data-category]',
    weight: function( itemElem ) {
      // remove parenthesis
      return parseFloat( $( itemElem ).find('.weight')
        .text()
        .replace( /[()]/g, '' ) );
    },
  },
});

$('#options').on( 'click', 'button', function( event ) {
  var $target = $( event.target );
  var key = $target.parent().attr('data-isotope-key');
  var value = $target.attr('data-isotope-value');

  if ( key === 'filter' && value === 'number-greater-than-50' ) {
    value = function( elem ) {
      var numberText = $( elem ).find('.number')
        .text();
      return parseInt( numberText, 10 ) > 40;
    };
  }
  console.log( key, value );
  var opts = {};
  opts[ key ] = value;
  $container.isotope( opts );
} );
