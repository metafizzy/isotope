/*************************************************
**  jQuery Molequul version 0.1
**  Copyright David DeSandro
**************************************************/
(function( $, undefined ) {

  // our "Widget" object constructor
  $.Molequul = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Molequul.prototype = {

    options : {
      // columnWidth : 150,
      resizeable: true,
      layoutMode : 'masonry',
      masonrySingleMode : false,
      containerClass : 'molequul',
      hiddenClass : 'molequul-hidden',
      hiddenStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 0, scale : 0.001 } :
        { opacity : 0 },
      visibleStyle : Modernizr.csstransforms && !$.browser.opera ? 
        { opacity : 1, scale : 1 } :
        { opacity : 1 },
      animationEngine : 'best-available',
      animationOptions: {
        queue: false
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
      
      // console.log( 'all atoms', this.$allAtoms.length )
      
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

      // add molequul class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );
      
      // do any layout-specific setup
      // this.width = this.element.width();
      // this._getMasonryColCount();
      
      // bind resize method
      if ( this.options.resizeable ) {
        $(window).bind('smartresize.molequul', function() { instance.element.molequul('resize') } );
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

      $atoms.css( atomStyle );
      
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
        $this.data( 'molequul-sort-data', sortData );
        // increment element count
        // console.log( instance.elemCount )
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
            return $(elem).data('molequul-sort-data')[ instance.options.sortBy ];
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
    

    

    
    // ====================== ClearFloat ======================
    



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
      var styleFn = ( this.applyStyleFnName === 'animate' && !$.data( this.element, 'molequul' ) ) ? 
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
      return this
        [ '_' +  this.options.layoutMode + 'Reset' ]()
        .layout( this.$filteredAtoms, callback )
    },
    
    // ====================== Convenience methods ======================
    
    // adds a jQuery object of items to a molequul container
    addAtoms : function( $content, callback ) {
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
      this.addAtoms( $content, function( $newAtoms ) {
        $filteredAtoms = instance._filter( $newAtoms );
        instance.$filteredAtoms = instance.$filteredAtoms.add( $filteredAtoms );
      });
      
      this._sort().reLayout( callback );
      
    },
    
    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      // var $newAtoms = this.addAtoms( $content );
      // this.$filteredAtoms = this.$filteredAtoms.add( $newAtoms );
      // 
      // return this.layout( $newAtoms, callback );
      var instance = this;
      this.addAtoms( $content, function( $newAtoms ){
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
        .unbind('.molequul')
        .removeClass( this.options.containerClass )
        .removeData('molequul');
      
      $(window).unbind('.molequul');

    },
    
    _getCols : function( namespace ) {
      this[ namespace ].columnWidth = ( this.options[ namespace ] && this.options[ namespace ].columnWidth ) || this.$allAtoms.outerWidth(true);
      
      // if colW == 0, back out before divide by zero
      if ( !this[ namespace ].columnWidth ) {
        window.console && console.error('Column width calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }
      this.width = this.element.width();
      this[ namespace ].cols = Math.floor( this.width / this[ namespace ].columnWidth ) ;
      this[ namespace ].cols = Math.max( this[ namespace ].cols, 1 );
      
      return this;
      
    },

    _getRows : function( namespace ) {
      this[ namespace ].rowHeight = ( this.options[ namespace ] && this.options[ namespace ].rowHeight ) || this.$allAtoms.outerHeight(true);
      
      // if colW == 0, back out before divide by zero
      if ( !this[ namespace ].rowHeight ) {
        window.console && console.error('Row height calculated to be zero. Stopping Molequul plugin before divide by zero. Check that the width of first child inside the molequul container is not zero.');
        return this;
      }
      this.height = this.element.height();
      this[ namespace ].rows = Math.floor( this.height / this[ namespace ].rowHeight ) ;
      this[ namespace ].rows = Math.max( this[ namespace ].rows, 1 );
      
      return this;
      
    }

  };
  
  
  // ====================== LAYOUTS ======================
  
  
  // ====================== Masonry ======================
  
  $.Molequul.prototype._masonryPlaceBrick = function( $brick, setCount, setY ) {
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

  };
  
  
  $.Molequul.prototype._masonryLayout = function( $elems ) {
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
  };
  
  // reset
  $.Molequul.prototype._masonryReset = function() {
    // layout-specific props
    this.masonry = {};
    // FIXME shouldn't have to call this again
    this._getCols('masonry');
    var i = this.masonry.cols;
    this.masonry.colYs = [];
    while (i--) {
      this.masonry.colYs.push( this.posTop );
    }
    return this;
  };
  

  
  $.Molequul.prototype._masonryResize = function() {
    var prevColCount = this.masonry.cols;
    // get updated colCount
    this._getCols('masonry');
    if ( this.masonry.cols !== prevColCount ) {
      // if column count has changed, do a new column cound
      this.reLayout();
    }

    return this;
  };
  
  $.Molequul.prototype._masonryGetContainerSize = function() {
    var containerHeight = Math.max.apply( Math, this.masonry.colYs ) - this.posTop;
    return { height: containerHeight };
  };
  
  
  // ====================== clearFloat ======================
    
  $.Molequul.prototype._clearFloatLayout = function( $elems ) {
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
  };
  
  $.Molequul.prototype._clearFloatReset = function() {
    this.clearFloat = {
      x : 0,
      y : 0,
      height : 0
    };
    return this;
  };
  
  $.Molequul.prototype._clearFloatGetContainerSize = function () {
    return { height : this.clearFloat.height };
  };
  
  $.Molequul.prototype._clearFloatResize = function() {
    this.width = this.element.width();
    return this.reLayout()
  };


  // ====================== cellsByRow ======================
  
  $.extend( $.Molequul.prototype, {

    _cellsByRowReset : function() {
      this.cellsByRow = {};
      this._getCols('cellsByRow');
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
      this._getCols('cellsByRow');

      // if column count has changed, do a new column cound
      if ( this.cellsByRow.cols !== prevCols ) {
        this.reLayout();
      }
      return this;
    }
  });
  
  $.extend( $.Molequul.prototype, {

    _cellsByColumnReset : function() {
      this.cellsByColumn = {};
      this._getRows('cellsByColumn');
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
      this._getRows('cellsByColumn');

      // if column count has changed, do a new column cound
      if ( this.cellsByColumn.rows !== prevRows ) {
        this.reLayout();
      }
      return this;
    }
  });
  

  

  
})( jQuery );