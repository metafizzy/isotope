// ========================= jQuery transform extensions ===============================
(function($){  


  $.optoTransform = {
    
    transformProp : getStyleProperty('transform'),
    
    fnUtils : Modernizr.csstransforms3d ? 
      { // 2d transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 3d transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale :  function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ,
    
    set : function( elem, name, value ) {

      // unpack current transform data
      var data =  $( elem ).data('transform') || {},
      // extend new value over current data
          newData = {},
          fnName,
          transformObj = {};
      // overwrite new data
      newData[ name ] = value;
      $.extend( data, newData );

      for ( fnName in data ) {
        var transformValue = data[ fnName ],
            getFn = $.optoTransform.fnUtils[ fnName ];
        transformObj[ fnName ] = getFn( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $( elem ).data( 'transform', data );

      // sorting so scale always comes before 
      value = valueFns;

      // set name to vendor specific property
      elem.style[ $.optoTransform.transformProp ] = valueFns;

    }
  };
  
  // ==================== scale ===================
  
  $.cssNumber.scale = true;
  
  $.cssHooks.scale = {
    set: function( elem, value ) {

      if ( typeof value === 'string' ) {
        value = parseFloat( value );
      }

      $.optoTransform.set( elem, 'scale', value )

    },
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.scale ? transform.scale : 1;
    }
  }

  $.fx.step.scale = function( fx ) {
    $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
  };
  
  
  // ==================== translate ===================
    
  $.cssNumber.translate = true;
  
  $.cssHooks.translate = {
    set: function( elem, value ) {

      // all this would be for public ease-of-use,
      // but we're leaving it out since this add-on is
      // only for internal-plugin use
      // if ( typeof value === 'string' ) {
      //   value = value.split(' ');
      // }
      // 
      //  
      // var i, val;
      // for ( i = 0; i < 2; i++ ) {
      //   val = value[i];
      //   if ( typeof val === 'string' ) {
      //     val = parseInt( val );
      //   }
      // }

      $.optoTransform.set( elem, 'translate', value )

    },
    
    get: function( elem, computed ) {
      var transform = $.data( elem, 'transform' );
      return transform && transform.translate ? transform.translate : [ 0, 0 ];
    }
  }


})( jQuery );