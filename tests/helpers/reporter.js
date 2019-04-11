// this is a Jasmine helper function used to export results as xunit tests results.
var jasmineReporters = require('jasmine-reporters');
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var junitReporter = new jasmineReporters.NUnitXmlReporter({
  savePath: './',
  consolidateAll: false,
});

var textReporter = new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayDuration: true,
  }
});

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(junitReporter);
jasmine.getEnv().addReporter(textReporter);