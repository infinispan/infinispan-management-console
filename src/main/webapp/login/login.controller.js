'use strict';

angular.module('managementConsole')
  .controller('LoginCtrl', [
    '$scope',
    '$state',
    'modelController',
    function ($scope, $state, modelController) {

      $scope.credentials = {
        username: '',
        password: ''
      };

      $scope.authenticated = false;
      $scope.showLoginSpinner = false;

      $scope.page.htmlClass = 'login-pf';

      $scope.login = function (credentials) {
        $scope.showLoginSpinner = true;
        modelController.login(credentials.username, credentials.password).then(function () {
          $scope.authenticated = true;
          $scope.page.htmlClass = '';
          var modelPromise = modelController.refresh();
          modelPromise.then(function () {
            $scope.showLoginSpinner = false;
            $state.go('clustersView');
          });
        }).catch(function (e) {
          console.log('Login error', e);
          $scope.loginError = true;
          $scope.showLoginSpinner = false;
        });
      };

      $scope.isAuthenticated = function () {
        return $scope.authenticated;
      };
    }]);
