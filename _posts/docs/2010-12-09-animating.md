---

title: Animating
category: docs
layout: default
toc:
  - { title: animationEngine option, anchor: animationengine_option }
  - { title: CSS transitions, anchor: css_transitions }
  - { title: Variations, anchor: variations }

---

Isotope was developed to take advantage of the best browser features available. For animations, you can use CSS3 transitions and transforms in capable browsers. Isotope provides Javascript animation fall back for lesser browsers.


## animationEngine option

You can control how Isotope handles animation with the [`animationEngine`](options.html#animationengine) option. This option has three values which control whether jQuery applies styles with`.css()` or `.animate()`.

+ `'best-available'`: if browser supports CSS transitions, Isotope uses `.css()`. If not, falls back to using `.animate()`.
+ `'css'`: Isotope uses `.css()`
+ `'jquery'`: Isotope uses `.animate()`

## CSS transitions

To enable animation with CSS transitions, you'll need the following code in your CSS:

{% highlight css %}

.isotope,
.isotope .isotope-item {
  /* change duration value to whatever you like */
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

## Variations

With these two options you can finely control how animation is handled across browsers.

### Best available (recommended)

Browsers that support CSS transitions will use them. Other browsers will fall back to using jQuery animation.

+ **Add** CSS transition declarations

### Always use jQuery

All browsers will use jQuery animation, regardless of their CSS transition support.

+ `animationEngine : 'jquery'`
+ **No** CSS transition declarations

Never set `animationEngine : 'jquery'` AND add CSS transition declarations. This will cause double-animation in browser that support CSS transitions &mdash; which is a bad thing.

### Only CSS transitions

+ `animationEngine: 'css'`
+ **Add** CSS transition declarations

### None

Animation is not enabled in any browser

+ `animationEngine : 'css'`
+ **No** CSS transition declarations

