var fakeElement = {};

fakeElement.constanants = 'b c d f g k l m n p q r s t v x z'.split(' ');
fakeElement.vowels = 'a e i o u y'.split(' ');
fakeElement.categories = 'alkali alkaline-earth lanthanoid actinoid transition post-transition'.split(' ');
fakeElement.suffices = 'on ium ogen'.split(' ');

fakeElement.getRandom = function( property ) {
  var values = fakeElement[ property ];
  return values[ Math.floor( Math.random() * values.length ) ];
};

fakeElement.create = function() {
  var widthClass = Math.random()*10 > 6 ? 'width2' : 'width1';
      heightClass = Math.random()*10 > 6 ? 'height2' : 'height1';
      category = fakeElement.getRandom('categories');
      className = 'element fake metal ' + category + ' ' + widthClass + ' ' + heightClass;
      letter1 = fakeElement.getRandom('constanants').toUpperCase();
      letter2 = fakeElement.getRandom('constanants');
      symbol = letter1 + letter2;
      name = letter1 + fakeElement.getRandom('vowels') + letter2 + fakeElement.getRandom('vowels') + fakeElement.getRandom('constanants') + fakeElement.getRandom('suffices');
      number = ~~( 21 + Math.random() * 100 );
      weight = ~~( number * 2 + Math.random() * 15 );
      
  return '<div class="' + className + '" data-symbol="' + symbol + 
    '" data-category="' + category + '"><p class="number">' + number + 
    '</p><h3 class="symbol">' + symbol + '</h3><h2 class="name">' + name + 
    '</h2><p class="weight">' + weight + '</p></div>';
};

fakeElement.getGroup = function() {
  var i = Math.ceil( Math.random()*3 + 1 ),
      newEls = '';
  while ( i-- ) {
    newEls += fakeElement.create();
  }
  return newEls;
};