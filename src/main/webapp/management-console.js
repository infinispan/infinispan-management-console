'use strict';

angular.module('managementConsole', [
  'managementConsole.api',
  'gridshore.c3js.chart',
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
            .state('clustersViewPhysical', {
              url: '/clusters-view-physical',
              templateUrl: 'clusters-view-physical/clusters-view.html',
              controller: 'ClustersViewPhysicalCtrl'
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
            })
            .state('cacheStatus', {
              url: '/cluster/:clusterName/cache/:cacheName',
              templateUrl: 'cache-status/cache-status.html',
              controller: 'CacheStatusCtrl'
            })
            .state('cacheNodes', {
              url: '/cluster/:clusterName/cache/:cacheName',
              templateUrl: 'cache-nodes/cache-nodes.html',
              controller: 'CacheNodesCtrl'
            })
            .state('clusterNodes', {
              url: '/clusters-view-physical/:clusterName/',
              templateUrl: 'cluster-nodes/cluster-nodes.html',
              controller: 'ClusterNodesCtrl'
            })
            .state('nodeStatus', {
              url: '/cluster/:clusterName/:nodeName/',
              params: {
                clusterName: null,
                nodeName: null,
                inetAddress: null
              },
              templateUrl: 'node-status/node-status.html',
              controller: 'NodeStatusCtrl'
            })
            .state('error404', {
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
  .run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
      $rootScope.safeApply = function (f) {
        var scope = this;
        $timeout(function () {
          scope.$apply(f);
        });
      };
      $rootScope.page = {htmlClass: ''};
    }]).run(['$rootScope', '$location', 'modelController', function ($rootScope, $location, modelController) {

      $rootScope.$on('$locationChangeStart', function () {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !modelController.isAuthenticated()) {
          $location.path('/login');
        }
      });
    }]).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/tabs/tabset.html",
      "<div>\n" +
      "  <ul class=\"nav nav-{{type || 'tabs'}} col-md-2\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
      "  <div class=\"tab-content col-md-10\">\n" +
      "    <div class=\"tab-pane\" \n" +
      "         ng-repeat=\"tab in tabs\" \n" +
      "         ng-class=\"{active: tab.active}\"\n" +
      "         uib-tab-content-transclude=\"tab\">\n" +
      "    </div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
  }]);
