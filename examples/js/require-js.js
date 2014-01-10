/*global requirejs: false*/

/*
// with bower components
requirejs.config({
  baseUrl: '../bower_components'
});

requirejs( [ '../js/isotope', '../js/layout-modes/masonry' ], function( Isotope ) {
  new Isotope( '#basic', {
    masonry: {
      columnWidth: 60
    }
  });
});
// */

// isotope.pkgd.js
/*
requirejs( [  'require', 'js/isotope.pkgd.js' ],
  function( require, Isotope ) {
    require( [ 'isotope/js/layout-modes/fit-rows' ], function() {
      new Isotope( '#basic', {
        layoutMode: 'fitRows',
        masonry: {
          columnWidth: 60
        }
      });
    });
  }
);
// */

// isotope.pkgd.js and jQuery
requirejs.config({
  paths: {
    jquery: '../../bower_components/jquery/jquery'
  }
})

requirejs( [ 'require', 'jquery', 'js/isotope.pkgd.js' ],
  function( require, $, Isotope ) {
    require( [
      'jquery-bridget/jquery.bridget',
      'isotope/js/layout-modes/masonry'
    ],
    function() {
      $.bridget( 'isotope', Isotope );
      $('#basic').isotope({
        masonry: {
          columnWidth: 60
        }
      });
    }
  );
});
