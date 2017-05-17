var Browser = require('zombie'),
  assert = require('chai').assert;
var browser;
browser = new Browser();
var referrer = 'http://localhost:3000/tours/hood-river';
browser.visit(referrer, function() {
  browser.clickLink('.requestGroupRate', function() {
    console.log(browser.referrer);

  });
});
