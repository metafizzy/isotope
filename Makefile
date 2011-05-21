JS_ENGINE ?= `which node nodejs`
JS = jquery.isotope.js
JS_MIN = jquery.isotope.min.js
SITE = isotope-site

# minifies jquery.isotope.js
# requires NodeJS and global uglify-js
min: ${ISO}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying" ${JS}; \
		uglifyjs ${JS} > ${JS_MIN}.tmp; \
		echo ';' >> ${JS_MIN}.tmp; \
		sed 's/\*\//&§/g; y/§/\n/;' ${JS_MIN}.tmp > ${JS_MIN}; \
		rm ${JS_MIN}.tmp; \
	else \
		echo "NodeJS required for minification."; \
	fi

# creates zip file of site
zip: _site
	mkdir ${SITE}
	cp -r _site/ ${SITE}
	zip -r ~/Desktop/${SITE}.zip ${SITE}/
	rm -rf ${SITE}