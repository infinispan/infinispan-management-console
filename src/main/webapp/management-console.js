'use strict';

angular.module('managementConsole', [
  'managementConsole.api',
  'gridshore.c3js.chart',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule'
]).constant('CONSTANTS', {
  'NO_BASE_CONFIGURATION_TEMPLATE': '<none>'
}).directive('fileModel', ['$parse', function ($parse) {
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
                url: '/cluster/:groupName/:clusterName',
                params:{
                  refresh:false
                },
                templateUrl: 'cluster-view/cluster-view.html',
                controller: 'ClusterViewCtrl'
            })
            .state('tasksView', {
                url: '/cluster/:groupName/:clusterName/tasks',
                params:{
                  refresh:false
                },
                templateUrl: 'cluster-view/tasks-view.html',
                controller: 'TasksViewCtrl'
            })
            .state('clustersViewPhysical', {
              url: '/clusters-view-physical',
              params:{
                refresh:false
              },
              templateUrl: 'clusters-view-physical/clusters-view.html',
              controller: 'ClustersViewPhysicalCtrl',
              resolve: {
                serverGroups: function (modelController, utils, clusterNodesService, $stateParams) {

                  function isStopped(server) {
                    return !server.isRunning();
                  }

                  function isRunning(server) {
                    return !isStopped(server);
                  }

                  function calculateClusterState() {
                    var groups = modelController.getServer().getServerGroups();
                    var servers = modelController.getServer().getNodes();
                    angular.forEach(groups, function (cluster) {
                      cluster.status = '';
                      cluster.hostCount = 0;
                      cluster.nodeCount = 0;
                      var hosts = [];
                      var serversInGroup = [];
                      angular.forEach(servers, function (server) {
                        if (server.getGroup() === cluster.name) {
                          hosts.push(server.host);
                          serversInGroup.push(server);
                        }
                      });
                      var hostsUnique = utils.countOccurrences(hosts);
                      cluster.hostCount = hostsUnique.length;
                      angular.forEach(hostsUnique, function (host) {
                        cluster.nodeCount += host.count;
                      });

                      if (serversInGroup.some(isRunning)) {
                        clusterNodesService.areCoordinatorsSameForServers(serversInGroup).then(function (sameView) {
                          cluster.status = sameView ? 'STARTED' : 'DEGRADED';
                        });
                      } else {
                        cluster.status = 'STOPPED';
                      }
                    });
                    return groups;
                  }

                  if ($stateParams.refresh) {
                    return modelController.refresh().then(function () {
                      return calculateClusterState();
                    });
                  } else {
                    return calculateClusterState();
                  }
                }
              }
            })
            .state('cacheStatus', {
              url: '/cluster/:groupName/:clusterName/cache/:cacheName',
              templateUrl: 'cache-status/cache-status.html',
              controller: 'CacheStatusCtrl'
            })
            .state('cacheNodes', {
              url: '/cluster/:groupName/:clusterName/cache/:cacheName',
              templateUrl: 'cache-nodes/cache-nodes.html',
              controller: 'CacheNodesCtrl'
            })
            .state('clusterNodes', {
              url: '/clusters-view-physical/:clusterName/',
              templateUrl: 'cluster-nodes/cluster-nodes.html',
              params: {
                clusterName: null,
                refresh: false
              },
              controller: 'ClusterNodesCtrl',
              resolve:{
                serverGroup:function (modelController, utils, clusterNodesService, $stateParams) {

                  function isStopped(server) {
                    return !server.isRunning();
                  }

                  function isRunning(server) {
                    return server.isRunning();
                  }

                  function calculateClusterState() {
                    var cluster = modelController.getServer().getServerGroupByName($stateParams.clusterName);
                    var servers = modelController.getServer().getNodes();
                    var serversInGroup = [];

                    cluster.status = '';
                    angular.forEach(servers, function (server) {
                      if (server.getGroup() === cluster.name) {
                        serversInGroup.push(server);
                      }
                    });

                    if (serversInGroup.some(isRunning)) {
                      clusterNodesService.areCoordinatorsSameForServers(serversInGroup).then(function (sameView) {
                        cluster.status = sameView ? 'STARTED' : 'DEGRADED';
                      });
                    } else {
                      cluster.status = 'STOPPED';
                    }
                    return cluster;
                  }
                  if ($stateParams.refresh) {
                    return modelController.refresh().then(function () {
                      return calculateClusterState();
                    });
                  } else {
                    return calculateClusterState();
                  }
                },
                view: function (modelController, clusterNodesService, $stateParams, utils) {
                  var servers = modelController.getServer().getNodes();
                  if (utils.isNonEmptyArray(servers)) {
                    var firstServer = servers[0];
                    var serverGroup = modelController.getServer().getServerGroupByName($stateParams.clusterName);
                    return clusterNodesService.getView(firstServer.getHost(), firstServer.getServerName(), serverGroup.profile);
                  } else {
                    return {
                      host: '',
                      server: ''
                    };
                  }
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
                  view: function(modelController, clusterNodesService, $stateParams){
                    var servers = modelController.getServer().getNodes();
                    var firstServer = servers[0];
                    var serverGroup = modelController.getServer().getServerGroupByName($stateParams.clusterName);
                    return clusterNodesService.getView(firstServer.getHost(), firstServer.getServerName(), serverGroup.profile);
                  }
                }
              }
            )
            .state('error404', {
                url: '/error404',
                templateUrl: 'error404/error404.html'
            }).state('editCache', {
                url: '/cluster/:groupName/:clusterName/edit-cache/:cacheName',
                params: {
                  groupName: null,
                  clusterName: null,
                  cacheName: null,
                  cacheConfigurationType: null,
                  cacheConfigurationTemplate: null,
                  newCacheCreation: false
                },
                templateUrl: 'edit-cache/edit-cache.html',
                controller: 'editCacheCtrl',
                resolve: {
                  configurationModel: function (cacheCreateController, modelController, $stateParams, CONSTANTS) {
                    var server = modelController.getServer();
                    var currentCluster = server.getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
                    if ($stateParams.newCacheCreation) {
                      if ($stateParams.cacheConfigurationTemplate === CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE) {
                        return {
                          'name': $stateParams.cacheName,
                          'type': $stateParams.cacheConfigurationType,
                          //creating new cache with bare template, name new template after cache
                          'template-name': $stateParams.cacheName,
                          //and set mode to SYNC
                          'mode':'SYNC'
                        };
                      } else {
                        return cacheCreateController.getConfigurationTemplate(currentCluster.getProfileName(), $stateParams.clusterName,
                          $stateParams.cacheConfigurationType, $stateParams.cacheConfigurationTemplate);
                      }
                    } else {
                      var currentCache = currentCluster.getCaches()[$stateParams.cacheName];
                      return cacheCreateController.getConfigurationTemplate(currentCluster.getProfileName(), $stateParams.clusterName,
                        currentCache.getType(), currentCache.getConfigurationTemplate());
                    }
                  }
                }
            }).state('editCacheTemplate', {
                url: '/cluster/:groupName/:clusterName/edit-cache-template/:cacheConfigurationTemplate',
                params: {
                  groupName: null,
                  clusterName: null,
                  templateName: null,
                  cacheConfigurationType: null,
                  cacheConfigurationTemplate: null,
                  mode:''
                },
                templateUrl: 'edit-cache-template/edit-cache-template.html',
                controller: 'editCacheTemplateCtrl',
                resolve: {
                  configurationModel: function ($q, cacheCreateController, modelController, $stateParams, CONSTANTS) {
                    if ($stateParams.cacheConfigurationTemplate === CONSTANTS.NO_BASE_CONFIGURATION_TEMPLATE) {
                      return {
                        'type': $stateParams.cacheConfigurationType,
                        //creating new cache with bare template, name new template after cache
                        'template-name': $stateParams.templateName,
                        //and set mode to SYNC
                        'mode': 'SYNC'
                      };
                    } else {
                      var deferred = $q.defer();
                      var cluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
                      var promise = cacheCreateController.getConfigurationTemplate(cluster.getProfileName(), $stateParams.clusterName,
                        $stateParams.cacheConfigurationType, $stateParams.cacheConfigurationTemplate);
                      promise.then(function (response) {
                        var model = response;
                        model.type = $stateParams.cacheConfigurationType;
                        model['template-name'] = $stateParams.templateName;
                        deferred.resolve(model);
                      });
                      return deferred.promise;
                    }
                  }
                }
            }).state('editCacheContainerSchemas', {
                url: '/cluster/:groupName/:clusterName/',
                params: {
                  groupName: null,
                  clusterName: null
                },
                templateUrl: 'cache-container/configuration-schemas/schemas.html',
                controller: 'editContainerSchemasCtrl',
                resolve: {}
            }).state('editCacheContainerTransport', {
                url: '/cluster/:groupName/:clusterName/',
                params: {
                  groupName: null,
                  clusterName: null
                },
                templateUrl: 'cache-container/configuration-transport/transport.html',
                controller: 'editContainerTransportCtrl',
                resolve: {

                }
            }).state('editCacheContainerThreadpools', {
                url: '/cluster/:groupName/:clusterName/',
                params: {
                  groupName: null,
                  clusterName: null
                },
                templateUrl: 'cache-container/configuration-threadpools/threadpools.html',
                controller: 'editContainerThreadpoolsCtrl',
                resolve: {}
            }).state('editCacheContainerSecurity', {
              url: '/cluster/:groupName/:clusterName/',
              params: {
                groupName: null,
                clusterName: null
              },
              templateUrl: 'cache-container/configuration-security/security.html',
              controller: 'editContainerSecurityCtrl',
              resolve: {
                securityConfig: function ($q, modelController, $stateParams){
                  var clusters = modelController.getServer().getClusters();
                  var currentCluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
                  var deferred = $q.defer();
                  currentCluster.getSecurityConfiguration().then(function(response){
                    deferred.resolve(response);
                  }).catch(function(){
                    deferred.resolve(null);
                  });
                  return deferred.promise;
                }
              }
            }).state('editCacheContainerDeploy', {
              url: '/cluster/:groupName/:clusterName/',
              params: {
                groupName: null,
                clusterName: null
              },
              templateUrl: 'cache-container/configuration-deploy/deploy.html',
              controller: 'editContainerDeployCtrl',
              resolve: {
                deployments: function(cacheContainerConfigurationService){
                  return cacheContainerConfigurationService.getArtifacts();
                },

                deployed: function(modelController, $stateParams, cacheContainerConfigurationService){
                  var cluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
                  return cacheContainerConfigurationService.getDeployedArtifact(cluster.getServerGroupName());
                }
              }
            }).state('editCacheContainerTasks', {
              url: '/cluster/:groupName/:clusterName/',
              params: {
                groupName: null,
                clusterName: null
              },
              templateUrl: 'cache-container/configuration-tasks/tasks.html',
              controller: 'editContainerTasksCtrl'
            }).state('editCacheContainerTemplates', {
              url: '/cluster/:groupName/:clusterName/',
              params: {
                groupName: null,
                clusterName: null
              },
              templateUrl: 'cache-container/configuration-templates/templates.html',
              controller: 'editContainerTemplatesCtrl',
              resolve: {
                configurationTemplates: function (modelController, $stateParams){
                  var currentCluster = modelController.getServer().getClusterByNameAndGroup($stateParams.clusterName, $stateParams.groupName);
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

  .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('infinispan-management-console')
      .setStorageType('sessionStorage');
  }])

/**
 * Safe apply method. It should be used when normal $scope.$apply happens to execute
 * during digest cycle which causes an error.
 * Use it just like normal apply: $scope.safeApply(myFunc).
 */
  .run(['$rootScope', '$timeout', '$modal', 'utils', function ($rootScope, $timeout, $modal, utils) {
      //isDomainControllerAlive is used for web app to server connectivity checking
      $rootScope.isDomainControllerAlive = true;
      $rootScope.safeApply = function (f) {
        var scope = this;
        $timeout(function () {
          scope.$apply(f);
        });
      };
      $rootScope.page = {htmlClass: ''};

      //generic error modal
      $rootScope.openErrorModal = function (error) {
        $modal.open({
          templateUrl: 'components/dialogs/generic-error.html',
          controller: function($scope, $modalInstance) {
            if( typeof error === 'string') {
              $scope.errorText = 'An error has occurred:';
              $scope.errorTextDetail = error;
            }
            else {
              utils.traverse(error, function (key, value, trail) {
                $scope.errorText = trail[0];
                $scope.errorTextDetail = value;
              });
            }
            $scope.ok = function () {
              $modalInstance.close();
            };
          },
          scope: $rootScope
        });
      };

      //generic info modal
      $rootScope.openRestartModal = function () {
        if ($rootScope.requiresRestartFlag) {
          $modal.open({
            templateUrl: 'components/dialogs/requires-restart.html',
            controller: function ($scope, $modalInstance, clusterNodesService) {

              $scope.ok = function () {
                clusterNodesService.restartCluster();
                $rootScope.requiresRestartFlag = false;
              };

              $scope.cancel = function () {
                $modalInstance.close();
              }
            },
            scope: $rootScope
          });
        }
      };

      //generic info modal
      $rootScope.openInfoModal = function (infoText, infoTextDetail) {
        $modal.open({
          templateUrl: 'components/dialogs/generic-info.html',
          controller: function ($scope, $modalInstance) {
            $scope.infoText = infoText;
            $scope.infoTextDetail = infoTextDetail;

            $scope.ok = function () {
              $modalInstance.close();
            };
          },
          scope: $rootScope
        });
      };
    }])
  .run([
    '$rootScope', 'modelController', '$urlRouter', '$state', '$interval',
    function ($rootScope, modelController, $urlRouter, $state, $interval) {
      $rootScope.$on('$stateChangeStart', function (event, toState) {
        // redirect to login page if not logged in
        if (toState.name !== 'login' && !modelController.isAuthenticated()) {
          event.preventDefault();
          var credentials = modelController.getCredentials();
          modelController.login(credentials.username, credentials.password).then(function () {
            var modelPromise = modelController.refresh();
            modelPromise.then(function () {
              $urlRouter.sync();
            }, function () {
              $state.go('login');
            });
          }, function () {
            $state.go('login');
          });
        }
        else if (toState.name === 'login' && modelController.isAuthenticated()) {
          $state.go('clustersView');
        }
      });
    }])

  .run(['$templateCache', function ($templateCache) {
    $templateCache.put(
      'template/tabs/tabset.html',
      '<div>\n' +
        '  <ul class=\"nav nav-{{type || \'tabs\'}} col-md-2\" ng-class=\"{\'nav-stacked\': vertical, \'nav-justified\': justified}\" ng-transclude></ul>\n' +
        '  <div class=\"tab-content col-md-10\">\n' +
        '    <div class=\"tab-pane\" \n' +
        '         ng-repeat=\"tab in tabs\" \n' +
        '         ng-class=\"{active: tab.active}\"\n' +
        '         uib-tab-content-transclude=\"tab\">\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n');
  }]);
