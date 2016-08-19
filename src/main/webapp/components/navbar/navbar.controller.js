'use strict';

angular.module('managementConsole')
  .controller('NavBarCtrl', [
    '$scope',
    '$state',
    'modelController',
    'config',
    function ($scope, $state, modelController, config) {
      $scope.modelController = modelController;
      $scope.config = config;
      $scope.isVisible = function () {
        return modelController.isAuthenticated();
      };

      $scope.getUser = function () {
        return modelController.getUser();
      };

      $scope.logout = function () {
        modelController.logout();
        $state.go('login');
      };
    }]);
