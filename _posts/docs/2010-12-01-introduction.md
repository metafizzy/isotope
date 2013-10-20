---

title: Introduction
category: docs
layout: default
toc:
  - { title: Features, anchor: features }
  - { title: Licensing, anchor: licensing }
  - { title: Getting started, anchor: getting_started }
  - { title: Code repository, anchor: code_repository }
  - { title: A word about moderation, anchor: moderation }
  - { title: Acknowledgments, anchor: acknowledgments }
  

---

<p class="tagline">Isotope: An exquisite jQuery plugin for magical layouts</p>

## Features

+ [**Layout modes**](layout-modes.html): Intelligent, dynamic layouts that can't be achieved with CSS alone.
+ [**Filtering**](filtering.html): Hide and reveal item elements easily with jQuery selectors.
+ [**Sorting**](sorting.html): Re-order item elements with sorting. Sorting data can be extracted from just about anything.
+ **Interoperability**: features can be utilized together for a cohesive experience.
+ **Progressive enhancement**: Isotope's [animation engine](animating.html) takes advantage of the best browser features when available &mdash; CSS transitions and transforms, GPU acceleration &mdash; but will also fall back to JavaScript animation for lesser browsers.

## Commercial Licensing

Isotope may be used in commercial projects and applications with the one-time purchase of a commercial license. [Read more about Isotope commercial licensing.](license.html)


<p>{% include developer-buy-button.html %} {% include org-buy-button.html %}</p>

Purchasing accepts most credit cards and takes seconds. Once purchased, you'll receive a commercial license PDF and you will be all set to use Isotope in your commercial applications.

For non-commercial, personal, or open source projects and applications, you may use Isotope under the terms of the MIT License. You may use Isotope for free.

### Purchase via PayPal

If you're having trouble using a credit card, try purchasing a license via PayPal:

+ [Buy Developer License via PayPal](http://pul.ly/b/13620)
+ [Buy Organization License via PayPal](http://pul.ly/b/36595)

## Getting started

Isotope requires jQuery 1.4.3 and greater.

### Markup

Isotope works on a container element with a group of similar child items.

{% highlight html %}

<div id="container">
  <div class="item">...</div>
  <div class="item">...</div>
  <div class="item">...</div>
  ...
</div>

{% endhighlight %}

### Script

{% highlight javascript %}

$('#container').isotope({
  // options
  itemSelector : '.item',
  layoutMode : 'fitRows'
});

{% endhighlight %}

[**See Demo: Basic**](../demos/basic.html)

There are a number of [options](options.html) you can specify.  Within the options is where you can [set the layout mode](layout-modes.html), [filter items](filtering.html),  and [sort items](sorting.html).

Additionally you can specify a callback after the options object. This function will be triggered after the animation has completed.

{% highlight javascript %}

$('#container').isotope({ filter: '.my-selector' }, function( $items ) {
  var id = this.attr('id'),
      len = $items.length;
  console.log( 'Isotope has filtered for ' + len + ' items in #' + id );
});

{% endhighlight %}

Within this callback <code><span class="k">this</span></code> refers to the container, and `$items` refers to the item elements. Both of these are jQuery objects and do _not_ need to be put in jQuery wrappers.

### CSS

Add these styles to your CSS for [filtering](filtering.html), [animation](animating.html) with CSS transitions, and [adding items](adding-items.html).

{% highlight css %}

/**** Isotope Filtering ****/

.isotope-item {
  z-index: 2;
}

.isotope-hidden.isotope-item {
  pointer-events: none;
  z-index: 1;
}

/**** Isotope CSS3 transitions ****/

.isotope,
.isotope .isotope-item {
  -webkit-transition-duration: 0.8s;
     -moz-transition-duration: 0.8s;
      -ms-transition-duration: 0.8s;
       -o-transition-duration: 0.8s;
          transition-duration: 0.8s;
}

.isotope {
  -webkit-transition-property: height, width;
     -moz-transition-property: height, width;
      -ms-transition-property: height, width;
       -o-transition-property: height, width;
          transition-property: height, width;
}

.isotope .isotope-item {
  -webkit-transition-property: -webkit-transform, opacity;
     -moz-transition-property:    -moz-transform, opacity;
      -ms-transition-property:     -ms-transform, opacity;
       -o-transition-property:      -o-transform, opacity;
          transition-property:         transform, opacity;
}

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

## Code repository

This project lives on GitHub at [github.com/desandro/isotope](http://github.com/desandro/isotope). There you can grab the latest code and follow development.

## A word about moderation {: #moderation}

Isotope enables a wealth of functionality. But just because you can take advantage of its numerous features together, doesn't mean you necessarily should. For each each feature you implement with Isotope, consider the benefit gained by users, at the cost of another level of complexity to your interface.

## Acknowledgments

+ [**"Cowboy" Ben Alman**](http://benalman.com/) for [jQuery BBQ](http://benalman.com/projects/jquery-bbq-plugin/) (included with docs)
+ [**Louis-Rémi Babé**](http://twitter.com/Louis_Remi) for [jQuery smartresize](https://github.com/louisremi/jquery-smartresize) (used within Isotope) and for [jQuery transform](https://github.com/louisremi/jquery.transform.js) which clued me in to using jQuery 1.4.3's CSS hooks
+ [**Jacek Galanciak**](http://razorjack.net/) for [jQuery Quicksand](http://razorjack.net/quicksand/), an early kernel of inspiration
+ [**Ralph Holzmann**](http://twitter.com/#!/ralphholzmann) for re-writing the [jQuery Plugins/Authoring tutorial](http://docs.jquery.com/Plugins/Authoring) and opened my eyes to [Plugin Methods](http://docs.jquery.com/Plugins/Authoring#Plugin_Methods) pattern
+ [**Eric Hynds**](http://www.erichynds.com/) for his article [Using $.widget.bridge Outside of the Widget Factory](http://www.erichynds.com/jquery/using-jquery-ui-widget-factory-bridge/) which provided the architecture for Isotope
+ [**Paul Irish**](http://paul-irish.com) for [Infinite Scroll](http://infinite-scroll.com) (included with docs), the [imagesLoaded plugin](http://gist.github.com/268257) (included with Isotope), and  [Debounced resize() plugin](http://paulirish.com/demo/resize) (provided base for smartresize)
+ The [**jQuery UI Team**](http://jqueryui.com/about) for [$.widget.bridge](https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js#L113-155) (partially used within Isotope)
+ The Modernizr team for [Modernizr](http://www.modernizr.com/) (partially used within Isotope)
+ [**Juriy Zaytsev aka "kangax"**](http://perfectionkills.com) for [getStyleProperty](http://perfectionkills.com/feature-testing-css-properties/) (used within Isotope)

<script src="https://www.simplegoods.co/assets/embed.js"> </script>
