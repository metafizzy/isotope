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
      },
      sortDir : 1
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
    
    // ====================== Sorting ======================
    
    
    addSortData : function( props ) {
      return this.each(function(){
        var $this = $(this),
            sortData = {},
            getSortData = props.opts.getSortData;
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          sortData[ key ] = getSortData[ key ]( $this );
        }
        // apply sort data to $element
        $this.data( 'molequul-sort-data', sortData );
        // increment element count
        props.elemCount ++;
      });
    },

    getPrevProp : function( property, props ) {
      return props.prevOpts && props.prevOpts[ property ] ? 
        props.prevOpts[ property ] : undefined
    },
    
    // used on all the filtered cards, $cards.filtered
    sort : function( $elems ) {
      var props  = this.data('molequul'),
          sortBy =  props.opts.sortBy,
          sortDir = props.opts.sortDir,
          previousFilter  = $.molequul.getPrevProp( 'filter', props ),
          previousSortBy  = $.molequul.getPrevProp( 'sortBy', props ),
          previousSortDir = $.molequul.getPrevProp( 'sortDir', props );
      // don't proceed if there is nothing to sort by
      // or if previousFilter == filter AND sortBy == previous Sort by
      if ( !sortBy || ( props.opts.filter === previousFilter && sortBy === previousSortBy && sortDir === previousSortDir ) ) {
        return this;
      }
      
      var getSorter = function( elem ) {
        return $(elem).data('molequul-sort-data')[ sortBy ];
      };
      // console.log( sortBy );
      
      
      $elems.sort( function( alpha, beta ) {
        var a = getSorter( alpha ),
            b = getSorter( beta );
        return ( a > b ) ? 1 * sortDir : ( a < b ) ? -1 * sortDir : 0;
      });
      
      return this;
    },
    

    // ====================== Layout ======================

    pushPosition : function( x, y, props ) {
      var position = $.molequul.position( x, y );
      props.styleQueue.push({ $el: this, style: position });
      return this;
    },

    // ====================== masonry ======================
    
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
      
      // position the brick
      x = props.colW * shortCol + props.posLeft;
      y = minimumY;
      this.molequul( 'pushPosition', x, y, props );

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
      props.colW = props.opts.columnWidth || props.atoms.$all.outerWidth(true);

      // if colW == 0, back out before divide by zero
      if ( !props.colW ) {
        window.console && console.error('Column width calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }
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
    
    masonrySetup : function( props ) {
      this.molequul('getMasonryColCount', props );
      return this;
    },
    

    
    // ====================== ClearFloat ======================
    
    clearFloat : function( props ) {
      return this.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true),
            x, y;
        
        if ( props.clearFloat.x !== 0  &&  atomW + props.clearFloat.x > props.width ) {
          // if this element cannot fit in the current row
          props.clearFloat.x = 0;
          props.clearFloat.y = props.clearFloat.height;
        } 
        
        // position the atom
        x = props.clearFloat.x + props.posLeft;
        y = props.clearFloat.y + props.posTop;
        $this.molequul( 'pushPosition', x, y, props );

        props.clearFloat.height = Math.max( props.clearFloat.y + atomH, props.clearFloat.height );
        props.clearFloat.x += atomW;

      });
    },
    
    clearFloatSetup : function( props ) {
      props.width = this.width();
      return this;
    },
    
    clearFloatResetLayoutProps : function( props ) {
      props.clearFloat = {
        x : 0,
        y : 0,
        height : 0
      };
      return this;
    },
    
    clearFloatMeasureContainerHeight : function ( props ) {
      props.containerHeight = props.clearFloat.height;
      return this;
    },
    
    clearFloatResize : function( props ) {
      props.width = this.width();
      return this
        .molequul( 'clearFloatResetLayoutProps', props )
        .molequul( 'layout', props.atoms.$filtered );
    },

    // ====================== General Methods ======================

    
    // used on collection of cards (should be filtered, and sorted before )
    // accepts cards-to-be-laid-out and colYs to start with
    layout : function( $elems, callback ) {

      var props = this.data('molequul'),
          layoutMode = props.opts.layoutMode ;

      // layout logic
      var layoutMethod = layoutMode;
      if ( layoutMethod === 'masonry' ) {
        layoutMethod = props.opts.masonrySingleMode ? 'masonrySingleColumn' : 'masonryMultiColumn';
      }
      
      $elems.molequul( layoutMethod, props );

      // set the height of the container to the tallest column
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

      // provide $elems as context for the callback
      callback = callback || function(){};
      callback.call( $elems );

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

      props.atoms = {};
      props.styleQueue = [];
      props.elemCount = 0;
      // need to get cards
      props.atoms.$all = props.opts.selector ? 
        this.find( props.opts.selector ) : 
        this.children();
      
      this.css({
        overflow : 'hidden',
        position : 'relative'
      });

      cardStyle = { position: 'absolute' };
      if ( $.molequul.usingTransforms ) {
        cardStyle.left = 0;
        cardStyle.top = 0;
      }
      props.atoms.$all.css( cardStyle );

      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem ) {
          return props.elemCount;
        }
      };
      props.opts.getSortData = $.extend( originalOrderSorter, props.opts.getSortData );

      // add sort data to each elem
      props.atoms.$all.molequul( 'addSortData', props );

      // get applyStyleFnName
      switch ( props.opts.animationEngine.toLowerCase().replace( /[ _-]/g, '') ) {
        case 'none' :
          props.applyStyleFnName = 'css';
          break;
        case 'jquery' :
          props.applyStyleFnName = 'animate';
          break;
        case 'bestavailable' :
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
      
      // do any layout-specific setup
      this.molequul( props.opts.layoutMode + 'Setup', props );
      
      // save data
      this.data( 'molequul', props )

      return this;
    },
    

    
    init : function( options, callback ) {

      return this.each(function() {  

        var $this = $(this),
            data = $this.data('molequul'),
            props = data || {};

        // checks if masonry has been called before on this object
        props.initialized = !!data;

        props.prevOpts = props.initialized ? data.opts : {};

        props.opts = $.extend(
          {},
          $.molequul.defaults,
          props.prevOpts,
          options
        );
        
        if ( !props.initialized ) {
          $this.molequul( 'setup', props );
        }
        
        
        if ( props.prevOpts.layoutMode && props.prevOpts.layoutMode !== props.opts.layoutMode ) {
          $this.molequul( props.opts.layoutMode + 'Setup', props );
        }
        

        $this
          .molequul( 'filter', props.atoms.$all )
          .molequul( 'sort', props.atoms.$filtered )
          .molequul( props.opts.layoutMode + 'ResetLayoutProps', props )
          .molequul( 'layout', props.atoms.$filtered, callback );


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