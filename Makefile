JS_ENGINE ?= `which node nodejs`
ISO = jquery.isotope.js
ISO_MIN = jquery.isotope.min.js

# minifies jquery.isotope.js
# requires NodeJS and global uglify-js
min: ${ISO}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying" ${ISO}; \
		uglifyjs ${ISO} > ${ISO_MIN}.tmp; \
		echo ';' >> ${ISO_MIN}.tmp; \
		sed 's/\*\//&§/; y/§/\n/;' ${ISO_MIN}.tmp > ${ISO_MIN}; \
		rm ${ISO_MIN}.tmp; \
	else \
		echo "NodeJS required for minification."; \
	fi

# creates zip file of site
zip: _site
	mkdir isotope-site
	cp -r _site/ isotope-site
	zip -r ~/Desktop/isotope-site.zip isotope-site/
	rm -rf isotope-site