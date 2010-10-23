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
    
    isNewProp : function( property, props ) {
      if ( !props.initialized ) {
        return true;
      }
      var previousProp = props.prevOpts[ property ];
      return ( props.opts[ property ] !== previousProp );
    },
    
    // ====================== Adding ======================
    
    addSortData : function( props ) {
      return this.each(function(){
        var $this = $(this),
            sortData = {},
            getSortData = props.opts.getSortData,
            key;
        // get value for sort data based on fn( $elem ) passed in
        for ( key in getSortData ) {
          sortData[ key ] = getSortData[ key ]( $this );
        }
        // apply sort data to $element
        $this.data( 'molequul-sort-data', sortData );
        // increment element count
        props.elemCount ++;
      });
    },
    
    setupAtoms : function( props ) {
      // base style for atoms
      var atomStyle = { position: 'absolute' };
      if ( props.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      // add sort data to each elem
      return this.molequul( 'addSortData', props ).css( atomStyle );
    },
    
    getAtoms : function( props ) {
      return props.opts.selector ? this.filter( props.opts.selector ) : this;
    },
    
    // adds a jQuery object of items to a molequul container
    addTo : function( $molecule ) {
      var props = $molecule.data('molequul'),
          $newAtoms = props.opts.selector ? this.filter( props.opts.selector ) : this;
      $newAtoms.molequul( 'setupAtoms', props )
      // console.log( $newAtoms )
      props.atoms.$all = props.atoms.$all.add( $newAtoms );
      props.atoms.$filtered = props.atoms.$filtered.add( $newAtoms );
      props.appending = true;
      // $molecule.data( 'molequul', props );
      // console.log( prevLen, props.atoms.$all.length )
      return $newAtoms;
    },
    
    add : function( $content ) {
      $content.molequul( 'addTo', this );
      return this;
    },
    
    insert : function( $content ) {
      // console.log('appedning')
      this.append( $content );
      $content.molequul( 'addTo', this );
      // console.log( this );
      return this.molequul('init');
    },
    
    // ====================== Filtering ======================

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
        // console.log( $cardsToShow.length, $cardsToHide.length )
      }
      
      return this;
    },
    
    // ====================== Sorting ======================
    
    
    getSortFn : function( sortBy, sortDir ) {
      var getSorter = function( elem ) {
        return $(elem).data('molequul-sort-data')[ sortBy ];
      };
      return function( alpha, beta ) {
        var a = getSorter( alpha ),
            b = getSorter( beta );
        return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
      };
    },
    
    randomSortFn : function() {
      return Math.random() > 5 ? 1 : -1;
    },
    
    // used on all the filtered cards, $cards.filtered
    sort : function( props ) {
      
      var sortFn = props.opts.sortBy === 'random' ? $.molequul.randomSortFn :
        $.molequul.getSortFn( props.opts.sortBy, props.opts.sortDir );
      
      props.atoms.$filtered.sort( sortFn );
      
      return this;
    },
    

    // ====================== Layout ======================

    pushPosition : function( x, y, props ) {
      var position = props.positionFn( x, y );
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
          x, y ;
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
              groupY = [],
              groupColY;

          // for each group potential horizontal position
          for ( var i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
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
        this.molequul( 'reLayout', props );
      }

      return this;
    },
    
    masonryMeasureContainerHeight : function( props ) {
      props.containerHeight = Math.max.apply( Math, props.colYs ) - props.posTop;
      return this;
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
      return this.molequul( 'reLayout', props );
    },


    // ====================== General Methods ======================


    
    // used on collection of cards (should be filtered, and sorted before )
    // accepts cards-to-be-laid-out and colYs to start with
    layout : function( $elems, callback ) {

      var props = this.data('molequul'),
          layoutMode = props.opts.layoutMode,
          layoutMethod = layoutMode;

      // layout logic
      if ( layoutMethod === 'masonry' ) {
        layoutMethod = props.opts.masonrySingleMode ? 'masonrySingleColumn' : 'masonryMultiColumn';
      }
      
      $elems.molequul( layoutMethod, props );

      // set the height of the container to the tallest column
      this.molequul( layoutMode + 'MeasureContainerHeight', props );
      var containerStyle    = { height: props.containerHeight };
      


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

      return this;
    },
    
    
    resize : function() {
      var props = this.data('molequul');

      return this.molequul( props.opts.layoutMode + 'Resize', props );
    },
    
    
    reLayout : function( props ) {
      props = props || this.data('molequul');
      props.initialized = true;
      return this
        .molequul( props.opts.layoutMode + 'ResetLayoutProps', props )
        .molequul( 'layout', props.atoms.$filtered );
    },
    
    // only run though on initial init
    setup : function( props ) {

      props.atoms = {};
      props.isNew = {};
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

      var jQueryAnimation = false;

      // get applyStyleFnName
      switch ( props.opts.animationEngine.toLowerCase().replace( /[ _\-]/g, '') ) {
        case 'none' :
          props.applyStyleFnName = 'css';
          break;
        case 'jquery' :
          props.applyStyleFnName = 'animate';
          jQueryAnimation = true;
          break;
        case 'bestavailable' :
        default :
          props.applyStyleFnName = Modernizr.csstransitions ? 'css' : 'animate';
      }
      
      props.usingTransforms = Modernizr.csstransforms && Modernizr.csstransitions && !jQueryAnimation;

      props.positionFn = props.usingTransforms ? $.molequul.translate : $.molequul.positionAbs;
      
      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem ) {
          return props.elemCount;
        }
      };
      props.opts.getSortData = $.extend( originalOrderSorter, props.opts.getSortData );

      props.atoms.$all.molequul( 'setupAtoms', props );
      
      
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
      this.data( 'molequul', props );

      return this;
    },
    
    watchedProps : [ 'filter', 'sortBy', 'sortDir', 'layoutMode' ],
    
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
        
        // check if watched properties are new
        $.each( $.molequul.watchedProps, function( i, propName ){
          props.isNew[ propName ] = $.molequul.isNewProp( propName, props );
        });

        if ( props.isNew.layoutMode ) {
          $this.molequul( props.opts.layoutMode + 'Setup', props );
        }
        
        if ( props.isNew.filter || props.appending ) {
          $this.molequul( 'filter', props.atoms.$all );
        }

        if ( props.isNew.filter || props.isNew.sortBy || props.isNew.sortDir || props.appending ) {
          $this.molequul( 'sort', props );
        }

        $this.molequul( props.opts.layoutMode + 'ResetLayoutProps', props )
          .molequul( 'layout', props.atoms.$filtered, callback );


        // binding window resizing
        if ( props.opts.resizeable ) {
          $(window).bind('smartresize.molequul', function() { $this.molequul( 'resize' ); } );
        } else if ( !props.opts.resizeable && !!props.prevOpts.resizeable ) {
          $(window).unbind('smartresize.molequul');
        }
        
        props.appending = false;

        // set all data so we can retrieve it for appended appendedContent
        //    or anyone else's crazy jquery fun
        $this.data( 'molequul', props );

      });
      
    },
    
    appendToLayout : function( $content ) {
      var $newAtoms = $content.molequul( 'addTo', this );
      return this.molequul( 'layout', $newAtoms );
    },
    
    translate : function( x, y ) {
      return { translate : [ x, y ] };
    },
    
    positionAbs : function( x, y ) {
      return { left: x, top: y };
    }
    
  };


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