---

title: Options
category: docs
layout: default
body_class: option-def
toc:
  - { title: animationEngine, anchor: animationengine }
  - { title: animationOptions, anchor: animationoptions }
  - { title: containerClass, anchor: containerclass }
  - { title: containerStyle, anchor: containerstyle }
  - { title: filter, anchor: filter }
  - { title: getSortData, anchor: getsortdata }
  - { title: hiddenClass, anchor: hiddenclass }
  - { title: hiddenStyle, anchor: hiddenstyle }
  - { title: itemClass, anchor: itemclass }
  - { title: itemPositionDataEnabled, anchor: itempositiondataenabled }
  - { title: itemSelector, anchor: itemselector }
  - { title: layoutMode, anchor: layoutmode }
  - { title: onLayout, anchor: onlayout }
  - { title: resizable, anchor: resizable }
  - { title: resizesContainer, anchor: resizescontainer }
  - { title: sortAscending, anchor: sortascending }
  - { title: sortBy, anchor: sortby }
  - { title: transformsEnabled, anchor: transformsenabled }
  - { title: visibleStyle, anchor: visiblestyle }
  - { title: Layout-specific options, anchor: layoutspecific_options }

---

<dl class="header clearfix">
  <dt><code>option</code></dt>
  <dd class="option-type">Type</dd>
  <dd class="default">Default</dd>
</dl>

## animationEngine

<dl class="clearfix">
  <dt><code>animationEngine</code></dt>
  <dd class="option-type">String</dd>
  <dd class="default"><code><span class="s1">'best-available'</span></code></dd>
</dl>

Determines the jQuery method to apply styles, `.css()` or `.animate()`. Useful for relying on CSS transitions to handle animation.

### Values {#animationEngine-values}


+ `'best-available'`: if browser supports CSS transitions, Isotope uses `.css()`. If not, falls back to using `.animate()`.
+ `'css'`: Isotope uses `.css()`
+ `'jquery'`: Isotope uses `.animate()`

## animationOptions

<dl class="clearfix">
  <dt><code>animationOptions</code></dt>
  <dd class="option-type">Object</dd>
  <dd class="default"><code>{ queue: <span class="kc">false</span>, duration: <span class="mi">800</span> }</code></dd>
</dl>

When jQuery is the animation engine (see above), these options will be used in <code>.animate()</code>. See the [jQuery API for animate options](http://api.jquery.com/animate/#animate-properties-options) for details.

### Example

{% highlight javascript %}

$('#container').isotope({
  animationOptions: {
     duration: 750,
     easing: 'linear',
     queue: false
   }
});

{% endhighlight %}

## containerClass

<dl class="clearfix">
  <dt><code>containerClass</code></dt>
  <dd class="option-type">String</dd>
  <dd class="default"><code><span class="s1">'isotope'</span></code></dd>
</dl>

The class applied to the container element.

## containerStyle

<dl class="clearfix">
  <dt><code>containerStyle</code></dt>
  <dd class="option-type">Object</dd>
  <dd class="default"><code>{ position: <span class="s1">'relative'</span>, overflow: <span class="s1">'hidden'</span> }</code></dd>
</dl>

CSS styles applied to the container element. Relative positioning enables absolute positioning on child items. Hidden overflow ensures that filtered items that lie outside the container do not interfer with subsequent content.

## filter

<dl class="clearfix">
  <dt><code>filter</code></dt>
  <dd class="option-type">Selector</dd>
</dl>

Setting a filter with show item elements that match the selector, and hide elements that do not match. See [docs on filering](filtering.html) for more details.

[**See Demo: Filtering**](../demos/filtering.html)

### Values {#filter-values}


<ul>
  <li><code><span class="s1">'*'</span></code> or <code><span class="s1">''</span></code> (an empty string): Shows all item elements</li>
</ul>


## getSortData

<dl class="clearfix">
  <dt><code>getSortData</code></dt>
  <dd class="option-type">Object</dd>
</dl>

An object containing one or several methods to retrieve data for Sorting. The methods receive one parameter (`$elem` in the example below) which is a jQuery object representing each item element. The methods need to return a value. See [docs on sorting](sorting.html) for more details.

[**See Demo: Sorting**](../demos/sorting.html)

### Example

{% highlight javascript %}

$('#container').isotope({
  getSortData : {
    symbol : function( $elem ) {
      return $elem.attr('data-symbol');
    },
    number : function( $elem ) {
      return parseInt( $elem.find('.number').text(), 10 );
    },
    name : function ( $elem ) {
      return $elem.find('.name').text();
    }
  }
});

{% endhighlight %}

## hiddenClass

<dl class="clearfix">
  <dt><code>hiddenClass</code></dt>
  <dd class="option-type">String</dd>
  <dd class="default"><code><span class="s1">'isotope-hidden'</span></code></dd>
</dl>

The class applied to item elements hidden by Filtering.

## hiddenStyle

<dl class="clearfix">
  <dt><code>hiddenStyle</code></dt>
  <dd class="option-type">Object</dd>
  <dd class="default"><code>{ opacity : <span class="mi">0</span>, scale : <span class="mi">0.001</span> }</code></dd>
</dl>

The style applied to item elements hidden by Filtering.

## itemClass

<dl class="clearfix">
  <dt><code>itemClass</code></dt>
  <dd class="option-type">String</dd>
  <dd class="default"><code><span class="s1">'isotope-item'</span></code></dd>
</dl>

The class applied to item elements.

## itemPositionDataEnabled

<dl class="clearfix">
  <dt><code>itemPositionDataEnabled</code></dt>
  <dd class="option-type">Boolean</dd>
  <dd class="default"><code><span class="kc">false</span></code></dd>
</dl>

When enabled, the position of item elements will exposed as data, which you can retrieve with jQuery's data method with <code><span class="s1">'isotope-item-position'</span></code> name space. Position is return as an object with `x` and `y`;

### Example

{% highlight javascript %}

$('#container').isotope({
  itemSelector: '.element',
  itemPositionDataEnabled: true
})
// log position of each item
.find('.element').each(function(){
  var position = $(this).data('isotope-item-position');
  console.log('item position is x: ' + position.x + ', y: ' + position.y  );
});

{% endhighlight %}

## itemSelector

<dl class="clearfix">
  <dt><code>itemSelector</code></dt>
  <dd class="option-type">Selector</dd>
</dl>

Restricts Isotope item elements to selector.

## layoutMode

<dl class="clearfix">
  <dt><code>layoutMode</code></dt>
  <dd class="option-type">String</dd>
  <dd class="default"><code><span class="s1">'masonry'</span></code></dd>
</dl>

See also docs on [Layout modes](layout-modes.html).

[**See Demo: Layout modes**](../demos/layout-modes.html)

## onLayout

<dl class="clearfix">
  <dt><code>onLayout</code></dt>
  <dd class="option-type">Function</dd>
</dl>

Similiar to a callback, `onLayout` is a function that will be triggered after every time an Isotope instance runs through its layout logic.

{% highlight javascript %}

$('#container').isotope({
  onLayout: function( $elems, instance ) {
    // `this` refers to jQuery object of the container element
    console.log( this.height() );
    // callback provides jQuery object of laid-out item elements
    $elems.css({ background: 'blue' });
    // instance is the Isotope instance
    console.log( instance.$filteredAtoms.length );
  }
});

{% endhighlight %}

## resizable

<dl class="clearfix">
  <dt><code>resizable</code></dt>
  <dd class="option-type">Boolean</dd>
  <dd class="default"><code><span class="kc">true</span></code></dd>
</dl>

Triggers layout logic when browser window is resized. 

## resizesContainer

<dl class="clearfix">
  <dt><code>resizesContainer</code></dt>
  <dd class="option-type">Boolean</dd>
  <dd class="default"><code><span class="kc">true</span></code></dd>
</dl>

Isotope will set the height (for vertical layout modes) or width (for horizontal layout modes) of the container after layout. If `resizesContainer` is set to <code><span class="kc">false</span></code>, be sure to set a size for the container in your CSS, so it doesn't collapse when Isotope is triggered.

## sortAscending

<dl class="clearfix">
  <dt><code>sortAscending</code></dt>
  <dd class="option-type">Boolean</dd>
  <dd class="default"><code><span class="kc">true</span></code></dd>
</dl>

Used with sorting. If true, items are sorted ascending: "1, 2, 3" or "A, B, C...". If false, items are sorted descending "Z, Y, X" or "9, 8, 7...". See [docs on sorting](sorting.html) for more details.

[**See Demo: Sorting**](../demos/sorting.html)

## sortBy

<dl class="clearfix">
  <dt><code>sortBy</code></dt>
  <dd class="option-type">String</dd>
</dl>

The property name of the method within the `getSortData` option to sort item elements.  See [docs on sorting](sorting.html) for more details.

[**See Demo: Sorting**](../demos/sorting.html)

### Values {#sortBy-values}

+ `'original-order'` Sorts item elements by their original order.

## transformsEnabled

<dl class="clearfix">
  <dt><code>transformsEnabled</code></dt>
  <dd class="option-type">Boolean</dd>
  <dd class="default"><code><span class="kc">true</span></code></dd>
</dl>

Isotope uses CSS3 transforms to position item elements, when available in the browser. Setting `transformsEnabled` to <code><span class="kc">false</span></code> will disable this feature so all browsers use top/left absolute positioning. Useful for [resolving issues with CSS transforms](help.html#css-transforms).

### Additional CSS {#transformsEnabled-css}

If you do disable transforms, but still want to use [CSS transitions](animating.html#css_transitions), you'll need add the following CSS:

{% highlight css %}

.isotope .isotope-item {
  -webkit-transition-property: top, left, opacity;
     -moz-transition-property: top, left, opacity;
      -ms-transition-property: top, left, opacity;
       -o-transition-property: top, left, opacity;
          transition-property: top, left, opacity;
}

{% endhighlight %}

## visibleStyle

<dl class="clearfix">
  <dt><code>visibleStyle</code></dt>
  <dd class="option-type">Object</dd>
  <dd class="default"><code>{ opacity : <span class="mi">1</span>, scale : <span class="mi">1</span> }</code></dd>
</dl>

The style applied to item elements made visible by Filtering.

## Layout-specific options

In addition the general options listed above, certain layout modes each have their own options. In order to avoid conflict, these options are set with an option that matches the name of the layout mode.

See docs on [layout modes](layout-modes.html) for each layout mode's available options.

For example, if your layout switched from `masonry` to `cellsByRow`:

{% highlight javascript %}

$('#container').isotope({
  masonry: {
    columnWidth: 120
  },
  cellsByRow: {
    columnWidth: 220,
    rowHeight: 220
  }
});

{% endhighlight %}

[**See Demo: Layout modes**](../demos/layout-modes.html)