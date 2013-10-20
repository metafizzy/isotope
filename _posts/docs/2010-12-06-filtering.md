---

title: Filtering
category: docs
layout: default
toc:
  - { title: Markup, anchor: markup }
  - { title: jQuery script, anchor: jquery_script }
  - { title: Creating interactive buttons, anchor: creating_interactive_buttons }
  - { title: Recommended CSS, anchor: recommended_css }

---

Isotope can hide and show item elements via the [`filter` option](options.html#filter). `filter` accepts a jQuery selector. Items that match that selector will be shown. Items that do not match will be hidden.

[**See Demo: Filtering**](../demos/filtering.html)

## Markup

Each item element has several identifying classes. In this case, `transition`, `metal`, `lanthanoid`, `alkali`, etc.

{% highlight html %}

<div id="container">
  <div class="element transition metal">...</div>
  <div class="element post-transition metal">...</div>
  <div class="element alkali metal">...</div>
  <div class="element transition metal">...</div>
  <div class="element lanthanoid metal inner-transition">...</div> 
  <div class="element halogen nonmetal">...</div> 
  <div class="element alkaline-earth metal">...</div>
  ...
</div>

{% endhighlight %}

## jQuery script

To show only `.metal` items, the jQuery script would be:

{% highlight javascript %}

$('#container').isotope({ filter: '.metal' });

{% endhighlight %}

The `filter` option uses a [jQuery selector](http://api.jquery.com/category/selectors/) to show item elements that match a selector, and hide all others that do not. For example:

+ `.alkali, .alkaline-earth` will show `.alkali` AND ` .alkaline-earth` item elements.
+ `.metal.transition` will show item elements that have BOTH `.metal` and `.transition` classes.
+ `.metal:not(.transition)` will show `.metal` item elements that are NOT `.transition`.

## Creating interactive buttons

Let's use a basic list for our buttons

{% highlight html %}

<ul id="filters">
  <li><a href="#" data-filter="*">show all</a></li>
  <li><a href="#" data-filter=".metal">metal</a></li>
  <li><a href="#" data-filter=".transition">transition</a></li>
  <li><a href="#" data-filter=".alkali, .alkaline-earth">alkali and alkaline-earth</a></li>
  <li><a href="#" data-filter=":not(.transition)">not transition</a></li>
  <li><a href="#" data-filter=".metal:not(.transition)">metal but not transition</a></li>
</ul>

{% endhighlight %}

Here we set the filter for each link with a `data-filter` attribute. In our jQuery script, whenever a link is clicked, we'll use this attribute as the filter selector.

{% highlight javascript %}

// cache container
var $container = $('#container');
// initialize isotope
$container.isotope({
  // options...
});

// filter items when filter link is clicked
$('#filters a').click(function(){
  var selector = $(this).attr('data-filter');
  $container.isotope({ filter: selector });
  return false;
});

{% endhighlight %}

## Recommended CSS

If you choose to use the filtering functionality, add the following CSS to your stylesheet:

{% highlight css %}

/**** Isotope filtering ****/

.isotope-item {
  z-index: 2;
}

.isotope-hidden.isotope-item {
  pointer-events: none;
  z-index: 1;
}

{% endhighlight %}

These styles ensure that hidden items will not interfere with interactions.
