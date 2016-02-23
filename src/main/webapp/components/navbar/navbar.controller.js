'use strict';

angular.module('managementConsole')
    .controller('NavBarCtrl', [
    '$scope',
    '$state',
    'modelController',
    function ($scope, $state, modelController) {
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
