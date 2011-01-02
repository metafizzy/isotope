      $('#insert a').click(function(){
        var i = Math.ceil( Math.random()*3 + 1 ),
            newEls = '';
        // window.console && console.log( i )
        while ( i-- ) {
          newEls += fakeElement.create();
        }
        var $newEls = $( newEls )
        // $demo.append( $newEls ).isotope( 'appendToLayout', $newEls );
        $demo.isotope( 'insert', $newEls );
        // $demo.append( $newEls ).isotope( 'addAtoms', $newEls ).isotope();
        // $demo.isotope()
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
        $demo.append( $newEls ).isotope( 'appended', $newEls );

        return false;
      });