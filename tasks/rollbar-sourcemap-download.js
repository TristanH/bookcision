var util = require('util');
var async = require('async');

module.exports = function(grunt) {
  grunt.registerMultiTask(
    'rollbar-sourcemap-download',
    'Queue up a source map download with Rollbar',
    function() {
      var options = this.options({
        endpoint: 'https://api.rollbar.com/api/1/sourcemap/download'
      });

      if (!'access_token' in options)
        grunt.fail("Must specify 'access_token' in task options.");
      if (!'version' in options)
        grunt.fail("Must specify 'version' in task options.");

      function rollbarDeploy(minifiedUrl, callback) {
        var Multipost = require('multipost');

        var postFields = [
          {
            name: 'access_token',
            value: options.access_token
          },
          {
            name: 'version',
            value: options.version
          },
          {
            name: 'minified_url',
            value: minifiedUrl
          }
        ];

        grunt.verbose.writeln(
          util.format('Posting %j to %s.', postFields, options.endpoint)
        );

        var req = new Multipost(options.endpoint, postFields);

        req.post(function(res) {
          if (res.statusCode !== 200) {
            grunt.log.error('Response: %s', res.data);
            grunt.fail.warn('Failed to POST to Rollbar API.');
          } else {
            grunt.verbose.writeln('Response: %s', res.data);
            grunt.log
              .write(util.format('\tQueued download for %s ', minifiedUrl))
              .ok();
          }

          callback();
        });
      }

      var done = this.async();

      if (util.isArray(this.data)) async.each(this.data, rollbarDeploy, done);
      else rollbarDeploy(this.data, done);
    }
  );
};
