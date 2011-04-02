/**
 * Isotope v1.0.110401
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2011 David DeSandro / Metafizzy
 */

(function( window, $, undefined ){

  // ========================= getStyleProperty by kangax ===============================
  // http://perfectionkills.com/feature-testing-css-properties/

  var getStyleProperty = (function(){

    var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];
    var _cache = { };

    function getStyleProperty(propName, element) {
      element = element || document.documentElement;
      var style = element.style,
          prefixed,
          uPropName,
          i, l;

      // check cache only when no element is given
      if (arguments.length === 1 && typeof _cache[propName] === 'string') {
        return _cache[propName];
      }
      // test standard property first
      if (typeof style[propName] === 'string') {
        return (_cache[propName] = propName);
      }
    
      // capitalize
      uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

      // test vendor specific properties
      for (i=0, l=prefixes.length; i<l; i++) {
        prefixed = prefixes[i] + uPropName;
        if (typeof style[prefixed] === 'string') {
          return (_cache[propName] = prefixed);
        }
      }
    }

    return getStyleProperty;
  }());

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
   * This version whittles down the script just to check support for
   * CSS transitions, transforms, and 3D transforms.
  */
  
  var docElement = document.documentElement,
      vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
      tests = [
        {
          name : 'csstransforms',
          getResult : function() {
            return !!getStyleProperty('transform');
          }
        },
        {
          name : 'csstransforms3d',
          getResult : function() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if ( test ){
              var st = document.createElement('style'),
                  div = document.createElement('div'),
                  mq = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)';

              st.textContent = mq + '{#modernizr{height:3px}}';
              (document.head || document.getElementsByTagName('head')[0]).appendChild(st);
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
          getResult : function() {
            return !!getStyleProperty('transitionProperty');
          }
        }
      ],

      i, len = tests.length
  ;

  if ( window.Modernizr ) {
    // if there's a previous Modernzir, check if there are necessary tests
    for ( i=0; i < len; i++ ) {
      var test = tests[i];
      if ( !Modernizr.hasOwnProperty( test.name ) ) {
        // if test hasn't been run, use addTest to run it
        Modernizr.addTest( test.name, test.getResult );
      }
    }
  } else {
    // or create new mini Modernizr that just has the 3 tests
    window.Modernizr = (function(){

      var miniModernizr = {
            _version : '1.6ish: miniModernizr for Isotope'
          },
          classes = [],
          test, result, className;

      // Run through tests
      for ( i=0; i < len; i++ ) {
        test = tests[i];
        result = test.getResult();
        miniModernizr[ test.name ] = result;
        className = ( result ?  '' : 'no-' ) + test.name;
        classes.push( className );
      }

      // Add the new classes to the <html> element.
      docElement.className += ' ' + classes.join( ' ' );

      return miniModernizr;
    })();
  }



  // ========================= isoTransform ===============================

  /**
   *  provides hooks for .css({ scale: value, translate: x y })
   *  Progressively enhanced CSS transforms
   *  Uses hardware accelerated 3D transforms for Safari
   *  or falls back to 2D transforms.
   */
  var isoTransform = {
    
    transformProp : getStyleProperty('transform'),
    
    fnUtils : Modernizr.csstransforms3d ? 
      { // 3D transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 2D transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale :  function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ,
    
    set : function( elem, name, value ) {
      var $elem = $(elem),
          // unpack current transform data
          data =  $elem.data('isoTransform') || {},
          newData = {},
          fnName,
          transformObj = {};

      // i.e. newData.scale = 0.5
      newData[ name ] = value;
      // extend new value over current data
      $.extend( data, newData );

      for ( fnName in data ) {
        var transformValue = data[ fnName ],
            getFn = isoTransform.fnUtils[ fnName ];
        transformObj[ fnName ] = getFn( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          // sorting so translate always comes first
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $elem.data( 'isoTransform', data );

      // set name to vendor specific property
      elem.style[ isoTransform.transformProp ] = valueFns;

    }
  };
  
  // ==================== scale ===================
  
  $.cssNumber.scale = true;
  
  $.cssHooks.scale = {
    set: function( elem, value ) {

      if ( typeof value === 'string' ) {
        value = parseFloat( value );
      }

      isoTransform.set( elem, 'scale', value );

    },
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.scale ? transform.scale : 1;
    }
  };

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

      isoTransform.set( elem, 'translate', value );

    },
    
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.translate ? transform.translate : [ 0, 0 ];
    }
  };




/*!
 * smartresize: debounced resize event for jQuery
 * http://github.com/lrbabe/jquery-smartresize
 *
 * Copyright (c) 2009 Louis-Remi Babe
 * Licensed under the GPL license.
 * http://docs.jquery.com/License
 *
 */

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



// ========================= Isotope ===============================


  // our "Widget" object constructor
  $.Isotope = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };
  
  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'overflow', 'position', 'width', 'height' ];

  $.Isotope.prototype = {

    options : {
      resizable: true,
      layoutMode : 'masonry',
      containerClass : 'isotope',
      itemClass : 'isotope-item',
      hiddenClass : 'isotope-hidden',
      hiddenStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 0, scale : 0.001 } : // browsers support CSS transforms, not Opera
        { opacity : 0 }, // other browsers, including Opera
      visibleStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 1, scale : 1 } : // browsers support CSS transforms, not Opera
        { opacity : 1 },  // other browsers, including Opera
      animationEngine : $.browser.opera ? 'jquery' : 'best-available',
      animationOptions: {
        queue: false,
        duration: 800
      },
      sortBy : 'original-order',
      sortAscending : true,
      resizesContainer : true,
      transformsEnabled : true
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

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      for ( var i=0, len = isoContainerStyles.length; i < len; i++ ) {
        var prop = isoContainerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || null;
      }
      
      this.element.css({
        overflow : 'hidden',
        position : 'relative'
      });

      var jQueryAnimation = false;

      // get applyStyleFnName
      switch ( this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '') ) {
        case 'css' :
        case 'none' :
          this.applyStyleFnName = 'css';
          break;
        case 'jquery' :
          this.applyStyleFnName = 'animate';
          jQueryAnimation = true;
          break;
        default : // best available
          this.applyStyleFnName = Modernizr.csstransitions ? 'css' : 'animate';
      }
      
      this.usingTransforms = this.options.transformsEnabled && Modernizr.csstransforms && Modernizr.csstransitions && !jQueryAnimation;

      this.getPositionStyles = this.usingTransforms ? this._translate : this._positionAbs;
      
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
          instance.element.isotope('resize');
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
        this.$filteredAtoms = this._filter( this.$allAtoms );
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
      
      this.updateSortData( $atoms, true );

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
    
    updateSortData : function( $atoms, isIncrementingElemCount ) {
      var instance = this,
          getSortData = this.options.getSortData,
          $this, sortData;
      $atoms.each(function(){
        $this = $(this);
        sortData = {};
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          sortData[ key ] = getSortData[ key ]( $this, instance );
        }
        // apply sort data to $element
        $this.data( 'isotope-sort-data', sortData );
        if ( isIncrementingElemCount ) {
          instance.elemCount ++;
        }
      });
    },
    
    // used on all the filtered atoms
    _sort : function() {
      
      var instance = this,
          getSorter = function( elem ) {
            return $(elem).data('isotope-sort-data')[ instance.options.sortBy ];
          },
          sortDir = this.options.sortAscending ? 1 : -1,
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
      var position = this.getPositionStyles( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this[ '_' +  layoutMode + 'Layout' ]( $elems );
      
      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      
      var styleFn = ( this.applyStyleFnName === 'animate' && !this.isLaidOut ) ? 
                    'css' : this.applyStyleFnName,
          animOpts = this.options.animationOptions;

      // process styleQueue
      $.each( this.styleQueue, function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
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
      
      return this[ '_' +  this.options.layoutMode + 'Reset' ]()
        .layout( this.$filteredAtoms, callback );
      
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
        var $filteredAtoms = instance._filter( $newAtoms );
        instance.$filteredAtoms = instance.$filteredAtoms.add( $filteredAtoms );
      });
      
      this._sort().reLayout( callback );
      
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ){
        instance.$filteredAtoms = instance.$filteredAtoms.add( $newAtoms );
        instance.layout( $newAtoms, callback );
      });
    },
    
    // removes elements from Isotope widget
    remove : function( $content ) {

      this.$allAtoms = this.$allAtoms.not( $content );
      this.$filteredAtoms = this.$filteredAtoms.not( $content );

      $content.remove();
      
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
    
    // HACKy should probably remove
    shuffle : function( callback ) {
      this.options.sortBy = 'shuffle';
      
      this.$allAtoms = this._shuffleArray( this.$allAtoms );
      this.$filteredAtoms = this._filter( this.$allAtoms );
      
      return this.reLayout( callback );
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;

      this.$allAtoms
        .removeClass( this.options.hiddenClass + ' ' + this.options.itemClass )
        .each(function(){
          this.style.position = null;
          this.style.top = null;
          this.style.left = null;
          this.style.opacity = null;
          if ( usingTransforms ) {
            this.style[ isoTransform.transformProp ] = null;
          }
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var i=0, len = isoContainerStyles.length; i < len; i++ ) {
        var prop = isoContainerStyles[i];
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }
      
      this.element
        .unbind('.isotope')
        .removeClass( this.options.containerClass )
        .removeData('isotope');
      
      $(window).unbind('.isotope');

    },
    
    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( namespace, isRows ) {
      var measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          UCSize   = isRows ? 'Height' : 'Width',
          segmentsName = isRows ? 'rows' : 'cols',
          segments,
          segmentSize;
      
      this[ size ] = this.element[ size ]();
      
                    // i.e. options.masonry && options.masonry.columnWidth
      segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item
                    this.$filteredAtoms[ 'outer' + UCSize ](true) ||
                    // if there's no items, use size of container
                    this[ size ];
      
      segments = Math.floor( this[ size ] / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;
      
      return this;
      
    },

  // ====================== LAYOUTS ======================
  
  
  // ====================== Masonry ======================
  
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
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = instance.masonry.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }
        
          instance._masonryPlaceBrick( $this, groupCount, groupY );
        }
      });
      return this;
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
    },

  
  // ====================== fitRows ======================
  
    _fitRowsLayout : function( $elems ) {
      this.width = this.element.width();
      var instance = this;
      
      $elems.each( function() {
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
      return this;
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
      return this.reLayout();
    },
  

  // ====================== cellsByRow ======================
  
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
            x = ( i % cols + 0.5 ) * instance.cellsByRow.columnWidth -
                  $this.outerWidth(true) / 2 + instance.posLeft,
            y = ( ~~( i / cols ) + 0.5 ) * instance.cellsByRow.rowHeight -
                  $this.outerHeight(true) / 2 + instance.posTop;
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
    },
  
  
  // ====================== straightDown ======================
  
    _straightDownReset : function() {
      this.straightDown = {
        y : 0
      };
      return this;
    },

    _straightDownLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this),
            y = instance.straightDown.y + instance.posTop;
        instance._pushPosition( $this, instance.posLeft, y );
        instance.straightDown.y += $this.outerHeight(true);
      });
      return this;
    },

    _straightDownGetContainerSize : function() {
      return { height : this.straightDown.y + this.posTop };
    },

    _straightDownResize : function() {
      this.reLayout();
      return this;
    },


  // ====================== masonryHorizontal ======================
  
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
              groupRowX, i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = instance.masonryHorizontal.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupCount, groupX );
        }
      });
      return this;
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
    },


  // ====================== fitColumns ======================
  
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
      $elems.each( function() {
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
      return this;
    },
    
    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },
    
    _fitColumnsResize : function() {
      return this.reLayout();
    },
    

  
  // ====================== cellsByColumn ======================
  
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
            x = ( ~~( i / rows ) + 0.5 )  * instance.cellsByColumn.columnWidth -
                  $this.outerWidth(true) / 2 + instance.posLeft,
            y = ( i % rows + 0.5 ) * instance.cellsByColumn.rowHeight -
                  $this.outerHeight(true) / 2 + instance.posTop;
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

  };
  
  
  // ======================= imagesLoaded Plugin  ===============================
  // A fork of http://gist.github.com/268257 by Paul Irish

  // mit license. paul irish. 2010.
  // webkit fix from Oren Solomianik. thx!

  $.fn.imagesLoaded = function(callback){
    var elems = this.find('img'),
        len   = elems.length,
        _this = this;

    if ( !elems.length ) {
      callback.call( this );
    }

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

  

// ======================= jQuery Widget bridge  ===============================


/*!
 * jQuery UI Widget 1.8.5
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */

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

})( window, jQuery );
