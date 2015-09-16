// The test is prepared to run with the default settings of 8.x.x Infinispan server in domain mode

'use strict';

describe('Cache filtering', function () {

    var utils = require('../e2eUtils');

    beforeEach(function () {
        utils.defaultLogin();
        // 'http://localhost:3000/index.html#/cluster/clustered'
        var link = element(by.id('cluster-link-clustered'));
        link.click();
        browser.sleep(500);
    });

    it('should find searchNameQuery element on cluster/clustered page', function() {
        expect(element(by.model('searchNameQuery')).isPresent()).toBe(true);
    });

    it('should filter caches when user types cache name into filter input field', function () {
        var linkToNodes = element(by.linkText('Caches'));
        linkToNodes.click();
        browser.sleep(500);

        var cacheList = element.all(by.repeater('cache in currentCluster.getCachesAsArray() | filter: {name: searchNameQuery}'));
        var query = element(by.model('searchNameQuery'));

        browser.sleep(1000);
        expect(cacheList.count()).toBe(4);

        query.sendKeys('default');

        expect(cacheList.count()).toBe(1);
        query.clear();
        // memcachedCache + namedCache
        query.sendKeys('cache');
        expect(cacheList.count()).toBe(3);
    });
});
