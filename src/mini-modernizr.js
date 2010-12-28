// ========================= getStyleProperty by kangax ===============================

var getStyleProperty = (function(){

  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];
  var _cache = { };

  function getStyleProperty(propName, element) {
    element = element || document.documentElement;
    var style = element.style,
        prefixed,
        uPropName;

    // check cache only when no element is given
    if (arguments.length == 1 && typeof _cache[propName] == 'string') {
      return _cache[propName];
    }
    // test standard property first
    if (typeof style[propName] == 'string') {
      return (_cache[propName] = propName);
    }
    
    // console.log('getting prop', propName)

    // capitalize
    uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i=0, l=prefixes.length; i<l; i++) {
      prefixed = prefixes[i] + uPropName;
      if (typeof style[prefixed] == 'string') {
        return (_cache[propName] = prefixed);
      }
    }
  }

  return getStyleProperty;
})();

// ========================= miniModernizr ===============================
// <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

/*!
 * Modernizr v1.6ish: miniModernizr for Isotope
 * http://www.modernizr.com
 *
 * Developed by: 
 * - Faruk Ates  http://farukat.es/
 * - Paul Irish  http://paulirish.com/
 *
 * Copyright (c) 2009-2010
 * Dual-licensed under the BSD or MIT licenses.
 * http://www.modernizr.com/license/
 */

 
/*
 * Modernizr is a script that detects native CSS3 and HTML5 features
 * available in the current UA and provides an object containing all
 * features with a true/false value, depending on whether the UA has
 * native support for it or not.
 * 
 * Modernizr will also add classes to the <html> element of the page,
 * one for each feature it detects. If the UA supports it, a class
 * like "cssgradients" will be added. If not, the class name will be
 * "no-cssgradients". This allows for simple if-conditionals in your
 * CSS, giving you fine control over the look & feel of your website.
 * 
 * This version whittles down the script just to check support for
 * CSS transitions, transforms, and 3D transforms.
 * 
 * @author        Faruk Ates
 * @author        Paul Irish
 * @copyright     (c) 2009-2010 Faruk Ates.
 * @contributor   Ben Alman
 */
 
window.Modernizr = window.Modernizr || (function(window,doc,undefined){
  
  var version = '1.6ish: miniModernizr for Isotope',
      miniModernizr = {},
      vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
      classes = [],
      docElement = document.documentElement,

      tests = [
        {
          name : 'csstransforms',
          result : function() {
            return !!getStyleProperty('transform');
          }
        },
        {
          name : 'csstransforms3d',
          result : function() {
            var test = !!getStyleProperty('perspective');
            // double check for Chrome's false positive
            if ( test ){
              var st = document.createElement('style'),
                  div = document.createElement('div'),
                  mq = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)';

              st.textContent = mq + '{#modernizr{height:3px}}';
              (doc.head || doc.getElementsByTagName('head')[0]).appendChild(st);
              div.id = 'modernizr';
              docElement.appendChild(div);

              test = div.offsetHeight === 3;

              st.parentNode.removeChild(st);
              div.parentNode.removeChild(div);
            }
            return !!test;
          }
        },
        {
          name : 'csstransitions',
          result : function() {
            return !!getStyleProperty('transitionProperty');
          }
        }
      ]
  ;


  // Run through all tests and detect their support in the current UA.
  for ( var i = 0, len = tests.length; i < len; i++ ) {
    var test = tests[i],
        result = test.result();
    miniModernizr[ test.name ] = result;
    var className = ( result ?  '' : 'no-' ) + test.name;
    classes.push( className );
  }

  // Add the new classes to the <html> element.
  docElement.className += ' ' + classes.join( ' ' );

  return miniModernizr;
  
})(this,this.document);