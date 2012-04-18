---

title: Sorting
category: docs
layout: default
toc:
  - { title: Markup, anchor: markup }
  - { title: getSortData option, anchor: getsortdata_option }
  - { title: sortBy option, anchor: sortby_option }
  - { title: sortAscending option, anchor: sortascending_option }
  - { title: Creating interactive buttons, anchor: creating_interactive_buttons }

---

Collect data from item element and rearrange their order in the layout with sorting.

[**See Demo: Sorting**](../demos/sorting.html)

## Markup

Any group of similar items have their own data. It could be a text value, like a title or tag, or a numerical value, like a measurement or grade. For our example, each item element has several data points that can be used for sorting. There's the elemental symbol, number, name of the element, weight, and category.

{% highlight html %}

<div id="container">
  <div class="element transition metal" data-category="transition"> 
    <p class="number">79</p> 
    <h3 class="symbol">Au</h3> 
    <h2 class="name">Gold</h2> 
    <p class="weight">196.966569</p> 
  </div> 
    
  <div class="element metalloid" data-category="metalloid"> 
    <p class="number">51</p> 
    <h3 class="symbol">Sb</h3> 
    <h2 class="name">Antimony</h2> 
    <p class="weight">121.76</p> 
  </div>
</div>

{% endhighlight %}


## getSortData option

In order to extract this data from the element, we need to pass in a function to get it via the [`getSortData`](options.html#getsortdata) option.  This option accepts an object, whose values are the functions to extract the data.

Each function receives one argument, which represents a jQuery object for each item element. With that argument, the function needs to return the data point.

In the example above, to get element name, we would need to get the text from the `.name` element. The same works for symbol.

{% highlight javascript %}

$('#container').isotope({
  getSortData : {
    name : function ( $elem ) {
      return $elem.find('.name').text();
    },
    symbol : function ( $elem ) {
      return $elem.find('.symbol').text();
    }
  }
});

{% endhighlight %}


For numerical data, we can convert a text value into a number with `parseInt()` or `parseFloat()`.

{% highlight javascript %}

getSortData : {
  // ...
  number : function ( $elem ) {
    return parseInt( $elem.find('.number').text(), 10 );
  },
  weight : function ( $elem ) {
    return parseFloat( $elem.find('.weight').text() );
  }
}

{% endhighlight %}

The data extracted can be anything accessible in the item element via jQuery. To extract the category data held within the `data-category` attribute, we can use the `.attr()`.

{% highlight javascript %}

getSortData : {
  // ...
  category : function ( $elem ) {
    return $elem.attr('data-category');
  }
}

{% endhighlight %}

Get creative! You could sort a list by the width of each item element.

{% highlight javascript %}

getSortData : {
  // ...
  width : function( $elem ) {
    return $elem.width();
  }
}

{% endhighlight %}

## sortBy option

For every method set in `getSortData`, Isotope uses that method to build the data for sorting. The data cache is built on initialization so it can be quickly accessed when sorting. With the methods above, we have built data for an item elements name, symbol, number, weight and category.

Sorting elements is done with the [`sortBy` option](options.html#sortby). The value needs to match the property name used in the `getSortData` object.

With our example, we can use `'name'`, `'symbol'`, `'number'`, `'weight'` and `'category'`.

{% highlight javascript %}

$('#container').isotope({ sortBy : 'symbol' });

{% endhighlight %}

There are two additional sorting data methods built in to Isotope. 

+ `'original-order'` will use the original order of the item elements to arrange them in the layout.
+ `'random'` is a random order.

## sortAscending option

By default, Isotope sorts data in ascension. If our data for name is "Gold, Antimony, Lead, Iron, Silver", when sorted by name, the elements will be ordered ABC.. : "Antimony, Gold, Iron, Lead, Silver."  To reverse the order and sort data in descension, set [`sortAscending`](options.html#sortascending) to <code><span class="kc">false</span></code>.

{% highlight javascript %}

$('#container').isotope({ 
  sortBy : 'name',
  sortAscending : false
});

{% endhighlight %}

## Creating interactive buttons

We can use a simple list for our buttons.

{% highlight html %}

<ul id="sort-by">
  <li><a href="#name">name</a></li>
  <li><a href="#symbol">symbol</a></li>
  <li><a href="#number">number</a></li>
  <li><a href="#weight">weight</a></li>
  <li><a href="#category">category</a></li>
</ul>

{% endhighlight %}

When one of these links is clicked, we can use the `href` attribute as the value for `sortBy` in the Isotope script.

{% highlight javascript %}

$('#sort-by a').click(function(){
  // get href attribute, minus the '#'
  var sortName = $(this).attr('href').slice(1);
  $('#container').isotope({ sortBy : sortName });
  return false;
});

{% endhighlight %}
