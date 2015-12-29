module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      jsfile: {
        src: 'src/calendar.js',
        dest: 'dist/calendar.js',
      },
      cssfile: {
        src: 'src/calendar.css',
        dest: 'dist/calendar.css',
      },
    },
    uglify: {
      target: {
        files: {
          'dist/calendar.min.js': ['src/calendar.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'dist/calendar.min.css': ['src/calendar.css']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['copy', 'uglify', 'cssmin', 'jshint']);

};