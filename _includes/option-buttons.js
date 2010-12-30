$('#options').find('.option-set a').click(function(){
  var $this = $(this);
  
  // don't proceed if already selected
  if ( $this.hasClass('selected') ) {
    return;
  }
  
  $this.parents('.option-set').find('.selected').removeClass('selected');
  $this.addClass('selected');
  
});
