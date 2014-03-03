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
// /*
requirejs( [ 'js/isotope.pkgd.js' ], function( Isotope ) {
  new Isotope( '#basic', {
    layoutMode: 'masonry',
    masonry: {
      columnWidth: 60
    }
  });
});
// */

// isotope.pkgd.js and jQuery
/*
requirejs.config({
  paths: {
    jquery: '../../bower_components/jquery/jquery'
  }
})

requirejs( [ 'require', 'jquery', 'js/isotope.pkgd.js' ],
  function( require, $, Isotope ) {
    require( [
      'jquery-bridget/jquery.bridget',
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

// */
