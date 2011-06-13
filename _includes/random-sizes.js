
      // hacky way of adding random size classes
      $container.find('.element').each(function(){
        if ( Math.random() > 0.6 ) {
          $(this).addClass('width2');
        }
        if ( Math.random() > 0.6 ) {
          $(this).addClass('height2');
        }
      });