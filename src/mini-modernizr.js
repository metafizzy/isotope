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
if ( !window.Modernizr ) {

  var miniModernizr = {},
      vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
      classes = [],
      docElement = document.documentElement,
      tests = {
        csstransforms : function() {
          return !!getStyleProperty('transform');
        },
        csstransforms3d : function() {
          var ret = !!getStyleProperty('perspective');

          if (ret){
            var st = document.createElement('style'),
                div = document.createElement('div');

            st.textContent = '@media ('+vendorCSSPrefixes.join('transform-3d),(') + 
                                'modernizr){#modernizr{height:3px}}';
            document.getElementsByTagName('head')[0].appendChild(st);
            div.id = 'modernizr';
            docElement.appendChild(div);

            ret = div.offsetHeight === 3;

            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);
          }
          return ret;
        },
        csstransitions : function() {
          return !!getStyleProperty('transitionProperty');
        }
      };

  // hasOwnProperty shim by kangax needed for Safari 2.0 support
  var _hasOwnProperty = ({}).hasOwnProperty, hasOwnProperty;
  if (typeof _hasOwnProperty !== 'undefined' && typeof _hasOwnProperty.call !== 'undefined') {
    hasOwnProperty = function (object, property) {
      return _hasOwnProperty.call(object, property);
    };
  }
  else {
    hasOwnProperty = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
      return ((property in object) && typeof object.constructor.prototype[property] === 'undefined');
    };
  }

  // Run through all tests and detect their support in the current UA.
  for ( var feature in tests ) {
    if ( hasOwnProperty( tests, feature ) ) {
      // run the test, throw the return value into the Modernizr,
      //   then based on that boolean, define an appropriate className
      //   and push it into an array of classes we'll join later.
      var test = tests[ feature ]();
      miniModernizr[ feature.toLowerCase() ] = test;
      var className = ( test ?  '' : 'no-' ) + feature.toLowerCase()
      classes.push( className );
    }
  }

  // Add the new classes to the <html> element.
  docElement.className += ' ' + classes.join( ' ' );

  window.Modernizr = miniModernizr;
}