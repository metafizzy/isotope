/*!
 * jQuery UI Widget 1.8.5
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

  $.widget = $.widget || {};

  $.widget.bridge = $.widget.bridge || function( name, object ) {
  	$.fn[ name ] = function( options ) {
  		var isMethodCall = typeof options === "string",
  			args = Array.prototype.slice.call( arguments, 1 ),
  			returnValue = this;

  		// allow multiple hashes to be passed on init
  		options = !isMethodCall && args.length ?
  			$.extend.apply( null, [ true, options ].concat(args) ) :
  			options;

  		// prevent calls to internal methods
  		if ( isMethodCall && options.substring( 0, 1 ) === "_" ) {
  			return returnValue;
  		}

  		if ( isMethodCall ) {
  			this.each(function() {
  				var instance = $.data( this, name );
  				if ( !instance ) {
  					throw "cannot call methods on " + name + " prior to initialization; " +
  						"attempted to call method '" + options + "'";
  				}
  				if ( !$.isFunction( instance[options] ) ) {
  					throw "no such method '" + options + "' for " + name + " widget instance";
  				}
  				var methodValue = instance[ options ].apply( instance, args );
  				if ( methodValue !== instance && methodValue !== undefined ) {
  					returnValue = methodValue;
  					return false;
  				}
  			});
  		} else {
  			this.each(function() {
  				var instance = $.data( this, name );
  				if ( instance ) {
  					instance.option( options || {} )._init();
  				} else {
  					$.data( this, name, new object( options, this ) );
  				}
  			});
  		}

  		return returnValue;
  	};
  };
  
  
  $.widget.bridge( 'molequul', Molequul );

})( jQuery );
