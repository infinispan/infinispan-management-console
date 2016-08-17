define(["require", "exports", "../App"], function (require, exports, App_1) {
    "use strict";
    // TODO when we re-work controller as Typescript objects we should not register to module, but just export class
    var module = App_1.App.module("managementConsole.clusters-view");
    module.controller('ClustersViewCtrl', [
        '$scope',
        '$state',
        'modelController',
        'clusterEventsService',
        'clusterNodesService',
        'utils',
        function ($scope, $state, modelController, clusterEventsService, clusterNodesService, utils) {
            $scope.clusters = [];
            $scope.serverGroups = modelController.getServer().getServerGroups();
            angular.forEach($scope.serverGroups, function (group) {
                var profile = modelController.getServer().getProfile(group.profile);
                $scope.clusters = $scope.clusters.concat(profile.getClusters());
            });
            //$scope.clusters = modelController.getServer().getClusters();
            $scope.stack = modelController.getServer().getFirstServer().getDefaultStack();
            $scope.relays = {};
            $scope.offlineSites = {};
            $scope.onlineSites = {};
            $scope.mixedSites = {};
            //endpoints for each cache container
            $scope.endpoints = [];
            //
            // Updates the map of remote site status
            //
            $scope.refreshRemoteSitesStatus = function (cluster) {
                clusterNodesService.getCoordinator(cluster).then(function (coord) {
                    var address = coord.getResourcePath()
                        .concat('subsystem', 'datagrid-infinispan', 'cache-container', cluster.getName());
                    var serverGroupClusterName = cluster.getServerGroupName().concat(cluster.getName());
                    // Refresh list of offline sites
                    modelController.readAttribute(address, 'sites-offline').then(function (response) {
                        if (utils.isNonEmptyArray(response)) {
                            $scope.offlineSites[serverGroupClusterName] = response;
                        }
                        else {
                            $scope.offlineSites[serverGroupClusterName] = [];
                        }
                    });
                    // Refresh list of online sites
                    modelController.readAttribute(address, 'sites-online').then(function (response) {
                        if (utils.isNonEmptyArray(response)) {
                            $scope.onlineSites[serverGroupClusterName] = response;
                        }
                        else {
                            $scope.onlineSites[serverGroupClusterName] = [];
                        }
                    });
                    // Refresh list of mixed sites
                    modelController.readAttribute(address, 'sites-mixed').then(function (response) {
                        if (utils.isNonEmptyArray(response)) {
                            $scope.mixedSites[serverGroupClusterName] = response;
                        }
                        else {
                            $scope.mixedSites[serverGroupClusterName] = [];
                        }
                    });
                });
            };
            //
            // Loads latest grid events
            //
            $scope.refreshGridEvents = function () {
                $scope.gridEvents = [];
                angular.forEach($scope.clusters, function (cluster) {
                    $scope.refreshClusterEvents(cluster, 10);
                });
            };
            $scope.refreshClusterEvents = function (cluster, maxLines) {
                clusterEventsService.fetchClusterEvents(cluster, maxLines).then(function (response) {
                    angular.forEach(response, function (event) {
                        $scope.gridEvents.push(event);
                    });
                });
            };
            angular.forEach($scope.clusters, function (cluster) {
                // Update remote site status for cluster
                $scope.refreshRemoteSitesStatus(cluster);
                var relays = cluster.getRelays();
                if (utils.isNonEmptyArray(relays)) {
                    angular.forEach(relays, function (relay) {
                        var tempRelays = relay['remote-site'];
                        $scope.relays[cluster.getName()] = Object.keys(tempRelays);
                    });
                }
                else {
                    $scope.relays[cluster.getName()] = ['N/A'];
                }
                $scope.endpoints.push(cluster.getEndpoints(cluster['name']));
                clusterNodesService.getAvailability(cluster).then(function (result) {
                    cluster.availability = result;
                }).catch(function () {
                    cluster.availability = 'UNAVAILABLE';
                });
            });
            // Refresh grid events
            $scope.refreshGridEvents();
        }]);
});
//# sourceMappingURL=clusters-view.controller.js.map