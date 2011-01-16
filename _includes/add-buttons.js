      $('#insert a').click(function(){
        var i = Math.ceil( Math.random()*3 + 1 ),
            newEls = '';
        while ( i-- ) {
          newEls += fakeElement.create();
        }
        var $newEls = $( newEls )
        $container.isotope( 'insert', $newEls );

        return false;
      });

      $('#append a').click(function(){
        var i = Math.ceil( Math.random()*3 + 1 ),
            newEls = '';
        while ( i-- ) {
          newEls += fakeElement.create();
        }
        var $newEls = $( newEls )
        $container.append( $newEls ).isotope( 'appended', $newEls );

        return false;
      });