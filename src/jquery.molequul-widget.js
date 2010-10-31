(function( $, undefined ) {

  // our "Widget" object constructor
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
    
    _filterFind: function( $elems, selector ) {
      return selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, this.options, options );
      
      this.atoms = {};
      this.isNew = {};
      this.styleQueue = [];
      this.elemCount = 0;
      // need to get atoms
      this.atoms.$all = this._filterFind( this.$elem.children(), this.options.itemSelector );
      
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

      this.positionFn = this.usingTransforms ? this._translate : this._positionAbs;
      
      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem ) {
          return this.elemCount;
        }
      };

      this.options.getSortData = $.extend( originalOrderSorter, this.options.getSortData );


      this._setupAtoms( this.atoms.$all );
      this.atoms.$all.molequul( '_setupAtoms' );
      
      
      // get top left position of where the bricks should be
      var $cursor   = $( document.createElement('div') );
      this.$elem.prepend( $cursor );
      this.posTop  = Math.round( $cursor.position().top );
      this.posLeft = Math.round( $cursor.position().left );
      $cursor.remove();

      // add molequul class first time around
      var instance = this;
      setTimeout( function() {
        instance.$elem.addClass( instance.options.containerClass );
      }, 0 );
      
      // console.log( this.options.layoutMode )
      
      // do any layout-specific setup
      this.width = this.$elem.width();
      this._getMasonryColCount();
      
      // save data
      // this.data( 'molequul', props );
      
      // bind resize method
      if ( this.options.resizeable ) {
        $(window).bind('smartresize.molequul', function() { instance.$elem.molequul('resize') } );
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
      
      // this.options = $.extend( true, Molequul.options, this.options );

      // check if watched properties are new
      var instance = this;
      $.each( [ 'filter', 'sortBy', 'sortDir' ], function( i, propName ){
        // console.log( propName, this );
        instance.isNew[ propName ] = instance._isNewProp( propName );
      });

      if ( this.isNew.filter ) {
        this.atoms.$filtered = this._filter( this.atoms.$all )
      } else {
        this.atoms.$filtered = this.atoms.$all;
      }

      if ( this.isNew.filter || this.isNew.sortBy || this.isNew.sortDir ) {
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
    
    _addSortData : function( $atoms ) {
      var instance = this;
      $atoms.each(function(){
        var $this = $(this),
            sortData = {},
            getSortData = instance.options.getSortData,
            key;
        // get value for sort data based on fn( $elem ) passed in
        for ( key in getSortData ) {
          sortData[ key ] = getSortData[ key ]( $this );
        }
        // apply sort data to $element
        $this.data( 'molequul-sort-data', sortData );
        // increment element count
        instance.elemCount ++;
      });
    },
    
    _setupAtoms : function( $atoms ) {
      
      // base style for atoms
      var atomStyle = { position: 'absolute' };
      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle );
      
      // add sort data to each elem
      this._addSortData( $atoms );

      // return this.molequul( 'addSortData', props ).css( atomStyle );
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
    
    
    _getSortFn : function( sortBy, sortDir ) {
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
    _sort : function() {
      
      var sortFn = this._getSortFn( this.options.sortBy, this.options.sortDir );
      
      this.atoms.$filtered.sort( sortFn );
      
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
    
    _placeBrick : function( $brick, setCount, setY ) {
      // here, `this` refers to a child element or "brick"
          // get the minimum Y value from the columns
      var minimumY  = Math.min.apply( Math, setY ),
          setHeight = minimumY + $brick.outerHeight(true),
          i         = setY.length,
          shortCol  = i,
          setSpan   = this.colCount + 1 - i,
          x, y ;
      // Which column has the minY value, closest to the left
      while (i--) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
        }
      }
      
      // position the brick
      x = this.colW * shortCol + this.posLeft;
      y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },
    
    _masonrySingleColumn : function( $elems ) {
      var instance = this;
      $elems.each(function(){
        instance._placeBrick( $(this), instance.colCount, instance.colYs );
      });
    },
    
    
    _masonryMultiColumn : function( $elems ) {
      var instance = this;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / instance.colW );
        colSpan = Math.min( colSpan, instance.colCount );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._placeBrick( $this, instance.colCount, instance.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = instance.colCount + 1 - colSpan,
              groupY = [],
              groupColY;

          // for each group potential horizontal position
          for ( var i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = instance.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }
          
          instance._placeBrick( $this, groupCount, groupY );
        }
      });
    },
    
    _getMasonryColCount : function( ) {
      // console.log( 'getting masonry col count')
      this.colW = this.options.columnWidth || this.atoms.$all.outerWidth(true);

      // if colW == 0, back out before divide by zero
      if ( !this.colW ) {
        window.console && console.error('Column width calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }
      this.width = this.$elem.width();
      this.colCount = Math.floor( this.width / this.colW ) ;
      this.colCount = Math.max( this.colCount, 1 );
      return this;
    },
    
    _masonryResetLayoutProps : function() {
      var i = this.colCount;
      this.colYs = [];
      while (i--) {
        this.colYs.push( this.posTop );
      }
      return this;
    },
    

    
    _masonryResize : function() {
      var prevColCount = this.colCount;
      // get updated colCount
      this._getMasonryColCount();
      if ( this.colCount !== prevColCount ) {
        // if column count has changed, do a new column cound
        this.reLayout();
      }

      return this;
    },
    
    _masonryMeasureContainerHeight : function() {
      this.containerHeight = Math.max.apply( Math, this.colYs ) - this.posTop;
    },
    

    
    // ====================== ClearFloat ======================
    
    _clearFloat : function( $elems ) {
      var instance = this;
      return $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true),
            x, y;
        
        if ( instance.clearFloat.x !== 0  &&  atomW + instance.clearFloat.x > instance.width ) {
          // if this element cannot fit in the current row
          instance.clearFloat.x = 0;
          instance.clearFloat.y = instance.clearFloat.height;
        } 
        
        // position the atom
        x = instance.clearFloat.x + instance.posLeft;
        y = instance.clearFloat.y + instance.posTop;
        instance._pushPosition( $this, x, y );

        instance.clearFloat.height = Math.max( instance.clearFloat.y + atomH, instance.clearFloat.height );
        instance.clearFloat.x += atomW;

      });
    },
    
    _clearFloatResetLayoutProps : function() {
      this.clearFloat = {
        x : 0,
        y : 0,
        height : 0
      };
      return this;
    },
    
    _clearFloatMeasureContainerHeight : function () {
      this.containerHeight = this.clearFloat.height;
    },
    
    _clearFloatResize : function() {
      this.width = this.$elem.width();
      return this.reLayout()
    },


    // ====================== General Layout ======================

    
    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode,
          layoutMethod = '_' + layoutMode;

      // layout logic
      if ( layoutMethod === '_masonry' ) {
        layoutMethod += this.options.masonrySingleMode ? 'SingleColumn' : 'MultiColumn';
      }
      
      this[ layoutMethod ]( $elems );
      
      // $elems.molequul( layoutMethod, props );

      // set the height of the container to the tallest column
      this[ '_' +  layoutMode + 'MeasureContainerHeight' ]();
      var containerStyle    = { height: this.containerHeight };
      


      this.styleQueue.push({ $el: this.$elem, style: containerStyle });



      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = ( this.applyStyleFnName === 'animate' && !$.data( this.$elem, 'molequul' ) ) ? 
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

      return this;
    },
    
    
    resize : function() {
      return this[ '_' + this.options.layoutMode + 'Resize' ]();
    },
    
    
    reLayout : function( callback ) {
      this
        [ '_' +  this.options.layoutMode + 'ResetLayoutProps' ]()
        .layout( this.atoms.$filtered, callback )
    },
    
    // ====================== Convenience methods ======================
    
    // adds a jQuery object of items to a molequul container
    add : function( $content ) {
      var $newAtoms = this._filterFind( $content, this.options.itemSelector );
      this._setupAtoms( $newAtoms );
      // add new atoms to atoms pools
      this.atoms.$all = this.atoms.$all.add( $newAtoms );
      this.atoms.$filtered = this.atoms.$filtered.add( $newAtoms );
      return this;
    },
    
    // convienence method for adding elements properly to any layout
    insert : function( $content ) {
      this.$elem.append( $content );
      return this.add( $content )._init();
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      return this.add( $content ).layout( $content, callback );
    }


  };
  
  $.widget.bridge( 'molequul', Molequul );
  
})( jQuery );