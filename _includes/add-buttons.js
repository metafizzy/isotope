      $('#insert a').click(function(){
        var i = Math.ceil( Math.random()*3 + 1 ),
            newEls = '';
        // window.console && console.log( i )
        while ( i-- ) {
          newEls += fakeElement.create();
        }
        var $newEls = $( newEls )
        // $container.append( $newEls ).isotope( 'appendToLayout', $newEls );
        $container.isotope( 'insert', $newEls );
        // $container.append( $newEls ).isotope( 'addAtoms', $newEls ).isotope();
        // $container.isotope()
        // console.log( next )

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