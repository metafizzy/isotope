/*************************************************
**  jQuery Molequul version 0.1
**  Copyright David DeSandro, licensed MIT
**  http://desandro.com/resources/jquery-molequul
**************************************************/
(function($){  

  // ========================= getStyleProperty by kangax ===============================

  var getStyleProperty = (function(){

    var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];

    function getStyleProperty(propName, element) {
      element = element || document.documentElement;
      var style = element.style,
          prefixed;

      // test standard property first
      if (typeof style[propName] == 'string') return propName;

      // capitalize
      propName = propName.charAt(0).toUpperCase() + propName.slice(1);

      // test vendor specific properties
      for (var i=0, l=prefixes.length; i<l; i++) {
        prefixed = prefixes[i] + propName;
        if (typeof style[prefixed] == 'string') return prefixed;
      }
    }

    return getStyleProperty;
  })();

  // ========================= miniModernizr ===============================
  // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting
  if ( !window.Modernizr ) {
    
    var miniModernizr = {},
        vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
        classes = [],
        docElement = document.documentElement,
        tests = {
          csstransforms : function() {
            return !!getStyleProperty('transform');
          },
          csstransforms3d : function() {
            var ret = !!getStyleProperty('perspective');
  
            if (ret){
              var st = document.createElement('style'),
                  div = document.createElement('div');
  
              st.textContent = '@media ('+vendorCSSPrefixes.join('transform-3d),(') + 
                                  'modernizr){#modernizr{height:3px}}';
              document.getElementsByTagName('head')[0].appendChild(st);
              div.id = 'modernizr';
              docElement.appendChild(div);
  
              ret = div.offsetHeight === 3;
  
              st.parentNode.removeChild(st);
              div.parentNode.removeChild(div);
            }
            return ret;
          },
          csstransitions : function() {
            return !!getStyleProperty('transitionProperty');
          }
        };
  
    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
    if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
      hasOwnProperty = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
      };
    }
      
    // Run through all tests and detect their support in the current UA.
    for ( var feature in tests ) {
      if ( hasOwnProperty( tests, feature ) ) {
        // run the test, throw the return value into the Modernizr,
        //   then based on that boolean, define an appropriate className
        //   and push it into an array of classes we'll join later.
        var test = tests[ feature ]();
        miniModernizr[ feature.toLowerCase() ] = test;
        var className = ( test ?  '' : 'no-' ) + feature.toLowerCase()
        classes.push( className );
      }
    }
  
    // Add the new classes to the <html> element.
    docElement.className += ' ' + classes.join( ' ' );
  
    window.Modernizr = miniModernizr;
  }

  // convienence vars
  var transformFnUtils = {
        translate : {
          getFn : {
            '2d' : function ( position ) {
              return 'translate(' + position.x + 'px, ' + position.y + 'px)';
            },
            '3d' : function ( position ) {
              return 'translate3d(' + position.x + 'px, ' + position.y + 'px, 0)';
            }
          },
          regex : /translate(3d)?\([\s\d\-\.,px]+\)/
        },
        scale : {
          getFn : {
            '2d' : function ( scale ) {
              return 'scale(' + scale + ')';
            },
            '3d' : function ( scale ) {
              return 'scale3d(' + scale + ', ' + scale + ', 1)';
            }
          },
          regex : /scale(3d)?\([\s\d\-\.,px]+\)/
        }
      },
      // for now, we'll only use transforms in Chrome and Safari
      // In Opera, transform removes all text anti-aliasing, crippling legibility
      // in FF, you cannot transition transforms in < 4.0
      usingTransforms = Modernizr.csstransforms && $.browser.webkit,
      dimensions = Modernizr.csstransforms3d ? '3d' : '2d',
      transformProp = getStyleProperty('transform');


  // ========================= smartresize ===============================

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


  // ========================= molequul ===============================

  var molequulMethods = {
    

    filter : function( $cards ) {
      var props  = this.data('molequul'),
          filter = props.opts.filter === '' ? '*' : props.opts.filter;

      if ( !filter ) {
        props.$cards.filtered = $cards;
      } else {
        var hiddenClass    = props.opts.hiddenClass,
            hiddenSelector = '.' + hiddenClass,
            $visibleCards  = $cards.not( hiddenSelector ),
            $hiddenCards   = $cards.filter( hiddenSelector ),
            $cardsToShow   = $hiddenCards;

        props.$cards.filtered = $cards.filter( filter );

        if ( filter !== '*' ) {
          $cardsToShow = $hiddenCards.filter( filter );

          var $cardsToHide = $visibleCards.not( filter ).toggleClass( hiddenClass );
          $cardsToHide.addClass( hiddenClass );
          props.styleQueue.push({ $el: $cardsToHide, style: props.opts.hiddenStyle });
        }
        
        props.styleQueue.push({ $el: $cardsToShow, style: props.opts.visibleStyle });
        $cardsToShow.removeClass( hiddenClass );

      }
      
      return this;
    },
    
    // used on all the filtered cards, $cards.filtered
    sort : function() {
      
    },
    

    
    placeCard : function( setCount, setY, props ) {
      // here, `this` refers to a child element or "brick"
          // get the minimum Y value from the columns
      var minimumY  = Math.min.apply( Math, setY ),
          setHeight = minimumY + this.outerHeight(true),
          i         = setY.length,
          shortCol  = i,
          setSpan   = props.colCount + 1 - i,
          animOpts  = $.extend( {}, props.opts.animationOptions ),
          position, x, y ;
      // Which column has the minY value, closest to the left
      while (i--) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
        }
      }
      
      x        = props.colW * shortCol + props.posLeft;
      y        = minimumY;
      position = molequulMethods.position( x, y );

      // position the brick
      props.styleQueue.push({ $el: this, style: position });
      // this[ props.applyStyle ]( position, animOpts );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        props.colYs[ shortCol + i ] = setHeight;
      }
      
      return this;
    },
    
    singleColumn : function( colYs, props ) {
      return this.each(function(){
        $(this).molequul( 'placeCard', props.colCount, colYs, props );
      });
    },
    
    
    multiColumn : function( colYs, props ) {
      return this.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.colW );
        colSpan = Math.min( colSpan, props.colCount );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          $this.molequul( 'placeCard', props.colCount, colYs, props );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.colCount + 1 - colSpan,
              groupY = [];

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            var groupColY = colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          $this.molequul( 'placeCard', groupCount, groupY, props );
        }
      });
    },
    
    // parseTransformStyle : function( style ) {
    //   for ( prop in style ) {
    //     switch
    //   }
    //   return style;
    // },

    complete : function( props ) {

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn =  ( props.initialized && props.opts.animate ) ? 'animate' : 'css',
          animOpts = props.opts.animationOptions;

      // process styleQueue
      $.each( props.styleQueue, function( i, obj ){
        // var style = molequulMethods.parseTransformStyle( obj.style );
        for ( var prop in obj.style ) {
          console.log( prop, obj.style[prop] )
          // switch ( obj.style[prop] ) {
          //   case 'scale' :
          //     console.log( obj.style )
          //     break;
          // }
        }
        
                                   // have to extend animation to play nice with jQuery
        obj.$el[ styleFn ]( obj.style, $.extend( {}, animOpts ) );
      });

      // clear out queue for next time
      props.styleQueue = [];

      // provide props.bricks as context for the callback
      // callback = callback || function(){};
      // callback.call( props.$bricks );

      // set all data so we can retrieve it for appended appendedContent
      //    or anyone else's crazy jquery fun
      this.data( 'molequul', props );
      
      return this;
    },
    
    // used on collection of cards (should be filtered, and sorted before )
    // accepts cards-to-be-laid-out and colYs to start with
    layout : function( $cards, colYs ) {

      var props = this.data('molequul');

      // console.log( props.opts.hiddenStyle.scale )

      // layout logic
      var layoutMode = props.opts.singleMode ? 'singleColumn' : 'multiColumn';

      $cards.molequul( layoutMode, colYs, props );

      // set the height of the container to the tallest column
      props.containerHeight = Math.max.apply( Math, props.colYs );
      var containerStyle    = { height: props.containerHeight - props.posTop };
      props.styleQueue.push({ $el: this, style: containerStyle });
      
      // this[ props.applyStyle ]( containerStyle, animOpts ).molequul( 'complete', props );

      this.molequul( 'complete', props );
      
      return this;
      
    },
    
    resetColYs : function( props ) {
      var colYs = [],
          i = props.colCount;
      while (i--) {
        colYs.push( props.posTop );
      }
      props.colYs = colYs;
      return colYs
    },
    
    resize : function() {
      // console.log( this.data('molequul') , this[0].id )
      var props = this.data('molequul'),
          prevColCount = props.colCount;
      
      props.initialized = true;

      // get updated colCount
      this.molequul( 'getColCount', props );
      if ( props.colCount !== prevColCount ) {
        // if column count has changed, do a new column cound
        var colYs = molequulMethods.resetColYs( props );
        this.molequul( 'layout', props.$cards.filtered, colYs );
      }

      return this;
    },
    
    append : function() {
      
    },
    
    getColCount : function( props ) {
      props.colCount = Math.floor( this.width() / props.colW ) ;
      props.colCount = Math.max( props.colCount, 1 );
      return this;
    },
    
    // only run though on initial init
    setup : function() {
      var props = this.data('molequul');
      props.$cards = {};
      props.styleQueue = [];
      // need to get cards
      props.$cards.all = props.opts.selector ? 
        this.find( props.opts.selector ) : 
        this.children();
      
      props.colW = props.opts.columnWidth || props.$cards.all.outerWidth(true);

      // if colW == 0, back out before divide by zero
      if ( !props.colW ) {
        window.console && console.error('Column width calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }

      this.css('position', 'relative').molequul( 'getColCount', props );

      cardStyle = { position: 'absolute' };
      if ( usingTransforms ) {
        cardStyle.left = 0;
        cardStyle.top = 0;
      }
      props.$cards.all.css( cardStyle );

      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.prepend( $cursor );
      props.posTop  = Math.round( $cursor.position().top );
      props.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add molequul class first time around
      var $container = this;
      setTimeout(function(){
        $container.addClass('molequul'); 
      }, 1 );

      return this;
    },
    

    
    init : function( options ) {

      return this.each(function() {  

        var $this = $(this),
            data = $this.data('molequul'),
            props = data || {};

        // checks if masonry has been called before on this object
        props.initialized = !!data;

        var previousOptions = props.initialized ? data.opts : {};

        props.opts = $.extend(
          {},
          $.fn.molequul.defaults,
          previousOptions,
          options
        );
        
        $this.data( 'molequul', props );
        
        if ( !props.initialized ) {
          $this.molequul( 'setup' );
        }

        var colYs = molequulMethods.resetColYs( props );
        $this
          .molequul( 'filter', props.$cards.all )
          .molequul( 'layout', props.$cards.filtered, colYs );


        // binding window resizing
        if ( props.opts.resizeable ) {
          $(window).bind('smartresize.molequul', function() { $this.molequul( 'resize' ); } );
        } else if ( !props.opts.resizeable && !!previousOptions.resizeable ) {
          $(window).unbind('smartresize.molequul');
        }

      });
      
    },
    
    transform : function( value ) {
      return {
        '-webkit-transform' : value,
           '-moz-transform' : value,
             '-o-transform' : value,
                'transform' : value
      }
    },
    
    translate : function( x, y ) {
      return molequulMethods.transform('translate(' + x + 'px, ' + y + 'px) scale(1)')
    },
    
    translate3d : function( x, y ) {
      return molequulMethods.transform('translate3d(' + x + 'px, ' + y + 'px, 0) scale(1)')
    },
    
    positionAbs : function( x, y ) {
      return { left: x, top: y }
    }
    
  };


  if ( usingTransforms ) {
    var translateMethod = Modernizr.csstransforms3d ? 'translate3d' : 'translate';
    molequulMethods.position = molequulMethods[ translateMethod ];
  } else {
    molequulMethods.position = molequulMethods.positionAbs;
  }
  // molequulMethods.position = Modernizr.csstransforms3d ? molequulMethods.translate3d : molequulMethods.positionAbs;

  // molequul code begin
  $.fn.molequul = function( firstArg ) { 

    // Method calling logic
    var method = molequulMethods[ firstArg ];
    if ( method ) {
      // remove firstArg, which is a string of the function name, from arguments
      var args = Array.prototype.slice.call( arguments, 1 );
      return method.apply( this, args );
      
    } else if ( !firstArg || typeof firstArg === 'object' ) {
      return molequulMethods.init.apply( this, arguments );
    }


  };


  // Default plugin options
  $.fn.molequul.defaults = {
    // singleMode: false,
    // columnWidth: undefined,
    // itemSelector: undefined,
    // appendedContent: undefined,
    // saveOptions: true,
    resizeable: true,
    hiddenClass : 'molequul-hidden',
    hiddenStyle : {
      opacity : 0,
      scale: 0.001
    },
    visibleStyle : {
      opacity : 1,
      scale: 1
    },
    animationOptions: {
      queue: false
    }
  };

})(jQuery);