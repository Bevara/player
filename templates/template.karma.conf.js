process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    files: [{ pattern: '@CMAKE_BINARY_DIR@/dist/universal-img.js', watched: false, included: true },
    { pattern: '@CMAKE_BINARY_DIR@/dist/*.wasm', watched: false, included: false, served: true, nocache: false },
      'test/**/*.js'],
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
    browserNoActivityTimeout: 600000
  });
};