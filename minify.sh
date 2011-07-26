#!/bin/bash

# minifies jquery.isotope.js
# requires nodejs & uglifyjs

JS=jquery.isotope.js
JS_MIN=jquery.isotope.min.js
TMP=$JS_MIN.tmp

uglifyjs $JS > $TMP
echo ';' >> $TMP
sed 's/\*\//&§/g; y/§/\n/;' $TMP > $JS_MIN
rm $TMP
echo "Minified" $JS "as" $JS_MIN
