'use strict';

angular.module('managementConsole', [
  'managementConsole.api',
  'ui.router',
  'ui.bootstrap'
])

.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            })
            .state('logout', {
                url: '/'
            })
            .state('clustersView', {
                url: '/clusters',
                templateUrl: 'clusters-view/clusters-view.html',
                controller: 'ClustersViewCtrl'
            })
            .state('clusterView', {
                url: '/cluster/:clusterName',
                templateUrl: 'cluster-view/cluster-view.html',
                controller: 'ClusterViewCtrl'
            })
            .state('nodeDetails', {
                url: '/cluster/:clusterName/node/:nodeName',
                templateUrl: 'node-details/node-details.html',
                controller: 'NodeDetailsCtrl'
            })
            .state('cacheDetails', {
                url: '/cluster/:clusterName/cache/:cacheName',
                templateUrl: 'cache-details/cache-details.html',
                controller: 'CacheDetailsCtrl'
            }).state('error404', {
                url: '/error404',
                templateUrl: 'error404/error404.html'
            }).state('createCache', {
                url: '/cluster/:clusterName/createCache',
                templateUrl: 'create-cache/create-cache.html',
                controller: 'createCacheCtrl'
            }).state('editCache', {
                url: '/cluster/:clusterName/edit-cache/:cacheName',
                templateUrl: 'edit-cache/edit-cache.html',
                controller: 'editCacheCtrl'
            });
        $urlRouterProvider
            .when('/', '/login')
            .when('', '/login')
            .otherwise('/error404');
  }])
/**
 * Safe apply method. It should be used when normal $scope.$apply happens to execute
 * during digest cycle which causes an error.
 * Use it just like normal apply: $scope.safeApply(myFunc).
 */
.run(['$rootScope', '$timeout',
    function ($rootScope, $timeout) {
        $rootScope.safeApply = function (f) {
            var scope = this;
            $timeout(function () {
                scope.$apply(f);
            });
        };
        $rootScope.page = { htmlClass: '' };
  }]);
