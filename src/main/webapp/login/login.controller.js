'use strict';

angular.module('managementConsole')
  .controller('LoginCtrl', [
    '$scope',
    '$state',
    'modelController',
    'config',
    function ($scope, $state, modelController, config) {

      $scope.config = config;

      $scope.credentials = {
        username: '',
        password: ''
      };

      $scope.authenticated = false;
      $scope.showLoginSpinner = false;

      if (modelController.isAuthenticated()) {
        $scope.page.htmlClass = '';
      } else {
        $scope.page.htmlClass = 'login-pf';
      }

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
          console.log(e);
          $scope.loginError = e;
          $scope.showLoginSpinner = false;
        });
      };

      $scope.alertDismissed = function () {
        $scope.loginError = null;
        $state.go('login', null, {reload: true});
      }
    }]);
