var Isotope = window.Isotope = require('../../js/isotope');
var eventie = require('eventie');
var matchesSelector = require('desandro-matches-selector');

// require('isotope-fit-columns');
// require('isotope-cells-by-column');
// require('isotope-horizontal');
// require('isotope-masonry-horizontal');

function getText( elem ) {
  return elem.textContent || elem.innerText;
}

var iso = window.iso = new Isotope( '#container', {
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
      var weight = itemElem.querySelector('.weight').textContent;
      return parseFloat( weight.replace( /[()]/g, '' ) );
    },
  },
} );

var options = document.querySelector('#options');

eventie.bind( options, 'click', function( event ) {
  if ( !matchesSelector( event.target, 'button' ) ) {
    return;
  }

  var key = event.target.parentNode.getAttribute('data-isotope-key');
  var value = event.target.getAttribute('data-isotope-value');

  if ( key === 'filter' && value === 'number-greater-than-50' ) {
    value = function( elem ) {
      var numberText = getText( elem.querySelector('.number') );
      return parseInt( numberText, 10 ) > 40;
    };
  }
  console.log( key, value );
  iso.options[ key ] = value;
  iso.arrange();
} );
