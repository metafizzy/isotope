// ========================= getStyleProperty by kangax ===============================

var getStyleProperty = (function(){

  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];
  var _cache = { };

  function getStyleProperty(propName, element) {
    element = element || document.documentElement;
    var style = element.style,
        prefixed,
        uPropName;

    // check cache only when no element is given
    if (arguments.length == 1 && typeof _cache[propName] == 'string') {
      return _cache[propName];
    }
    // test standard property first
    if (typeof style[propName] == 'string') {
      return (_cache[propName] = propName);
    }
    
    // console.log('getting prop', propName)

    // capitalize
    uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i=0, l=prefixes.length; i<l; i++) {
      prefixed = prefixes[i] + uPropName;
      if (typeof style[prefixed] == 'string') {
        return (_cache[propName] = prefixed);
      }
    }
  }

  return getStyleProperty;
})();

// ========================= miniModernizr ===============================
// <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

/*!
 * Modernizr v1.6ish: miniModernizr for Isotope
 * http://www.modernizr.com
 *
 * Developed by: 
 * - Faruk Ates  http://farukat.es/
 * - Paul Irish  http://paulirish.com/
 *
 * Copyright (c) 2009-2010
 * Dual-licensed under the BSD or MIT licenses.
 * http://www.modernizr.com/license/
 */

 
/*
 * Modernizr is a script that detects native CSS3 and HTML5 features
 * available in the current UA and provides an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 * 
 * Modernizr will also add classes to the <html> element of the page,
 * one for each feature it detects. If the UA supports it, a class
 * like "cssgradients" will be added. If not, the class name will be
 * "no-cssgradients". This allows for simple if-conditionals in your
 * CSS, giving you fine control over the look & feel of your website.
 * 
 * This version whittles down the script just to check support for
 * CSS transitions, transforms, and 3D transforms.
 * 
 * @author        Faruk Ates
 * @author        Paul Irish
 * @copyright     (c) 2009-2010 Faruk Ates.
 * @contributor   Ben Alman
 */
 
window.Modernizr = window.Modernizr || (function(window,doc,undefined){
  
  var version = '1.6ish: miniModernizr for Isotope',
      miniModernizr = {},
      vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
      classes = [],
      docElement = document.documentElement,

      tests = [
        {
          name : 'csstransforms',
          result : function() {
            return !!getStyleProperty('transform');
          }
        },
        {
          name : 'csstransforms3d',
          result : function() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if ( test ){
              var st = document.createElement('style'),
                  div = document.createElement('div'),
                  mq = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)';

              st.textContent = mq + '{#modernizr{height:3px}}';
              (doc.head || doc.getElementsByTagName('head')[0]).appendChild(st);
              div.id = 'modernizr';
              docElement.appendChild(div);

              test = div.offsetHeight === 3;

              st.parentNode.removeChild(st);
              div.parentNode.removeChild(div);
            }
            return !!test;
          }
        },
        {
          name : 'csstransitions',
          result : function() {
            return !!getStyleProperty('transitionProperty');
          }
        }
      ]
  ;


  // Run through all tests and detect their support in the current UA.
  for ( var i = 0, len = tests.length; i < len; i++ ) {
    var test = tests[i],
        result = test.result();
    miniModernizr[ test.name ] = result;
    var className = ( result ?  '' : 'no-' ) + test.name;
    classes.push( className );
  }

  // Add the new classes to the <html> element.
  docElement.className += ' ' + classes.join( ' ' );

  return miniModernizr;
  
})(this,this.document);




// ========================= jQuery transform extensions ===============================
(function($){  


  $.optoTransform = {
    
    transformProp : getStyleProperty('transform'),
    
    fnUtils : Modernizr.csstransforms3d ? 
      { // 2d transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 3d transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale :  function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ,
    
    set : function( elem, name, value ) {

      // unpack current transform data
      var data =  $( elem ).data('transform') || {},
      // extend new value over current data
          newData = {},
          fnName,
          transformObj = {};
      // overwrite new data
      newData[ name ] = value;
      $.extend( data, newData );

      for ( fnName in data ) {
        var transformValue = data[ fnName ],
            getFn = $.optoTransform.fnUtils[ fnName ];
        transformObj[ fnName ] = getFn( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $( elem ).data( 'transform', data );

      // sorting so scale always comes before 
      value = valueFns;

      // set name to vendor specific property
      elem.style[ $.optoTransform.transformProp ] = valueFns;

    }
  };
  
  // ==================== scale ===================
  
  $.cssNumber.scale = true;
  
  $.cssHooks.scale = {
    set: function( elem, value ) {

      if ( typeof value === 'string' ) {
        value = parseFloat( value );
      }

      $.optoTransform.set( elem, 'scale', value )

    },
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.scale ? transform.scale : 1;
    }
  }

  $.fx.step.scale = function( fx ) {
    $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
  };
  
  
  // ==================== translate ===================
    
  $.cssNumber.translate = true;
  
  $.cssHooks.translate = {
    set: function( elem, value ) {

      // all this would be for public ease-of-use,
      // but we're leaving it out since this add-on is
      // only for internal-plugin use
      // if ( typeof value === 'string' ) {
      //   value = value.split(' ');
      // }
      // 
      //  
      // var i, val;
      // for ( i = 0; i < 2; i++ ) {
      //   val = value[i];
      //   if ( typeof val === 'string' ) {
      //     val = parseInt( val );
      //   }
      // }

      $.optoTransform.set( elem, 'translate', value )

    },
    
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.translate ? transform.translate : [ 0, 0 ];
    }
  }


})( jQuery );



/*!
 * smartresize: debounced resize event for jQuery
 * http://github.com/lrbabe/jquery-smartresize
 *
 * Copyright (c) 2009 Louis-Remi Babe
 * Licensed under the GPL license.
 * http://docs.jquery.com/License
 *
 */
(function($){  

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };

})( jQuery );



/*************************************************
**  jQuery Isotope version 0.1
**  Copyright David DeSandro
**************************************************/
(function( $, undefined ) {

  // our "Widget" object constructor
  $.Isotope = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Isotope.prototype = {

    options : {
      resizable: true,
      layoutMode : 'masonry',
      containerClass : 'isotope',
      itemClass : 'isotope-item',
      hiddenClass : 'isotope-hidden',
      hiddenStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 0, scale : 0.001 } :
        { opacity : 0 },
      visibleStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 1, scale : 1 } :
        { opacity : 1 },
      animationEngine : 'best-available',
      animationOptions: {
        queue: false,
        duration: 800
      },
      sortBy : 'original-order',
      sortAscending : true

    },
    
    _filterFind: function( $elems, selector ) {
      return selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, this.options, options );
      
      this.isNew = {};
      this.styleQueue = [];
      this.elemCount = 0;
      // need to get atoms
      this.$allAtoms = this._filterFind( this.element.children(), this.options.itemSelector );
      
      this.element.css({
        overflow : 'hidden',
        position : 'relative'
      });

      var jQueryAnimation = false;

      // get applyStyleFnName
      switch ( this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '') ) {
        case 'none' :
          this.applyStyleFnName = 'css';
          break;
        case 'jquery' :
          this.applyStyleFnName = 'animate';
          jQueryAnimation = true;
          break;
        case 'bestavailable' :
        default :
          this.applyStyleFnName = Modernizr.csstransitions ? 'css' : 'animate';
      }
      
      this.usingTransforms = Modernizr.csstransforms && Modernizr.csstransitions && !jQueryAnimation;

      this.positionFn = this.usingTransforms ? this._translate : this._positionAbs;
      
      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem, instance ) {
          return instance.elemCount;
        }
      };

      this.options.getSortData = $.extend( this.options.getSortData, originalOrderSorter );

      this._setupAtoms( this.$allAtoms );
      
      
      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.element.prepend( $cursor );
      this.posTop  = Math.round( $cursor.position().top );
      this.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add isotope class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );
      
      // bind resize method
      if ( this.options.resizable ) {
        $(window).bind( 'smartresize.isotope', function() { 
          instance.element.isotope('resize') 
        });
      }
      
    },
  
    
    _isNewProp : function( prop ) {
      return this.prevOpts ? ( this.options[ prop ] !== this.prevOpts[ prop ] ) : true;
    },
  
    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {
      
      // check if watched properties are new
      var instance = this;
      $.each( [ 'filter', 'sortBy', 'sortAscending' ], function( i, propName ){
        instance.isNew[ propName ] = instance._isNewProp( propName );
      });

      if ( this.isNew.filter ) {
        this.$filteredAtoms = this._filter( this.$allAtoms )
      } else {
        this.$filteredAtoms = this.$allAtoms;
      }

      if ( this.isNew.filter || this.isNew.sortBy || this.isNew.sortAscending ) {
        this._sort();
      }
      
      this.reLayout( callback );

    },

    option: function( key, value ){
      
      // get/change options AFTER initialization:
      // you don't have to support all these cases,
      // but here's how:
    
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
    
      // signature: $('#foo').option('cool');  - getter
      } else if ( key && typeof value === "undefined" ){
        return this.options[ key ];
        
      // signature: $('#foo').bar('option', 'baz', false);
      } else {
        this.options[ key ] = value;
      }
    
      return this; // make sure to return the instance!
    },

    
    // ====================== Adding ======================
    
    _setupAtoms : function( $atoms ) {
      
      // base style for atoms
      var atomStyle = { position: 'absolute' };
      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle ).addClass( this.options.itemClass );
      
      var instance = this;
      $atoms.each(function(){
        var $this = $(this),
            sortData = {},
            getSortData = instance.options.getSortData,
            key;
        // get value for sort data based on fn( $elem ) passed in
        for ( key in getSortData ) {
          sortData[ key ] = getSortData[ key ]( $this, instance );
        }
        // apply sort data to $element
        $this.data( 'isotope-sort-data', sortData );
        // increment element count
        instance.elemCount ++;
      });

    },
    
    // ====================== Filtering ======================

    _filter : function( $atoms ) {
      var $filteredAtoms,
          filter = this.options.filter === '' ? '*' : this.options.filter;

      if ( !filter ) {
        $filteredAtoms = $atoms;
      } else {
        var hiddenClass    = this.options.hiddenClass,
            hiddenSelector = '.' + hiddenClass,
            $visibleAtoms  = $atoms.not( hiddenSelector ),
            $hiddenAtoms   = $atoms.filter( hiddenSelector ),
            $atomsToShow   = $hiddenAtoms;

        $filteredAtoms = $atoms.filter( filter );

        if ( filter !== '*' ) {
          $atomsToShow = $hiddenAtoms.filter( filter );

          var $atomsToHide = $visibleAtoms.not( filter ).toggleClass( hiddenClass );
          $atomsToHide.addClass( hiddenClass );
          this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
        }
        
        this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
        $atomsToShow.removeClass( hiddenClass );
      }
      
      return $filteredAtoms;
    },
    
    // ====================== Sorting ======================
    
    // used on all the filtered atoms, $atoms.filtered
    _sort : function() {
      
      var instance = this,
          getSorter = function( elem ) {
            return $(elem).data('isotope-sort-data')[ instance.options.sortBy ];
          },
          sortDir = this.options.sortAscending ? 1 : -1;
          sortFn = function( alpha, beta ) {
            var a = getSorter( alpha ),
                b = getSorter( beta );
            return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
          };
      
      this.$filteredAtoms.sort( sortFn );
      
      return this;
    },
    

    // ====================== Layout ======================

    
    _translate : function( x, y ) {
      return { translate : [ x, y ] };
    },
    
    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      var position = this.positionFn( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
    },

    // ====================== masonry ======================
    

    

    
    // ====================== fitRows ======================
    



    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode,
          layoutMethod = '_' + layoutMode;

      // layout logic
      // if ( layoutMethod === '_masonry' ) {
      //   layoutMethod += this.options.masonrySingleMode ? 'SingleColumn' : 'MultiColumn';
      // }
      
      this[ '_' +  layoutMode + 'Layout' ]( $elems );
      

      // set the size of the container
      var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
      this.styleQueue.push({ $el: this.element, style: containerStyle });



      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      
      var styleFn = ( this.applyStyleFnName === 'animate' && !this.isLaidOut ) ? 
                    'css' : this.applyStyleFnName,
          animOpts = this.options.animationOptions;


      // process styleQueue
      $.each( this.styleQueue, function( i, obj ){
                                       // have to extend animation to play nice with jQuery
        obj.$el[ styleFn ]( obj.style, $.extend( {}, animOpts ) );
      });
      
      

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $elems );
      }
      
      this.isLaidOut = true;

      return this;
    },
    
    
    resize : function() {
      return this[ '_' + this.options.layoutMode + 'Resize' ]();
    },
    
    
    reLayout : function( callback ) {
      return this
        [ '_' +  this.options.layoutMode + 'Reset' ]()
        .layout( this.$filteredAtoms, callback )
    },
    
    // ====================== Convenience methods ======================
    
    // adds a jQuery object of items to a isotope container
    addItems : function( $content, callback ) {
      var $newAtoms = this._filterFind( $content, this.options.itemSelector );
      this._setupAtoms( $newAtoms );
      // add new atoms to atoms pools
      // FIXME : this breaks shuffle order and returns to original order
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },
    
    // convienence method for adding elements properly to any layout
    insert : function( $content, callback ) {
      this.element.append( $content );
      
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        $filteredAtoms = instance._filter( $newAtoms );
        instance.$filteredAtoms = instance.$filteredAtoms.add( $filteredAtoms );
      });
      
      this._sort().reLayout( callback );
      
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ){
        instance.$filteredAtoms = instance.$filteredAtoms.add( $newAtoms );
        instance.layout( $newAtoms, callback )
      });
    },
    
    _shuffleArray : function ( array ) {
      var tmp, current, i = array.length;
      
      if ( i ){ 
        while(--i) {
          current = ~~( Math.random() * (i + 1) );
          tmp = array[current];
          array[current] = array[i];
          array[i] = tmp;
        }
      }
      return array;
    },
    
    logNames : function( $atoms ) {
      var message = '';
      $atoms.each(function(){
        message += $(this).find('.name').text() + ', ';
      });
      window.console && console.log( message );
    },
    
    // HACKy should probably remove
    shuffle : function( callback ) {
      this.options.sortBy = 'shuffle';
      
      this.logNames( this.$allAtoms );      
      this.$allAtoms = this._shuffleArray( this.$allAtoms );
      this.logNames( this.$allAtoms );
      this.$filteredAtoms = this._filter( this.$allAtoms );
      
      return this.reLayout( callback );
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {
      var atomUnstyle = $.extend( this.options.visibleStyle, {
        position: 'relative',
        top: 'auto',
        left: 'auto'
      });
      
      if ( this.usingTransforms ) {
        atomUnstyle[ $.optoTransform.transformProp ] = 'none';
      }
      
      this.$allAtoms
        .css( atomUnstyle )
        .removeClass( this.options.hiddenClass );
      
      this.element
        .css({
          width: 'auto',
          height: 'auto'
        })
        .unbind('.isotope')
        .removeClass( this.options.containerClass )
        .removeData('isotope');
      
      $(window).unbind('.isotope');

    },
    
    _getSegments : function( namespace, isRows ) {
      var measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          UCSize   = isRows ? 'Height' : 'Width',
          segments = isRows ? 'rows' : 'cols';
      
      this[ namespace ][ measure ] = ( this.options[ namespace ] && this.options[ namespace ][ measure ] ) || this.$allAtoms[ 'outer' + UCSize ](true);
      
      // if colW == 0, back out before divide by zero
      if ( !this[ namespace ][ measure ] ) {
        $.error( measure + ' calculated to be zero. Stopping Isotope plugin before divide by zero. Check that the width of first child inside the isotope container is not zero.')
        return this;
      }
      this[ size ] = this.element[ size ]();
      this[ namespace ][ segments ] = Math.floor( this[ size ] / this[ namespace ][ measure ] );
      this[ namespace ][ segments ] = Math.max( this[ namespace ][ segments ], 1 );
      
      return this;
      
    },

  };
  
  
  // ====================== LAYOUTS ======================
  
  
  // ====================== Masonry ======================
  
  $.extend( $.Isotope.prototype, {
  
    _masonryPlaceBrick : function( $brick, setCount, setY ) {
      // here, `this` refers to a child element or "brick"
          // get the minimum Y value from the columns
      var minimumY  = Math.min.apply( Math, setY ),
          setHeight = minimumY + $brick.outerHeight(true),
          i         = setY.length,
          shortCol  = i,
          setSpan   = this.masonry.cols + 1 - i,
          x, y ;
      // Which column has the minY value, closest to the left
      while (i--) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
        }
      }
    
      // position the brick
      x = this.masonry.columnWidth * shortCol + this.posLeft;
      y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },
  
  
    _masonryLayout : function( $elems ) {
      var instance = this;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / instance.masonry.columnWidth );
        colSpan = Math.min( colSpan, instance.masonry.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, instance.masonry.cols, instance.masonry.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = instance.masonry.cols + 1 - colSpan,
              groupY = [],
              groupColY;

          // for each group potential horizontal position
          for ( var i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = instance.masonry.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }
        
          instance._masonryPlaceBrick( $this, groupCount, groupY );
        }
      });
    },
  
    // reset
    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments('masonry');
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( this.posTop );
      }
      return this;
    },
  

  
    _masonryResize : function() {
      var prevColCount = this.masonry.cols;
      // get updated colCount
      this._getSegments('masonry');
      if ( this.masonry.cols !== prevColCount ) {
        // if column count has changed, do a new column cound
        this.reLayout();
      }

      return this;
    },
  
    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs ) - this.posTop;
      return { height: containerHeight };
    }
  
  });
  
  // ====================== fitRows ======================
  
  $.extend( $.Isotope.prototype, {
    
    _fitRowsLayout : function( $elems ) {
      this.width = this.element.width();
      var instance = this;
      
      return $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true),
            x, y;
      
        if ( instance.fitRows.x !== 0  &&  atomW + instance.fitRows.x > instance.width ) {
          // if this element cannot fit in the current row
          instance.fitRows.x = 0;
          instance.fitRows.y = instance.fitRows.height;
        } 
      
        // position the atom
        x = instance.fitRows.x + instance.posLeft;
        y = instance.fitRows.y + instance.posTop;
        instance._pushPosition( $this, x, y );
  
        instance.fitRows.height = Math.max( instance.fitRows.y + atomH, instance.fitRows.height );
        instance.fitRows.x += atomW;
  
      });
    },
  
    _fitRowsReset : function() {
      this.fitRows = {
        x : 0,
        y : 0,
        height : 0
      };
      return this;
    },
  
    _fitRowsGetContainerSize : function () {
      return { height : this.fitRows.height };
    },
  
    _fitRowsResize : function() {
      return this.reLayout()
    }
  
  });


  // ====================== cellsByRow ======================
  
  $.extend( $.Isotope.prototype, {

    _cellsByRowReset : function() {
      this.cellsByRow = {};
      this._getSegments('cellsByRow');
      this.cellsByRow.rowHeight = this.options.cellsByRow.rowHeight || this.$allAtoms.outerHeight(true);
      return this;
    },

    _cellsByRowLayout : function( $elems ) {
      var instance = this,
          cols = this.cellsByRow.cols;
      this.cellsByRow.atomsLen = $elems.length;
      $elems.each( function( i ){
        var $this = $(this),
            x = ( i % cols + 0.5 ) * instance.cellsByRow.columnWidth
                - $this.outerWidth(true) / 2 + instance.posLeft,
            y = ( ~~( i / cols ) + 0.5 ) * instance.cellsByRow.rowHeight 
                - $this.outerHeight(true) / 2 + instance.posTop;
        instance._pushPosition( $this, x, y );
      });
      return this;
    },

    _cellsByRowGetContainerSize : function() {
      return { height : Math.ceil( this.cellsByRow.atomsLen / this.cellsByRow.cols ) * this.cellsByRow.rowHeight + this.posTop };
    },

    _cellsByRowResize : function() {
      var prevCols = this.cellsByRow.cols;
      this._getSegments('cellsByRow');

      // if column count has changed, do a new column cound
      if ( this.cellsByRow.cols !== prevCols ) {
        this.reLayout();
      }
      return this;
    }
  });
  
  
  // ====================== verticalList ======================
  
  $.extend( $.Isotope.prototype, {

    _verticalListReset : function() {
      this.verticalList = {
        y : 0
      };
      return this;
    },

    _verticalListLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this),
            y = instance.verticalList.y + instance.posTop;
        instance._pushPosition( $this, instance.posLeft, y );
        instance.verticalList.y += $this.outerHeight(true)
      });
      return this;
    },

    _verticalListGetContainerSize : function() {
      return { height : this.verticalList.y + this.posTop };
    },

    _verticalListResize : function() {
      this.reLayout();
      return this;
    }
  });

  // ====================== masonryHorizontal ======================
  
  
  $.extend( $.Isotope.prototype, {

    _masonryHorizontalPlaceBrick : function( $brick, setCount, setX ) {
      // here, `this` refers to a child element or "brick"
          // get the minimum Y value from the columns
      var minimumX  = Math.min.apply( Math, setX ),
          setWidth  = minimumX + $brick.outerWidth(true),
          i         = setX.length,
          smallRow  = i,
          setSpan   = this.masonryHorizontal.rows + 1 - i,
          x, y ;
      // Which column has the minY value, closest to the left
      while (i--) {
        if ( setX[i] === minimumX ) {
          smallRow = i;
        }
      }

      // position the brick
      x = minimumX;
      y = this.masonryHorizontal.rowHeight * smallRow + this.posTop;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
      }

    },
    
    _masonryHorizontalLayout : function( $elems ) {
      var instance = this;
      $elems.each(function(){
        var $this  = $(this),
            //how many rows does this brick span
            rowSpan = Math.ceil( $this.outerHeight(true) / instance.masonryHorizontal.rowHeight );
        rowSpan = Math.min( rowSpan, instance.masonryHorizontal.rows );

        if ( rowSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryHorizontalPlaceBrick( $this, instance.masonryHorizontal.rows, instance.masonryHorizontal.rowXs );
        } else {
          // brick spans more than one row
          // how many different places could this brick fit horizontally
          var groupCount = instance.masonryHorizontal.rows + 1 - rowSpan,
              groupX = [],
              groupRowX;

          // for each group potential horizontal position
          for ( var i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = instance.masonryHorizontal.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupCount, groupX );
        }
      });
    },
    
    _masonryHorizontalReset : function() {
      // layout-specific props
      this.masonryHorizontal = {};
      // FIXME shouldn't have to call this again
      this._getSegments( 'masonryHorizontal', true );
      var i = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (i--) {
        this.masonryHorizontal.rowXs.push( this.posLeft );
      }
      return this;
    },
    
    _masonryHorizontalResize : function() {
      var prevRows = this.masonryHorizontal.rows;
      // get updated colCount
      this._getSegments( 'masonryHorizontal', true );
      if ( this.masonryHorizontal.rows !== prevRows ) {
        // if column count has changed, do a new column cound
        this.reLayout();
      }

      return this;
    },
    
    _masonryHorizontalGetContainerSize : function() {
      var containerWidth = Math.max.apply( Math, this.masonryHorizontal.rowXs ) - this.posLeft;
      return { width: containerWidth };
    }

  });
  

  // ====================== fitColumns ======================
  
  $.extend( $.Isotope.prototype, {
    
    _fitColumnsReset : function() {
      this.fitColumns = {
        x : 0,
        y : 0,
        width : 0
      };
      return this;
    },
    
    _fitColumnsLayout : function( $elems ) {
      var instance = this;
      this.height = this.element.height();
      return $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true),
            x, y;

        if ( instance.fitColumns.y !== 0  &&  atomH + instance.fitColumns.y > instance.height ) {
          // if this element cannot fit in the current column
          instance.fitColumns.x = instance.fitColumns.width;
          instance.fitColumns.y = 0;
        } 

        // position the atom
        x = instance.fitColumns.x + instance.posLeft;
        y = instance.fitColumns.y + instance.posTop;
        instance._pushPosition( $this, x, y );

        instance.fitColumns.width = Math.max( instance.fitColumns.x + atomW, instance.fitColumns.width );
        instance.fitColumns.y += atomH;

      });
    },
    
    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },
    
    _fitColumnsResize : function() {
      return this.reLayout();
    }
    
    
  });
  

  
  // ====================== cellsByColumn ======================
  
  $.extend( $.Isotope.prototype, {

    _cellsByColumnReset : function() {
      this.cellsByColumn = {};
      this._getSegments( 'cellsByColumn', true );
      this.cellsByColumn.columnWidth = this.options.cellsByColumn.columnWidth || this.$allAtoms.outerHeight(true);
      return this;
    },

    _cellsByColumnLayout : function( $elems ) {
      var instance = this,
          rows = this.cellsByColumn.rows;
      this.cellsByColumn.atomsLen = $elems.length;
      $elems.each( function( i ){
        var $this = $(this),
            x = ( ~~( i / rows ) + 0.5 )  * instance.cellsByColumn.columnWidth
                - $this.outerWidth(true) / 2 + instance.posLeft,
            y = ( i % rows + 0.5 ) * instance.cellsByColumn.rowHeight 
                - $this.outerHeight(true) / 2 + instance.posTop;
        instance._pushPosition( $this, x, y );
      });
      return this;
    },

    _cellsByColumnGetContainerSize : function() {
      return { width : Math.ceil( this.cellsByColumn.atomsLen / this.cellsByColumn.rows ) * this.cellsByColumn.columnWidth + this.posLeft };
    },

    _cellsByColumnResize : function() {
      var prevRows = this.cellsByColumn.rows;
      this._getSegments( 'cellsByColumn', true );

      // if column count has changed, do a new column cound
      if ( this.cellsByColumn.rows !== prevRows ) {
        this.reLayout();
      }
      return this;
    }
  });
  
  

  // mit license. paul irish. 2010.
  // webkit fix from Oren Solomianik. thx!

  // callback function is passed the last image to load
  //   as an argument, and the collection as `this`


  $.fn.imagesLoaded = function(callback){
    var elems = this.find('img'),
        len   = elems.length,
        _this = this;

    elems.bind('load',function(){
      if (--len <= 0){ 
        callback.call( _this ); 
      }
    }).each(function(){
      // cached images don't fire load sometimes, so we reset src.
      if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        this.src = src;
      }  
    }); 

    return this;
  };
  

  

  
})( jQuery );



/*!
 * jQuery UI Widget 1.8.5
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

  $.widget = $.widget || {};

  $.widget.bridge = $.widget.bridge || function( name, object ) {
  	$.fn[ name ] = function( options ) {
  		var isMethodCall = typeof options === "string",
  			args = Array.prototype.slice.call( arguments, 1 ),
  			returnValue = this;

  		// allow multiple hashes to be passed on init
  		options = !isMethodCall && args.length ?
  			$.extend.apply( null, [ true, options ].concat(args) ) :
  			options;

  		// prevent calls to internal methods
  		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
  			return returnValue;
  		}

  		if ( isMethodCall ) {
  			this.each(function() {
  				var instance = $.data( this, name );
  				if ( !instance ) {
  					return $.error( "cannot call methods on " + name + " prior to initialization; " +
  						"attempted to call method '" + options + "'" );
  				}
  				if ( !$.isFunction( instance[options] ) ) {
  					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
  				}
  				var methodValue = instance[ options ].apply( instance, args );
  				if ( methodValue !== instance && methodValue !== undefined ) {
  					returnValue = methodValue;
  					return false;
  				}
  			});
  		} else {
  			this.each(function() {
  				var instance = $.data( this, name );
  				if ( instance ) {
  					instance.option( options || {} )._init();
  				} else {
  					$.data( this, name, new object( options, this ) );
  				}
  			});
  		}

  		return returnValue;
  	};
  };
  
  
  $.widget.bridge( 'isotope', $.Isotope );

})( jQuery );
