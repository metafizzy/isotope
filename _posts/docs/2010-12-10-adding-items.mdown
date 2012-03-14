---

title: Adding items
category: docs
layout: default
toc:
  - { title: addItems method, anchor: additems_method }
  - { title: insert method, anchor: insert_method }
  - { title: appended method, anchor: appended_method }
  - { title: Prepending, anchor: prepending }
  - { title: Recommended CSS, anchor: recommended_css }

---

If your application dynamically adds new content, Isotope provides several methods to add items.

[**See Demo: Adding items**](../demos/adding-items.html).

## addItems method

The [`addItems` method](methods.html#additems) adds new content to an Isotope container. This applies the proper styles to the items so they can be positioned and any sorting data is retrieved. But that's it. The new content will _not_ be filtered, sorted, or positioned properly, nor will it be appended to the container element.

{% highlight javascript %}

var $newItems = $('<div class="item" /><div class="item" /><div class="item" />');
$('#container').append( $newItems ).isotope( 'addItems', $newItems );

{% endhighlight %}

## insert method

More likely, you want to use the [`insert` method](methods.html#insert), which does everything that `addItems` misses. `insert` will append the content to the container, filter the new content, sort all the content, then trigger a `reLayout` so all item elements are properly laid out.

{% highlight javascript %}

var $newItems = $('<div class="item" /><div class="item" /><div class="item" />');
$('#container').isotope( 'insert', $newItems );

{% endhighlight %}

## appended method

The [`appended` method](methods.html#appended) is a convenience method triggers `addItems` on new content, then lays out _only the new content_ at the end of the layout. This method is useful if you know you only want to add new content to the end, and **not** use filtering or sorting.  `appended` is the best method to use with Infinite Scroll.

[**See Demo: Infinite Scroll**](../demos/infinite-scroll.html).

See also [Infinite Scroll with filtering or sorting](help.html#infinite_scroll_with_filtering_or_sorting)

## Prepending

Because of Isotope's sorting functionality, prepending isn't as straight forward as might expect. However, it can be replicated fairly easy.  After prepending new content to the container, you can re-collect all the item elements and update their sorting order with the [`reloadItems` method](methods.html#reloaditems). Then trigger a re-layout, with the original DOM order.

{% highlight javascript %}

var $newItems = $('<div class="item" /><div class="item" /><div class="item" />');
$('#container').prepend( $newItems)
  .isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });

{% endhighlight %}

## Recommended CSS

You'll need these styles in your CSS for the reveal animation when adding items.

{% highlight css %}

/**** disabling Isotope CSS3 transitions ****/

.isotope.no-transition,
.isotope.no-transition .isotope-item,
.isotope .isotope-item.no-transition {
  -webkit-transition-duration: 0s;
     -moz-transition-duration: 0s;
      -ms-transition-duration: 0s;
       -o-transition-duration: 0s;
          transition-duration: 0s;
}

{% endhighlight %}
