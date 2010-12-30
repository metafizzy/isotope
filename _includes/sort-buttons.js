
      // sorting
      $('#sort a').click(function(){
        // get href attribute, minus the #
        var $this = $(this),
            sortName = $this.attr('href').slice(1),
            asc = $this.parents('.sort').hasClass('asc');
        // var sortTest = 'sort ' + sortName + ' ' + direction;
        // console.time( sortTest );
        $demo.isotope({ 
          sortBy : sortName,
          sortAscending : asc
        });
        // console.timeEnd( sortTest );
        return false;
      });