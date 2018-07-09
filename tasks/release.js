module.exports = function(grunt) {
  grunt.registerTask('release', 'Publish to Azure and release', function(
    version
  ) {
    var versionToNotRelease = 'prerelease';
    if (arguments.length === 0) {
      // Keep this text in sync with README.md
      grunt.log.writeln(
        "Specify '" +
          versionToNotRelease +
          "' to commit the change and publish to Azure but not release live. Specify 'major' 'minor' or 'patch' to perform those steps and additionally release live."
      );
    } else {
      grunt.task.run(
        'generate-banner',
        'clean',
        'build:src:test',
        'readPackageJSON',
        'build:src:debug',
        'build:src:release',
        'build:bookmarklet'
      );

      // if (version === versionToNotRelease)
      //   grunt.task.run(
      //     'azureblob:upload-this-version-js',
      //     'azureblob:upload-this-version-non-js',
      //     'rollbar-sourcemap-download:version'
      //   );
      // else grunt.task.run('azureblob', 'rollbar-sourcemap-download');
    }
  });
};
