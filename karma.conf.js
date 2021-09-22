process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    config.set({
      singleRun: true,
      frameworks: ['mocha', 'chai'],
      files: ['test/**/*.js'],
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
      junitReporter: {
        outputFile: 'test-results.xml'
      },
    })
  }