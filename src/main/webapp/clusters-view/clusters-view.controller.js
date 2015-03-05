'use strict';

angular.module('managementConsole')
    .controller('ClustersViewCtrl', [
    '$scope',
    'modelController',
    function ($scope, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            $scope.clusters = modelController.getServer().getClusters();
  }]);
