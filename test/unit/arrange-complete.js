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
      iso.once( 'arrangeComplete', function() {
        assert.ok( true, 'after layout mid-way thru transition' );
        next();
      });

      iso.arrange({
        filter: '.a2',
        transitionDuration: '0.6s'
      });

      setTimeout( function() {
        iso.arrange({
          filter: '.b2'
        });
      }, 300 );
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
