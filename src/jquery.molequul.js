/*************************************************
**  jQuery Molequul version 0.1
**  Copyright David DeSandro
**************************************************/
(function($){  

  $.molequul = {
    
    // Default plugin options
    defaults : {
      columnWidth : 150,
      resizeable: true,
      layoutMode : 'masonry',
      masonrySingleMode : false,
      containerClass : 'molequul',
      hiddenClass : 'molequul-hidden',
      hiddenStyle : {
        opacity : 0,
        scale : [ 0.001 ]
      },
      visibleStyle : {
        opacity : 1,
        scale : [ 1 ]
      },
      animationEngine : 'best-available',
      animationOptions: {
        queue: false
      }
    },
    
    usingTransforms : Modernizr.csstransforms && Modernizr.csstransitions,
    

    filter : function( $cards ) {
      var props  = this.data('molequul'),
          filter = props.opts.filter === '' ? '*' : props.opts.filter;

      if ( !filter ) {
        props.atoms.$filtered = $cards;
      } else {
        var hiddenClass    = props.opts.hiddenClass,
            hiddenSelector = '.' + hiddenClass,
            $visibleCards  = $cards.not( hiddenSelector ),
            $hiddenCards   = $cards.filter( hiddenSelector ),
            $cardsToShow   = $hiddenCards;

        props.atoms.$filtered = $cards.filter( filter );

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
    

    // ====================== masonry layout methods ======================
    
    placeBrick : function( setCount, setY, props ) {
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
      position = $.molequul.position( x, y );

      // position the brick
      props.styleQueue.push({ $el: this, style: position });
      // this[ props.applyStyle ]( position, animOpts );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        props.colYs[ shortCol + i ] = setHeight;
      }
      
      return this;
    },
    
    masonrySingleColumn : function( props ) {
      return this.each(function(){
        $(this).molequul( 'placeBrick', props.colCount, props.colYs, props );
      });
    },
    
    
    masonryMultiColumn : function( props ) {
      return this.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.colW );
        colSpan = Math.min( colSpan, props.colCount );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          $this.molequul( 'placeBrick', props.colCount, props.colYs, props );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.colCount + 1 - colSpan,
              groupY = [];

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            var groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          $this.molequul( 'placeBrick', groupCount, groupY, props );
        }
      });
    },
    
    getMasonryColCount : function( props ) {
      props.width = this.width();
      props.colCount = Math.floor( props.width / props.colW ) ;
      props.colCount = Math.max( props.colCount, 1 );
      return this;
    },
    
    masonryResetLayoutProps : function( props ) {
      
      var i = props.colCount;
      props.colYs = [];
      while (i--) {
        props.colYs.push( props.posTop );
      }
      return this;
    },
    

    
    masonryResize : function( props ) {
      var prevColCount = props.colCount;
      // get updated colCount
      this.molequul( 'getMasonryColCount', props );
      if ( props.colCount !== prevColCount ) {
        // if column count has changed, do a new column cound
        // var colYs = $.molequul.resetColYs( props );
        this
          .molequul( 'masonryResetLayoutProps', props )
          .molequul( 'layout', props.atoms.$filtered );
      }

      return this;
    },
    
    masonryMeasureContainerHeight : function( props ) {
      props.containerHeight = Math.max.apply( Math, props.colYs );
      return this
    },
    
    // ====================== ClearFloat ======================
    
    clearFloat : function( props ) {
      
      return this.each( function() {
        var $this = $(this).
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true),
            x, y, position;
        
        if ( props.clearFloat.x !== 0  &&  atomW + props.clearFloat.x > props.width ) {
          // if this element cannot fit in the current row
          props.clearFloat.x = 0;
          props.clearFloat.y = props.clearFloat.height;
        } 
        
        x        = props.clearFloat.x + props.posLeft;
        y        = props.clearFloat.y + props.posTop;
        position = $.molequul.position( x, y );
        // position the atom
        props.styleQueue.push({ $el: $this, style: position });

        props.clearFloat.height = Math.max( props.clearFloat.y + atomH, props.clearFloat.height );
        props.clearFloat.x += atomW;

      });
    },

    // ====================== General Methods ======================

    
    complete : function( props ) {


      
      return this;
    },
    
    
    // used on collection of cards (should be filtered, and sorted before )
    // accepts cards-to-be-laid-out and colYs to start with
    layout : function( $elems ) {

      var props = this.data('molequul'),
          layoutMode = props.opts.layoutMode ;

      // switch ( props.opts.layoutMode.toLowerCase().replace(/[ -]/g, '') ) {
      //   case 'clearfloat' :
      //     layoutMode = 'clearFloat';
      //     break;
      //   case 'masonrysinglecolumn' :
      //     layoutMode = 'masonrySingleColumn';
      //     break;
      //   default :
      //     layoutMode = 'masonryMultiColumn';
      // }

      // props.clearFloat = {
      //   x : 0,
      //   y : 0,
      //   height : 0
      // };
      // 
      // props.width = this.width();

      // layout logic
      var layoutMethod = layoutMode;
      if ( layoutMethod === 'masonry' ) {
        layoutMethod = props.opts.masonrySingleMode ? 'masonrySingleColumn' : 'masonryMultiColumn';
      }
      
      $elems.molequul( layoutMethod, props );

      // set the height of the container to the tallest column
      // props.containerHeight = Math.max.apply( Math, props.colYs );
      // props.containerHeight = props.clearFloat.height;
      this.molequul( layoutMode + 'MeasureContainerHeight', props );
      var containerStyle    = { height: props.containerHeight - props.posTop };
      props.styleQueue.push({ $el: this, style: containerStyle });




      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = ( props.applyStyleFnName === 'animate' && !props.initialized ) ? 
                    'css' : props.applyStyleFnName,
          animOpts = props.opts.animationOptions;


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
    
  

    
    resize : function() {
      var props = this.data('molequul');
      props.initialized = true;

      return this.molequul( props.opts.layoutMode + 'Resize', props );
    },
    
    append : function() {
      
    },
    

    
    // only run though on initial init
    setup : function( props ) {
      // var props = this.data('molequul');
      props.atoms = {};
      props.styleQueue = [];
      // need to get cards
      props.atoms.$all = props.opts.selector ? 
        this.find( props.opts.selector ) : 
        this.children();
      
      props.colW = props.opts.columnWidth || props.atoms.$all.outerWidth(true);

      // if colW == 0, back out before divide by zero
      if ( !props.colW ) {
        window.console && console.error('Column width calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }

      this.css('position', 'relative').molequul( 'getColCount', props );

      cardStyle = { position: 'absolute' };
      if ( $.molequul.usingTransforms ) {
        cardStyle.left = 0;
        cardStyle.top = 0;
      }
      props.atoms.$all.css( cardStyle );

      // 
      switch ( props.opts.animationEngine ) {
        // ****  change option to lower case
        case 'none' :
          props.applyStyleFnName = 'css';
          break;
        case 'jquery' :
          props.applyStyleFnName = 'animate';
          break;
        case 'best-available' :
        default :
          props.applyStyleFnName = Modernizr.csstransitions ? 'css' : 'animate';
          break;
      }
      
      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.prepend( $cursor );
      props.posTop  = Math.round( $cursor.position().top );
      props.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add molequul class first time around
      var $container = this;
      setTimeout(function(){
        $container.addClass( props.opts.containerClass ); 
      }, 1 );
      
      // save data
      this.data( 'molequul', props )

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
          $.molequul.defaults,
          previousOptions,
          options
        );
        
        // $this.data( 'molequul', props );
        
        if ( !props.initialized ) {
          $this.molequul( 'setup', props );
        }
        
        if ( props.opts.layoutMode === 'masonry' ) {
          $this.molequul('getMasonryColCount', props )
        }

        $this.molequul( 'filter', props.atoms.$all )
          .molequul( props.opts.layoutMode + 'ResetLayoutProps', props )
          .molequul( 'layout', props.atoms.$filtered );


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


  $.molequul.position = $.molequul.usingTransforms ? $.molequul.translate : $.molequul.positionAbs;

  // molequul code begin
  $.fn.molequul = function( firstArg ) { 

    // Method calling logic
    var method = $.molequul[ firstArg ];
    if ( method ) {
      // remove firstArg, which is a string of the function name, from arguments
      var args = Array.prototype.slice.call( arguments, 1 );
      return method.apply( this, args );
      
    } else if ( !firstArg || typeof firstArg === 'object' ) {
      return $.molequul.init.apply( this, arguments );
    }


  };


})(jQuery);