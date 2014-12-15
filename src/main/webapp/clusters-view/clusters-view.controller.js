'use strict';

angular.module('managementConsole')
    .controller('ClustersViewCtrl', [
    '$scope',
    'modelController',
    function ($scope, modelController) {
            $scope.clusters = modelController.getServer().getClusters();
  }]);