/*************************************************
**  jQuery Molequul version 0.1
**  Copyright David DeSandro
**************************************************/
(function($){  

  var usingTransforms = Modernizr.csstransforms;
  // var usingTransforms = false;

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
    
    complete : function( props ) {

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn =  ( props.initialized && props.opts.animate ) ? 'animate' : 'css',
          animOpts = props.opts.animationOptions;
      // console.log( props.initialized, props.opts.animate, styleFn )

      // console.log( $.extend( {}, animOpts ) )

      // process styleQueue
      $.each( props.styleQueue, function( i, obj ){
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
    
    translate : function( x, y ) {
      return { translate : [ x, y ] }
    },
    
    positionAbs : function( x, y ) {
      return { left: x, top: y };
    }
    
  };


  molequulMethods.position = usingTransforms ? molequulMethods.translate : molequulMethods.positionAbs;

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
    resizeable: true,
    hiddenClass : 'molequul-hidden',
    hiddenStyle : {
      opacity : 0,
      scale : [ 0.001 ]
    },
    visibleStyle : {
      opacity : 1,
      scale : [ 1 ]
    },
    animate : false,
    animationOptions: {
      queue: false
    }
  };

})(jQuery);