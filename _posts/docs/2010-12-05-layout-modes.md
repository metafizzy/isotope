---

title: Layout modes
category: docs
layout: default
body_class: option-def
toc:
  - { title: Horizontal layouts, anchor: horizontal_layouts }
  - { title: cellsByColumn, anchor: cellsbycolumn }
  - { title: cellsByRow, anchor: cellsbyrow }
  - { title: fitColumns, anchor: fitcolumns }
  - { title: fitRows, anchor: fitrows }
  - { title: masonry, anchor: masonry }
  - { title: masonryHorizontal, anchor: masonryhorizontal }
  - { title: straightAcross, anchor: straightacross }
  - { title: straightDown, anchor: straightdown }
  - { title: Modified layout modes, anchor: modified_layout_modes }

---

Isotope has a versatile layout engine that can accommodate multiple layout modes. You can set and change the layout mode via the `layoutMode` option.

[**See Demo: Layout modes**](../demos/layout-modes.html)

### Example

{% highlight javascript %}

$('#container').isotope({ layoutMode : 'fitRows' });

{% endhighlight %}

Several layout modes are built into Isotope.

### Horizontal layouts

Horizontal layout modes (masonryHorizontal, fitColumns, cellsByColumn, and straightAcross) need a container that has a height value. Be sure that your CSS has height set.

{% highlight css %}

#container {
  /* either of these will work for horizontal Isotope layouts */
  height: 80%;
  height: 480px;
}

{% endhighlight %}

## cellsByColumn

A **horizontal** grid layout where items are centered inside each cell. The grid is defined by two options, `columnWidth` and `rowHeight`. The horizontal equivalent of cellsByRow.

### Options {#cellsByColumn-options}

<dl class="clearfix">
  <dt><code>columnWidth</code></dt>
  <dd class="option-type">Integer</dd>
</dl>
<dl class="clearfix">
  <dt><code>rowHeight</code></dt>
  <dd class="option-type">Integer</dd>
</dl>

### Example {#cellsByColumn-example}

{% highlight javascript %}

$('#container').isotope({
  layoutMode: 'cellsByColumn',
  cellsByColumn: {
    columnWidth: 240,
    rowHeight: 360
  }
});

{% endhighlight %}


## cellsByRow

A **vertical** grid layout where items are centered inside each cell. The grid is defined by two options, `columnWidth` and `rowHeight`.

### Options {#cellsByRow-options}

<dl class="clearfix">
  <dt><code>columnWidth</code></dt>
  <dd class="option-type">Integer</dd>
</dl>
<dl class="clearfix">
  <dt><code>rowHeight</code></dt>
  <dd class="option-type">Integer</dd>
</dl>

### Example {#cellsByRow-example}

{% highlight javascript %}

$('#container').isotope({
  layoutMode: 'cellsByRow',
  cellsByRow: {
    columnWidth: 240,
    rowHeight: 360
  }
});

{% endhighlight %}

## fitColumns

Item elements are arranged into columns. Columns progress **horizontally** from left to right. Items within those columns are arranged top-to-bottom. The horizontal equivalent of fitRows. 

## fitRows

Item elements are arranged into rows. Rows progress **vertically** top to bottom. Similar to what you would expect from a layout that uses `float: left`.

## masonry

Masonry is the default layout mode for Isotope. Item elements are arranged intelligently within a **vertical** grid. For each item element, the script calculates the next best fit for the item within the grid.

### Options {#masonry-options}

<dl class="clearfix">
  <dt><code>columnWidth</code></dt>
  <dd class="option-type">Integer</dd>
</dl>

The width of one column in the grid. If no value is set for `columnWidth`, default is the width of the first item element.

### Example {#masonry-example}

{% highlight javascript %}

$('#container').isotope({
  masonry: {
    columnWidth: 240
  }
});

{% endhighlight %}


## masonryHorizontal

The **horizontal** equivalent of masonry layout. Instead of progressing top-to-bottom, masonryHorizontal layout will progress left-to-right. Item elements are arranged intelligently within a grid. For each item element, the script calculates the next best fit for the item within the grid.

### Options {#masonryHorizontal-options}

<dl class="clearfix">
  <dt><code>rowHeight</code></dt>
  <dd class="option-type">Integer</dd>
</dl>

The width of one column in the grid. If no value is set for `rowHeight`, default is the height of the first item element.

### Example {#masonryHorizontal-example}

{% highlight javascript %}

$('#container').isotope({
  masonryHorizontal: {
    rowHeight: 360
  }
});

{% endhighlight %}

## straightAcross

Item elements are arranged **horizontally** left to right. Useful for simple lists.

## straightDown

Item elements are arranged **vertically** top to bottom. Useful for simple lists.

## Modified layout modes

[Isotope's methods can be extended and overwritten](extending-isotope.html) to shim-in additional functionality. See these modified layout modes:

+ [**Centered masonry**](../custom-layout-modes/centered-masonry.html)
+ [**Masonry corner stamp**](../custom-layout-modes/masonry-corner-stamp.html)
+ [**Masonry gutters**](../custom-layout-modes/masonry-gutters.html)

To use these mods, copy the revised methods found in the demos' page source. They look like:

{% highlight javascript %}

$.Isotope.prototype._masonryReset = function() {
  // modified code..
};

{% endhighlight %}
