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
      
      console.log( 'all atoms', this.atoms.$all.length )
      
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