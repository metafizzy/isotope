#!/bin/bash

# minifies jquery.isotope.js
# requires nodejs & uglify-js

IN=jquery.isotope.js
OUT=jquery.isotope.min.js

uglifyjs $IN --compress conditionals=true --mangle --comments --output $OUT
