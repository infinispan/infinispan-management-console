'use strict';

angular.module('managementConsole')
    .controller('NavBarCtrl', [
    '$scope',
    '$state',
    'modelController',
    function ($scope, $state, modelController) {
            $scope.modelController = modelController;

            $scope.isVisible = function () {
                return modelController.isAuthenticated();
            };

            $scope.logout = function () {
                modelController.logout();
                $state.go('login');
            };
  }]);
