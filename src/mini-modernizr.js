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
            var ret = !!getStyleProperty('perspective');
            console.log( ret )
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
    var test = tests[i];
    miniModernizr[ test.name ] = test.result();
    var className = ( test.result() ?  '' : 'no-' ) + test.name;
    classes.push( className );
  }

  // Add the new classes to the <html> element.
  docElement.className += ' ' + classes.join( ' ' );

  window.Modernizr = miniModernizr;
  
  
}