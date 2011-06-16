---

title: Hash history with jQuery BBQ
category: docs
layout: default
toc:
  - { title: Markup, anchor: markup }
  - { title: jQuery script, anchor: jquery_script }

---

As cool as Isotope is, the only thing that could make it even cooler would be adding bookmark-able URL hashes. Ben Alman's [jQuery BBQ](http://benalman.com/projects/jquery-bbq-plugin/) allows us to do just that.

> jQuery BBQ leverages the HTML5 hashchange event to allow simple, yet powerful bookmarkable #hash history.

[**See Demo: Hash history**](../demos/hash-history.html)

BBQ is a marvelous plugin that provides for a lot more functionality. The [hash history demo](../demos/hash-history.html) uses multiple options (`sortBy`, `sortAscending`, and `layoutMode` in addition to `filter`), the ability to use back-button history, and properly highlights selected links.

Given BBQ's tremendous capabilities, the code can grow to be a bit complex. Be sure to read through [BBQ's docs](http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html) and take look at [its examples](http://benalman.com/code/projects/jquery-bbq/examples/) before you dive in and code up your own solution.

## Markup

Instead of setting the option values and keys with `data` attributes, we can add the option in the `href` for each link.

{% highlight html %}

<ul class="option-set">
  <li><a href="#filter=*" class="selected">show all</a></li>
  <li><a href="#filter=.metal">metal</a></li>
  <li><a href="#filter=.transition">transition</a></li>
  <li><a href="#filter=.alkali%2C+.alkaline-earth">alkali and alkaline-earth</a></li>
  <li><a href="#filter=%3Anot(.transition)">not transition</a></li>
  <li><a href="#filter=.metal%3Anot(.transition)">metal but not transition</a></li>
</ul>

{% endhighlight %}

The `href` value is a serialized string, suitable for a URL. These values can be created with [jQuery.param()](http://api.jquery.com/jQuery.param/).

{% highlight javascript %}

$.param({ filter: '.metal' })
// >> "filter=.metal"
$.param({ filter: '.alkali, alkaline-earth' })
// >> "filter=.alkali%2C+alkaline-earth"
$.param({ filter: ':not(.transition)' })
// >> "#filter=%3Anot(.transition)"

{% endhighlight %}

## jQuery script

These serialized `href` values can be converted into their proper jQuery object form when clicked using  [jQuery.deparam()](http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html#jQuery.deparam) from jQuery BBQ.

{% highlight javascript %}

$('.option-set a').click(function(){
      // get href attr, remove leading #
  var href = $(this).attr('href').replace( /^#/, '' ),
      // convert href into object
      // i.e. 'filter=.inner-transition' -> { filter: '.inner-transition' }
      option = $.deparam( href, true );
  // set hash, triggers hashchange on window
  $.bbq.pushState( option );
  return false;
});

{% endhighlight %}

Calling [$.bbq.pushState()](http://benalman.com/code/projects/jquery-bbq/docs/files/jquery-ba-bbq-js.html#jQuery.bbq.pushState) will trigger the `hashchange` event. At that point, we can parse the hash from the URL and use it to trigger the proper change in the Isotope instance.

{% highlight javascript %}

$(window).bind( 'hashchange', function( event ){
  // get options object from hash
  var hashOptions = $.deparam.fragment();
  // apply options from hash
  $container.isotope( hashOptions );
})
  // trigger hashchange to capture any hash data on init
  .trigger('hashchange');

{% endhighlight %}

Now any filter buttons that are clicked will update the URL hash, so these options can be bookmarked.
