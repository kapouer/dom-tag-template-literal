"use strict";

var customLaunchers = {
  // You can use this tool to generate the correct config:
  // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
  win10chrome: { base: "SauceLabs", browserName: "chrome", platform: "Windows 10" },
  // androidChrome: { base: "SauceLabs", browserName: "android", platform: "Linux" },
  // win10firefox: { base: "SauceLabs", browserName: "firefox", platform: "Windows 10" },
  // iosSafari: { base: "SauceLabs", browserName: "iphone", platform: "OS X 10.10" },
  // iosSafari92: { base: "SauceLabs", browserName: "iphone", platform: "OS X 10.10", version: "9.2" },
  // win10ie11: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 10" },
  // win7ie9: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 7", version: "9.0" },
  // win7ie10: { base: "SauceLabs", browserName: "internet explorer", platform: "Windows 7", version: "10.0" }
};

module.exports = function(config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
    process.exit(1)
  }
  config.set({
    sauceLabs: {
      testName: "dom-template-strings test suite",
      tunnerIdentifier: process.env.TRAVIS_JOB_NUMBER,
      startConnect: false
    },
    files: [
      "dist/template.js",
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
    captureTimeout: 120000,
    client: {
      captureConsole: true,
      timeout: 20000
    },
    connectOptions: {
      verbose: false,
      verboseDebugging: false
    },
    browserNoActivityTimeout: 30000
  });
};
