( function() {

'use strict';

// ----- default layout mode ----- //
Isotope.prototype.options.layoutMode = 'fitRows';

// ----- getText ----- //
var docElem = document.documentElement;

window.getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };

})();
