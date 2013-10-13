/**
 * Isotope Item
**/

( function( window ) {

'use strict';

// -------------------------- helpers -------------------------- //

// trim

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };


var docElem = document.documentElement;

var getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };


// -------------------------- Item -------------------------- //

function itemDefinition( Outlayer ) {

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

Item.prototype = new Outlayer.Item();

Item.prototype._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  Outlayer.Item.prototype._create.call( this );
  this.sortData = {};
};

Item.prototype.updateSortData = function() {
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  for ( var key in getSortData ) {
    var sorter = getSortData[ key ];
    sorter = mungeSorter( sorter );
    this.sortData[ key ] = sorter( this.element, this );
  }
};

// add a magic layer to sorters
// for convienent shorthands
// .foo-bar will use the text of .foo-bar querySelector
// [foo-bar] will use attribute
// you can also add parser
// `.foo-bar parseInt` will parse that as a number
function mungeSorter( sorter ) {
  if ( typeof sorter !== 'string' ) {
    return sorter;
  }
  // parse the sorter string
  var args = trim( sorter ).split(' ');
  var query = args[0];
  // check if query looks like [an-attribute]
  var attrMatch = query.match( /^\[(.+)\]$/ );
  var attr = attrMatch && attrMatch[1];
  var getValue = getValueGetter( attr, query );
  // use second argument as a parser
  var parser = getParser( args[1] );
  // parse the value, if there was a parser
  sorter = parser ? function( elem ) {
    return elem && parser( getValue( elem ) );
  } :
  // otherwise just return value
  function( elem ) {
    return elem && getValue( elem );
  };

  return sorter;
}

// get an attribute getter, or get text of the querySelector
function getValueGetter( attr, query ) {
  var getValue;
  // if query looks like [foo-bar], get attribute
  if ( attr ) {
    getValue = function( elem ) {
      return elem.getAttribute( attr );
    };
  } else {
    // otherwise, assume its a querySelector, and get its text
    getValue = function( elem ) {
      var child = elem.querySelector( query );
      return child && getText( child );
    };
  }
  return getValue;
}

// return a parser function if arg matches
function getParser( arg ) {
  var parser;
  switch ( arg ) {
    case 'parseInt' :
      parser = function( val ) {
        return parseInt( val, 10 );
      };
      break;
    case 'parseFloat' :
      parser = function( val ) {
        return parseFloat( val );
      };
  }
  return parser;
}

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'outlayer/outlayer'
    ],
    itemDefinition );
} else {
  // browser global
  window.Isotope = window.Isotope || {};
  window.Isotope.Item = itemDefinition(
    window.Outlayer
  );
}

})( window );
