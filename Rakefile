# automates minifying jquery.isotope.js
# from command line run:
#     rake min COMPILER='path/to/compiler.jar'
file compiler = ENV["COMPILER"] || '~/resources/google-closure/compiler.jar'
js = 'jquery.isotope.js'
min_js = 'jquery.isotope.min.js'

desc "Generates #{min_js}"
task :min => min_js

file min_js => compiler do
  puts "Minifying jquery.isotope.js..."
  sh "java -jar #{compiler} --js #{js} --js_output_file #{min_js}"
  # Adds header comment
  min = File.read( min_js )
  File.open( min_js, 'w') do |f|
    f.write File.readlines( js )[0..5].join()
    f.write min
  end
end

