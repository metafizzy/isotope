build:
	jekyll build

zip:
	rm -rf _site/isotope-v1-docs.zip
	cp -r _site isotope-v1-docs
	zip -rq _site/isotope-v1-docs.zip isotope-v1-docs/
	rm -rf isotope-v1-docs

deploy: 
	s3cmd sync _site/. s3://isotope.metafizzy.co/v1/

prod: build zip deploy
