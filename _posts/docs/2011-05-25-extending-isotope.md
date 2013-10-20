---

title: Extending Isotope
category: docs
layout: default
toc:
  - { title: Custom layout modes, anchor: custom_layout_modes }

---

Isotope uses a constructor pattern, `$.Isotope`. To extend Isotope, you need only to add a method to `$.Isotope.prototype`.

{% highlight javascript %}

$.Isotope.prototype.myMethod = function() { ... };

// or, using jQuery extend utility
$.extend( $.Isotope.prototype, {
  myMethod : function() { ... }
});

{% endhighlight %}

Before diving in, try [looking over the source](../jquery.isotope.js) to get a better understand of the internal logic behind Isotope.

## Custom layout modes

Isotope's layout modes are built around four methods: `Reset`, `Layout`, `GetContainerSize`, and `ResizeChanged`. These methods are the hooks that allow you to develop your own custom layout mode, without getting your hands dirty dealing with sorting, filtering, or other functionality. These layout mode methods need to be prefixed with an underscore and the name of the layout mode.

{% highlight javascript %}

// adding layout mode methods for 'customMode'
$.extend( $.Isotope.prototype, {
  _customModeReset : function() { ... },
  _customModeLayout : function( $elems ) { ... },
  _customModeGetContainerSize : function() { ... },
  _customModeResizeChanged : function() { ... }
});

{% endhighlight %}

[**See Custom layout mode: Category Rows**](../custom-layout-modes/category-rows.html)
[**See Custom layout mode: Spine align**](../custom-layout-modes/spine-align.html)

All of the [default layout modes](../docs/layout-modes.html) follow this pattern. We'll look at the code behind the _fitRows_ layout mode.

### Reset

Each layout mode should have its own set of properties that only it can use and not be affected by other layout modes. These properties can be accessed in the instance as an object whose value matches the layout mode name (i.e. `this.fitRows` for _fitRows_).

The `Reset` layout mode method is called with every `reLayout`, where Isotope will go through each item element and position it. This method resets layout mode properties.

The _fitRows_ layout mode keeps track of x and y position, as well as the height of the container. These properties are set back to zero in `Reset`.

{% highlight javascript %}

_fitRowsReset : function() {
  this.fitRows = {
    x : 0,
    y : 0,
    height : 0
  };
},

{% endhighlight %}

### Layout

The `Layout` layout mode method is where items are positioned. Most of your layout logic happens here. This method provides one argument `$elems` -- a jQuery object with the item elements that need to be positioned.

`$elems.each` is the principle loop, iterating over each item element and positioning it. Items are positioned with the `_pushPosition` method (see below). The layout modes properties are 

For _fitRows_, items are placed with the `this.fitRows.x` and `this.fitRows.y` values. This position is determined by if the item can fit in the current row, or if a new row needs to be started.

{% highlight javascript %}

_fitRowsLayout : function( $elems ) {
  var instance = this,
      containerWidth = this.element.width(),
      props = this.fitRows;
  
  $elems.each( function() {
    var $this = $(this),
        atomW = $this.outerWidth(true),
        atomH = $this.outerHeight(true);
  
    if ( props.x !== 0 && atomW + props.x > containerWidth ) {
      // if this element cannot fit in the current row
      props.x = 0;
      props.y = props.height;
    } 
  
    // position the atom
    instance._pushPosition( $this, props.x, props.y );

    props.height = Math.max( props.y + atomH, props.height );
    props.x += atomW;

  });
},

{% endhighlight %}

### GetContainerSize

After the script goes through positioning each item, it needs to resize the container. `GetContainerSize` returns the style for the size of the container.

In _fitRows_, the height property is returned as the value for height.

{% highlight javascript %}

_fitRowsGetContainerSize : function () {
  return { height : this.fitRows.height };
},

{% endhighlight %}

### ResizeChanged

`ResizeChanged` is triggered whenever the browser window is resized. Before Isotope adjusts the layout, this method is triggered to determine if the layout has actually changed. The methods return a boolean.

{% highlight javascript %}

_fitRowsResizeChanged : function() {
  return true;
},

{% endhighlight %}

### Helper methods

The `_pushPosition` method is used within a layout mode's `Layout` method. It takes 3 arguments: the item element currently being positioned, the x position, and the y position.

{% highlight javascript %}

_pushPosition( $item, x, y )

{% endhighlight %}

`_getSegments` is used within the layout mode's `Reset` method. It performs several utilities:

+ Determines the `columnWidth` for the layout mode (`rowHeight` for horizontal layout modes). This is either passed in as an option (i.e. `masonry { columnWidth: 90 }`), or the width of the first item element. This property is then set for the layout mode, i.e. `this.masonry.columnWidth`.
+ Calculates the number of number of columns (or rows, if horizontal) given the size of the container. This property is then set for the layout mode, i.e. `this.masonry.cols`.

{% highlight javascript %}

_getSegments( isHorizontal )

// for example
_cellsByRowReset : function() {
  this.cellsByRow = {
    index : 0
  };
  // get this.cellsByRow.columnWidth
  this._getSegments();
  // get this.cellsByRow.rowHeight
  this._getSegments(true);
},

{% endhighlight %}

Similarly, `_checkIfSegmentsChanged` is used within `ResizeChanged`. It returns a boolean indicating whether or not the number of columns or rows has changed since the window has been resized.

{% highlight javascript %}

_checkIfSegmentsChanged( isHorizontal )

// for example
_masonryResizeChanged : function() {
  return this._checkIfSegmentsChanged();
},

{% endhighlight %}

