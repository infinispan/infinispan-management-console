'use strict';

angular.module('managementConsole', [
  'managementConsole.api',
  'gridshore.c3js.chart',
  'ui.router',
  'ui.bootstrap'
]).directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]).config(['$stateProvider', '$urlRouterProvider',
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
                params:{
                  refresh:false
                },
                templateUrl: 'cluster-view/cluster-view.html',
                controller: 'ClusterViewCtrl'
            })
            .state('tasksView', {
                url: '/cluster/:clusterName/tasks',
                params:{
                  refresh:false
                },
                templateUrl: 'cluster-view/tasks-view.html',
                controller: 'TasksViewCtrl'
            })
            .state('clustersViewPhysical', {
              url: '/clusters-view-physical',
              templateUrl: 'clusters-view-physical/clusters-view.html',
              controller: 'ClustersViewPhysicalCtrl',
              resolve:{
                serverGroups:function (modelController, utils) {

                  var groups = modelController.getServer().getServerGroups();
                  var servers = modelController.getServer().getNodes();

                  angular.forEach(groups, function(cluster){
                    cluster.status = 'STOPPED';
                    cluster.hostCount = 0;
                    cluster.nodeCount = 0;
                    var hosts = [];
                    angular.forEach(servers, function(server){
                      if (server.getGroup() === cluster.name) {
                        hosts.push(server.host);
                        if (!server.isRunning()){
                          cluster.status = 'DEGRADED';
                        }
                      }
                    });
                    var hostsUnique = utils.countOccurrences(hosts);
                    cluster.hostCount = hostsUnique.length;
                    angular.forEach(hostsUnique, function(host) {
                      cluster.nodeCount += host.count;
                    });

                    if (cluster.nodeCount > 0 && cluster.status !== 'DEGRADED'){
                      cluster.status = 'STARTED';
                    }
                  });
                  return groups;
              }
              }
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
              controller: 'ClusterNodesCtrl',
              resolve:{
                serverGroup:function (modelController, utils, $stateParams) {

                  var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
                  var servers = modelController.getServer().getNodes();


                  cluster.status = 'STOPPED';
                  cluster.hostCount = 0;
                  cluster.nodeCount = 0;
                  var hosts = [];
                  angular.forEach(servers, function (server) {
                    if (server.getGroup() === cluster.name) {
                      hosts.push(server.host);
                      if (!server.isRunning()) {
                        cluster.status = 'DEGRADED';
                      }
                    }
                  });
                  var hostsUnique = utils.countOccurrences(hosts);
                  cluster.hostCount = hostsUnique.length;
                  angular.forEach(hostsUnique, function (host) {
                    cluster.nodeCount += host.count;
                  });

                  if (cluster.nodeCount > 0 && cluster.status !== 'DEGRADED') {
                    cluster.status = 'STARTED';
                  }
                  return cluster;
                }
              }
            })
            .state('nodeStatus', {
                url: '/cluster/:clusterName/:nodeName/',
                params: {
                  clusterName: null,
                  nodeName: null,
                  inetAddress: null
                },
                templateUrl: 'node-status/node-status.html',
                controller: 'NodeStatusCtrl',
                resolve: {
                  nodeStats: function (modelController, $stateParams) {
                    var controller = modelController.getServer();
                    var serverNode = controller.getNode($stateParams.nodeName);
                    return serverNode.fetchStats();
                  },

                  aggregateNodeStats: function(modelController, $stateParams){
                    var controller = modelController.getServer();
                    var serverNode = controller.getNode($stateParams.nodeName);
                    return serverNode.fetchAggregateNodeStats();
                  }
                }
              }
            )
            .state('error404', {
                url: '/error404',
                templateUrl: 'error404/error404.html'
            }).state('editCache', {
                url: '/cluster/:clusterName/edit-cache/:cacheName',
                params: {
                  clusterName: null,
                  cacheName: null,
                  cacheConfigurationType: null,
                  cacheConfigurationTemplate: null,
                  newCacheCreation: false
                },
                templateUrl: 'edit-cache/edit-cache.html',
                controller: 'editCacheCtrl',
                resolve: {
                  configurationModel: function (cacheCreateController, modelController, $stateParams) {
                    if ($stateParams.newCacheCreation) {
                      return cacheCreateController.getConfigurationTemplate($stateParams.clusterName,
                        $stateParams.cacheConfigurationType, $stateParams.cacheConfigurationTemplate);
                    } else {
                      var server = modelController.getServer();
                      var clusters = server.getClusters();
                      var currentCluster = server.getCluster(clusters, $stateParams.clusterName);
                      var currentCache = currentCluster.getCaches()[$stateParams.cacheName];
                      return cacheCreateController.getConfigurationTemplate($stateParams.clusterName,
                        currentCache.getType(), currentCache.getConfigurationTemplate());
                    }
                  }
                }
            }).state('editCacheTemplate', {
                url: '/cluster/:clusterName/edit-cache-template/:cacheConfigurationTemplate',
                params: {
                  clusterName: null,
                  templateName: null,
                  cacheConfigurationType: null,
                  cacheConfigurationTemplate: null
                },
                templateUrl: 'edit-cache-template/edit-cache-template.html',
                controller: 'editCacheTemplateCtrl',
                resolve: {
                  configurationModel: function (cacheCreateController, modelController, $stateParams) {
                    var cacheTemplateModel = cacheCreateController.getConfigurationTemplate($stateParams.clusterName,
                      $stateParams.cacheConfigurationType, $stateParams.cacheConfigurationTemplate);
                    cacheTemplateModel.template = $stateParams.templateName;
                    return cacheTemplateModel;
                  }
                }
            }).state('editCacheContainerSchemas', {
                url: '/cluster/:clusterName/',
                params: {
                  clusterName: null
                },
                templateUrl: 'cache-container/configuration-schemas/schemas.html',
                controller: 'editContainerSchemasCtrl',
                resolve: {}
            }).state('editCacheContainerTransport', {
                url: '/cluster/:clusterName/',
                params: {
                  clusterName: null
                },
                templateUrl: 'cache-container/configuration-transport/transport.html',
                controller: 'editContainerTransportCtrl',
                resolve: {

                }
          }).state('editCacheContainerThreadpools', {
            url: '/cluster/:clusterName/',
            params: {
              clusterName: null
            },
            templateUrl: 'cache-container/configuration-threadpools/threadpools.html',
            controller: 'editContainerThreadpoolsCtrl',
            resolve: {

            }
          }).state('editCacheContainerSecurity', {
            url: '/cluster/:clusterName/',
            params: {
              clusterName: null
            },
            templateUrl: 'cache-container/configuration-security/security.html',
            controller: 'editContainerSecurityCtrl',
            resolve: {
              securityConfig: function ($q, modelController, $stateParams){
                var clusters = modelController.getServer().getClusters();
                var currentCluster = modelController.getServer().getCluster(clusters, $stateParams.clusterName);
                var deferred = $q.defer();
                currentCluster.getSecurityConfiguration().then(function(response){
                  deferred.resolve(response);
                }).catch(function(e){
                  deferred.resolve(null);
                });
                return deferred.promise;
              }
            }
          }).state('editCacheContainerDeploy', {
            url: '/cluster/:clusterName/',
            params: {
              clusterName: null
            },
            templateUrl: 'cache-container/configuration-deploy/deploy.html',
            controller: 'editContainerDeployCtrl',
            resolve: {
              deployments: function(modelController){
                return modelController.getDeployedArtifacts();
              }
            }
          }).state('editCacheContainerTemplates', {
            url: '/cluster/:clusterName/',
            params: {
              clusterName: null
            },
            templateUrl: 'cache-container/configuration-templates/templates.html',
            controller: 'editContainerTemplatesCtrl',
            resolve: {
              configurationTemplates: function (modelController, $stateParams){
                var currentCluster = modelController.getServer().getClusterByName($stateParams.clusterName);
                return currentCluster.getConfigurations();
              }
            }
          }).state('viewEvents', {
              url: '/events-view',
              templateUrl: 'events-view/events-view.html',
              controller: 'EventsViewCtrl'
              }
        );

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
    }]).run(['$templateCache', function ($templateCache) {
    $templateCache.put('template/tabs/tabset.html',
      '<div>\n' +
      "  <ul class=\"nav nav-{{type || 'tabs'}} col-md-2\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
      '  <div class=\"tab-content col-md-10\">\n' +
      '    <div class=\"tab-pane\" \n' +
      '         ng-repeat=\"tab in tabs\" \n' +
      '         ng-class=\"{active: tab.active}\"\n' +
      '         uib-tab-content-transclude=\"tab\">\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>\n');
  }]);
