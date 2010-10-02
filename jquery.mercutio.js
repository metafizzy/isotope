/*************************************************
**  jQuery Mercutio version 0.1
**  Copyright David DeSandro, licensed MIT
**  http://desandro.com/resources/jquery-mercutio
**************************************************/
(function($){  

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


  var mercutioMethods = {
    
    init : function( options, callback ) {

      return this.each(function() {  

        console.log( this )

      });
      
    }
    
    
  };

  // mercutio code begin
  $.fn.mercutio = function( firstArg ) { 

    // Method calling logic
    var method = mercutioMethods[ firstArg ];
    if ( method ) {
      // remove firstArg, which is a string of the function name, from arguments
      var args = Array.prototype.slice.call( arguments, 1 );
      return method.apply( this, args );
      
    } else if ( !firstArg || typeof firstArg === 'object' ) {
      return mercutioMethods.init.apply( this, arguments );
    }


  };


  // Default plugin options
  $.fn.mercutio.defaults = {
    singleMode: false,
    columnWidth: undefined,
    itemSelector: undefined,
    appendedContent: undefined,
    saveOptions: true,
    resizeable: true,
    animate: false,
    animationOptions: {}
  };

})(jQuery);