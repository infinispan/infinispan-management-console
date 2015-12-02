'use strict';

angular.module('managementConsole')
    .controller('ClustersViewPhysicalCtrl', [
    '$scope',
    'modelController',
    'serverGroups',
    function ($scope, modelController, serverGroups) {

            $scope.groups = serverGroups;
            $scope.servers = modelController.getServer().getNodes();

  }]);
