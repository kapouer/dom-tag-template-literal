"use strict";

var customLaunchers = {
  // You can use this tool to generate the correct config:
  // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  win10chrome: { base: "SauceLabs", browserName: "chrome", platform: "Windows 10" },
  // androidChrome: { base: "SauceLabs", browserName: "android", platform: "Linux" },
  win10firefox: { base: "SauceLabs", browserName: "firefox", platform: "Windows 10" },
  iosSafari: { base: "SauceLabs", browserName: "iphone", platform: "OS X 10.10" },
  // iosSafari92: { base: "SauceLabs", browserName: "iphone", platform: "OS X 10.10", version: "9.2" },
  win10ie11: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 10" },
  win7ie9: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 7", version: "9.0" }
};

module.exports = function(config) {
  config.set({
    sauceLabs: {
      testName: "domify test suite"
    },
    files: [
      // "https://cdn.polyfill.io/v2/polyfill.min.js",
      "dist/client-test.js"
    ],
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    frameworks: [ "mocha" ],
    reporters: [ "spec", "saucelabs" ],
    plugins: [ "karma-mocha", "karma-sauce-launcher", "karma-spec-reporter" ],
    singleRun: true,
    autoWatch: false,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: 5,
    client: {
      captureConsole: true,
      timeout: 20000
    },
    startConnect: true,
    connectOptions: {
      verbose: false,
      verboseDebugging: false
    },
    browserNoActivityTimeout: 30000
  });
};
