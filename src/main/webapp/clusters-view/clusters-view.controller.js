'use strict';

angular.module('managementConsole')
    .controller('ClustersViewCtrl', [
    '$scope',
    '$state',
    'modelController',
    function ($scope, $state, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            $scope.clusters = modelController.getServer().getClusters();
  }]);
