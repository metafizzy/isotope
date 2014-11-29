'use strict';

Tinytest.addAsync('Isotope - fitRows', function (test, done) {
  var isotopeDropZone = document.createElement('div');
  document.body.appendChild(isotopeDropZone);

  // TODO ideally we'd get the htmls straight from this repo, but no idea how to do this from TinyTest - http://stackoverflow.com/questions/27180892/pull-an-html-file-into-a-tinytest
  HTTP.get('https://rawgit.com/metafizzy/isotope/master/test/index.html', function callback(error, result) {

    // adapted from test/fit-rows.js
    function checkPosition(item, x, y) {
      var elem = item.element;
      var left = parseInt(elem.style.left, 10);
      var top = parseInt(elem.style.top, 10);
      test.equal([ left, top ], [ x, y ], 'item position ' + x + ', ' + y);
    }

    if (error) {
      test.fail({message: 'Error getting the test file. Do we have an Internet connection to rawgit.com?'});
    } else {
      // [^] matches across newlines. Stay within the <body>, or else the fragment will attempt to load resources on its own.
      isotopeDropZone.innerHTML = result.content.match(/<h2>fitRows[^]+<\/div>/);

      test.ok({message: 'Visual test passed if the fitRows look like two towers, and failed if they look like a rotated L'});

      var iso = new Isotope('#fitrows-gutter', {
        layoutMode: 'fitRows',
        itemSelector: '.item',
        transitionDuration: 0
      });

      checkPosition(iso.items[0], 0, 0);
      checkPosition(iso.items[1], 60, 0);

      // check gutter
      iso.options.fitRows = {
        gutter: 10
      };
      iso.layout();

      checkPosition(iso.items[0], 0, 0);
      checkPosition(iso.items[1], 70, 0);

      // check gutter, with element sizing
      iso.options.fitRows = {
        gutter: '.gutter-sizer'
      };
      iso.layout();

      checkPosition(iso.items[0], 0, 0);
      checkPosition(iso.items[1], 78, 0);
    }

    done();

  });
  
});
