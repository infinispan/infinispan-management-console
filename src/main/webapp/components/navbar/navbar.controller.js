'use strict';

angular.module('managementConsole')
    .controller('NavBarCtrl', [
    '$scope',
    'modelController',
    function ($scope, modelController) {
            $scope.isVisible = function () {
                return modelController.isAuthenticated();
            };
        
            $scope.getUser = function() {
                return modelController.getUsername();
            };
        
            $scope.logout = function () {
                modelController.logout();
            };
  }]);