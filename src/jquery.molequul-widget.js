(function( $, undefined ) {

  // our "Widget" object constructor
  var Molequul = function( options, element ){
      this.options = options;
      this.element = element;

      this._init();
  };

  Molequul.prototype = {
  
    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init: function(){
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

    publicFn: function(){ // notice no underscore
      return "public method";
    },

    _privateFn: function(){
      return "private method";
    }
  };
  
  $.widget.bridge( 'molequul', Molequul );
  
})( jQuery );