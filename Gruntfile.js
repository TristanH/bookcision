module.exports = function(grunt) {
  'use strict';
  // Load all npm packages defined in package.json that start with "grunt-"
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

  var path = require('path');
  var changeCase = require('change-case');
  var webpack = require('webpack');
  var lrSnippet = require('grunt-contrib-livereload/lib/utils')
    .livereloadSnippet;
  var LIVERELOAD_PORT = 9001;

  grunt.loadTasks('tasks');

  var folderMount = function folderMount(connect, point) {
    return connect.static(path.resolve(point));
  };

  // Read in package.json and layer on some grunt-specific properties
  var rollbar = grunt.file.readJSON('rollbar.json');

  var getBuiltFilesArray = function(type, dest) {
    var srcPattern = type === 'js' ? '**/*.js' : '**/*!(.js)';
    var destination = dest === 'latest' ? 'latest' : '<%= pkg.version %>';
    return [
      {
        expand: true,
        cwd: 'dest',
        filter: 'isFile',
        src: srcPattern,
        dest: destination + '/'
      }
    ];
  };

  grunt.initConfig({
    asciify: {
      options: {
        font: 'trek',
        log: true
      },
      banner: {
        get text() {
          return changeCase.upperCase(grunt.config.get('pkg.name'));
        }
      }
    },

    meta: {
      banner:
        '' +
          '/*!\n\n' +
          ' <%= asciify_banner %>' +
          ' * <%= pkg.title %> v<%= pkg.version %> - <%= pkg.tagline %>\n' +
          ' * <%= pkg.homepage %> \n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
          '<%= pkg.author %>\n' +
          ' * MIT Licensed\n' +
          ' */\n'
    },

    webpack: {
      options: {
        context: __dirname,

        entry: './src/index.js',

        target: 'web',

        stats: {
          // Configure the console output
          // colors: false,
          // modules: true,
          // reasons: true /*@TODO Before release, comb the debug.js file using this to make sure everything included is desired*/
        },

        module: {
          loaders: [
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.jade$/, loader: 'jade-loader' },
            { test: /\.handlebars$/, loader: 'handlebars-loader' }
            // { test: /\.png$/,                 loader: "url-loader?limit=10000&minetype=image/png" },
            // { test: /\.jpg$/,                 loader: "url-loader?limit=10000&minetype=image/jpg" },
            // { test: /\.gif$/,                 loader: "url-loader?limit=10000&minetype=image/gif" },
            // { test: /\.woff$/,                loader: "url-loader?limit=10000&minetype=application/font-woff" }
          ]
        },

        // Fail grunt task on webpacking error (https://github.com/webpack/webpack/issues/81)
        failOnError: true,

        resolve: {
          root: path.join(__dirname, 'src'),
          modulesDirectories: [
            'web_modules',
            'node_modules',
            'src/lib/handlebars-helpers'
          ],
          fallback: __dirname
        },

        options: {
          debug: false
        }
      },
      test: {
        entry: './test/index.js',
        target: 'node',
        plugins: [
          new webpack.DefinePlugin({
            DEBUG: false,
            TEST: true
          }),
          new webpack.ProvidePlugin({
            sinon: 'sinon',
            should: 'should',
            assert: 'assert'
          })
        ],
        output: {
          path: path.join(__dirname, 'dest'),
          filename: '<%= pkg.moduleName %>.test.js'
        },
        resolve: {
          alias: { 'lib/ui/css$': 'lib/stub' },
          extensions: ['', '.node', '.er.js', '.js', '.json']
        },
        module: {
          loaders: [
            { test: /sinon.js$/, loader: 'imports?define=>false' }
            // { test: /\.json$/,   loader: "json" }
          ]
          // ,postLoaders: [{
          //   test: /src\\.*\.js$/, // @TODO me thinks webpack needs a test that is path-friendly rather than a filename regex
          //   exclude: [
          //     "node_modules.chai",
          //     "node_modules.coverjs-loader",
          //     "node_modules.webpack.buildin"
          //   ],
          //   loader: "coverjs-loader"
          // }]
        }
      },
      debug: {
        devtool: 'source-map',
        options: { debug: true },
        plugins: [
          new webpack.DefinePlugin({
            DEBUG: true,
            TEST: false
          }),
          new webpack.BannerPlugin('<%= meta.banner %>', { raw: true }),
          new webpack.optimize.UglifyJsPlugin({
            // Gets passed through to UglifyJS, allows us to enable conditional compilation (and dead code removal for DEBUG-gated code)
            compressor: {
              drop_debugger: false,
              warnings: false,
              unused: false
            }, // @TODO turn warnings back on
            beautify: true,
            comments: 'all',
            mangle: false
          })
        ],
        output: {
          path: path.join(__dirname, 'dest'),
          filename: '<%= pkg.moduleName %>.debug.js'
        }
      },
      release: {
        options: { debug: false },
        devtool: 'source-map',
        /* @TODO profile: true, */
        plugins: [
          new webpack.DefinePlugin({
            DEBUG: false,
            TEST: false
          }),
          new webpack.BannerPlugin('<%= meta.banner %>', { raw: true }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin({
            // Gets passed through to UglifyJS, allows us to enable conditional compilation (and dead code removal for DEBUG-gated code)
            compressor: { warnings: false } // @TODO turn warnings back on
          })
        ],
        output: {
          path: path.join(__dirname, 'dest'),
          filename: '<%= pkg.moduleName %>.js'
        }
      }
    },

    jade: {
      options: {
        pretty: true, // Don't bother compressing the release html. This Grunt task doesn't handle any of the internal jade templates, which we do compress. webpack's jade-loader takes care of those.
        data: {
          get pkg() {
            return grunt.config.get('pkg');
          }
        }
      },
      'bookmarklet-debug': {
        options: {
          data: {
            get pkg() {
              return grunt.config.get('pkg');
            },
            debug: true
          }
        },
        files: {
          'dest/bookmarklet.debug.html': ['src/bookmarklet.jade'],
          'dest/test.html': ['test/test.jade']
        }
      },
      'bookmarklet-release': {
        files: {
          'dest/bookmarklet.html': ['src/bookmarklet.jade']
        }
      }
    },

    uglify: {
      options: {
        compress: { dead_code: true }
      },
      'bookmarklet-debug': {
        options: {
          compress: { global_defs: { DEBUG: true } }, // enables condition code compilation
          beautify: true,
          comments: 'all',
          mangle: false
        },
        files: {
          'dest/bookmarklet.debug.js': ['src/bookmarklet.js']
        }
      },
      'bookmarklet-release': {
        options: {
          compress: { global_defs: { DEBUG: false } },
          comments: 'some'
        },
        files: {
          'dest/bookmarklet.js': ['src/bookmarklet.js'],
        }
      }
    },

    simplemocha: {
      options: {
        reporter: 'spec',
        globals: ['should']
      },

      all: {
        src: path.join(__dirname, 'dest', '<%= pkg.moduleName %>.test.js')
      }
    },


    copy: {
      zeroclipboard: {
        src: 'node_modules/zeroclipboard/ZeroClipboard.swf',
        dest: 'dest/ZeroClipboard.swf'
      }
    },

    // 'rollbar-sourcemap-download': {
    //   options: {
    //     access_token: rollbar.server_access_token,
    //     version: '<%= pkg.version %>'
    //   },
    //   version:
    //     '',
    //   latest:
    //     '',
    // },

    // livereload server
    connect: {
      livereload: {
        options: {
          port: LIVERELOAD_PORT,
          middleware: function(connect, options) {
            return [lrSnippet, folderMount(connect, '.')];
          }
        }
      }
    },

    // livereload requires regarde (vs. grunt-contrib-watch)
    regarde: {
      // Watch for changes in the source and rebuild the final packages
      build: {
        files: ['src/**/*', 'test/**/*', 'build/**/*'],
        tasks: ['build']
      },
      // Watch for changes to the final packages and deploy them to the browser (if livereload is running)
      reload: {
        files: 'dest/**/*',
        tasks: ['livereload']
      }
    },

    open: {
      dev: {
        path: 'http://localhost:' + LIVERELOAD_PORT + '/dest/test.html'
      }
    },

    clean: {
      all: ['dest', 'build']
    }
  }); // end initConfig()

  grunt.registerTask('readPackageJSON', function() {
    var pkg = grunt.file.readJSON('package.json');
    pkg.title = changeCase.titleCase(pkg.name);
    pkg.moduleName = changeCase.camelCase(pkg.name);

    grunt.config.set('pkg', pkg);
  });
  grunt.task.run('readPackageJSON');

  grunt.registerTask('test', ['webpack:test', 'simplemocha']);

  grunt.registerTask('watch', ['regarde']);
  grunt.registerTask('generate-banner', ['asciify']);
  grunt.registerTask('lr', [
    'build',
    'livereload-start',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', ['test']);
};
