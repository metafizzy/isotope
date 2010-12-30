// change layout
var isHorizontal = false;
$('#layouts a').click(function(){
  var mode = $(this).attr('href').slice(1);
      wasHorizontal = isHorizontal;
  isHorizontal = $(this).hasClass('horizontal');
  
  if ( wasHorizontal !== isHorizontal ) {
    // need to do some clean up for transitions and sizes
    var style = isHorizontal ? 
      { height: '80%', width: $demo.width() } : 
      { width: 'auto' };
    $demo.addClass('no-transition').css( style );
    setTimeout(function(){
      $demo.removeClass('no-transition').isotope({ layoutMode : mode });
    }, 100 )
  } else {
    // go ahead and apply new layout
    $demo.isotope({ layoutMode : mode });
    
  }
  
  return false;
});