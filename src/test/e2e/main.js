'use strict';

describe('The main clusters view', function () {

  var utils = require('../e2eUtils');

  beforeEach(function () {
    utils.defaultLogin();
    // login page automatically redirects to #/clusters page, no action needed here
  });

  it('should contain 2 containers by default ', function () {
    var clusters = element.all(by.repeater('cluster in clusters'));
    expect(clusters.count()).toBe(2);
  });
});
