Isotope
========

**An exquisite jQuery plugin for magical layouts. Enables filtering, sorting, and dynamic layouts.**

This package has all the documentation and demos to get you started.

View this project live at [http://isotope.metafizzy.co](http://isotope.metafizzy.co).

## Licensing

**Commercial use requires purchase of one-time license fee per developer seat.** Commercial use  includes any application that makes you money. This includes portfolio sites and premium templates. Commercial licenses may be purchased at [http://metafizzy.co#licenses](http://metafizzy.co#licenses).

Use in non-commercial and personal applications is free.

## Viewing this project locally

### Via download

You can download a zip of all the flat HTML files from [http://meta.metafizzy.co/files/isotope-site.zip](http://meta.metafizzy.co/files/isotope-site.zip).

### Via Jekyll

The documentation and demo pages are generated using [Jekyll](http://github.com/mojombo/jekyll/wiki). With Jekyll installed, you can clone this repo and run Jekyll from Terminal:

``` bash
git clone https://github.com/desandro/isotope.git
cd isotope/
jekyll --server --auto
```

Then view the live site at [http://localhost:4000](http://localhost:4000).

## Including Isotope as a submodule

The _module_ branch has just `jquery.isotope.js` and `jquery.isotope.min.js`, perfect for adding to your repo as a [submodule](http://dropshado.ws/post/20058825150/git-submodules).

``` bash
git submodule add https://github.com/desandro/isotope.git
cd isotope/
git checkout module
git pull origin module
cd ../
git submodule update --init
```

Then you can reference `isotope/jquery.isotope.min.js` within your own project.

To pull in the lastest version of the isotope submodule:

``` bash
cd isotope/
git pull origin module
```

## Changelog

View the [commit history](https://github.com/desandro/isotope/commits/master/jquery.isotope.js) for a complete robust list of changes to the script.

+ **v1.5**
  [2011-10-19](https://github.com/desandro/isotope/commit/2c789ecb5ec#jquery.isotope.js)
  - add proper callback support that trigger after animation/transition
+ **v1.4** [2011-06-29](https://github.com/desandro/isotope/commit/8e2f51612eaf20e3031b81b8c5ff5e322cbb7b4f#jquery.isotope.js)
  - shuffle method added
  - inserting and appending positions items then reveals them
+ **v1.3** [2011-05-23](https://github.com/desandro/isotope/commit/a7cc0be2a0038c13a2955a889a873f63a39eb6c2#jquery.isotope.js)
  - refactor layout mode API
  - layoutModeResize -> layoutModeResizeChanged, which returns boolean
+ **v1.2** [2011-05-13](https://github.com/desandro/isotope/commit/b3cf6139d7641f282724a7a541b3bfb10d1bbf54#jquery.isotope.js)
  - add updateOption method, for changing options after initialization
+ **v1.1** [2011-04-26](https://github.com/desandro/isotope/commit/3c551406ee1e4cd8345cdbe589c2d8d1e164b259#jquery.isotope.js)
  - incremental additions, bug fixes, and refactorings
+ **v1.0** [2011-02-07](https://github.com/desandro/isotope/commit/78253dfb34808d9a677ae721e97c5afc08aa19b8#jquery.isotope.js)
  - public release

* * *

Copyright (c) 2011-2012 David DeSandro / Metafizzy LLC
