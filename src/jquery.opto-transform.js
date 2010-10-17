// ========================= jQuery transform extensions ===============================
(function($){  


  // if props.transform hasn't been set, do it already
  $.props.transform = getStyleProperty('transform');
  
  var transformFnUtilsDimensional = {
        '2d' : {
          translate : function ( position ) {
            return 'translate(' + position[0] + 'px, ' + position[1] + 'px)';
          },
          scale :  function ( scale ) {
            return 'scale(' + scale[0] + ')';
          }
        },
        '3d' : {
          translate : function ( position ) {
            return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0)';
          },
          scale : function ( scale ) {
            return 'scale3d(' + scale[0] + ', ' + scale[0] + ', 1)';
          }
        }
      },
      dimensions = Modernizr.csstransforms3d ? '3d' : '2d',
      transformFnUtils = transformFnUtilsDimensional[ dimensions ];


  var _jQueryStyle = $.style;
  $.style = function ( elem, name, value  ) {

    switch ( name ) {
      case 'scale' :
      case 'translate' :
        // unpack current transform data
        var data =  $( elem ).data('transform') || {},
        // extend new value over current data
            newData = {},
            valueFns = [],
            fnName;
        newData[ name ] = value;
        $.extend( data, newData );

        for ( fnName in data ) {
          var transformValue = data[ fnName ],
              getFn = transformFnUtils[ fnName ],
              valueFn = getFn( transformValue );
          valueFns.push( valueFn );
        }

        // set data back in elem
        $( elem ).data('transform', data );

        value = valueFns.join(' ');
        
        // set name to vendor specific property
        name = $.props.transform;
        
        break;
    }

    return _jQueryStyle.apply( this, arguments );
  };
  
  
  var _fxCur = $.fx.prototype.cur;
  $.fx.prototype.cur = function () {
    if ( this.prop === 'scale' ) {
      var data = $( this.elem ).data('transform'),
          currentScale = data && data[ this.prop ] ? data[ this.prop ] : [ 1 ];
      // scale value is saved as a 1 item array
      return currentScale[0];
    }

    return _fxCur.apply(this, arguments);
  };

  $.fx.step.scale = function (fx) {
    $( fx.elem ).css({ scale: [ fx.now ] });
  };

})( jQuery );