#!/bin/bash

# minifies jquery.isotope.js
# requires nodejs & uglifyjs

IN=jquery.isotope.js
OUT=jquery.isotope.min.js

# remove any lines that begin with /*jshint or /*global
# then, minify with Uglify JS
# then, add newline characters after `*/`, but not last newline character
awk '!/^\/\*[jshint|global]/' $IN \
  | uglifyjs \
  | awk '{ORS=""; gsub(/\*\//,"*/\n"); if (NR!=1) print "\n"; print;}' > $OUT
echo "Minified" $IN "as" $OUT
