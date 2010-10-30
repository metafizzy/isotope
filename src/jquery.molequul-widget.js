(function( $, undefined ) {

  // our "Widget" object constructor
  
  var MolequulDefaults = {
    columnWidth : 150,
    resizeable: true,
    layoutMode : 'masonry',
    masonrySingleMode : false,
    containerClass : 'molequul',
    hiddenClass : 'molequul-hidden',
    hiddenStyle : {
      opacity : 0
    },
    visibleStyle : {
      opacity : 1
    },
    animationEngine : 'best-available',
    animationOptions: {
      queue: false
    },
    sortBy : 'original-order',
    sortDir : 1
    
  };
  
  var Molequul = function( options, element ){
    this.elem = element;
    this.$elem = $( element );

    this._create( options );
    this._init();
  };

  Molequul.prototype = {

    options : {
      columnWidth : 150,
      resizeable: true,
      layoutMode : 'masonry',
      masonrySingleMode : false,
      containerClass : 'molequul',
      hiddenClass : 'molequul-hidden',
      hiddenStyle : {
        opacity : 0
      },
      visibleStyle : {
        opacity : 1
      },
      animationEngine : 'best-available',
      animationOptions: {
        queue: false
      },
      sortBy : 'original-order',
      sortDir : 1

    },
    
    _filterFind: function( selector ) {
      return selector ? this.find( selector ).add( this.find( selector ) ) : this;
    },
    
    // sets up widget
    _create: function( options ) {
      
      this.options = $.extend( true, this.options, options );
      
      this.atoms = {};
      this.isNew = {};
      this.styleQueue = [];
      this.elemCount = 0;
      // need to get atoms
      this.atoms.$all = this.$elem.children().molequul('_filterFind', this.options.itemSelector );
      
      // console.log( 'all atoms', this.atoms.$all.length )
      
      this.$elem.css({
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

      this.positionFn = this.usingTransforms ? Molequul.translate : Molequul.positionAbs;
      
      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem ) {
          return props.elemCount;
        }
      };
      this.options.getSortData = $.extend( originalOrderSorter, this.options.getSortData );

      this.atoms.$all.molequul( '_setupAtoms' );
      
      
      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.$elem.prepend( $cursor );
      this.posTop  = Math.round( $cursor.position().top );
      this.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add molequul class first time around
      var $container = this.$elem,
          containerClass = this.options.containerClass;
      setTimeout( function() {
        $container.addClass( containerClass );
      }, 0 );
      
      // console.log( this.options.layoutMode )
      
      // do any layout-specific setup
      this.$elem.molequul( '_' + this.options.layoutMode + 'Setup' );
      
      // save data
      // this.data( 'molequul', props );
      
    },
  
    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init: function(){
      
      // this.options = $.extend( true, Molequul.options, this.options );
      
      console.log( this )
      // init code
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
    
    // ====================== Filtering ======================

    filter : function( $atoms ) {
      var props  = this.data('molequul'),
          filter = props.opts.filter === '' ? '*' : props.opts.filter;

      if ( !filter ) {
        props.atoms.$filtered = $atoms;
      } else {
        var hiddenClass    = props.opts.hiddenClass,
            hiddenSelector = '.' + hiddenClass,
            $visibleAtoms  = $atoms.not( hiddenSelector ),
            $hiddenAtoms   = $atoms.filter( hiddenSelector ),
            $atomsToShow   = $hiddenAtoms;

        props.atoms.$filtered = $atoms.filter( filter );

        if ( filter !== '*' ) {
          $atomsToShow = $hiddenAtoms.filter( filter );

          var $atomsToHide = $visibleAtoms.not( filter ).toggleClass( hiddenClass );
          $atomsToHide.addClass( hiddenClass );
          props.styleQueue.push({ $el: $atomsToHide, style: props.opts.hiddenStyle });
        }
        
        props.styleQueue.push({ $el: $atomsToShow, style: props.opts.visibleStyle });
        $atomsToShow.removeClass( hiddenClass );
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
    
    // used on all the filtered atoms, $atoms.filtered
    sort : function( props ) {
      
      var sortFn = props.opts.sortBy === 'random' ? $.molequul.randomSortFn :
        $.molequul.getSortFn( props.opts.sortBy, props.opts.sortDir );
      
      props.atoms.$filtered.sort( sortFn );
      
      return this;
    },
    

    // ====================== Layout ======================

    
    translate : function( x, y ) {
      return { translate : [ x, y ] };
    },
    
    positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

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


    // ====================== General Layout ======================

    
    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
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
      if ( callback ) {
        callback.call( $elems );
      }

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
    
    // ====================== Setup and Init ======================
    
    // only run though on initial init
    setup : function( props ) {

      props.atoms = {};
      props.isNew = {};
      props.styleQueue = [];
      props.elemCount = 0;
      // need to get atoms
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

        // checks if molquul has been called before on this object
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
        
        // reset this prop for next time
        props.appending = false;

        // set all data so we can retrieve it for appended appendedContent
        //    or anyone else's crazy jquery fun
        $this.data( 'molequul', props );

      });
      
    },
    
    // ====================== Convenience methods ======================
    
    // adds a jQuery object of items to a molequul container
    add : function( $content ) {
      var props = this.data('molequul'),
          $newAtoms = props.opts.selector ? $content.filter( props.opts.selector ) : $content;
      $newAtoms.molequul( 'setupAtoms', props )
      // add new atoms to atoms pools
      props.atoms.$all = props.atoms.$all.add( $newAtoms );
      props.atoms.$filtered = props.atoms.$filtered.add( $newAtoms );
      props.appending = true;
      return this;
    },
    
    // convienence method for adding elements properly to any layout
    insert : function( $content ) {
      return this.append( $content ).molequul( 'add', $content ).molequul('init');
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content ) {
      return this.molequul( 'add', $content ).molequul( 'layout', $content );
    }


    // publicFn: function(){ // notice no underscore
    //   return "public method";
    // },
    // 
    // _privateFn: function(){
    //   return "private method";
    // }
  };
  
  $.widget.bridge( 'molequul', Molequul );
  
})( jQuery );