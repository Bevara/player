/* A CI image can provide its own Chrome, which is what the filters-builder
 * agent does (CHROME_BIN=/usr/bin/chromium, PUPPETEER_SKIP_DOWNLOAD=1):
 * puppeteer is then installed without downloading a browser, and this must not
 * ask it for a path it never fetched. With no CHROME_BIN set, nothing changes. */
process.env.CHROME_BIN = process.env.CHROME_BIN || require('puppeteer').executablePath();

const version = require("./version.js").version;

module.exports = function (config) {
  config.set({
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    files: [{ pattern: '@CMAKE_BINARY_DIR@/dist/universal-tags_'+version+'.js', watched: false, included: true },
    { pattern: '@CMAKE_BINARY_DIR@/dist/*.wasm', watched: false, included: false, served: true, nocache: false },
    { pattern: '@CMAKE_BINARY_DIR@/dist/*.js', watched: false, included: false, served: true, nocache: false },
      'test-player/**/*.js'],
    reporters: ['progress', 'junit'],
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
          /* A Kubernetes pod gets 64 MB of /dev/shm by default, and Chromium
           * passes response bodies from the network service to the renderer
           * through Mojo data pipes backed by shared memory. Fetches of a few
           * hundred KB then fail while small ones succeed - which is how the
           * three largest test signals (MJPEG 323 KB, UTVIDEO 654 KB, VP9
           * 1.7 MB) and libheif's 216 KB reference PNG came out red on the
           * agent while curl from the same pod downloaded them in 15 ms. This
           * makes Chromium use /tmp instead; no effect outside a container. */
          '--disable-dev-shm-usage',
          '--remote-debugging-port=9222'
        ]
      }
    },
    autoWatch: false,
    // singleRun: false, // Karma captures browsers, runs the tests and exits
    concurrency: Infinity,
    nunitReporter: {
      outputFile: 'test-results.xml',
      suite: ''
    },
    browserNoActivityTimeout: 3000000,
    browserDisconnectTimeout: 3000000
  });
};
