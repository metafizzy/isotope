deploy: 
	s3cmd sync _site/. s3://isotope.metafizzy.co
