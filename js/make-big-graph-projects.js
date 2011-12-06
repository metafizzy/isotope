var programs = 'commercial urbanism public-space culture body-culture health education housing hotel media'.split(' '),
    programsLen = programs.length,
    statuses = 'idea in-progress under-construction completed'.split(' '),
    statusesLen = statuses.length;

function randInt(num) {
  return Math.floor( Math.random() * num );
}

function getChar() {
  var code;
  if ( Math.random() < 0.05 ) {
    // number
    code = randInt(10) + 48;
  } else {
    // alpha
    code = randInt(24) + 65;
  }
  return String.fromCharCode(code);
}

function makeBigGraphProject() {
  var year = 2001 + randInt(11),
      i = Math.floor( Math.random() * 2  + 3 ),
      title = '';
  while (i--) {
    title += getChar();
  }
  var program = programs[ randInt( programsLen ) ];
      status = statuses[ randInt( statusesLen ) ];
      scale = randInt(20);

  project = '<div class="project ' + program + '" ' + 
    'data-year="' + year + '" ' +
    'data-program="' + program + '" ' +
    'data-scale="' + scale + '" ' +
    'data-status="' + status + '" ' +
    '><div class="icon"></div>' + 
    '<p class="title">' + title + '</p>' +
    '</div>';

  return project;
}