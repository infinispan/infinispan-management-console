'use strict';

describe('Node filtering', function () {

  var utils = require('../e2eUtils');

  beforeEach(function () {
    utils.defaultLogin();
    var link = element(by.id('cluster-link-clustered'));
    link.click();
  });

  it('should find cacheOrNodeFilterQueryInput element on cluster/clustered page', function() {
    expect(element(by.id('cacheOrNodeFilterQueryInput')).isPresent()).toBe(true);
  });

  it('should filter nodes when user types node name into filter input field', function () {
    var linkToNodes = element(by.linkText('Nodes'));
    linkToNodes.click();
    browser.sleep(300);

    var nodeList = element.all(by.repeater('node in currentCluster.getNodes() | filter:cacheOrNodeFilterQuery'));
    var query = element(by.model('cacheOrNodeFilterQuery.name'));

    browser.sleep(1000);
    // master/server-one; master/server-two; master/server-three expected
    expect(nodeList.count()).toBe(3);

    query.sendKeys('one');
    expect(nodeList.count()).toBe(1);
    query.clear();

    query.sendKeys('two');
    expect(nodeList.count()).toBe(1);
    query.clear();

    query.sendKeys('/server');
    expect(nodeList.count()).toBe(3);
    query.clear();
  });
});
