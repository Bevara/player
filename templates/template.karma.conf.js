process.env.CHROME_BIN = require('puppeteer').executablePath();

const version = require("./version.js").version;

module.exports = function (config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    files: [{ pattern: '@CMAKE_BINARY_DIR@/dist/universal-tags_'+version+'.js', watched: false, included: true },
    { pattern: '@CMAKE_BINARY_DIR@/dist/*.wasm', watched: false, included: false, served: true, nocache: false },
    { pattern: '@CMAKE_BINARY_DIR@/dist/*.js', watched: false, included: false, served: true, nocache: false },
      'test-player/**/*.js'],
    reporters: ['dots', 'junit'],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      'ChromeHeadless': {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
    reporters: ['progress', 'nunit'],
    nunitReporter: {
      outputFile: 'test-results.xml',
      suite: ''
    },
    browserNoActivityTimeout: 3000000,
    browserDisconnectTimeout: 3000000
  });
};