QUnit.test( 'arrangeComplete', function( assert ) {
  'use strict';

  var iso = new Isotope( '#arrange-complete', {
    layoutMode: 'fitRows',
    transitionDuration: '0.1s'
  });

  var done = assert.async();

  var tests = [
    function() {
      iso.once( 'arrangeComplete', function() {
        assert.ok( true, 'arrangeComplete after some were filtered' );
        next();
      });

      iso.arrange({
        filter: '.a1'
      });
    },
    function() {
      iso.once( 'arrangeComplete', function() {
        assert.ok( true, 'after some revealed, some hidden, some same' );
        next();
      });

      iso.arrange({
        filter: '.b2'
      });
    },
    function() {
      iso.once( 'arrangeComplete', function() {
        assert.ok( true, 'after random sort' );
        next();
      });

      iso.arrange({
        sortBy: 'random'
      });
    },
    function() {
      var ticks = 0;
      function onArrangeComplete() {
        ticks++;
        if ( ticks == 2) {
          assert.ok( true, 'after layout mid-way thru transition' );
          iso.off( 'arrangeComplete', onArrangeComplete );
          next();
        } else if ( ticks > 2 ) {
          assert.ok( false, 'more ticks happened' );
        }
      }

      iso.on( 'arrangeComplete',  onArrangeComplete );

      iso.arrange({
        filter: '.a2',
        transitionDuration: '0.6s'
      });

      setTimeout( function() {
        iso.arrange({
          filter: '.b2'
        });
      }, 300 );
    },
    // stagger
    function() {
      iso.once( 'arrangeComplete', function() {
        assert.ok( true, 'arrangeComplete with stagger' );
        next();
      });

      iso.arrange({
        stagger: 100,
        sortBy: 'random',
        filter: '*',
        transitionDuration: '0.4s'
      });
    },
    // stagger, triggered mid-transition
    function() {
      var ticks = 0;
      function onArrangeComplete() {
        ticks++;
        if ( ticks == 2) {
          assert.ok( true, 'after layout mid-way thru transition, with stagger' );
          iso.off( 'arrangeComplete', onArrangeComplete );
          iso.options.stagger = 0;
          next();
        } else if ( ticks > 2 ) {
          assert.ok( false, 'more ticks happened' );
        }
      }

      iso.on( 'arrangeComplete',  onArrangeComplete );

      iso.arrange({
        stagger: 100,
        sortBy: 'random',
        transitionDuration: '0.4s'
      });

      setTimeout( function() {
        iso.arrange({
          filter: '.a1'
        });
      }, 250 );
    }
  ];

  function next() {
    if ( tests.length ) {
      var nextTest = tests.shift();
      // HACK for consecutive arrangeComplete calls
      setTimeout( nextTest );
    } else {
      done();
    }
  }

  next();

});
