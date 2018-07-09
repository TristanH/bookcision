module.exports = function(grunt) {
  grunt.registerTask('build', 'Build code and test it.', function(
    subset,
    subset2
  ) {
    if (arguments.length === 0) {
      grunt.task.run('generate-banner', 'build:bookmarklet', 'build:src');
    } else if (subset === 'bookmarklet') {
      if (subset2 === 'debug')
        grunt.task.run('jade:bookmarklet-debug', 'uglify:bookmarklet-debug');
      else grunt.task.run('jade', 'uglify');
    } else if (subset === 'src') {
      grunt.task.requires('generate-banner');
      // grunt.task.run('jshint');

      if (subset2 === 'debug') grunt.task.run('webpack:debug');
      else if (subset2 === 'test')
        grunt.task.run('webpack:test', 'simplemocha');
      else if (subset2 === 'release') grunt.task.run('webpack:release');
      else grunt.task.run('webpack', 'simplemocha');

      if (subset2 !== 'test') grunt.task.run('copy:zeroclipboard');
    }
  });
};
