'use strict';

angular.module('managementConsole')
    .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $stateParams, $state, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            $scope.shared = {
                currentCollection: 'caches'
            };
            $scope.clusters = modelController.getServer().getClusters();
            $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

            $scope.serversCheckboxes = [];

            $scope.currentCluster.getNodes().forEach(function(node) {
                $scope.serversCheckboxes[node.server] = true;
            });

            $scope.$watch('currentCluster', function (currentCluster) {
                if (currentCluster && currentCluster.name !== $stateParams.clusterName) {
                    $state.go('clusterView', {
                        'clusterName': currentCluster.name
                    });
                }
            });
  }]);