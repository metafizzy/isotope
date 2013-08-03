/*!
 * Isotope v2.0.0
 * Magical sorting and filtering layouts
 * http://isotope.metafizzy.co
 */

( function( window ) {

'use strict';

// vars
// var document = window.document;

// -------------------------- helpers -------------------------- //


// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function isotopeDefinition( Outlayer, getSize, matchesSelector ) {
  // create an Outlayer layout class
  var Isotope = Outlayer.create('isotope');

  Isotope.prototype._create = function() {
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // create from registered layout modes
    for ( var name in Isotope.layoutModes ) {
      this._createLayoutMode( name );
    }
  };

  Isotope.prototype._createLayoutMode = function( name ) {
    var LayoutMode = Isotope.layoutModes[ name ];
    var options = this.options[ name ];
    this.modes[ name ] = new LayoutMode( this, options );
  };

  Isotope.prototype._mode = function() {
    return this.modes[ this.options.layoutMode ];
  };

  Isotope.prototype.layout = function() {
    this.filteredItems = this._filter( this.items );
    this._sort();
    Outlayer.prototype.layout.call( this );
    // this._mode._resetLayout();
    // this._resetLayout();
    // this._manageStamps();
    // 
    // // don't animate first layout
    // var isInstant = this.options.isLayoutInstant !== undefined ?
    //   this.options.isLayoutInstant : !this._isLayoutInited;
    // this.layoutItems( this.items, isInstant );
    // 
    // // flag for initalized
    // this._isLayoutInited = true;
  };


  // -------------------------- filter -------------------------- //

  Isotope.prototype._filter = function( items ) {
    var filter = this.options.filter;
    var matches = [];
    var unmatches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test;
    if ( typeof filter === 'function' ) {
      test = function( item ) {
        return filter( item.element );
      };
    } else {
      test = function( item ) {
        return matchesSelector( item.element, filter );
      };
    }

    // test each item
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      item.isFilterMatched = isMatched;
      var group = isMatched ? matches : unmatches;
      group.push( item );
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    this.reveal( hiddenMatched );
    this.hide( visibleUnmatched );

    return matches;
  };

  // -------------------------- sort -------------------------- //


  Isotope.prototype._sort = function() {
    var sortBy = this.options.sortBy;
    function sortFn( a, b ) {
      
    }
    this.filteredItems.sort( );
  };

  // -------------------------- methods -------------------------- //

  Isotope.prototype._resetLayout = function() {
    this._mode._resetLayout();
  };

  Isotope.prototype._getItemLayoutPosition = function( item ) {
    return this._mode._getItemLayoutPosition( item );
  };


  Isotope.prototype._manageStamp = function( stamp ) {
    this._mode._manageStamp( stamp );
  };

  Isotope.prototype._getContainerSize = function() {
    return this._mode._getContainerSize();
  };

  return Isotope;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'outlayer',
      'get-size',
      'matches-selector'
    ],
    isotopeDefinition );
} else {
  // browser global
  window.Isotope = isotopeDefinition(
    window.Outlayer,
    window.getSize,
    window.matchesSelector
  );
}

})( window );
