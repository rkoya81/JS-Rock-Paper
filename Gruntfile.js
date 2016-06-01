module.exports = function(grunt) {
var LIVERELOAD_PORT = 35729;
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'src/css/main.css': 'src/sass/main.scss'
        }
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: ['src/**/*.js'],
        dest: 'prod/js/main.min.js'
      },
      css: {
        src: 'src/css/*.css',
        dest: 'prod/css/main.min.css'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= concat.js.dest %>': ['<%= concat.js.dest %>']
        }
      }
    },

    qunit: {
      files: ['tests/**/*.html']
    },

    jshint: {
      files: ['Gruntfile.js', 'src/**/main.js', 'tests/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },

    csslint: {
      strict: {
        options: {
          csslintrc: '.csslintrc',
          import: 2,
          formatters: ['compact']
        },
        src: [
          'src/**/main.css'
        ]
      }
    },

    watch: {
      files: ['<%= jshint.files %>', 'src/index.html'],
      tasks: ['jshint', 'sass', 'csslint', 'concat:css','qunit'],
      options: { livereload: LIVERELOAD_PORT },
      sass: {
        files: 'src/sass/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['jshint', 'csslint', 'concat', 'uglify', 'connect', 'watch']);
};