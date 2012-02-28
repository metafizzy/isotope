---

title: Methods
category: docs
layout: default
toc:
  - { title: addItems, anchor: additems }
  - { title: appended, anchor: appended }
  - { title: destroy, anchor: destroy }
  - { title: insert, anchor: insert }
  - { title: layout, anchor: layout }
  - { title: option, anchor: option }
  - { title: reLayout, anchor: relayout }
  - { title: reloadItems, anchor: reloaditems }
  - { title: remove, anchor: remove }
  - { title: shuffle, anchor: shuffle }
  - { title: updateSortData, anchor: updatesortdata }

---

Isotope offers several methods to extend functionality. Isotope's methods follow the jQuery UI pattern.

{% highlight javascript %}

$('#container').isotope( 'methodName', [optionalParameters] )

{% endhighlight %}

## addItems

{% highlight javascript %}

.isotope( 'addItems', $items, callback )

{% endhighlight %}

Adds item elements to the pool of item elements of the container, but does not sort, filter or layout. See [Adding items](adding-items.html) for more details. The argument within the callback is the group of elements that were added. 

[**See Demo: Adding items**](../demos/adding-items.html)

## appended

{% highlight javascript %}

.isotope( 'appended', $items, callback )

{% endhighlight %}

Adds item elements via `addItems` method, then triggers `layout` just for those new elements. Useful for Infinite Scroll. See [Adding items](adding-items.html) for more details.

[**See Demo: Adding items**](../demos/adding-items.html)

## destroy

{% highlight javascript %}

.isotope( 'destroy' )

{% endhighlight %}

Removes Isotope functionality completely. Returns element back to pre-init state.

## insert

{% highlight javascript %}

.isotope( 'insert', $items, callback )

{% endhighlight %}

Appends items elements to container, adds items to via `addItems` method, and then triggers `reLayout` method so new elements are properly filtered, sorted and laid-out. See [Adding items](adding-items.html) for more details.

[**See Demo: Adding items**](../demos/adding-items.html).

## layout

{% highlight javascript %}

.isotope( 'layout', $items, callback )

{% endhighlight %}

Positions specified item elements in layout.

`layout` will only position specified elements, and those elements will be positioned at the end of layout. Whereas `reLayout` will position all elements in the Isotope widget.

## option

{% highlight javascript %}

.isotope( 'option', options )

{% endhighlight %}

Sets options for plugin instance. Unlike passing options through `.isotope()`, using the `option` method will not trigger layout.

{% highlight javascript %}

// sets multiple options
.isotope( 'option', { layoutMode: 'fitRows', filter: '.my-filter' } )

{% endhighlight %}


## reLayout

{% highlight javascript %}

.isotope( 'reLayout', callback )

{% endhighlight %}

Resets layout properties and lays-out every item element.

[**See Demo: reLayout**](../demos/relayout.html)

## reloadItems

{% highlight javascript %}

.isotope( 'reloadItems' )

{% endhighlight %}

Re-collects all item elements in their current order in the DOM.  Useful for prepending.

[**See Demo: Adding items**](../demos/adding-items.html).

## remove

{% highlight javascript %}

.isotope( 'remove', $items, callback )

{% endhighlight %}

Removes specified item elements from Isotope widget and the DOM.

[**See Demo: Removing**](../demos/removing.html).

## shuffle

{% highlight javascript %}

.isotope( 'shuffle', callback )

{% endhighlight %}

Shuffles order of items. Sets [`sortBy` option](options.html#sortby) to [`'random'`](sorting.html#sortby_option).

## updateSortData

{% highlight javascript %}

.isotope( 'updateSortData', $items )

{% endhighlight %}

Updates the sorting data on specified item elements. This method is useful if the data within an item is changed dynamically after Isotope has been initialized.
