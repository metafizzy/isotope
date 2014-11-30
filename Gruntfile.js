/*jshint node: true, strict: false */

// -------------------------- grunt -------------------------- //

module.exports = function( grunt ) {

  var banner = ( function() {
    var src = grunt.file.read('js/isotope.js');
    var re = new RegExp('^\\s*(?:\\/\\*[\\s\\S]*?\\*\\/)\\s*');
    var matches = src.match( re );
    var banner = matches[0].replace( 'Isotope', 'Isotope PACKAGED' );
    return banner;
  })();

  grunt.initConfig({
    // ----- global settings ----- //
    namespace: 'isotope',
    dataDir: 'tasks/data',

    // ----- tasks settings ----- //

    jshint: {
      docs: [ 'js/**/*.js'  ],
      options: grunt.file.readJSON('.jshintrc')
    },

    requirejs: {
      pkgd: {
        options: {
          baseUrl: 'bower_components',
          include: [
            'jquery-bridget/jquery.bridget',
            'isotope/js/isotope'
          ],
          out: 'dist/isotope.pkgd.js',
          optimize: 'none',
          paths: {
            isotope: '../',
            jquery: 'empty:'
          },
          wrap: {
            start: banner
          }
        }
      }
    },

    uglify: {
      pkgd: {
        files: {
          'dist/isotope.pkgd.min.js': [ 'dist/isotope.pkgd.js' ]
        },
        options: {
          banner: banner
        }
      }
    },

    exec: {
      'meteor-init': {
        command: [
          // Make sure Meteor is installed, per https://meteor.com/install.
          // The curl'ed script is safe; takes 2 minutes to read source & check.
          'type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }',
          // Meteor expects package.js to be in the root directory of
          // the checkout, so copy it there temporarily
          'cp meteor/package.js .'
        ].join(';')
      },
      'meteor-cleanup': {
        // remove build files and package.js
        command: 'rm -rf .build.* versions.json package.js'
      },
      'meteor-test': {
        command: 'spacejam --mongo-url mongodb:// test-packages ./'
      },
      'meteor-publish': {
        command: 'meteor publish'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask( 'pkgd-edit', function() {
    var outFile = grunt.config.get('requirejs.pkgd.options.out');
    var contents = grunt.file.read( outFile );
    // get requireJS definition code
    var definitionRE = /define\(\s*'isotope\/js\/isotope'(.|\n)+isotopeDefinition\s*\)/;
    var definition = contents.match( definitionRE )[0];
    // remove name module
    var fixDefinition = definition.replace( "'isotope/js/isotope',", '' )
      // ./item -> isotope/js/item
      .replace( /'.\//g, "'isotope/js/" );
    contents = contents.replace( definition, fixDefinition );
    grunt.file.write( outFile, contents );
    grunt.log.writeln( 'Edited ' + outFile );
  });

  // Meteor tasks
  grunt.registerTask('meteor-test', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor-publish', ['exec:meteor-init', 'exec:meteor-publish', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-publish', 'exec:meteor-cleanup']);
  
  grunt.registerTask( 'default', [
    'jshint',
    'requirejs',
    'pkgd-edit',
    'uglify'
  ]);

};
