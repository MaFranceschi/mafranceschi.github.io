// Karma configuration
// Generated on 2016-10-14

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'app/content/lib/jquery/dist/jquery.js',
      'app/content/lib/es5-shim/es5-shim.js',
      'app/content/lib/angular/angular.js',
      'app/content/lib/json3/lib/json3.js',
      'app/content/lib/ui-router/release/angular-ui-router.js',
      'app/content/lib/bootstrap/dist/js/bootstrap.js',
      'app/content/lib/angular-animate/angular-animate.js',
      'app/content/lib/angular-cookies/angular-cookies.js',
      'app/content/lib/angular-resource/angular-resource.js',
      'app/content/lib/angular-route/angular-route.js',
      'app/content/lib/angular-sanitize/angular-sanitize.js',
      'app/content/lib/angular-touch/angular-touch.js',
      'app/content/lib/ngDialog/js/ngDialog.js',
      'app/content/lib/peerjs/peer.js',
      'app/content/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/content/lib/angular-translate/angular-translate.js',
      'app/content/lib/angular-translate-loader-partial/angular-translate-loader-partial.js',
      'app/content/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'app/content/lib/angular-translate-loader-url/angular-translate-loader-url.js',
      'app/content/lib/crypto-js/index.js',
      'app/content/lib/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
